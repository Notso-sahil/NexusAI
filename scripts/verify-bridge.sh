#!/usr/bin/env bash
# Verify mcp-chrome-bridge connectivity (Unix/macOS/Linux)

set -e

echo -e "\033[36mChecking mcp-chrome-bridge status...\033[0m"

# Check if port 12306 is listening
if lsof -i :12306 | grep -q LISTEN; then
    echo -e "\033[32m[OK] Port 12306 is listening\033[0m"
else
    echo -e "\033[31m[FAIL] Port 12306 is NOT listening. Make sure:\033[0m"
    echo -e "\033[33m  1. Chrome is open\033[0m"
    echo -e "\033[33m  2. The Chrome MCP extension is loaded and Connected\033[0m"
    echo -e "\033[33m  3. Run: mcp-chrome-bridge register\033[0m"
    exit 1
fi

# Check MCP endpoint
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:12306/mcp || echo "000")
if [ "$HTTP_STATUS" != "000" ]; then
    echo -e "\033[32m[OK] MCP endpoint reachable at http://127.0.0.1:12306/mcp (HTTP $HTTP_STATUS)\033[0m"
else
    echo -e "\033[33m[WARN] Could not reach MCP endpoint — bridge may still be running (requires SSE/POST)\033[0m"
fi

# Check bridge installed
if command -v mcp-chrome-bridge &> /dev/null; then
    BRIDGE_VER=$(mcp-chrome-bridge --version 2>&1 || echo "unknown")
    echo -e "\033[32m[OK] mcp-chrome-bridge installed: $BRIDGE_VER\033[0m"
else
    echo -e "\033[31m[FAIL] mcp-chrome-bridge not found. Run: npm install -g mcp-chrome-bridge\033[0m"
    exit 1
fi

echo ""
echo -e "\033[36mSetup looks good! Open Antigravity and try:\033[0m"
echo '  "Look at my active Chrome tab and tell me what you see."'
