# Releasing

We follow Basecamp's Shape Up methodology for releases. This document explains our release cycle and process.

## Release Cycle Overview

We work in **6-week cycles** followed by a **2-week cooldown**.

```
Week 1-6: Building          Week 7-8: Cooldown
┌─────────────────────┐     ┌─────────────────┐
│  Shaped work gets   │     │  Bug fixes      │
│  built and shipped  │ ──▶ │  Small tweaks   │
│                     │     │  Shaping next   │
└─────────────────────┘     └─────────────────┘
```

### The 6-Week Cycle

During the build cycle:
- We work on **shaped pitches** that have been bet on
- Work is organized into **scopes** (not tasks)
- Teams have full autonomy over implementation
- Shipping happens continuously throughout

### The 2-Week Cooldown

During cooldown:
- Fix bugs reported during the cycle
- Clean up tech debt
- Shape pitches for the next cycle
- No new feature work

## Release Types

### 1. Continuous Deploys (During Cycle)

Every merge to `main` that passes CI gets deployed automatically.

```
Feature Branch ──▶ PR ──▶ Review ──▶ Merge ──▶ Deploy
```

This is our primary release mechanism. We ship small, working pieces continuously.

### 2. Cycle Releases (End of 6-Week Cycle)

At the end of each cycle, we:
1. Review what shipped
2. Write release notes
3. Tag a version
4. Communicate to stakeholders

## How to Ship

### Daily Workflow

1. **Pull latest main**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b scope/brief-description
   # Examples:
   # git checkout -b improve-empty-state
   # git checkout -b fix-mobile-layout
   ```

3. **Make your changes**

4. **Run tests locally**
   ```bash
   yarn test          # Unit tests
   yarn test:e2e      # E2E tests (if UI changed)
   ```

5. **Push and create PR**
   ```bash
   git push -u origin HEAD
   # Then open PR on GitHub
   ```

6. **Get review and merge**
   - PR triggers CI (lint, test, build)
   - After approval, squash and merge
   - Delete the branch

7. **Deploy happens automatically**
   - Netlify deploys frontend on merge
   - LangGraph Cloud deploys agents on merge (when configured)

### Cutting a Version Release

At the end of a cycle, or for significant milestones:

```bash
# 1. Ensure you're on main with all changes
git checkout main
git pull origin main

# 2. Create a version tag
git tag -a v1.0.0 -m "Cycle 1: Initial Release"

# 3. Push the tag
git push origin v1.0.0

# 4. Create GitHub Release
# Go to GitHub → Releases → Draft new release
# Select the tag and write release notes
```

## Version Numbering

We use semantic versioning with cycle context:

```
v{major}.{minor}.{patch}

Major: Breaking changes or major feature sets
Minor: New features (usually per cycle)
Patch: Bug fixes during cooldown
```

**Examples:**
- `v1.0.0` - First production release
- `v1.1.0` - Second cycle release
- `v1.1.1` - Bug fix during cooldown
- `v2.0.0` - Major architecture change

## Release Checklist

Before cutting a release:

- [ ] All CI checks passing on main
- [ ] Manually test the core user journeys:
  - [ ] Can select a coaching feature
  - [ ] Can send a message and get response
  - [ ] Can navigate between features
  - [ ] Can start new threads
- [ ] No critical bugs in issue tracker
- [ ] Team agrees it's ready

## Deployment Environments

### Production

- **Frontend**: Netlify (auto-deploys on main)
- **Agents**: LangGraph Cloud (manual deploy for now)
- **URL**: (to be configured)

### Preview (PR Deploys)

Netlify creates preview deploys for every PR:
- URL: `deploy-preview-{pr-number}--{site-name}.netlify.app`
- Useful for visual review before merge

## Rollback Procedure

If something goes wrong after deploy:

### Frontend (Netlify)

1. Go to Netlify → Deploys
2. Find the last working deploy
3. Click "Publish deploy"

### Agents (LangGraph Cloud)

1. Identify the last working commit
2. Deploy that specific version:
   ```bash
   git checkout {commit-sha}
   langgraph deploy
   ```

## Communication

### During Cycle

- Post in team channel when starting a scope
- Post when shipping significant pieces
- Raise blockers early

### At Cycle End

Write a brief summary:
```markdown
## Cycle {N} Shipped

### What We Built
- Feature 1: Brief description
- Feature 2: Brief description

### What We Learned
- Key insight 1
- Key insight 2

### What's Next
- Planned scope 1
- Planned scope 2
```

## Links

- [Shape Up by Basecamp](https://basecamp.com/shapeup) - Our methodology
- [GitHub Repository](link-here) - Source code
- [Netlify Dashboard](link-here) - Frontend deploys
- [LangGraph Cloud](link-here) - Agent deploys
