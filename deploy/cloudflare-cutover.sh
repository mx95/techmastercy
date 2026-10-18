#!/usr/bin/env bash
# Point techmaster.com.cy (+ www) at the Hetzner VPS via Cloudflare DNS API.
# Runs in GitHub Actions (no Shopify/server SSH required for the DNS change).
set -euo pipefail

DOMAIN="${DOMAIN:-techmaster.com.cy}"
TARGET_IP="${TARGET_IP:-46.225.180.168}"
CF_API="${CF_API:-https://api.cloudflare.com/client/v4}"

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

[[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] || die "CLOUDFLARE_API_TOKEN is not set"

auth_hdr=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json")

cf() {
  local method="$1" path="$2"
  shift 2
  curl -fsS -X "${method}" "${auth_hdr[@]}" "${CF_API}${path}" "$@"
}

resolve_zone_id() {
  if [[ -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    printf '%s\n' "${CLOUDFLARE_ZONE_ID}"
    return
  fi
  local response zone_id
  response="$(cf GET "/zones?name=${DOMAIN}")"
  zone_id="$(printf '%s' "${response}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")')"
  [[ -n "${zone_id}" ]] || die "Cloudflare zone not found for ${DOMAIN} (check token permissions / account)"
  printf '%s\n' "${zone_id}"
}

upsert_a_record() {
  local zone_id="$1" name="$2" ip="$3"
  local list existing_id existing_type payload response

  list="$(cf GET "/zones/${zone_id}/dns_records?name=${name}")"
  existing_id="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")')"
  existing_type="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["type"] if r else "")')"

  payload="$(python3 -c 'import json,sys; print(json.dumps({"type":"A","name":sys.argv[1],"content":sys.argv[2],"ttl":300,"proxied":False}))' "${name}" "${ip}")"

  if [[ -n "${existing_id}" ]]; then
    if [[ "${existing_type}" != "A" ]]; then
      echo "Deleting existing ${existing_type} record for ${name} (${existing_id})"
      cf DELETE "/zones/${zone_id}/dns_records/${existing_id}" >/dev/null
      echo "Creating A ${name} -> ${ip} (DNS only)"
      response="$(cf POST "/zones/${zone_id}/dns_records" --data "${payload}")"
    else
      echo "Updating A ${name} -> ${ip} (DNS only, proxied=false)"
      response="$(cf PUT "/zones/${zone_id}/dns_records/${existing_id}" --data "${payload}")"
    fi
  else
    echo "Creating A ${name} -> ${ip} (DNS only)"
    response="$(cf POST "/zones/${zone_id}/dns_records" --data "${payload}")"
  fi

  printf '%s' "${response}" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; r=d["result"]; print("OK", r["name"], r["type"], r["content"], "proxied="+str(r.get("proxied")))'
}

echo "=== Cloudflare DNS cutover ==="
echo "domain=${DOMAIN}"
echo "target_ip=${TARGET_IP}"

ZONE_ID="$(resolve_zone_id)"
echo "zone_id=${ZONE_ID}"

upsert_a_record "${ZONE_ID}" "${DOMAIN}" "${TARGET_IP}"
upsert_a_record "${ZONE_ID}" "www.${DOMAIN}" "${TARGET_IP}"

# Drop Shopify IPv6 / leftover Shopify hostnames so traffic cannot fall back.
delete_records_by_type() {
  local zone_id="$1" name="$2" rtype="$3"
  local list ids
  list="$(cf GET "/zones/${zone_id}/dns_records?name=${name}&type=${rtype}")"
  ids="$(printf '%s' "${list}" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("\n".join(r["id"] for r in (d.get("result") or [])))')"
  while IFS= read -r rid; do
    [[ -n "${rid}" ]] || continue
    echo "Deleting ${rtype} ${name} (${rid})"
    cf DELETE "/zones/${zone_id}/dns_records/${rid}" >/dev/null
  done <<< "${ids}"
}
delete_records_by_type "${ZONE_ID}" "${DOMAIN}" "AAAA"
# Optional Shopify account subdomain left from the old storefront.
delete_records_by_type "${ZONE_ID}" "account.${DOMAIN}" "CNAME"

echo "=== verifying public DNS (may lag) ==="
for host in "${DOMAIN}" "www.${DOMAIN}"; do
  echo "-- dig ${host} --"
  dig +short "${host}" A || true
done

echo "Cutover API updates submitted. Propagation can take a few minutes."
echo "Next: confirm dig returns ${TARGET_IP}, then enable HTTPS on the VPS."
