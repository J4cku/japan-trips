---
name: preview
description: Build and preview TripMag locally. Kills stale servers, builds fresh, starts on port 8080, and opens in Chrome.
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[port]"
---

# Preview

Build and preview TripMag in the browser.

## Steps

1. Kill any existing Next.js server on the target port:
   ```bash
   lsof -ti :${PORT:-8080} | xargs kill 2>/dev/null
   ```

2. Clean build to avoid stale CSS cache:
   ```bash
   rm -rf .next
   npx next build
   ```

3. Start production server:
   ```bash
   npx next start -p ${PORT:-8080} &
   ```

4. Wait for server to be ready (curl health check)

5. Open in Chrome using MCP tools:
   - Get/create tab context
   - Navigate to `http://localhost:${PORT:-8080}`
   - Take a desktop screenshot

6. Report build status and URL

## Arguments

`$ARGUMENTS` is an optional port number. Default: 8080.

If $ARGUMENTS is a path like `/trip/japan-2026`, start on default port and navigate to that path.

## Output

Report:
- Build status (success/fail)
- Server URL
- Screenshot of the loaded page
