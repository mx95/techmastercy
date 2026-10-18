#!/bin/sh
set -eu

mkdir -p /data/private

# Apply schema without interactive migrations. Avoid destructive reset.
npx prisma db push --skip-generate

# Record running revision when provided by the deploy script.
if [ -n "${DEPLOY_GIT_SHA:-}" ]; then
  printf '%s\n' "$DEPLOY_GIT_SHA" > /data/DEPLOYED_SHA
fi

exec node server.js
