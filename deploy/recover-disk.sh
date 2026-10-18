#!/bin/bash
# Run as root on the Hetzner VPS (console) to free disk and restore deploy ctl.
set -euo pipefail
echo "[recover] start $(date -u)"
df -h / || true
docker system prune -af
curl -fsSL https://raw.githubusercontent.com/mx95/techmastercy/cursor/server-access-diag-aabd/deploy/techmastercy-ctl.sh \
  -o /usr/local/sbin/techmastercy-ctl
chmod 750 /usr/local/sbin/techmastercy-ctl
chown root:root /usr/local/sbin/techmastercy-ctl
echo "[recover] ctl bytes=$(wc -c < /usr/local/sbin/techmastercy-ctl)"
df -h /
cd /opt/techmastercy
rm -rf .git 2>/dev/null || true
git init
git remote add origin https://github.com/mx95/techmastercy.git 2>/dev/null || \
  git remote set-url origin https://github.com/mx95/techmastercy.git
git fetch --prune origin
SHA=$(git rev-parse origin/cursor/server-access-diag-aabd)
echo "[recover] deploy $SHA"
/usr/local/sbin/techmastercy-ctl deploy "$SHA"
/usr/local/sbin/techmastercy-ctl enable-https techmaster.com.cy 46.225.180.168 || true
/usr/local/sbin/techmastercy-ctl health || true
echo "[recover] done $(date -u)"
