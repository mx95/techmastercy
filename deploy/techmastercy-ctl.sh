#!/usr/bin/env bash
# Restricted production control script for TechmasterCY.
# Installed as /usr/local/sbin/techmastercy-ctl (root-owned).
# Invoked by the tmcdeploy user via sudoers — not a general shell.
set -euo pipefail

APP_DIR="${TECHMASTERY_APP_DIR:-/opt/techmastercy}"
DEPLOY_USER="${TECHMASTERY_DEPLOY_USER:-tmcdeploy}"
COMPOSE_FILE="${APP_DIR}/docker-compose.yml"
STATE_DIR="${APP_DIR}/.deploy"
CURRENT_SHA_FILE="${STATE_DIR}/current_sha"
PREVIOUS_SHA_FILE="${STATE_DIR}/previous_sha"
LOCK_FILE="${STATE_DIR}/deploy.lock"
HEALTH_URL="${TECHMASTERY_HEALTH_URL:-http://127.0.0.1:3000/api/health}"
COMPOSE=(docker compose -f "${COMPOSE_FILE}" --project-directory "${APP_DIR}")

# Git operations run as the deploy user so a read-only GitHub deploy key in
# /home/tmcdeploy/.ssh can authenticate without granting docker privileges.
git_as_deploy() {
  sudo -u "${DEPLOY_USER}" -- git -C "${APP_DIR}" "$@"
}

log() { printf '[techmastercy-ctl] %s\n' "$*"; }
die() { printf '[techmastercy-ctl] ERROR: %s\n' "$*" >&2; exit 1; }

require_root() {
  [[ "$(id -u)" -eq 0 ]] || die "must run as root (via sudo)"
}

acquire_lock() {
  mkdir -p "${STATE_DIR}"
  exec 9>"${LOCK_FILE}"
  if ! flock -n 9; then
    die "another deployment is already in progress"
  fi
}

require_env() {
  [[ -f "${APP_DIR}/.env" ]] || die "missing ${APP_DIR}/.env — create from .env.example on the server"
  [[ -f "${COMPOSE_FILE}" ]] || die "missing ${COMPOSE_FILE}"
}

git_sha_at_head() {
  git_as_deploy rev-parse HEAD
}

wait_for_health() {
  local attempts="${1:-30}"
  local i
  for ((i = 1; i <= attempts; i++)); do
    if curl -fsS --max-time 5 "${HEALTH_URL}" >/dev/null 2>&1; then
      log "health check OK (${HEALTH_URL})"
      return 0
    fi
    sleep 2
  done
  die "health check failed after ${attempts} attempts: ${HEALTH_URL}"
}

cmd_status() {
  require_env
  echo "app_dir=${APP_DIR}"
  if [[ -f "${CURRENT_SHA_FILE}" ]]; then
    echo "current_sha=$(cat "${CURRENT_SHA_FILE}")"
  else
    echo "current_sha=unknown"
  fi
  if [[ -f "${PREVIOUS_SHA_FILE}" ]]; then
    echo "previous_sha=$(cat "${PREVIOUS_SHA_FILE}")"
  else
    echo "previous_sha=none"
  fi
  echo "git_head=$(git_sha_at_head 2>/dev/null || echo unavailable)"
  "${COMPOSE[@]}" ps || true
  curl -fsS --max-time 5 "${HEALTH_URL}" || echo "health: unreachable"
}

cmd_logs() {
  require_env
  "${COMPOSE[@]}" logs --tail="${1:-200}" app
}

cmd_health() {
  curl -fsS --max-time 5 "${HEALTH_URL}"
  echo
}

checkout_sha() {
  local sha="$1"
  [[ "${sha}" =~ ^[0-9a-f]{7,40}$ ]] || die "invalid git sha: ${sha}"
  git_as_deploy fetch --prune origin
  git_as_deploy checkout --detach "${sha}"
  git_as_deploy reset --hard "${sha}"
}

compose_up() {
  local sha="$1"
  export IMAGE_TAG="${sha:0:12}"
  export DEPLOY_GIT_SHA="${sha}"
  "${COMPOSE[@]}" build --pull app
  "${COMPOSE[@]}" up -d --remove-orphans app
  wait_for_health 45
}

cmd_deploy() {
  require_root
  require_env
  acquire_lock

  local target_sha="${1:-}"
  [[ -n "${target_sha}" ]] || die "usage: techmastercy-ctl deploy <git-sha>"

  mkdir -p "${STATE_DIR}"
  local previous=""
  if [[ -f "${CURRENT_SHA_FILE}" ]]; then
    previous="$(cat "${CURRENT_SHA_FILE}")"
  else
    previous="$(git_sha_at_head || true)"
  fi

  log "deploying ${target_sha} (previous=${previous:-none})"
  checkout_sha "${target_sha}"

  if ! compose_up "${target_sha}"; then
    log "deploy failed; attempting rollback to ${previous:-none}"
    if [[ -n "${previous}" && "${previous}" != "${target_sha}" ]]; then
      checkout_sha "${previous}"
      compose_up "${previous}" || die "rollback also failed — inspect docker logs"
      printf '%s\n' "${previous}" > "${CURRENT_SHA_FILE}"
    fi
    die "deployment of ${target_sha} failed"
  fi

  if [[ -n "${previous}" ]]; then
    printf '%s\n' "${previous}" > "${PREVIOUS_SHA_FILE}"
  fi
  printf '%s\n' "${target_sha}" > "${CURRENT_SHA_FILE}"
  # Keep a marker inside the data volume via env on next recreate; also local marker:
  printf '%s\n' "${target_sha}" > "${STATE_DIR}/last_success"
  log "deploy succeeded: ${target_sha}"
}

cmd_rollback() {
  require_root
  require_env
  acquire_lock

  [[ -f "${PREVIOUS_SHA_FILE}" ]] || die "no previous_sha recorded"
  local previous
  previous="$(cat "${PREVIOUS_SHA_FILE}")"
  [[ -n "${previous}" ]] || die "previous_sha empty"

  log "rolling back to ${previous}"
  checkout_sha "${previous}"
  compose_up "${previous}"
  local current
  current="$(cat "${CURRENT_SHA_FILE}" 2>/dev/null || true)"
  if [[ -n "${current}" ]]; then
    printf '%s\n' "${current}" > "${PREVIOUS_SHA_FILE}"
  fi
  printf '%s\n' "${previous}" > "${CURRENT_SHA_FILE}"
  log "rollback succeeded: ${previous}"
}

usage() {
  cat <<'EOF'
Usage: techmastercy-ctl <command> [args]

Commands:
  deploy <git-sha>   Fetch, checkout, build, restart, health-check
  rollback           Redeploy the previous recorded git sha
  status             Show deploy state, compose ps, health
  health             Curl the local health endpoint
  logs [lines]       Tail application logs (default 200)
EOF
}

main() {
  local cmd="${1:-}"
  shift || true
  case "${cmd}" in
    deploy) cmd_deploy "$@" ;;
    rollback) cmd_rollback "$@" ;;
    status) cmd_status "$@" ;;
    health) cmd_health "$@" ;;
    logs) cmd_logs "$@" ;;
    -h|--help|help|"") usage ;;
    *) die "unknown command: ${cmd}" ;;
  esac
}

main "$@"
