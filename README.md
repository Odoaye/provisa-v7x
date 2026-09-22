# Provisa Writers v7

Clean Next.js 16 migration of the Provisa Writers standalone site.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/provisa-writers run dev
```

Open the preview at the root path.

## Production check

```bash
pnpm --filter @workspace/provisa-writers run typecheck
pnpm --filter @workspace/provisa-writers run build
```

## Vercel

Use `artifacts/provisa-writers` as the Vercel project root. Vercel will detect
the Next.js app automatically; no custom build command is required. If the
whole monorepo is connected, set the Vercel Root Directory to this folder.

The field notes and team desk prototype keep the original standalone behavior:
browser storage is used for local drafts and staff changes.