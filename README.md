# ardons-site-frontend

React + Vite frontend for roderbuilt.com. Fetches content from the Strapi backend (`ardons-site`).

## Local development

Both this repo and the backend need to be running at the same time.

### Prerequisites

- Node.js >= 20.x
- A `.env.local` file in the project root (gitignored) with your local Strapi credentials:

```
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=<token from your local Strapi admin>
```

Generate the token once in your local Strapi admin at `http://localhost:1337/admin` under Settings → API Tokens. It persists until you delete your local Strapi database.

### Start the dev server

```bash
npm run dev
```

Runs on `http://localhost:5173`.

## Deployment

Deployments are handled automatically via GitHub Actions on push to `main`. See `.github/workflows/deploy.yml` for the full workflow. Builds the Vite app and rsyncs `dist/` to the server.
