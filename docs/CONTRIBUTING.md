# Contributing

Welcome! This guide will help you contribute to the Sales Coaching Suite.

## Before You Start

1. Read [GETTING_STARTED.md](./GETTING_STARTED.md) to set up your environment
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how things work
3. Read [RELEASING.md](./RELEASING.md) to understand our release cycle

## Making Changes

### 1. Pick Up Work

During a 6-week cycle, work comes from **shaped pitches** that have been bet on. Check with the team to see what's in scope.

During cooldown, focus on:
- Bug fixes
- Small improvements
- Tech debt

### 2. Create a Branch

```bash
git checkout main
git pull origin main
git checkout -b your-branch-name
```

**Branch naming:**
- `fix/description` - Bug fixes
- `feat/description` - New features
- `improve/description` - Improvements to existing features
- `docs/description` - Documentation changes

### 3. Make Your Changes

Follow these principles:

**Keep it simple**
- Don't over-engineer
- Don't add features that weren't asked for
- Don't refactor code that isn't related to your change

**Match existing patterns**
- Look at similar code in the codebase
- Follow the same style and structure
- When in doubt, keep it consistent

**Write good prompts (for agents)**
- The power is in the prompts, not complex graphs
- See `apps/agents/src/react-agent/prompts.ts` for examples

### 4. Test Your Changes

```bash
# Always run unit tests
yarn test

# Run E2E tests if you changed UI
yarn test:e2e

# Run integration tests if you changed agent behavior (requires API key)
yarn test:integration
```

**Test requirements:**
- All unit tests must pass
- E2E tests must pass if you touched frontend code
- Add tests for new functionality
- Don't break existing tests

### 5. Commit Your Changes

Write clear commit messages:

```bash
# Good
git commit -m "Add loading state to message input"
git commit -m "Fix thread history not updating on new message"

# Bad
git commit -m "updates"
git commit -m "WIP"
git commit -m "fix stuff"
```

**Commit message format:**
- Start with a verb: Add, Fix, Update, Remove, Refactor
- Keep it under 72 characters
- Describe what changed, not how

### 6. Push and Create PR

```bash
git push -u origin HEAD
```

Then open a PR on GitHub with:

**Title:** Clear, concise description of the change

**Description:**
```markdown
## What

Brief description of what this PR does.

## Why

Why is this change needed?

## How to Test

1. Step one
2. Step two
3. Expected result

## Screenshots (if UI change)

Before/after if applicable.
```

### 7. Get Review

- Request review from a teammate
- Address feedback promptly
- Don't take feedback personally—we're all improving the code together

### 8. Merge

Once approved:
1. Squash and merge (keeps history clean)
2. Delete your branch
3. Deployment happens automatically

## Code Style

### TypeScript

```typescript
// Use explicit types for function parameters and returns
function processMessage(message: Message): ProcessedMessage {
  // ...
}

// Prefer const over let
const userName = "Alice";

// Use template literals for string interpolation
const greeting = `Hello, ${userName}!`;

// Destructure when it improves readability
const { id, content, type } = message;
```

### React

```tsx
// Functional components with explicit props type
interface FeatureCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function FeatureCard({ title, description, onClick }: FeatureCardProps) {
  return (
    <button onClick={onClick} className="...">
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}
```

### CSS (Tailwind)

```tsx
// Group related utilities
<div className="
  flex items-center gap-4
  p-4 rounded-lg
  bg-white shadow-sm
  hover:shadow-md transition-shadow
">

// Use cn() for conditional classes
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

## Adding a New Feature

### Frontend Feature

1. Add feature to `COACHING_FEATURES` in `apps/web/src/providers/Stream.tsx`
2. Create corresponding agent in `apps/agents/src/`
3. Add agent to `langgraph.json`
4. Add E2E test in `e2e/`
5. Update documentation

### Agent Feature

1. Create new directory in `apps/agents/src/`
2. Copy structure from existing agent:
   ```
   your-agent/
   ├── graph.ts          # LangGraph definition
   ├── prompts.ts        # System prompt
   ├── configuration.ts  # Config types
   ├── utils.ts          # Helpers
   └── tests/
       ├── unit/
       └── integration/
   ```
3. Write a great prompt (this is where the magic happens)
4. Add to `langgraph.json`
5. Add tests

## Testing Guide

### Unit Tests

Fast tests that don't require external services.

```typescript
// apps/agents/src/your-agent/tests/unit/graph.test.ts
import { describe, it, expect } from "vitest";
import { ensureConfiguration } from "../../configuration";

describe("ensureConfiguration", () => {
  it("should return defaults when no config provided", () => {
    const config = ensureConfiguration({});
    expect(config.model).toBe("claude-sonnet-4-20250514");
  });
});
```

### Integration Tests

Tests that call real APIs (require `ANTHROPIC_API_KEY`).

```typescript
// apps/agents/src/your-agent/tests/integration/graph.int.test.ts
import { describe, it, expect } from "vitest";
import { graph } from "../../graph";

describe("your-agent integration", () => {
  it("should generate response for valid input", async () => {
    const result = await graph.invoke({
      messages: [{ role: "user", content: "test input" }],
    });
    expect(result.messages).toHaveLength(2);
  });
});
```

### E2E Tests

Full user journey tests with Playwright.

```typescript
// e2e/your-feature.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Your Feature JTBD", () => {
  test("user can accomplish their job", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Your Feature").click();
    // ... test the journey
  });
});
```

## Getting Help

- **Stuck on something?** Ask in the team channel
- **Found a bug?** Open an issue on GitHub
- **Have an idea?** Write a pitch (see Shape Up)

## Quick Reference

| Command | What it does |
|---------|--------------|
| `yarn dev` | Start dev servers |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run E2E tests |
| `yarn test:integration` | Run integration tests |
| `yarn build` | Build for production |
| `yarn lint` | Check code style |
