#!/bin/sh
set -eu

# Bootstrap: copy the checked-out ctl onto the host when bind-mounted.
# Needed once for servers whose installed ctl predates self-refresh on deploy.
if [ -d /host-sbin ] && [ -f /ctl-src/techmastercy-ctl.sh ]; then
  cp /ctl-src/techmastercy-ctl.sh /host-sbin/techmastercy-ctl
  chmod 750 /host-sbin/techmastercy-ctl
  chown root:root /host-sbin/techmastercy-ctl 2>/dev/null || true
fi

# Drop root before running the app.
if [ "$(id -u)" = "0" ]; then
  exec runuser -u nextjs -g nodejs -- /app/docker-entrypoint.sh "$@"
fi

mkdir -p /data/private

# Apply schema without interactive migrations. Avoid destructive reset.
npx prisma db push --skip-generate

# Record running revision when provided by the deploy script.
if [ -n "${DEPLOY_GIT_SHA:-}" ]; then
  printf '%s\n' "$DEPLOY_GIT_SHA" > /data/DEPLOYED_SHA
fi

exec node server.js
