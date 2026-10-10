# Extension Tool Reference

## MCP Server
- **Server key**: `nexus-browser`
- **URL**: `http://127.0.0.1:12307/mcp`
- **Start bridge**: `nexus-bridge start`
- **Total active tools**: 30 tools

---

## All Available Tools

### Tab & Window Management
| Tool | Description |
|:---|:---|
| `get_windows_and_tabs` | List all open windows and tabs with IDs and URLs |
| `chrome_navigate` | Navigate to a URL or go back/forward in history |
| `chrome_switch_tab` | Switch to a specific tab by ID |
| `chrome_close_tabs` | Close one or more tabs by ID |
| `chrome_history` | Search browser history |
| `chrome_bookmark_search` | Search bookmarks by title/URL |
| `chrome_bookmark_add` | Add a new bookmark |
| `chrome_bookmark_delete` | Delete a bookmark |

### Page Reading & DOM
| Tool | Description |
|:---|:---|
| `chrome_read_page` | Get accessibility tree of visible elements (preferred over screenshots) |
| `chrome_get_web_content` | Fetch and extract text content from a page |
| `chrome_javascript` | Execute JavaScript in a tab and return result |
| `chrome_console` | Capture browser console output |
| `chrome_handle_dialog` | Handle alert/confirm/prompt dialogs |

### Clicking & Interaction
| Tool | Description |
|:---|:---|
| `chrome_click_element` | Click an element by CSS selector, XPath, ref, or coordinates |
| `chrome_keyboard` | Simulate keyboard input (Enter, Tab, Ctrl+C, text typing, etc.) |
| `chrome_request_element_selection` | Ask user to manually select an element (human-in-the-loop fallback) |
| `chrome_computer` | Full mouse + keyboard control (use as last resort) |

### Forms & Autonomous Application Filling
| Tool | Description |
|:---|:---|
| `nexus_job_applier` | ⭐ **Autonomous Job Application Filler** — Extracts company context & job description, maps Resume Vault candidate profile, synthesizes authentic Human-Generated answers, populates inputs with synthetic events, and audits results |
| `nexus_form_autofill` | ⭐ **Semantic Multi-Field Autofill** — Provide label→value map; automatically matches inputs/textareas/selects with virtual DOM event bubbling |
| `chrome_fill_or_select` | Fill a single input, textarea, select, checkbox, or radio by selector/ref |
| `chrome_upload_file` | Upload files to a file input element |

### Screenshots & Recording
| Tool | Description |
|:---|:---|
| `chrome_screenshot` | Capture visual screenshot of page viewport or specific element |
| `chrome_gif_recorder` | Record tab activity as an animated GIF |
| `performance_start_trace` | Start performance trace recording |
| `performance_stop_trace` | Stop trace recording |
| `performance_analyze_insight` | Summarize recorded performance trace |

### Network
| Tool | Description |
|:---|:---|
| `chrome_network_request` | Send network request with browser cookies and context |
| `chrome_network_capture` | Capture network traffic (start/stop) |
| `chrome_handle_download` | Wait for and get details of a browser file download |

### Quiz Solving
| Tool | Description |
|:---|:---|
| `nexus_quiz_solver` | ⭐ **Autonomous Quiz Solver** — Extracts quiz structure (questions + answer options) from active tab, evaluates answers, and selects/inputs responses |

---

## Preferred Tool Combos

### Autonomous Job Application
```
get_windows_and_tabs → chrome_read_page → nexus_job_applier → chrome_screenshot → human verification
```

### Fill a General Web Form
```
get_windows_and_tabs → chrome_read_page → nexus_form_autofill → chrome_screenshot → chrome_click_element (submit)
```

### Answer a Quiz
```
get_windows_and_tabs → nexus_quiz_solver → chrome_screenshot → chrome_click_element (submit)
```

### Read Page Content
```
get_windows_and_tabs → chrome_read_page
```

### Click Something
```
get_windows_and_tabs → chrome_read_page → chrome_click_element
```

### Debug a Page Visually
```
get_windows_and_tabs → chrome_screenshot
```

---

## Operational Guidelines

- **Always call `get_windows_and_tabs` first** to obtain the active `tabId`.
- **Prefer `nexus_job_applier` for job applications**: Reads on-device Resume Vault, extracts company mission/role, and synthesizes tailored responses adhering to Human-Generated Text rules.
- **Prefer `nexus_form_autofill` over individual `chrome_fill_or_select` calls** for multi-field forms.
- **Prefer `nexus_quiz_solver` over manual inspection** for questionnaires and online assessments.
- **Always verify before submitting**: Take a `chrome_screenshot` after form filling to verify correctness before clicking submit buttons.
- `chrome_computer` is the most powerful but slowest tool; only use it when targeted DOM tools cannot reach an element.
