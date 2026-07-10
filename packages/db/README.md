# Lumana DB

Prisma schema and DB tools now live under the API package at `apps/api/prisma/schema.prisma`. Configure `DATABASE_URL` in environment.

Generate client (from repo root):

```bash
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

Run migrations (when ready):

```bash
npx prisma migrate dev --schema=apps/api/prisma/schema.prisma --name init
```
