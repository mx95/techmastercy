# GitHub Actions secrets and repository settings

Repository: `https://github.com/mx95/techmastercy`

## Repository settings

1. **Settings → Actions → General**
   - Allow GitHub Actions.
   - Workflow permissions: **Read repository contents** (sufficient for these workflows).
2. **Settings → Environments → New environment → `production`**
   - Optional but recommended: required reviewers before deploy.
   - The `deploy.yml` job uses `environment: production`.
3. **Branch protection for `main`** (recommended)
   - Require pull request reviews.
   - Require status checks: `Lint, typecheck, test, build` (job name from `ci.yml`).
   - Do not allow bypass without reason.

## Required Actions secrets

Create under **Settings → Secrets and variables → Actions**:

| Secret | Value | Notes |
|--------|--------|------|
| `DEPLOY_HOST` | `46.225.180.168` | Server IPv4 |
| `DEPLOY_USER` | `tmcdeploy` | Least-privilege user (never `root`) |
| `DEPLOY_SSH_KEY` | Private key PEM for `tmcdeploy` | Generate a **new** keypair for Actions; do not reuse your personal admin key in the repo |
| `DEPLOY_SSH_FINGERPRINT` | `SHA256:Mg+G1KRNOAzTDxtp9I+1Dbhjkj3y2Xkhy2JBEnrXLAM` | Host ED25519 fingerprint verified from the live server |

### Generate the deploy keypair (on your PC)

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\tmcdeploy_github -C "github-actions-tmcdeploy" -N ""
```

- Put the **private** key contents into GitHub secret `DEPLOY_SSH_KEY`.
- Append the **public** key to the server file `/home/tmcdeploy/.ssh/authorized_keys`.
- Never commit either key.

### Verified host fingerprint (as of server inspection)

```
ED25519 SHA256:Mg+G1KRNOAzTDxtp9I+1Dbhjkj3y2Xkhy2JBEnrXLAM
RSA     SHA256:BeF4XvpbdvPpmGQop3RB3jAAGPXZ3xAvoDEJUMgo55o
```

Use the ED25519 value in `DEPLOY_SSH_FINGERPRINT`.

## Workflows

| Workflow | Trigger | Deploys? |
|----------|---------|----------|
| `.github/workflows/ci.yml` | `pull_request` + `push` to `main` | No |
| `.github/workflows/deploy.yml` | `push` to `main` + `workflow_dispatch` | Yes, after quality job |

Production deployments are serialized via `concurrency: production-deploy`.

## Private repository git access on the server

If the GitHub repository is private, the server must be able to `git fetch` as `tmcdeploy`:

1. Create a **read-only Deploy key** in GitHub → Settings → Deploy keys.
2. Install that private key on the server as `/home/tmcdeploy/.ssh/id_ed25519` (mode `600`).
3. Add `github.com` to `/home/tmcdeploy/.ssh/known_hosts`.

The Actions SSH key (`DEPLOY_SSH_KEY`) is only for logging into the server — it is separate from the GitHub deploy key used for `git fetch`.
