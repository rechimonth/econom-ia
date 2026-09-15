#!/usr/bin/env bash
# Applies supabase/migrations/*.sql through the Supabase Management API.
#
# This path needs a SINGLE credential (a personal access token) and no database
# password, which is often the only thing available on a hosted project.
#
# Creates the token at: https://supabase.com/dashboard/account/tokens
#
# Usage:
#   SUPABASE_ACCESS_TOKEN='sbp_...' ./scripts/apply-migrations-via-api.sh [project-ref]
#
# Note: the CLI path (scripts/deploy-supabase.sh) also records migration history
# via `supabase db push`. This script records the same rows so a later
# `supabase db push` will not try to re-apply them.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

PROJECT_REF="${1:-}"
if [ -z "$PROJECT_REF" ] && [ -f server/.env ]; then
  PROJECT_REF="$(grep -E '^SUPABASE_URL=' server/.env | head -1 | sed -E 's#.*https://([^.]+)\.supabase\.co.*#\1#')"
fi
[ -n "$PROJECT_REF" ] || fail "Could not determine project ref. Pass it as the first argument."
[ -n "${SUPABASE_ACCESS_TOKEN:-}" ] || fail "Set SUPABASE_ACCESS_TOKEN (create one at https://supabase.com/dashboard/account/tokens)."

API="https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query"

run_sql() {
  local sql="$1" label="$2" body status
  body="$(python3 -c 'import json,sys; print(json.dumps({"query": sys.stdin.read()}))' <<<"$sql")"
  status="$(curl -sS -o /tmp/api_sql_out.json -w '%{http_code}' -X POST "$API" \
    -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    --data-binary "$body")"
  if [ "$status" != "200" ] && [ "$status" != "201" ]; then
    printf 'ERROR: %s failed (HTTP %s)\n' "$label" "$status" >&2
    cat /tmp/api_sql_out.json >&2; echo >&2
    return 1
  fi
  printf '     %s OK (HTTP %s)\n' "$label" "$status"
}

echo "==> Verifying access to project ${PROJECT_REF}"
run_sql "select current_database(), current_user, current_setting('search_path');" "connectivity" || exit 1
cat /tmp/api_sql_out.json; echo

# Ensure the history table the CLI uses exists, so versions can be recorded.
run_sql "create schema if not exists supabase_migrations;
create table if not exists supabase_migrations.schema_migrations (
  version text primary key,
  statements text[],
  name text
);" "migration history table" || exit 1

applied_any=0
for file in $(find supabase/migrations -maxdepth 1 -name '*.sql' | sort); do
  base="$(basename "$file" .sql)"
  version="${base%%_*}"
  name="${base#*_}"

  already="$(curl -sS -X POST "$API" \
    -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    --data-binary "$(python3 -c 'import json,sys; print(json.dumps({"query": sys.stdin.read()}))' <<<"select count(*)::int as c from supabase_migrations.schema_migrations where version = '${version}';")" \
    | python3 -c 'import json,sys
try:
    d=json.load(sys.stdin)
    rows=d if isinstance(d,list) else d.get("result",d)
    print(rows[0]["c"] if isinstance(rows,list) and rows else 0)
except Exception:
    print(0)')"

  if [ "$already" != "0" ]; then
    printf '\n==> %s already applied, skipping\n' "$base"
    continue
  fi

  printf '\n==> Applying %s\n' "$base"
  run_sql "$(cat "$file")" "$base" || fail "Migration ${base} failed"

  run_sql "insert into supabase_migrations.schema_migrations (version, name) values ('${version}', '${name}') on conflict (version) do nothing;" "record ${version}" || true
  applied_any=1
done

echo
echo "==> Verifying remote schema via the REST API"
set -a; . ./server/.env; set +a

RPC_STATUS="$(curl -s -o /tmp/verify_rpc.json -w '%{http_code}' \
  -X POST "${SUPABASE_URL}/rest/v1/rpc/increment_ai_quota" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"p_user_id":"00000000-0000-0000-0000-000000000000","p_usage_month":"2000-01"}')"

TABLE_STATUS="$(curl -s -o /tmp/verify_table.json -w '%{http_code}' \
  "${SUPABASE_URL}/rest/v1/subscriptions?select=user_id&limit=1" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")"

echo "    increment_ai_quota RPC -> HTTP ${RPC_STATUS}"
echo "    subscriptions table   -> HTTP ${TABLE_STATUS}"

if [ "$RPC_STATUS" != "200" ] || [ "$TABLE_STATUS" != "200" ]; then
  echo "--- rpc response ---"; cat /tmp/verify_rpc.json; echo
  echo "--- table response ---"; cat /tmp/verify_table.json; echo
  fail "Remote schema verification failed"
fi

echo "==> Done. Migrations applied and verified."