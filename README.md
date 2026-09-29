QAZFRAZE AI

QAZFRAZE AI is a research and learning platform for Kazakh phraseology. It combines a searchable 150-entry corpus, AI-assisted phrase analysis, cultural context, translations, image generation, and interactive language games.

## Features

- AI phrase analysis through `/api/analyze`
- Kazakh and Russian interfaces
- Local analysis cache
- Research corpus with search, filters, phrase details, and pagination
- Corpus-to-AI analysis and image generation
- AI image generation through `/api/generate-image`
- WordGame and DiplomatGame learning modes
- Copy, share, responsive layout, and mobile sidebar

## Stack

- React 19 and Vite
- Tailwind CSS
- Express
- OpenAI server SDK
- `lucide-react`

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite frontend:

```bash
npm run dev
```

Start the API server in a second terminal:

```bash
npm run server
```

The Vite development server proxies `/api` requests to `http://localhost:3001`.

## Production

Build the frontend:

```bash
npm run build
```

Start the single Express process:

```bash
npm start
```

When `NODE_ENV=production`, Express serves the built `dist` directory and keeps `/api/*` routes connected to the existing API handlers. `PORT` defaults to `3001`.

## Environment Variables

The backend reads these variable names from the server environment or a local `.env` file:

- `OPENAI_API_KEY`
- `CLIENT_ORIGIN`
- `PORT`

`OPENAI_API_KEY` is server-side only and must never be placed in frontend code, committed to Git, or exposed in a client bundle. The `.env` file is ignored by Git.

## Health Check

With the server running:

```text
GET /api/health
```

The endpoint returns a JSON response confirming that the QAZFRAZE AI backend is running.

