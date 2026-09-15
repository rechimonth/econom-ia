#!/usr/bin/env bash
# Links the Supabase project, pushes migrations/, and verifies the quota RPC.
#
# Usage:
#   SUPABASE_DB_PASSWORD='...' ./scripts/deploy-supabase.sh [project-ref]
#
# Requires an authenticated Supabase CLI (run `npx supabase login` first, or
# export SUPABASE_ACCESS_TOKEN with a personal access token).
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

# Derive the project ref from server/.env when not passed explicitly.
PROJECT_REF="${1:-}"
if [ -z "$PROJECT_REF" ] && [ -f server/.env ]; then
  PROJECT_REF="$(grep -E '^SUPABASE_URL=' server/.env | head -1 | sed -E 's#.*https://([^.]+)\.supabase\.co.*#\1#')"
fi
[ -n "$PROJECT_REF" ] || fail "Could not determine project ref. Pass it as the first argument."

if ! ls ~/.supabase/access-token >/dev/null 2>&1 && [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  fail "Supabase CLI is not authenticated. Run 'npx supabase login' first."
fi

[ -n "${SUPABASE_DB_PASSWORD:-}" ] || fail "Set SUPABASE_DB_PASSWORD (database password from the Supabase dashboard)."

echo "==> Linking project ${PROJECT_REF}"
npx --yes supabase link --project-ref "$PROJECT_REF" -p "$SUPABASE_DB_PASSWORD" || fail "supabase link failed"

echo "==> Pending migrations"
npx --yes supabase migration list --linked 2>&1

echo "==> Dry run"
npx --yes supabase db push --linked --dry-run || fail "supabase db push --dry-run failed"

echo "==> Applying migrations"
npx --yes supabase db push --linked -p "$SUPABASE_DB_PASSWORD" || fail "supabase db push failed"

# Verify the RPC and table actually exist, rather than trusting the CLI exit code.
echo "==> Verifying remote schema"
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