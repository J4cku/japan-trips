#!/bin/bash
# Hook: Block CSS anti-patterns that cause known bugs in TripMag
# Runs on PreToolUse for Edit/Write targeting .css files

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check CSS files
if [[ "$FILE_PATH" != *.css ]]; then
  exit 0
fi

# Check new content for known anti-patterns
NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty')

if [ -z "$NEW_CONTENT" ]; then
  exit 0
fi

# Block: var(--lp-font-display) or var(--lp-font-mono) — these intermediary
# variables don't work because --font-display/--font-mono are set on <body>,
# not :root. Use var(--font-display, 'Playfair Display') directly instead.
if echo "$NEW_CONTENT" | grep -q 'var(--lp-font-display)\|var(--lp-font-mono)'; then
  echo "BLOCKED: Do not use var(--lp-font-display) or var(--lp-font-mono). These intermediary variables fail because Next.js sets --font-display/--font-mono on <body>, not :root. Use var(--font-display, 'Playfair Display'), Georgia, serif or var(--font-mono, 'Space Mono'), 'Courier New', monospace directly." >&2
  exit 2
fi

exit 0
