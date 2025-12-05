# Sales Coaching Suite

AI-powered sales coaching tools built on LangGraph. Made with love by [Princeton Idea Exchange](https://princetonideaexchange.com).

## Features

### Next Step Coach
Transform raw brain-dump notes about networking conversations into clear, actionable follow-up recommendations.

### Call Coach
Get expert AI feedback on your sales calls. Paste a transcript or describe what happened.

## Quick Start

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

Visit http://localhost:5173 to use the web interface.

## Architecture

```
next-step-coach/
├── apps/
│   ├── agents/          # LangGraph agents
│   │   └── src/
│   │       ├── react-agent/       # Next Step Coach agent
│   │       └── call-coach-agent/  # Call Coach agent
│   └── web/             # React frontend (Vite)
├── e2e/                 # E2E tests (Playwright)
├── langgraph.json       # LangGraph Cloud config
└── playwright.config.ts
```

## Testing

Following the Testing Trophy pattern:

```bash
# Unit tests (fast, isolated)
yarn test

# E2E tests (full user journeys)
yarn test:e2e

# E2E tests with UI
yarn test:e2e:ui

# Integration tests (requires API keys)
yarn test:integration

# All tests
yarn test:all
```

## Deployment

### LangGraph Cloud

The agents are configured for deployment to LangGraph Cloud via `langgraph.json`:

```json
{
  "graphs": {
    "next-step-coach": "./apps/agents/src/react-agent/graph.ts:graph",
    "call-coach": "./apps/agents/src/call-coach-agent/graph.ts:graph"
  }
}
```

Deploy using the LangGraph CLI:

```bash
langgraph deploy
```

### Frontend

The web frontend can be deployed to any static hosting (Vercel, Netlify, etc.):

```bash
# Build the frontend
yarn build

# Deploy the dist folder
```

Configure environment variables:
- `VITE_API_URL`: LangGraph Cloud deployment URL
- `VITE_LANGSMITH_API_KEY`: LangSmith API key (for cloud deployments)

## Development

```bash
# Run linting
yarn lint

# Format code
yarn format

# Type check
yarn build
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
ANTHROPIC_API_KEY=your-key-here
LANGSMITH_API_KEY=your-key-here  # Optional, for tracing
```
