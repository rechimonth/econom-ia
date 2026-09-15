#!/usr/bin/env bash
# Starts (or restarts) the backend and frontend dev servers and verifies both respond.
#
# Usage:
#   ./scripts/start-local.sh          # start both (stops any existing instance first)
#   ./scripts/start-local.sh stop     # stop both
#   ./scripts/start-local.sh status   # check health only
#
# This container has no ss/netstat/lsof, so processes are tracked by matching the
# repo path in the command line (via pgrep) plus PID files written at start time.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

LOG_DIR="${LOG_DIR:-/tmp/econom-ia-logs}"
BACKEND_PORT="${BACKEND_PORT:-8787}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
PID_DIR="$LOG_DIR/pids"
mkdir -p "$PID_DIR"

for f in .env server/.env; do
  [ -f "$f" ] || { printf 'ERROR: missing %s. Create the env files first.\n' "$f" >&2; exit 1; }
done

# Match only this checkout's processes, so we never kill an unrelated server.
backend_pids() { pgrep -f "node --watch server\.js" 2>/dev/null; pgrep -f "$REPO_ROOT/server/server\.js" 2>/dev/null; }
frontend_pids() { pgrep -f "$REPO_ROOT/node_modules/\.bin/vite" 2>/dev/null; }
all_pids() { { backend_pids; frontend_pids; cat "$PID_DIR"/*.pid 2>/dev/null; } | sort -u | grep -E '^[0-9]+$'; }

stop_all() {
  echo "==> Stopping existing servers"
  local pid
  for pid in $(all_pids); do
    kill "$pid" 2>/dev/null && echo "    killed pid $pid"
  done
  rm -f "$PID_DIR"/*.pid 2>/dev/null
  sleep 2
}

http_code() { curl -s -m 3 -o /dev/null -w '%{http_code}' "$1" 2>/dev/null; }

wait_for() {
  local url="$1" name="$2" attempts=0
  while [ "$attempts" -lt 30 ]; do
    if [ "$(http_code "$url")" = "200" ]; then
      printf '     %-8s OK -> HTTP 200 (%s)\n' "$name" "$url"
      return 0
    fi
    attempts=$((attempts + 1))
    sleep 1
  done
  printf 'ERROR: %s did not become healthy at %s\n' "$name" "$url" >&2
  return 1
}

status_all() {
  local backend frontend
  backend="$(http_code "http://localhost:${BACKEND_PORT}/health")"
  frontend="$(http_code "http://localhost:${FRONTEND_PORT}/")"
  printf '    backend  :%s\n    frontend :%s\n' "$backend" "$frontend"
  [ "$backend" = "200" ] && [ "$frontend" = "200" ]
}

case "${1:-start}" in
  stop)   stop_all; exit 0 ;;
  status) status_all; exit $? ;;
  start)  ;;
  *) printf 'Usage: %s [start|stop|status]\n' "$0" >&2; exit 2 ;;
esac

stop_all

echo "==> Starting backend (port ${BACKEND_PORT})"
nohup npm run server:dev > "$LOG_DIR/backend.log" 2>&1 &
echo $! > "$PID_DIR/backend-wrapper.pid"

echo "==> Starting frontend (port ${FRONTEND_PORT}, strict)"
# --strictPort makes Vite fail loudly instead of silently drifting to another port.
nohup npm run dev -- --port "$FRONTEND_PORT" --strictPort > "$LOG_DIR/frontend.log" 2>&1 &
echo $! > "$PID_DIR/frontend-wrapper.pid"

sleep 6

echo "==> Health checks"
wait_for "http://localhost:${BACKEND_PORT}/health" "backend" \
  || { echo "--- backend.log ---"; tail -25 "$LOG_DIR/backend.log"; exit 1; }

if grep -q "is in use" "$LOG_DIR/frontend.log" 2>/dev/null; then
  echo "ERROR: frontend port ${FRONTEND_PORT} was already in use. --- frontend.log ---" >&2
  tail -15 "$LOG_DIR/frontend.log" >&2
  exit 1
fi

wait_for "http://localhost:${FRONTEND_PORT}/" "frontend" \
  || { echo "--- frontend.log ---"; tail -25 "$LOG_DIR/frontend.log"; exit 1; }

echo "==> Running processes"
pgrep -af "node --watch server\.js|${REPO_ROOT}/node_modules/\.bin/vite" | sed 's/^/    /' || true

echo "==> Logs: $LOG_DIR/backend.log  $LOG_DIR/frontend.log"
echo "==> Both servers running."