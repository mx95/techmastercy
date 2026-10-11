#!/usr/bin/env bash
set -euo pipefail
PUBFILE="${1:-/tmp/tmcdeploy_github.pub}"
mkdir -p /home/tmcdeploy/.ssh
touch /home/tmcdeploy/.ssh/authorized_keys
if ! grep -qxF "$(cat "$PUBFILE")" /home/tmcdeploy/.ssh/authorized_keys; then
  cat "$PUBFILE" >> /home/tmcdeploy/.ssh/authorized_keys
fi
chown -R tmcdeploy:tmcdeploy /home/tmcdeploy/.ssh
chmod 700 /home/tmcdeploy/.ssh
chmod 600 /home/tmcdeploy/.ssh/authorized_keys
echo authorized_ok
