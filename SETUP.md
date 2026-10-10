# NexusAI Browser Agent — Setup Guide

## Overview

**NexusAI Browser Agent** connects Antigravity (and any MCP client) directly to Google Chrome, enabling autonomous browser interactions, intelligent form filling, quiz solving, and automated job applications with human-like text generation.

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|:---|:---|:---|
| Node.js | >= 18.19.0 (LTS recommended) | `node --version` |
| pnpm | >= 8.x | `pnpm --version` |
| Google Chrome | Latest stable | — |

---

## Quick Setup (Recommended)

Run the one-click build and installation script from the project root:

### On Windows (PowerShell):
```powershell
.\build-and-install.ps1
```

### On macOS / Linux:
```bash
./build-and-install.sh
```

Or via root package commands:
```bash
pnpm install
pnpm setup
```

This single command:
1. Compiles `@nexusai/shared` (TypeScript schemas, types, and humanizer prompts).
2. Compiles `@nexusai/bridge` (Fastify MCP server and CLI executable).
3. Builds `@nexusai/extension` (Manifest V3 Chrome extension bundle in `packages/extension/.output/chrome-mv3`).
4. Generates and installs the native messaging host manifest (`com.nexusai.browserhost.json`) and Windows Registry entry (`HKCU\Software\Google\Chrome\NativeMessagingHosts\com.nexusai.browserhost`).

---

## Loading the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the directory:
   ```
   c:\Users\elite\Desktop\Browser-interaction\packages\extension\.output\chrome-mv3
   ```
5. Confirm the extension card displays **NexusAI Browser Agent**.

---

## Starting the Bridge & Connecting

1. Start the bridge MCP server:
   ```powershell
   nexus-bridge start
   ```
   *(Listening on `http://127.0.0.1:12307/mcp`)*
2. In Chrome, click the **NexusAI** puzzle piece / toolbar icon to open the popup.
3. Verify the status shows **Connected** on port `12307`.
4. Check the **Human-Generated Text** toggle switch (enabled by default) to enforce natural, buzzword-free candidate writing.

---

## In-Extension Resume Vault & Job Applier

1. Open the NexusAI popup → click **Resume Vault & Job Applier**.
2. Upload your resume (`.json`, `.txt`, `.pdf`, `.docx`) or click **Load Demo Profile**.
3. All profile data is stored **100% locally** in Chrome storage — never sent to cloud databases.
4. Navigate to any active job posting (Greenhouse, Lever, LinkedIn, Ashby, Workday, etc.).
5. Click **Fill Active Job Page** or instruct Antigravity:
   > *"Fill out the job application on my active tab using my resume profile."*

---

## Verifying Antigravity MCP Connection

Antigravity automatically detects `.agents/mcp_config.json`:
```json
{
  "mcpServers": {
    "nexus-browser": {
      "type": "streamableHttp",
      "url": "http://127.0.0.1:12307/mcp"
    }
  }
}
```

To verify:
1. Check Antigravity's tool inventory — you should see 29 tools under `nexus-browser`.
2. Run the bridge verification script:
   ```powershell
   .\scripts\verify-bridge.ps1
   ```

---

## Troubleshooting

### Extension Shows "Disconnected"
- Confirm the bridge is running (`netstat -ano | findstr 12307`).
- Re-run `node scripts/install-host.mjs` to ensure the native messaging host manifest is registered.
- Fully restart Google Chrome.

### Input Not Updating on React/Vue Pages
- Use `nexus_form_autofill` or `nexus_job_applier` — they automatically dispatch synthetic input and change events with native prototype setters to trigger virtual DOM state updates.

### Port 12307 Collision
```powershell
netstat -ano | findstr 12307
```
Identify and terminate the conflicting PID, or specify a custom port using `NEXUSAI_PORT=12308`.
