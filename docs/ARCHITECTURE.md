# Architecture

This document explains how the Sales Coaching Suite is built and why.

## Overview

The Sales Coaching Suite is a full-stack AI application with two main parts:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                    apps/web (port 5173)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Dashboard   │  │  Next Step   │  │  Call Coach  │       │
│  │  (feature    │  │  Coach       │  │  (feedback   │       │
│  │   selector)  │  │  (follow-ups)│  │   on calls)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   LangGraph Server                           │
│                  apps/agents (port 2024)                     │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │  next-step-coach     │  │  call-coach          │         │
│  │  (graph)             │  │  (graph)             │         │
│  └──────────────────────┘  └──────────────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Anthropic   │
                    │  Claude API  │
                    └──────────────┘
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React + Vite | Fast dev experience, modern tooling |
| Styling | Tailwind CSS | Utility-first, rapid prototyping |
| State | nuqs | URL-based state for shareability |
| Agents | LangGraph | Structured agent workflows |
| LLM | Claude (Anthropic) | Best-in-class reasoning |
| Testing | Vitest + Playwright | Fast unit tests + E2E |
| Monorepo | Yarn Workspaces + Turbo | Efficient builds |

## Frontend Architecture

### Key Components

```
apps/web/src/
├── components/
│   ├── thread/           # Chat interface
│   │   ├── index.tsx     # Main Thread component
│   │   ├── messages/     # Human/AI message rendering
│   │   └── history/      # Thread history sidebar
│   └── ui/               # Reusable UI components
├── providers/
│   ├── Stream.tsx        # LangGraph connection + feature selector
│   └── Thread.tsx        # Thread state management
└── lib/
    ├── utils.ts          # Tailwind class merging
    └── ensure-tool-responses.ts  # Tool call handling
```

### State Flow

1. User selects a feature → `assistantId` set in URL via nuqs
2. StreamProvider creates LangGraph connection
3. User sends message → Thread component handles submission
4. LangGraph streams response → messages update in real-time
5. Thread ID stored in URL → enables sharing/bookmarking

## Agent Architecture

### Graph Structure

Both agents use a simple linear graph:

```
┌─────────┐     ┌───────────┐     ┌─────────┐
│  START  │ ──▶ │ callModel │ ──▶ │   END   │
└─────────┘     └───────────┘     └─────────┘
```

The power is in the **prompts**, not complex graph topology.

### Agent Files

```
apps/agents/src/react-agent/      # Next Step Coach
├── graph.ts          # LangGraph definition
├── prompts.ts        # System prompt (the magic)
├── configuration.ts  # Model and prompt config
└── utils.ts          # Model loading helper

apps/agents/src/call-coach-agent/ # Call Coach
├── graph.ts          # Same structure
├── prompts.ts        # Different coaching prompt
├── configuration.ts
└── utils.ts
```

### Why No Tools?

These agents are intentionally simple. They're coaching assistants that don't need to:
- Search the web
- Query databases
- Call external APIs

All they need is a great prompt and a great model. Complexity is added only when needed.

## Data Flow

### Message Format

```typescript
interface Message {
  id: string;
  type: "human" | "ai" | "tool";
  content: string;
  tool_calls?: ToolCall[];  // For AI messages with tool use
}
```

### Streaming

The frontend uses LangGraph's React SDK for streaming:

```typescript
const stream = useStream({
  apiUrl: "http://localhost:2024",
  assistantId: "next-step-coach",
  threadId: threadId ?? null,
  streamMode: ["values"],  // Stream full state updates
});
```

## Testing Architecture

We follow the **Testing Trophy** pattern:

```
        ╱╲
       ╱  ╲      E2E Tests (Playwright)
      ╱    ╲     - Full user journeys
     ╱──────╲    - JTBD validation
    ╱        ╲   - Slow but high confidence
   ╱──────────╲
  ╱            ╲  Integration Tests (Vitest)
 ╱──────────────╲ - Agent tests with real LLM
╱                ╲- Slower, need API keys
╱──────────────────╲
      Unit Tests     - Fast, isolated
      (Vitest)       - No external deps
```

### Test Organization

```
e2e/                          # End-to-end tests
├── jtbd-next-step-coach.spec.ts
├── jtbd-call-coach.spec.ts
└── dashboard.spec.ts

apps/agents/src/*/tests/
├── unit/                     # Fast, no API calls
│   └── graph.test.ts
└── integration/              # Real API calls
    └── graph.int.test.ts

apps/web/src/lib/__tests__/   # Frontend unit tests
├── utils.test.ts
└── ensure-tool-responses.test.ts
```

## Deployment Architecture

### Development

```
yarn dev
  │
  ├─▶ Turbo runs both in parallel
  │
  ├─▶ apps/web (Vite dev server, port 5173)
  │
  └─▶ apps/agents (LangGraph server, port 2024)
```

### Production

```
Frontend (Netlify)           Agents (LangGraph Cloud)
       │                              │
       │  VITE_API_URL ───────────▶  │
       │                              │
       ▼                              ▼
   Static SPA              Managed Agent Runtime
   (React app)             (Handles threads, state)
```

## Key Design Decisions

### 1. URL-Based State

All important state is in the URL:
- `?assistantId=next-step-coach` - Current feature
- `?threadId=abc123` - Current conversation
- `?chatHistoryOpen=true` - UI state

**Why?** Enables sharing, bookmarking, and back-button navigation.

### 2. Feature-First Architecture

Features are defined once and used everywhere:

```typescript
// apps/web/src/providers/Stream.tsx
export const COACHING_FEATURES = [
  {
    id: "next-step-coach",
    title: "Next Step Coach",
    description: "...",
    icon: MessageSquare,
    examples: ["..."],
  },
  // ...
];
```

**Why?** Single source of truth. Adding a feature means updating one array.

### 3. Simple Agents

No complex agent graphs. Just:
- Great prompts
- Great model
- Simple linear flow

**Why?** Easier to debug, test, and understand. Complexity added only when proven needed.
