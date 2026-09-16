# Supabase migrations

## Fuente de verdad

La fuente de verdad del esquema es `supabase/migrations/*.sql` en `main`.

## Flujo normal de despliegue

Usar el Supabase CLI mediante `npm run supabase:deploy` / `scripts/deploy-supabase.sh`.
El script enlaza el proyecto, ejecuta `db push`, y después verifica por REST que existan
la tabla `subscriptions` y la RPC `public.increment_ai_quota`.

La contraseña de base de datos se entrega únicamente mediante `SUPABASE_DB_PASSWORD`.
Nunca se pasa como argumento del proceso.

## Fallback por Management API

`scripts/apply-migrations-via-api.sh` existe como alternativa cuando el CLI no es viable.
También registra `supabase_migrations.schema_migrations`, pero no reemplaza al flujo CLI.
Debe recibir `SUPABASE_ACCESS_TOKEN` y `SUPABASE_SERVICE_ROLE_KEY` por entorno; no se deben
leer credenciales desde `server/.env` ejecutándolo como shell.

## Regla de seguridad

Después de cualquier cambio estructural crítico, el despliegue debe comprobar el objeto
remoto que realmente consume la aplicación. Para las cuotas de IA, esto significa que
`increment_ai_quota` debe existir exactamente en `public` y ser ejecutable únicamente por
`service_role`.
