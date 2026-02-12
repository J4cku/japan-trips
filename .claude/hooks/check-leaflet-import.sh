#!/bin/bash
# Hook: Block module-level Leaflet imports that cause SSR crashes
# Runs on PreToolUse for Edit/Write targeting .tsx/.ts files

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check TypeScript files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty')

if [ -z "$NEW_CONTENT" ]; then
  exit 0
fi

# Block: import L from "leaflet" or import { ... } from "leaflet" at module level
# Leaflet uses `window` and will crash SSR. Must use dynamic import() inside useEffect.
if echo "$NEW_CONTENT" | grep -qE "^import .+ from ['\"]leaflet['\"]"; then
  echo "BLOCKED: Do not import Leaflet at module level — it uses \`window\` and crashes SSR. Use dynamic import('leaflet') inside useEffect() instead. See src/components/landing/JapanMap.tsx for the correct pattern." >&2
  exit 2
fi

exit 0
