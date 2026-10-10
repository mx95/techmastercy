#!/usr/bin/env bash
# Idempotent Hetzner provisioning for TechmasterCY.
# Run manually as root AFTER reviewing. Does not change DNS or Shopify.
#
# Usage:
#   sudo bash deploy/provision-server.sh
#   sudo ENABLE_UFW=1 bash deploy/provision-server.sh   # optional firewall enable
#
# This script will NOT:
#   - disable root SSH / PasswordAuthentication without explicit flags
#   - enable UFW unless ENABLE_UFW=1
#   - issue TLS certificates
#   - add tmcdeploy to the docker group (uses sudoers-wrapped ctl instead)
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/techmastercy}"
DEPLOY_USER="${DEPLOY_USER:-tmcdeploy}"
REPO_URL="${REPO_URL:-https://github.com/mx95/techmastercy.git}"
ENABLE_UFW="${ENABLE_UFW:-0}"
INSTALL_NGINX="${INSTALL_NGINX:-1}"

log() { printf '[provision] %s\n' "$*"; }
die() { printf '[provision] ERROR: %s\n' "$*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "run as root"

log "OS check"
. /etc/os-release
log "Detected ${PRETTY_NAME}"
[[ "${ID}" == "ubuntu" ]] || die "expected Ubuntu"

log "Installing baseline packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg git ufw jq openssl util-linux

if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker Engine from Docker official apt repository"
  install -m 0755 -d /etc/apt/keyrings
  if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
  fi
  arch="$(dpkg --print-architecture)"
  # Ubuntu 26.04 may not have a dedicated Docker suite yet; fall back carefully.
  codename="${VERSION_CODENAME}"
  if ! curl -fsI "https://download.docker.com/linux/ubuntu/dists/${codename}/stable" >/dev/null 2>&1; then
    log "Docker suite for ${codename} not found; trying noble"
    codename="noble"
  fi
  echo \
    "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${codename} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
else
  log "Docker already installed: $(docker --version)"
fi

docker compose version >/dev/null

if [[ "${INSTALL_NGINX}" == "1" ]]; then
  apt-get install -y nginx
  systemctl enable nginx
fi

if ! id -u "${DEPLOY_USER}" >/dev/null 2>&1; then
  log "Creating deploy user ${DEPLOY_USER}"
  useradd --create-home --shell /bin/bash "${DEPLOY_USER}"
else
  log "Deploy user ${DEPLOY_USER} already exists"
fi

install -d -m 0750 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
touch "/home/${DEPLOY_USER}/.ssh/authorized_keys"
chmod 600 "/home/${DEPLOY_USER}/.ssh/authorized_keys"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"

if [[ ! -d "${APP_DIR}/.git" ]]; then
  log "Cloning repository into ${APP_DIR}"
  mkdir -p "${APP_DIR}"
  git clone "${REPO_URL}" "${APP_DIR}"
else
  log "Repository already present at ${APP_DIR}"
fi
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}"

if [[ ! -f "${APP_DIR}/.env" ]]; then
  log "Creating ${APP_DIR}/.env from example (EDIT SECRETS BEFORE FIRST DEPLOY)"
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
  # Generate a session secret placeholder value locally on the server.
  if grep -q '^SESSION_SECRET=""$' "${APP_DIR}/.env" 2>/dev/null || grep -q '^SESSION_SECRET=$' "${APP_DIR}/.env" 2>/dev/null; then
    secret="$(openssl rand -base64 48 | tr -d '\n')"
    sed -i "s|^SESSION_SECRET=.*|SESSION_SECRET=\"${secret}\"|" "${APP_DIR}/.env"
  fi
  sed -i 's|^NODE_ENV=.*|NODE_ENV="production"|' "${APP_DIR}/.env"
  sed -i 's|^APP_URL=.*|APP_URL="https://techmaster.com.cy"|' "${APP_DIR}/.env"
  sed -i 's|^SITE_URL=.*|SITE_URL="https://techmaster.com.cy"|' "${APP_DIR}/.env"
  sed -i 's|^PAYMENT_PROVIDER=.*|PAYMENT_PROVIDER="mock"|' "${APP_DIR}/.env"
  sed -i 's|^ALLOW_MOCK_PAYMENTS=.*|ALLOW_MOCK_PAYMENTS="false"|' "${APP_DIR}/.env"
  sed -i 's|^DATABASE_URL=.*|DATABASE_URL="file:/data/techmastercy.db"|' "${APP_DIR}/.env"
  sed -i 's|^PRIVATE_FILES_DIR=.*|PRIVATE_FILES_DIR="/data/private"|' "${APP_DIR}/.env"
fi
chown root:"${DEPLOY_USER}" "${APP_DIR}/.env"
chmod 640 "${APP_DIR}/.env"

log "Installing restricted control script"
install -m 0750 -o root -g root "${APP_DIR}/deploy/techmastercy-ctl.sh" /usr/local/sbin/techmastercy-ctl

SUDOERS_FILE="/etc/sudoers.d/techmastercy-${DEPLOY_USER}"
cat > "${SUDOERS_FILE}" <<EOF
# Least-privilege deploy: only the techmastercy control script as root.
${DEPLOY_USER} ALL=(root) NOPASSWD: /usr/local/sbin/techmastercy-ctl
EOF
chmod 440 "${SUDOERS_FILE}"
visudo -cf "${SUDOERS_FILE}"

# Explicitly do NOT add ${DEPLOY_USER} to the docker group.
if id -nG "${DEPLOY_USER}" | grep -qw docker; then
  log "WARNING: ${DEPLOY_USER} is in the docker group (root-equivalent). Prefer removing: gpasswd -d ${DEPLOY_USER} docker"
fi

if [[ "${INSTALL_NGINX}" == "1" ]]; then
  log "Installing HTTP nginx site (no HTTPS until DNS + certs)"
  install -m 0644 "${APP_DIR}/deploy/nginx-http.conf" /etc/nginx/sites-available/techmastercy
  ln -sfn /etc/nginx/sites-available/techmastercy /etc/nginx/sites-enabled/techmastercy
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx || systemctl start nginx
fi

if [[ "${ENABLE_UFW}" == "1" ]]; then
  log "Configuring UFW (SSH + HTTP/HTTPS) — ENABLE_UFW=1 was set"
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  ufw status verbose
else
  log "UFW left unchanged (currently may be inactive). Re-run with ENABLE_UFW=1 when ready."
fi

log "Disk usage"
df -h /

cat <<EOF

Provisioning complete (local server steps).

NEXT MANUAL STEPS (required):
1) Add the GitHub Actions deploy public key to /home/${DEPLOY_USER}/.ssh/authorized_keys
2) Edit ${APP_DIR}/.env — set ADMIN_PASSWORD, SESSION_SECRET (already generated if empty), SMTP/JCC as needed
   IMPORTANT: ALLOW_MOCK_PAYMENTS must remain false in production
3) Ensure the GitHub repo is reachable (public clone or deploy key with read access)
4) First deploy as ${DEPLOY_USER}:
     sudo /usr/local/sbin/techmastercy-ctl deploy <git-sha>
5) Do NOT point DNS or issue certificates until HTTP health checks succeed on this server IP
6) Verified today: techmaster.com.cy still resolves to Shopify, not this server

EOF
