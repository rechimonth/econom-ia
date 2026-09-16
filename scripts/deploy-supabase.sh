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

PROJECT_REF="${1:-}"
if [ -z "$PROJECT_REF" ] && [ -n "${SUPABASE_URL:-}" ]; then
  PROJECT_REF="$(printf '%s' "$SUPABASE_URL" | sed -E 's#.*https://([^.]+)\.supabase\.co.*#\1#')"
fi
[ -n "$PROJECT_REF" ] || fail "Could not determine project ref. Pass it as the first argument or export SUPABASE_URL."

if ! ls ~/.supabase/access-token >/dev/null 2>&1 && [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  fail "Supabase CLI is not authenticated. Run 'npx supabase login' first."
fi

[ -n "${SUPABASE_DB_PASSWORD:-}" ] || fail "Set SUPABASE_DB_PASSWORD in the environment (database password from the Supabase dashboard)."
[ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ] || fail "Set SUPABASE_SERVICE_ROLE_KEY in the environment for post-deploy verification."

export SUPABASE_DB_PASSWORD

echo "==> Linking project ${PROJECT_REF}"
npx --yes supabase link --project-ref "$PROJECT_REF" || fail "supabase link failed"
echo "==> Pending migrations"
npx --yes supabase migration list --linked 2>&1
echo "==> Dry run"
npx --yes supabase db push --linked --dry-run || fail "supabase db push --dry-run failed"
echo "==> Applying migrations"
npx --yes supabase db push --linked || fail "supabase db push failed"

# Verify the RPC and table actually exist, rather than trusting the CLI exit code.
echo "==> Verifying remote schema"
SUPABASE_URL="${SUPABASE_URL:-https://${PROJECT_REF}.supabase.co}"
VERIFY_TMP="$(mktemp -d)" || fail "Could not create temporary directory"
trap 'rm -rf "$VERIFY_TMP"' EXIT

RPC_STATUS="$(curl -sS -o "$VERIFY_TMP/rpc.json" -w '%{http_code}' \
  -X POST "${SUPABASE_URL}/rest/v1/rpc/increment_ai_quota" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"p_user_id":"00000000-0000-0000-0000-000000000000","p_usage_month":"2000-01"}')"

TABLE_STATUS="$(curl -sS -o "$VERIFY_TMP/table.json" -w '%{http_code}' \
  "${SUPABASE_URL}/rest/v1/subscriptions?select=user_id&limit=1" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")"

echo "    increment_ai_quota RPC -> HTTP ${RPC_STATUS}"
echo "    subscriptions table   -> HTTP ${TABLE_STATUS}"

if [ "$RPC_STATUS" != "200" ] || [ "$TABLE_STATUS" != "200" ]; then
  echo "--- rpc response ---"; cat "$VERIFY_TMP/rpc.json"; echo
  echo "--- table response ---"; cat "$VERIFY_TMP/table.json"; echo
  fail "Remote schema verification failed"
fi

echo "==> Done. Migrations applied and verified."