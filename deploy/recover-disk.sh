#!/bin/bash
# Run as root on the Hetzner VPS to free disk and restore deploy ctl.
# Safe to re-run. Prefer: bash /dev/shm/tmc-recover/recover.sh after Actions stages it.
set -euo pipefail

BRANCH="${TMC_BRANCH:-cursor/server-access-diag-aabd}"
APP_DIR="${TECHMASTERY_APP_DIR:-/opt/techmastercy}"
CTL=/usr/local/sbin/techmastercy-ctl
RAW="https://raw.githubusercontent.com/mx95/techmastercy/${BRANCH}"

echo "[recover] start $(date -u)"
df -h / || true

echo "[recover] docker prune"
docker system prune -af || true
docker builder prune -af || true

echo "[recover] restore ctl"
curl -fsSL "${RAW}/deploy/techmastercy-ctl.sh" -o "${CTL}.new"
install -m 0750 -o root -g root "${CTL}.new" "$CTL"
rm -f "${CTL}.new"
echo "[recover] ctl bytes=$(wc -c < "$CTL")"
df -h /

echo "[recover] refresh app checkout"
mkdir -p "$APP_DIR"
cd "$APP_DIR"
if [ ! -d .git ]; then
  rm -rf .git 2>/dev/null || true
  git init
fi
git remote add origin https://github.com/mx95/techmastercy.git 2>/dev/null || \
  git remote set-url origin https://github.com/mx95/techmastercy.git
git fetch --prune origin
SHA=$(git rev-parse "origin/${BRANCH}")
chown -R tmcdeploy:tmcdeploy "$APP_DIR" 2>/dev/null || true

echo "[recover] deploy $SHA"
"$CTL" deploy "$SHA"
"$CTL" enable-https techmaster.com.cy 46.225.180.168 || true
"$CTL" health || true
echo "[recover] done $(date -u)"
df -h /
