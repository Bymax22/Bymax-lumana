Deployment guide — Vercel (recommended: two projects)

Overview

This repository is a monorepo with two separate apps:
- apps/api — Nest.js API (now wrapped as a Vercel Serverless Function under `apps/api/api/index.ts`)
- apps/web — Next.js frontend

Recommended approach (two Vercel projects)

1) Create Vercel project: `lumana-api`
   - Root directory: `apps/api`
   - Build command: `npm run build`
   - Install command: leave default (Vercel will run `npm install` in `apps/api`)
   - Output: no static output; we serve requests using `api/index.ts` serverless function
   - Environment variables (set in Vercel > Settings > Environment Variables):
     - `DATABASE_URL` (required)
     - `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` (if used)
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (if used)
     - `PORT` (optional; not required for serverless)
     - Any other server secrets used by `apps/api` (email, third-party keys)
   - Vercel will run the build; the `apps/api/vercel.json` file routes all requests to the function at `api/index.ts`.

2) Create Vercel project: `lumana-web`
   - Root directory: `apps/web`
   - Build command: `npm run build`
   - Environment variables (set in Vercel > Settings > Environment Variables):
     - `NEXT_PUBLIC_API_BASE_URL` — set to the production API URL (e.g. `https://lumana-api.vercel.app`)
     - `NEXT_PUBLIC_API_TIMEOUT_MS` — optional timeout in ms
     - Any other public envs the frontend needs
   - Deploy; the frontend uses `NEXT_PUBLIC_API_BASE_URL` to call the deployed API.

Local development notes

- API (local):
  - Start from repo root:

```powershell
npm run dev:api
```

  - By default `apps/api` listens on port `4000`.

- Web (local):

```powershell
npm run dev
```

  - For local web -> local API, set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` (e.g. in `.env.local` under `apps/web`).

Verification

- After deploying `lumana-api`, verify health:

```bash
curl -v https://<your-api-domain>/health
```

- After deploying `lumana-web`, verify the frontend can reach the API (open browser and use admin pages).

Troubleshooting

- If front-end shows `API request timed out` or the browser reports `ERR_CONNECTION_TIMED_OUT`, confirm:
  - `lumana-api` deployment is healthy and shows a successful build
  - The `health` endpoint returns 200
  - `NEXT_PUBLIC_API_BASE_URL` in `lumana-web` is set to the correct domain

- If `health` fails with a DB error, check `DATABASE_URL` and database provider status.

Notes

- Running `apps/api` as a serverless function is suitable for many endpoints but consider a dedicated platform (Railway, Fly.io, Render) for long-running or heavy workloads.
- If you'd prefer a single Vercel project setup (monorepo), I can prepare a root-level `vercel.json` with `builds`/`routes` and adjust builds accordingly — but the two-project approach is simpler and more maintainable.

CI / GitHub Actions

You can automate deployments for both projects on each push to `main` using GitHub Actions. Create repository secrets (see below) and add the provided workflow file at `.github/workflows/deploy-vercel.yml`. The workflow uses the `amondnet/vercel-action` to deploy each app from its workspace directory.

Required GitHub repository secrets

- `VERCEL_TOKEN` — a personal token from your Vercel account
- `VERCEL_ORG_ID` — your Vercel organization ID
- `VERCEL_PROJECT_ID_API` — the Vercel project ID for the API (apps/api)
- `VERCEL_PROJECT_ID_WEB` — the Vercel project ID for the web (apps/web)

Set these in GitHub > Settings > Secrets and variables > Actions.

Quick Vercel CLI environment commands

After installing the Vercel CLI and logging in, you can add environment variables to each Vercel project from the command line:

```bash
# for the API project
npx vercel env add DATABASE_URL production --token $VERCEL_TOKEN --confirm --scope=<org-alias-or-id> --project=<project-id-api>

# for the web project (public var)
npx vercel env add NEXT_PUBLIC_API_BASE_URL production --token $VERCEL_TOKEN --confirm --scope=<org-alias-or-id> --project=<project-id-web>
```

Replace `<org-alias-or-id>` and project ids with values from your Vercel dashboard. You can list projects and get IDs with:

```bash
npx vercel projects ls --token $VERCEL_TOKEN
```

Once the secrets and envs are configured, pushes to `main` will trigger the workflow and deploy both apps.
