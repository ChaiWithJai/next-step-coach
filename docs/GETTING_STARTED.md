# Getting Started

Welcome to the Sales Coaching Suite! This guide will get you from zero to running in under 10 minutes.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+**: Check with `node --version`
- **Yarn 3.5+**: Comes with Node via Corepack
- **Anthropic API Key**: Get one at https://console.anthropic.com

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone <repository-url>
cd next-step-coach

# Enable Corepack for Yarn 3
corepack enable

# Install dependencies
yarn install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start Development

```bash
# This starts both the frontend (port 5173) and agents (port 2024)
yarn dev
```

### 4. Open the App

Visit http://localhost:5173 in your browser. You should see the Sales Coaching Suite dashboard with two features:

- **Next Step Coach**: Turn networking notes into follow-ups
- **Call Coach**: Get feedback on sales calls

## Verify Everything Works

### Run the Tests

```bash
# Run unit tests (should pass in <1 second)
yarn test

# Expected output:
# ✓ apps/web/src/lib/__tests__/utils.test.ts (8 tests)
# ✓ apps/web/src/lib/__tests__/ensure-tool-responses.test.ts (6 tests)
# ✓ apps/agents/src/react-agent/tests/unit/graph.test.ts (8 tests)
# ✓ apps/agents/src/call-coach-agent/tests/unit/graph.test.ts (9 tests)
# Test Files: 4 passed
# Tests: 31 passed
```

### Test the App Manually

1. Click "Next Step Coach"
2. Click one of the example prompts
3. Click "Send"
4. You should see a coaching response

## Project Structure

```
next-step-coach/
├── apps/
│   ├── agents/              # LangGraph agents (backend)
│   │   └── src/
│   │       ├── react-agent/       # Next Step Coach
│   │       └── call-coach-agent/  # Call Coach
│   └── web/                 # React frontend
│       └── src/
│           ├── components/  # UI components
│           ├── providers/   # React context providers
│           └── lib/         # Utilities
├── e2e/                     # End-to-end tests
├── docs/                    # Documentation (you are here)
├── langgraph.json          # Agent deployment config
└── package.json            # Monorepo root
```

## Common Issues

### "Anthropic API key not found"

Make sure your `.env` file exists and contains:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Port 5173 already in use

Kill the existing process:
```bash
lsof -ti :5173 | xargs kill -9
```

### Yarn install fails

Make sure Corepack is enabled:
```bash
corepack enable
yarn --version  # Should show 3.5.1 or higher
```

## Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to contribute
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase
- Read [RELEASING.md](./RELEASING.md) to learn our release process
