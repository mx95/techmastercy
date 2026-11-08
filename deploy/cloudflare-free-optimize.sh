#!/usr/bin/env bash
# Apply free-plan Cloudflare optimizations for techmaster.com.cy.
# Does not require Cloudflare MCP — uses CLOUDFLARE_API_TOKEN (same as cutover).
#
# Token needs at least:
#   Zone.DNS Edit, Zone.Zone Settings Edit, Zone.Zone Read
#
# Free-plan actions:
#   1) Orange-cloud (proxied) apex + www so CDN / edge TLS / WAF apply
#   2) Safe free zone settings (HTTPS, compression, HTTP/3, cache level, …)
# Skips paid-only features; skips Rocket Loader (breaks Next.js).
set -euo pipefail

DOMAIN="${DOMAIN:-techmaster.com.cy}"
CF_API="${CF_API:-https://api.cloudflare.com/client/v4}"

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

[[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] || die "CLOUDFLARE_API_TOKEN is not set"

auth_hdr=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json")

cf() {
  local method="$1" path="$2"
  shift 2
  curl -fsS -X "${method}" "${auth_hdr[@]}" "${CF_API}${path}" "$@"
}

# Soft PATCH: print warnings instead of aborting when a setting is plan-locked.
cf_patch_soft() {
  local path="$1" payload="$2" label="$3"
  local response http
  response="$(curl -sS -w '\n%{http_code}' -X PATCH "${auth_hdr[@]}" \
    "${CF_API}${path}" --data "${payload}" || true)"
  http="$(printf '%s' "${response}" | tail -n1)"
  body="$(printf '%s' "${response}" | sed '$d')"
  if printf '%s' "${body}" | python3 -c 'import json,sys; d=json.load(sys.stdin); raise SystemExit(0 if d.get("success") else 1)' 2>/dev/null; then
    echo "OK  ${label}"
  else
    echo "SKIP ${label} (http=${http}) — ${body}" >&2
  fi
}

resolve_zone_id() {
  if [[ -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    printf '%s\n' "${CLOUDFLARE_ZONE_ID}"
    return
  fi
  local response zone_id
  response="$(cf GET "/zones?name=${DOMAIN}")"
  zone_id="$(printf '%s' "${response}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")')"
  [[ -n "${zone_id}" ]] || die "Cloudflare zone not found for ${DOMAIN}"
  printf '%s\n' "${zone_id}"
}

enable_proxy_on_a() {
  local zone_id="$1" name="$2"
  local list existing_id content ttl payload response

  list="$(cf GET "/zones/${zone_id}/dns_records?name=${name}&type=A")"
  existing_id="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")')"
  content="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["content"] if r else "")')"
  ttl="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0].get("ttl",1) if r else 1)')"
  [[ -n "${existing_id}" && -n "${content}" ]] || die "No A record for ${name} — run DNS cutover first"

  # Proxied records must use TTL=1 (automatic).
  payload="$(python3 -c 'import json,sys; print(json.dumps({"type":"A","name":sys.argv[1],"content":sys.argv[2],"ttl":1,"proxied":True}))' "${name}" "${content}")"
  response="$(cf PUT "/zones/${zone_id}/dns_records/${existing_id}" --data "${payload}")"
  printf '%s' "${response}" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; r=d["result"]; print("OK", r["name"], r["type"], r["content"], "proxied="+str(r.get("proxied")), "ttl="+str(r.get("ttl")))'
}

echo "=== Cloudflare free optimize ==="
echo "domain=${DOMAIN}"

ZONE_ID="$(resolve_zone_id)"
echo "zone_id=${ZONE_ID}"

echo "--- orange-cloud DNS (required for free CDN/WAF) ---"
enable_proxy_on_a "${ZONE_ID}" "${DOMAIN}"
enable_proxy_on_a "${ZONE_ID}" "www.${DOMAIN}"

echo "--- free zone settings ---"
# SSL Full (strict): origin already has Let's Encrypt certs.
cf_patch_soft "/zones/${ZONE_ID}/settings/ssl" '{"value":"strict"}' "ssl=strict"
cf_patch_soft "/zones/${ZONE_ID}/settings/always_use_https" '{"value":"on"}' "always_use_https=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/automatic_https_rewrites" '{"value":"on"}' "automatic_https_rewrites=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/brotli" '{"value":"on"}' "brotli=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/early_hints" '{"value":"on"}' "early_hints=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/http3" '{"value":"on"}' "http3=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/0rtt" '{"value":"on"}' "0rtt=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/websockets" '{"value":"on"}' "websockets=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/ip_geolocation" '{"value":"on"}' "ip_geolocation=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/email_obfuscation" '{"value":"on"}' "email_obfuscation=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/server_side_exclude" '{"value":"on"}' "server_side_exclude=on"
cf_patch_soft "/zones/${ZONE_ID}/settings/security_level" '{"value":"medium"}' "security_level=medium"
cf_patch_soft "/zones/${ZONE_ID}/settings/browser_check" '{"value":"on"}' "browser_check=on"
# Cache most static assets; origin Cache-Control still governs HTML (no-store).
cf_patch_soft "/zones/${ZONE_ID}/settings/cache_level" '{"value":"aggressive"}' "cache_level=aggressive"
# 0 = Respect Existing Headers (honour origin Cache-Control).
cf_patch_soft "/zones/${ZONE_ID}/settings/browser_cache_ttl" '{"value":0}' "browser_cache_ttl=respect_existing"
# Minify is free when still offered; ignore if removed for the zone.
cf_patch_soft "/zones/${ZONE_ID}/settings/minify" \
  '{"value":{"css":"on","html":"on","js":"on"}}' "minify=on"
# Rocket Loader rewrites scripts and breaks Next.js hydration — keep off.
cf_patch_soft "/zones/${ZONE_ID}/settings/rocket_loader" '{"value":"off"}' "rocket_loader=off"

echo "=== done ==="
echo "Expect cf-ray response headers on https://${DOMAIN}/ within a minute."
echo "If SSL errors appear, confirm origin LE certs cover ${DOMAIN} and www."
