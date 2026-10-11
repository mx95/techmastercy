#!/usr/bin/env bash
set -euo pipefail
echo "ADMIN_EMAIL from env:"
grep -E '^ADMIN_EMAIL=' /opt/techmastercy/.env || echo "(not set)"
echo
echo "Admin users in DB:"
docker exec techmastercy-app node -e '
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.adminUser.findMany({ select: { email: true, createdAt: true } })
  .then((rows) => { console.log(JSON.stringify(rows, null, 2)); return p.$disconnect(); })
  .catch(async (e) => { console.error(e); await p.$disconnect(); process.exit(1); });
'
