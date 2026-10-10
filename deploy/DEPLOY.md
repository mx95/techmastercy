# TechmasterCY — Hetzner deployment runbook

Production target: Ubuntu on Hetzner (`46.225.180.168`), Docker Compose app on `127.0.0.1:3000`, host nginx reverse proxy.

**Do not change DNS or Shopify until HTTP health checks succeed on the server IP.**

As of last inspection:

- OS: Ubuntu 26.04.1 LTS
- Docker / nginx: not installed (provision script installs them)
- UFW: inactive
- DNS `techmaster.com.cy` → Shopify (`23.227.38.65`), **not** this server
- HTTPS certificates: **not issued** (blocked until DNS points here)

## Architecture

```
Internet → (future) DNS → nginx :80/:443 → 127.0.0.1:3000 → Docker app (non-root)
                                                      ↓
                                         named volume techmaster_data (/data)
```

- Application secrets live only in `/opt/techmastercy/.env` (mode `640`, `root:tmcdeploy`).
- GitHub Actions authenticates as `tmcdeploy` (not root).
- `tmcdeploy` may only run `sudo /usr/local/sbin/techmastercy-ctl` (no docker group).

## 1. One-time server provisioning (manual, as root)

From your PC (uses your existing admin key — keep it off GitHub):

```powershell
scp -i C:\Users\skapn\techmaster_hetzner -o IdentitiesOnly=yes `
  deploy\provision-server.sh `
  root@46.225.180.168:/root/provision-server.sh
```

On the server:

```bash
# Review the script first
less /root/provision-server.sh

# Recommended first run: install Docker + nginx, do NOT enable UFW yet
bash /root/provision-server.sh

# After you confirm SSH still works with the deploy user, optionally:
# ENABLE_UFW=1 bash /root/provision-server.sh
```

Or, after the repo exists on the server:

```bash
cd /opt/techmastercy
sudo bash deploy/provision-server.sh
```

### Add the GitHub Actions public key

```bash
# On your PC: generate a NEW keypair for Actions (see GITHUB_ACTIONS.md)
# Then on the server:
sudo -u tmcdeploy bash -c 'cat >> ~/.ssh/authorized_keys' <<'EOF'
ssh-ed25519 AAAA... github-actions-tmcdeploy
EOF
sudo chmod 600 /home/tmcdeploy/.ssh/authorized_keys
```

### Edit production secrets

```bash
sudo nano /opt/techmastercy/.env
```

Set at minimum:

- `SESSION_SECRET` (generated if empty during provision)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (for seed)
- `ALLOW_MOCK_PAYMENTS=false`
- `PAYMENT_PROVIDER=mock` until JCC is ready (`jcc` later)
- SMTP / JCC values when available

Never commit this file.

### Private GitHub repo access (if needed)

If `git fetch` as `tmcdeploy` fails, add a **read-only GitHub deploy key** to `/home/tmcdeploy/.ssh/id_ed25519` and `ssh-keyscan github.com >> /home/tmcdeploy/.ssh/known_hosts`.

## 2. First manual deploy (before trusting Actions)

```bash
sudo -u tmcdeploy git -C /opt/techmastercy fetch origin
sudo /usr/local/sbin/techmastercy-ctl deploy "$(sudo -u tmcdeploy git -C /opt/techmastercy rev-parse origin/main)"
sudo /usr/local/sbin/techmastercy-ctl health
curl -fsS http://127.0.0.1:3000/api/health
curl -fsS http://127.0.0.1/api/health   # via nginx if installed
```

Seed admin once:

```bash
cd /opt/techmastercy
docker compose exec app npx tsx prisma/seed.ts
```

Change the admin password immediately after first login.

## 3. GitHub Actions

Configure secrets exactly as listed in [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md).

### Test PR checks

1. Open a pull request into `main`.
2. Confirm `CI` workflow runs lint, typecheck, tests, Next build, and Docker build.
3. Merge only when checks are green.

### Test production deploy

1. Merge to `main` (or run **Actions → Deploy production → Run workflow**).
2. Confirm `Deploy production` → `Pre-deploy quality gates` then `Deploy to Hetzner`.
3. On the server: `sudo /usr/local/sbin/techmastercy-ctl status`

## 4. HTTPS (only after DNS cut-over)

When you are ready (manual DNS change — not automated here):

1. Point `techmaster.com.cy` A record to `46.225.180.168`.
2. Verify: `dig +short techmaster.com.cy` returns that IP.
3. Install certbot and issue certificates:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo mkdir -p /var/www/certbot
sudo certbot --nginx -d techmaster.com.cy -d www.techmaster.com.cy
sudo cp /opt/techmastercy/deploy/nginx-https.conf /etc/nginx/sites-available/techmastercy
sudo nginx -t && sudo systemctl reload nginx
```

Until DNS points here, **do not** claim HTTPS is operational.

## 5. Logs and monitoring

```bash
sudo /usr/local/sbin/techmastercy-ctl logs 200
docker compose -f /opt/techmastercy/docker-compose.yml logs -f app
df -h /
docker stats techmastercy-app --no-stream
```

## 6. Rollback

```bash
sudo /usr/local/sbin/techmastercy-ctl rollback
sudo /usr/local/sbin/techmastercy-ctl status
```

Notes:

- Rollback restores the previous **application git SHA** and rebuilds/restarts containers.
- Persistent SQLite data in Docker volume `techmaster_data` is **not** deleted.
- `prisma db push` is non-interactive and does not auto-rollback schema changes. Avoid destructive schema edits in production without a DB backup.

### Backup / restore

```bash
# Backup volume data while app is stopped briefly (or use consistent sqlite backup tooling)
cd /opt/techmastercy
docker compose stop app
docker run --rm -v techmaster_data:/data -v /var/backups/techmastercy:/backup alpine \
  tar czf /backup/techmastercy-$(date +%F-%H%M).tar.gz -C /data .
docker compose start app
```

Restore: stop app, extract archive into the volume, start app, verify health.

## 7. Security model summary

| Actor | Can do | Cannot do |
|-------|--------|-----------|
| `root` (your admin key) | Full server admin | Should not be used by Actions |
| `tmcdeploy` | SSH + `sudo techmastercy-ctl` only | No docker group, no arbitrary sudo |
| GitHub Actions | SSH as `tmcdeploy`, invoke ctl | No production secrets in the repo |

Trade-off: rejecting docker-group membership means compose commands run through the root-owned ctl script. That is intentional least privilege for CI.
