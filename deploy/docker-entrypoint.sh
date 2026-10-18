#!/bin/sh
set -eu

# Bootstrap: best-effort copy of checked-out ctl onto the host (stale ctl hosts).
# Must never block app startup.
if [ "$(id -u)" = "0" ] && [ -d /host-sbin ] && [ -f /ctl-src/techmastercy-ctl.sh ]; then
  cp /ctl-src/techmastercy-ctl.sh /host-sbin/techmastercy-ctl \
    && chmod 750 /host-sbin/techmastercy-ctl \
    && chown root:root /host-sbin/techmastercy-ctl \
    || echo "techmastercy: host ctl refresh skipped" >&2
fi

# Drop root before running the app (compose may start the container as uid 0).
if [ "$(id -u)" = "0" ]; then
  if command -v setpriv >/dev/null 2>&1; then
    exec setpriv --reuid=1001 --regid=1001 --clear-groups -- /bin/sh /app/docker-entrypoint.sh "$@"
  fi
  if command -v runuser >/dev/null 2>&1; then
    exec runuser -u nextjs -g nodejs -- /bin/sh /app/docker-entrypoint.sh "$@"
  fi
  echo "techmastercy: warning: running app as root (no setpriv/runuser)" >&2
fi

mkdir -p /data/private

# Apply schema without interactive migrations. Avoid destructive reset.
npx prisma db push --skip-generate

# Record running revision when provided by the deploy script.
if [ -n "${DEPLOY_GIT_SHA:-}" ]; then
  printf '%s\n' "$DEPLOY_GIT_SHA" > /data/DEPLOYED_SHA
fi

exec node server.js
