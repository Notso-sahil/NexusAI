# Antigravity Browser Integration — Setup Guide

## Prerequisites

| Requirement | Minimum Version | Check Command |
|:---|:---|:---|
| Node.js | >= 18.19.0 | `node --version` |
| npm | >= 9.x | `npm --version` |
| Google Chrome | Latest stable | — |

---

## Step 1: Install the Bridge

```powershell
npm install -g mcp-chrome-bridge
```

Verify:
```powershell
mcp-chrome-bridge --version
```

---

## Step 2: Download the Chrome Extension (Status: Completed)

The extension has already been downloaded and extracted to:
`C:\Users\elite\.tools\mcp-chrome-extension\`

> ⚠️ **Do not delete or move this folder — Chrome references it directly.**

---

## Step 3: Load Extension in Chrome (Action Required by You)

1. Open Google Chrome → navigate to `chrome://extensions/`
2. Toggle **Developer mode** ON (top-right corner)
3. Click **Load unpacked**
4. Select the folder: `C:\Users\elite\.tools\mcp-chrome-extension`
5. Verify the Extension ID shown on the extension card:
   `hbdgbgagpkpjffpklnamcljpakneikee`

---

## Step 4: Register the Native Messaging Host (Status: Completed)

The native messaging host has already been registered:
- Host manifest: `%APPDATA%\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost.json`
- Registry entry: `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost`
- Allowed origin: `chrome-extension://hbdgbgagpkpjffpklnamcljpakneikee/`
- Binary: `C:\Users\elite\AppData\Roaming\npm\node_modules\mcp-chrome-bridge\dist\run_host.bat`

---

## Step 5: Connect the Extension

1. **Fully restart Google Chrome** (close all windows, reopen)
2. Click the **Chrome MCP** icon in the Chrome toolbar
3. Click **Connect**
4. ✅ The popup should show: *"Connected — listening at 127.0.0.1:12306"*

---

## Step 6: Verify the Bridge is Running

Run the verification script:

```powershell
.\scripts\verify-bridge.ps1
```

Expected output:
```
[OK] Port 12306 is listening
[OK] MCP endpoint reachable at http://127.0.0.1:12306/mcp
```

---

## Step 7: Configure Antigravity

The `.agents/mcp_config.json` file is already present in this project. Antigravity picks it up automatically when the workspace is opened.

To force a tool inventory refresh:
- Restart Antigravity IDE
- Or use the **Refresh MCP Tools** option from the command palette

---

## Troubleshooting

### Extension not showing "Connected"
- Re-run `mcp-chrome-bridge register` and ensure the Extension ID is correct
- Restart Chrome completely (not just the tab)

### Port 12306 already in use
```powershell
netstat -ano | findstr 12306
```
Kill the conflicting process or reconfigure the bridge port.

### Chrome MCP tools not appearing in Antigravity
- Confirm `mcp_config.json` is at `.agents/mcp_config.json` in the workspace root
- Restart Antigravity

### Input not registering on React/Vue pages
- The agent rules in `browser-agent.md` handle this automatically via event dispatching
- Ensure you're using the latest `mcp-chrome-bridge` version

---

## Quick Test

Once setup is complete, try this prompt in Antigravity:

> *"Open a new tab to https://httpbin.org/forms/post and fill out the Customer Name field with 'Test User', then take a screenshot."*

The agent should:
1. Call `get_windows_and_tabs`
2. Call `chrome_extract_content`
3. Call `chrome_fill_input`
4. Call `chrome_screenshot` and show you the result
