#!/usr/bin/env bash
set -euo pipefail

# Temporary password for one-time recovery. Change after login.
NEW_PASSWORD='TechmasterAdmin2026!'
ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' /opt/techmastercy/.env | head -n1 | cut -d= -f2- | tr -d '"')"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@techmaster.com.cy}"

echo "Resetting password for: ${ADMIN_EMAIL}"

docker exec -e ADMIN_EMAIL="$ADMIN_EMAIL" -e NEW_PASSWORD="$NEW_PASSWORD" techmastercy-app \
  node -e '
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = String(process.env.NEW_PASSWORD || "");
  if (!email || !password) throw new Error("Missing ADMIN_EMAIL or NEW_PASSWORD");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash, active: true },
    select: { email: true, active: true },
  });
  console.log(JSON.stringify({ ok: true, email: user.email, active: user.active }));
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
'

echo
echo "Done. Log in at http://46.225.180.168/admin/login"
echo "Email: ${ADMIN_EMAIL}"
echo "Temporary password: ${NEW_PASSWORD}"
echo "Change this password after you get in."
