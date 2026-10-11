#!/usr/bin/env bash
set -euo pipefail

EMAIL="${1:-admin@techmaster.com.cy}"
PASS="${2:-TechmasterAdmin2026!}"

curl -sS -D /tmp/login-headers.txt -o /tmp/login-body.txt \
  -X POST "http://127.0.0.1/api/admin/login" \
  -H "Content-Type: application/json" \
  --data-binary "{\"email\":\"${EMAIL}\",\"password\":\"${PASS}\"}"

echo "=== BODY ==="
cat /tmp/login-body.txt
echo
echo "=== HEADERS ==="
cat /tmp/login-headers.txt
echo
echo "=== SET-COOKIE ==="
grep -i '^set-cookie:' /tmp/login-headers.txt || echo "(none)"

if grep -qi 'Secure' /tmp/login-headers.txt; then
  echo "FAIL: Secure flag present on HTTP response"
  exit 1
fi

COOKIE="$(grep -i '^set-cookie:' /tmp/login-headers.txt | head -1 | sed 's/[Ss]et-[Cc]ookie: //; s/;.*//')"
if [[ -z "$COOKIE" ]]; then
  echo "FAIL: no session cookie"
  exit 1
fi

echo "=== /admin with cookie ==="
curl -sS -D - -o /dev/null -H "Cookie: ${COOKIE}" "http://127.0.0.1/admin" | head -n 20

if curl -sS -D - -o /dev/null -H "Cookie: ${COOKIE}" "http://127.0.0.1/admin" | grep -qi '^location: /admin/login'; then
  echo "FAIL: still redirected to login"
  exit 1
fi

echo "OK: admin session cookie works over HTTP"
