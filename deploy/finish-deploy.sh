#!/bin/bash
# Run as root in Hetzner Console after disk recover.
set -euo pipefail
APP=/opt/techmastercy
BRANCH="${TMC_BRANCH:-cursor/server-access-diag-aabd}"
CTL=/usr/local/sbin/techmastercy-ctl

echo "[finish] disk"
df -h /

echo "[finish] fix ownership"
chown -R tmcdeploy:tmcdeploy "$APP"
chown root:tmcdeploy "$APP/.env"
chmod 640 "$APP/.env"

echo "[finish] git fetch"
cd "$APP"
sudo -u tmcdeploy git config --global --add safe.directory "$APP" || true
if ! sudo -u tmcdeploy git -C "$APP" remote get-url origin >/dev/null 2>&1; then
  sudo -u tmcdeploy git -C "$APP" remote add origin https://github.com/mx95/techmastercy.git
else
  sudo -u tmcdeploy git -C "$APP" remote set-url origin https://github.com/mx95/techmastercy.git
fi
sudo -u tmcdeploy git -C "$APP" fetch --prune origin
SHA=$(sudo -u tmcdeploy git -C "$APP" rev-parse "origin/${BRANCH}")
echo "[finish] deploy $SHA"
"$CTL" deploy "$SHA"
"$CTL" enable-https techmaster.com.cy 46.225.180.168 || true
"$CTL" health
"$CTL" status || true
df -h /
echo "[finish] done"
