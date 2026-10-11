#!/usr/bin/env bash
set -euo pipefail

SHA="${1:-}"
if [[ -z "$SHA" ]]; then
  echo "usage: run-deploy.sh <git-sha>" >&2
  exit 1
fi

echo "========== FETCH =========="
sudo -u tmcdeploy git -C /opt/techmastercy fetch --prune origin

echo "========== CLEAN LOCAL SYNC DRIFT =========="
# Preserve production secrets (.env is gitignored).
# Deploy markers are root-owned by techmastercy-ctl; fix so clean can run as tmcdeploy.
chown -R tmcdeploy:tmcdeploy /opt/techmastercy/.deploy 2>/dev/null || true
sudo -u tmcdeploy git -C /opt/techmastercy reset --hard "origin/main"
sudo -u tmcdeploy git -C /opt/techmastercy clean -fd
# Keep .env and data-related ignored files.
test -f /opt/techmastercy/.env

echo "========== DEPLOY ${SHA} =========="
sudo /usr/local/sbin/techmastercy-ctl deploy "${SHA}"

echo "========== HEALTH =========="
sudo /usr/local/sbin/techmastercy-ctl health
curl -fsS --max-time 10 http://127.0.0.1:3000/api/health
echo
curl -fsS --max-time 10 http://127.0.0.1/api/health
echo
curl -sS -I --max-time 10 http://127.0.0.1/contact | head -n 15

echo "========== STATUS =========="
sudo /usr/local/sbin/techmastercy-ctl status
