// NexusAI Browser Agent — Phase Documentation Generator
// Generates a professional Word (.docx) document for each phase of the project
// Run: node scripts/generate-docs.js

const path = require('path');
const fs = require('fs');

const docx = require('docx');

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType,
  UnderlineType, PageBreak, Header, Footer, ImageRun, SectionType,
  convertInchesToTwip, LevelFormat, NumberFormat
} = docx;

const OUTPUT_DIR = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLOR = {
  primary:    '4F46E5',  // Indigo
  secondary:  '7C3AED',  // Violet
  accent:     '06B6D4',  // Cyan
  dark:       '1E1B4B',  // Dark navy
  text:       '1F2937',  // Charcoal
  muted:      '6B7280',  // Gray
  code:       'F3F4F6',  // Light gray (bg)
  codeText:   '1F2937',
  white:      'FFFFFF',
  border:     'E5E7EB',
  success:    '059669',
  warning:    'D97706',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const bold = (text, color = COLOR.text, size = 22) =>
  new TextRun({ text, bold: true, color, size });

const normal = (text, color = COLOR.text, size = 22) =>
  new TextRun({ text, color, size });

const italic = (text, color = COLOR.muted, size = 20) =>
  new TextRun({ text, italics: true, color, size });

const para = (children, spacing = { before: 120, after: 120 }, alignment = AlignmentType.LEFT) =>
  new Paragraph({ children, spacing, alignment });

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, color: COLOR.white, size: 36 })],
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 240, after: 240 },
  shading: { type: ShadingType.SOLID, fill: COLOR.primary },
  indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, color: COLOR.primary, size: 28 })],
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.primary } },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, color: COLOR.secondary, size: 24 })],
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 80 },
});

const bullet = (text, color = COLOR.text) => new Paragraph({
  children: [new TextRun({ text, color, size: 22 })],
  bullet: { level: 0 },
  spacing: { before: 60, after: 60 },
});

const subBullet = (text, color = COLOR.muted) => new Paragraph({
  children: [new TextRun({ text, color, size: 20 })],
  bullet: { level: 1 },
  spacing: { before: 40, after: 40 },
});

const codeBlock = (lines) => {
  const rows = lines.map(line =>
    new TableRow({
      children: [new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: line, font: 'Courier New', size: 18, color: COLOR.codeText })],
          spacing: { before: 40, after: 40 },
          indent: { left: convertInchesToTwip(0.1) },
        })],
        shading: { type: ShadingType.SOLID, fill: COLOR.code },
        margins: { left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
      })]
    })
  );
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: COLOR.border },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.border },
      left:   { style: BorderStyle.SINGLE, size: 4, color: COLOR.border },
      right:  { style: BorderStyle.SINGLE, size: 4, color: COLOR.border },
    },
  });
};

const infoBox = (label, text, fillColor = 'EEF2FF') => new Table({
  rows: [new TableRow({ children: [
    new TableCell({
      children: [
        new Paragraph({ children: [bold(label, COLOR.primary, 20)], spacing: { before: 60, after: 20 } }),
        new Paragraph({ children: [normal(text, COLOR.text, 20)], spacing: { before: 0, after: 60 } }),
      ],
      shading: { type: ShadingType.SOLID, fill: fillColor },
      margins: { top: convertInchesToTwip(0.1), bottom: convertInchesToTwip(0.1),
                 left: convertInchesToTwip(0.15), right: convertInchesToTwip(0.15) },
    })
  ]})],
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top:   { style: BorderStyle.SINGLE, size: 8, color: COLOR.primary },
    left:  { style: BorderStyle.SINGLE, size: 8, color: COLOR.primary },
    bottom: { style: BorderStyle.NONE },
    right:  { style: BorderStyle.NONE },
  },
});

const divider = () => new Paragraph({
  children: [],
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.border } },
});

const pageBreakPara = () => new Paragraph({ children: [new PageBreak()] });

// ─── Phase Content Definitions ────────────────────────────────────────────────

const PHASES = [
  {
    number: 1,
    filename: 'phase-1-scaffold.docx',
    title: 'Phase 1: Project Scaffold & Monorepo Setup',
    subtitle: 'Setting the Foundation',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'Before writing a single line of the actual browser automation code, we needed to organize the project properly. Think of this phase like building the foundation of a house before the walls go up.',
        'The original project we were working from was scattered across multiple separate packages on the internet — one for the Chrome extension, one for the bridge server, and one for the shared types. We brought all of them together into a single, unified workspace so that any change in one part automatically works with the others.',
        'We also gave the project a brand new identity. Instead of being a copy of someone else\'s work, it is now called "NexusAI Browser Agent" — a completely original product with its own name, icons, and configuration.',
        'Finally, we chose the modern tools that professional development teams use: pnpm for package management (faster and more efficient than npm), TypeScript for safer code, and a workspace setup that lets all three packages (extension, bridge, shared) talk to each other seamlessly.',
      ],
      keyPoints: [
        'Created a single organized folder structure instead of relying on 3 separate internet packages',
        'Gave the project a new brand identity: NexusAI Browser Agent',
        'Set up professional developer tooling used by major tech companies',
        'Established naming conventions, coding standards, and folder patterns for the rest of the project',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'We initialized a pnpm workspace monorepo containing three interconnected packages: @nexusai/extension (Chrome MV3), @nexusai/bridge (Node.js MCP server), and @nexusai/shared (tool schemas). This enables cross-package TypeScript imports with full type safety and hot module reloading during development.',
        'The workspace is configured via pnpm-workspace.yaml pointing to packages/*, allowing pnpm to hoist shared dependencies to the root node_modules while maintaining isolated dependency trees per package. Each package declares its own tsconfig.json extending a root tsconfig.base.json that enforces strict TypeScript, ES2022 target, and module resolution for both CommonJS (bridge) and ESM (extension).',
      ],
      codeBlocks: [
        {
          label: 'pnpm-workspace.yaml',
          lines: [
            'packages:',
            '  - "packages/*"',
          ]
        },
        {
          label: 'Root package.json scripts',
          lines: [
            '"scripts": {',
            '  "build": "pnpm --filter ./packages/* build",',
            '  "dev": "pnpm --filter @nexusai/extension dev",',
            '  "clean": "pnpm --filter ./packages/* exec -- rm -rf dist .output"',
            '}',
          ]
        },
        {
          label: 'tsconfig.base.json',
          lines: [
            '{',
            '  "compilerOptions": {',
            '    "strict": true,',
            '    "target": "ES2022",',
            '    "moduleResolution": "bundler",',
            '    "paths": { "@nexusai/shared": ["../shared/src/index.ts"] }',
            '  }',
            '}',
          ]
        },
      ],
      keyDecisions: [
        'pnpm over npm: 2-3x faster installs, hard links for disk efficiency, strict dependency isolation',
        'Monorepo over separate repos: atomic commits across extension+bridge+shared, shared linting config, single CI pipeline',
        'WXT for extension build: abstracts Manifest V3 complexities, hot reload in dev mode, outputs clean production ZIP',
        'TypeScript strict mode: eliminates undefined/null bugs at compile time, critical for Chrome API usage',
      ]
    }
  },

  {
    number: 2,
    filename: 'phase-2-extension.docx',
    title: 'Phase 2: Chrome Extension — Build & English Localization',
    subtitle: 'Building the Browser-Side AI Interface',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'The Chrome Extension is the piece of software that lives inside your browser. It is what gives the AI agent its eyes and hands — allowing it to see what is on your screen, read text from any web page, click buttons, fill out forms, and take screenshots.',
        'The original extension had all of its text in Chinese, which made it difficult to use and maintain for an English-speaking team. We rebuilt the entire user interface from scratch in English with a clean, modern dark design that matches the visual style of Antigravity.',
        'We also completely redesigned the popup (the small window that appears when you click the extension icon in Chrome). The new popup has four distinct sections: a connection status panel showing whether the AI is connected, a searchable list of all 28 available tools the AI can use, a quick-action area with one-click buttons for the most common tasks, and a settings footer.',
        'The extension now has a fresh identity — NexusAI Browser Agent — with its own name, icons, and description that appear in the Chrome extensions page.',
      ],
      keyPoints: [
        'Rebuilt from scratch in English — no Chinese text anywhere in the interface',
        'New modern dark popup with 4 functional sections',
        'Brand new identity: NexusAI Browser Agent, with custom icons',
        '28 AI tools implemented: reading pages, clicking elements, filling forms, taking screenshots, and more',
        'Works with all modern web frameworks including React, Vue, and Angular',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'The extension is built using WXT (Web Extension Toolkit) with Vue 3 Composition API. WXT handles the Manifest V3 build complexity, content script injection, and dev-mode HMR. The extension communicates with the bridge via Chrome Native Messaging (stdin/stdout binary protocol with 4-byte length-prefixed messages).',
        'Each tool is implemented as an isolated TypeScript module in src/tools/. Tool calls arrive from the bridge as NexusMessageType.CALL_TOOL messages received by the background service worker, which dispatches to the correct tool handler and returns the result. The native messaging host connection is maintained as a persistent port in the service worker.',
        'The popup is a Vue 3 SPA compiled into popup.html. It uses the chrome.runtime messaging API to communicate with the background service worker to read connection state and trigger quick actions. The tool list is fetched from the background on popup open and filtered client-side.',
      ],
      codeBlocks: [
        {
          label: 'manifest.config.ts (WXT)',
          lines: [
            'export default defineManifest({',
            '  name: "NexusAI Browser Agent",',
            '  description: "AI-powered browser automation for MCP clients",',
            '  version: "1.0.0",',
            '  default_locale: "en",',
            '  permissions: ["nativeMessaging","tabs","activeTab","scripting",',
            '    "webRequest","debugger","history","bookmarks","storage","sidePanel"],',
            '  host_permissions: ["<all_urls>"],',
            '  action: { default_popup: "popup.html" },',
            '  side_panel: { default_path: "sidepanel.html" },',
            '  background: { service_worker: "background.js" }',
            '});',
          ]
        },
        {
          label: 'React/Vue-compatible fill (src/tools/form.ts)',
          lines: [
            'function fillReactInput(el: HTMLInputElement, value: string) {',
            '  const nativeSetter = Object.getOwnPropertyDescriptor(',
            '    HTMLInputElement.prototype, "value"',
            '  )?.set;',
            '  nativeSetter?.call(el, value);',
            '  el.dispatchEvent(new Event("input",  { bubbles: true }));',
            '  el.dispatchEvent(new Event("change", { bubbles: true }));',
            '}',
          ]
        },
        {
          label: 'English locale (src/locales/en/messages.json)',
          lines: [
            '{',
            '  "extensionName":   { "message": "NexusAI Browser Agent" },',
            '  "statusConnected":  { "message": "Connected" },',
            '  "statusDisconnected": { "message": "Disconnected" },',
            '  "btnConnect":      { "message": "Connect" },',
            '  "btnDisconnect":   { "message": "Disconnect" },',
            '  "toolCount":       { "message": "$1 tools available" }',
            '}',
          ]
        },
      ],
      keyDecisions: [
        'WXT over manual webpack: handles MV3 service worker quirks, automatic content script registration, built-in ZIP output for distribution',
        'Native setter pattern for React inputs: directly mutating .value bypasses React\'s synthetic event system; using the native prototype setter triggers React\'s internal change tracking',
        'English-only locale: single messages.json in en/ with no zh_CN fallback, removing all original Chinese strings',
        'No manifest key field: fresh Extension ID assigned by Chrome, severing link to original extension identity',
      ]
    }
  },

  {
    number: 3,
    filename: 'phase-3-bridge.docx',
    title: 'Phase 3: Node.js Bridge — MCP Server Rewrite',
    subtitle: 'The Communication Layer Between AI and Browser',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'The bridge is the invisible middleman that makes everything work. When you give Antigravity a command like "fill out this form," Antigravity does not talk directly to Chrome. Instead, it sends a message to the bridge — a small program running in the background on your computer — and the bridge forwards that message to the Chrome extension, which then takes action in the browser.',
        'We completely rewrote the bridge under the NexusAI identity. Its new name is nexus-bridge, it runs on a different port (12307) to avoid conflicts with the old bridge, and every piece of text in it is now in English.',
        'We also added a new command-line tool (nexus-bridge doctor) that can automatically diagnose common problems, like the extension not being connected or the port being blocked. This makes troubleshooting much easier.',
        'The bridge follows the Model Context Protocol (MCP) — an open standard for AI tools — so it works not just with Antigravity, but with any MCP-compatible AI assistant.',
      ],
      keyPoints: [
        'Completely rewrote the bridge with NexusAI branding — no references to the original project',
        'Changed from port 12306 to port 12307 to allow both old and new bridges to coexist',
        'Added nexus-bridge doctor command for automatic problem diagnosis',
        'All source code comments and messages are in English',
        'Compatible with any MCP client (Antigravity, Claude Desktop, etc.)',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'The bridge is a Node.js process that serves two endpoints: a Fastify HTTP server on 127.0.0.1:12307 exposing the MCP streamable HTTP protocol (POST /mcp + GET /mcp SSE), and a stdio mode for direct subprocess invocation by MCP clients. It relays tool calls to the Chrome extension via Chrome Native Messaging — a binary stdin/stdout protocol using 4-byte little-endian message length prefixes.',
        'The bridge maintains a single persistent Native Messaging port to the extension, queuing concurrent requests and matching responses by a correlation ID (UUID). All tool schemas are imported from @nexusai/shared, keeping tool definitions DRY and consistent between bridge and extension.',
        'Registration writes the native messaging manifest JSON and a Windows Registry entry under HKCU, making the host discoverable by Chrome without admin privileges.',
      ],
      codeBlocks: [
        {
          label: 'src/scripts/constants.ts',
          lines: [
            'export const COMMAND_NAME = "nexus-bridge";',
            'export const HOST_NAME   = "com.nexusai.browserhost";',
            'export const BRIDGE_PORT = 12307;',
            'export const DESCRIPTION = "NexusAI Browser Agent Native Messaging Host";',
          ]
        },
        {
          label: 'Native messaging manifest (written by register)',
          lines: [
            '{',
            '  "name": "com.nexusai.browserhost",',
            '  "description": "NexusAI Browser Agent Native Messaging Host",',
            '  "path": "C:\\\\...\\\\nexus-bridge\\\\run_host.bat",',
            '  "type": "stdio",',
            '  "allowed_origins": [',
            '    "chrome-extension://<your-new-extension-id>/"',
            '  ]',
            '}',
          ]
        },
        {
          label: 'src/mcp/server.ts (Fastify setup)',
          lines: [
            'const server = Fastify({ logger: false });',
            'server.register(cors, { origin: true });',
            '',
            'server.post("/mcp", async (req, reply) => {',
            '  const result = await mcpHandler.handleRequest(req.body);',
            '  return reply.send(result);',
            '});',
            '',
            'server.listen({ port: BRIDGE_PORT, host: "127.0.0.1" });',
            'console.log(`NexusAI Bridge listening on :${BRIDGE_PORT}`);',
          ]
        },
      ],
      keyDecisions: [
        'Port 12307: avoids collision with existing mcp-chrome-bridge on 12306, allows both to run simultaneously during migration',
        'Fastify over Express: 2-3x throughput, built-in JSON schema validation, zero-overhead serialization — important for low-latency tool calls',
        'UUID correlation IDs: allows concurrent tool calls from multiple MCP clients to the same native host, with correct response routing',
        'HKCU registry (not HKLM): no administrator privileges required, user-level install matches original behavior',
      ]
    }
  },

  {
    number: 4,
    filename: 'phase-4-shared.docx',
    title: 'Phase 4: Shared Package — Tool Schemas & Types',
    subtitle: 'The Single Source of Truth for All Tools',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'The shared package is like a central dictionary for the project. It contains the official definitions of all 28 AI tools — what each tool is called, what it does, and what inputs it accepts.',
        'Without this shared package, the same tool definition would need to be written twice: once in the bridge (which tells the AI client what tools are available) and once in the extension (which actually executes the tools). Having two copies creates a risk of them falling out of sync — the AI might think a tool accepts one type of input, while the extension expects something different.',
        'By putting all tool definitions in one place, both the bridge and the extension always agree. Any change to a tool automatically applies everywhere.',
        'All tool descriptions in this package are written in clear, professional English. This is what the AI actually reads when it decides which tool to use for your request.',
      ],
      keyPoints: [
        'Single source of truth — tool definitions written once, used in both bridge and extension',
        'All 28 tool descriptions written in English with clear, professional language',
        'Includes TypeScript types for compile-time safety across the entire project',
        'Easily extensible — adding a new tool means adding one entry in this package',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'The @nexusai/shared package exports TOOL_SCHEMAS (ToolSchema[]) consumed by the bridge\'s MCP ListTools handler, and NexusMessageType enum used for native messaging message routing. It is built as a dual CJS/ESM package using tsup, enabling consumption by both the Node.js bridge (CJS) and the WXT extension build (ESM).',
        'Each ToolSchema conforms to the MCP specification\'s tool format: name (string), description (string), and inputSchema (JSON Schema object). TypeScript generics are used to type each tool\'s args object, enabling type-safe tool call handling in both bridge and extension.',
      ],
      codeBlocks: [
        {
          label: 'src/tool-schemas.ts (excerpt)',
          lines: [
            'export const TOOL_SCHEMAS: ToolSchema[] = [',
            '  {',
            '    name: "nexus_form_autofill",',
            '    description: "Intelligently fill an entire HTML form using ' +
              'semantic label matching.",',
            '    inputSchema: {',
            '      type: "object",',
            '      required: ["fields"],',
            '      properties: {',
            '        fields: { type: "object",',
            '          description: "Map of field labels to fill values",',
            '          additionalProperties: { type: "string" } },',
            '        submit: { type: "boolean", default: false }',
            '      }',
            '    }',
            '  },',
            '  // ... 27 more tools',
            '];',
          ]
        },
        {
          label: 'src/message-types.ts',
          lines: [
            'export enum NexusMessageType {',
            '  CALL_TOOL  = "call_tool",',
            '  LIST_TOOLS = "list_tools",',
            '  PING       = "ping",',
            '  READY      = "ready",',
            '  ERROR      = "error",',
            '}',
          ]
        },
      ],
      keyDecisions: [
        'Dual CJS/ESM build (tsup): bridge requires CJS for Node.js require(); extension bundler prefers ESM tree-shaking',
        'JSON Schema for inputSchema: directly compatible with MCP spec, enables automatic validation in MCP SDK',
        'Separate package vs inline: allows independent versioning of schemas, and future possibility of publishing to npm',
      ]
    }
  },

  {
    number: 5,
    filename: 'phase-5-features.docx',
    title: 'Phase 5: New Features — Quiz Solver & Form Autofill',
    subtitle: 'Our Custom AI Superpowers',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'This phase is where NexusAI Browser Agent becomes meaningfully better than the original tool. We added two brand-new capabilities that the original did not have: a quiz solver and a smart form autofill.',
        'The quiz solver (nexus_quiz_solver) works by reading the entire quiz page, identifying each question and all possible answer choices, and returning that information in a structured format that the AI can reason about. The AI then selects the correct answers and clicks them — just like a human would, but faster and more accurately.',
        'The smart form autofill (nexus_form_autofill) is more intelligent than a simple "type this text into that field" approach. You tell the AI "fill in the Name field with John Doe and the Email field with john@example.com," and it intelligently searches the page for fields that match those descriptions — even if the field is labeled slightly differently, like "Full Name" or "Your Email Address."',
        'Both tools also handle the special requirements of modern websites built with React and Vue, which use a different internal system for tracking form input changes. Our implementation fires all the necessary events to ensure the website registers the filled values correctly.',
      ],
      keyPoints: [
        'nexus_quiz_solver: reads quiz structure and returns it for AI reasoning — then auto-answers on command',
        'nexus_form_autofill: semantic label matching finds the right field even if names differ slightly',
        'Both tools are React, Vue, and Angular compatible out of the box',
        'These tools are exclusive to NexusAI Browser Agent — not in the original project',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'nexus_quiz_solver performs a two-pass DOM traversal. The first pass identifies quiz containers using heuristic scoring: forms with multiple radio groups score highest, followed by ordered lists with checkboxes, then divs with sequential input patterns. The second pass extracts per-question data: question text from <legend>, <label>, or preceding heading elements; options from input[type=radio], input[type=checkbox], or select options; and generates precise CSS selectors for each option using a selector generation algorithm (prefers id, then aria-label, then nth-of-type fallback).',
        'nexus_form_autofill builds a field index on first call by collecting all form elements and their associated labels via multiple strategies: explicit <label for=id>, aria-label attribute, placeholder attribute, adjacent text nodes, and fieldset/legend context. The index maps normalized label text to {element, selector, type}. Fuzzy matching uses Levenshtein distance with a threshold of 0.7 similarity to handle minor label variations.',
        'React-compatible fill uses the native input value setter from HTMLInputElement.prototype — bypassing React\'s synthetic event wrapper — then dispatches the native bubbling input/change events that React\'s fiber reconciler listens to.',
      ],
      codeBlocks: [
        {
          label: 'Quiz extraction (quiz.ts)',
          lines: [
            'function extractQuizStructure(): QuizStructure {',
            '  const questions: Question[] = [];',
            '  const radioGroups = groupBy(',
            '    [...document.querySelectorAll("input[type=radio]")],',
            '    el => el.getAttribute("name")',
            '  );',
            '  for (const [name, inputs] of Object.entries(radioGroups)) {',
            '    questions.push({',
            '      text: findQuestionText(inputs[0]),',
            '      type: "radio",',
            '      options: inputs.map(el => ({',
            '        text: findLabelText(el),',
            '        selector: generateSelector(el),',
            '        value: el.value',
            '      }))',
            '    });',
            '  }',
            '  return { questions, submitSelector: findSubmitButton() };',
            '}',
          ]
        },
        {
          label: 'Semantic label matching (form.ts)',
          lines: [
            'function findFieldByLabel(label: string): HTMLElement | null {',
            '  const normalized = label.toLowerCase().trim();',
            '  let bestMatch: { el: HTMLElement; score: number } | null = null;',
            '  for (const [fieldLabel, fieldInfo] of fieldIndex) {',
            '    const score = similarity(normalized, fieldLabel);',
            '    if (score > 0.7 && (!bestMatch || score > bestMatch.score)) {',
            '      bestMatch = { el: fieldInfo.element, score };',
            '    }',
            '  }',
            '  return bestMatch?.el ?? null;',
            '}',
          ]
        },
      ],
      keyDecisions: [
        'Heuristic quiz detection over fixed selectors: websites use wildly different DOM structures for quizzes; heuristic scoring is more robust than assuming specific class names',
        'Levenshtein similarity for label matching: handles real-world label variations ("First Name" vs "firstname" vs "Your first name") without requiring exact matches',
        'Native setter for React compat: React\'s synthetic event system wraps native DOM events; direct .value = assignment alone does not trigger React re-render without the native setter trick',
      ]
    }
  },

  {
    number: 6,
    filename: 'phase-6-build.docx',
    title: 'Phase 6: Build Pipeline & Developer Scripts',
    subtitle: 'Making Development and Deployment Simple',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'A build pipeline is the automated process that takes our human-readable source code and transforms it into the actual program that runs in your browser or computer. Without it, you would need to manually run many complex steps in the right order every time you wanted to test a change.',
        'We built a one-command setup script (build-and-install.ps1) that handles everything: installing dependencies, building all three packages in the correct order, registering the bridge with Chrome, and telling you exactly what to do next (load the extension folder in Chrome). What previously took many manual steps now takes one command.',
        'We also set up separate development and production modes. In development mode, the extension rebuilds automatically whenever you change a file, so you can see your changes in the browser immediately. In production mode, it creates an optimized, compact version ready for distribution.',
      ],
      keyPoints: [
        'One command (build-and-install.ps1) handles the entire setup from scratch',
        'Development mode: instant hot reload when files change',
        'Production mode: optimized, minified output ready for distribution',
        'All three packages (extension, bridge, shared) build in the correct dependency order',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'The build system uses pnpm\'s --filter flag with topological ordering to build packages in dependency order: shared first, then bridge and extension in parallel. The extension uses WXT\'s built-in Vite pipeline; the bridge and shared packages use tsup for fast, zero-config TypeScript compilation with both CJS and ESM output.',
        'The PowerShell setup script coordinates: pnpm install (hoisted deps), pnpm build (all packages), npm link (bridge to global), nexus-bridge register (native host), and user-facing instructions for the Chrome step.',
      ],
      codeBlocks: [
        {
          label: 'scripts/build-and-install.ps1',
          lines: [
            '# NexusAI Browser Agent — One-Command Setup',
            'Write-Host "Installing dependencies..." -ForegroundColor Cyan',
            'pnpm install',
            '',
            'Write-Host "Building all packages..." -ForegroundColor Cyan',
            'pnpm build',
            '',
            'Write-Host "Linking nexus-bridge globally..." -ForegroundColor Cyan',
            'Set-Location packages/bridge',
            'npm link',
            'Set-Location ../..',
            '',
            'Write-Host "Registering native messaging host..." -ForegroundColor Cyan',
            'nexus-bridge register',
            '',
            'Write-Host "" ',
            'Write-Host "Done! Final step:" -ForegroundColor Green',
            'Write-Host "  Load packages/extension/.output/chrome-mv3" -ForegroundColor White',
            'Write-Host "  as an unpacked extension in chrome://extensions/" -ForegroundColor White',
          ]
        },
        {
          label: 'packages/bridge/package.json (build)',
          lines: [
            '"scripts": {',
            '  "build": "tsup src/index.ts src/cli.ts --format cjs --dts",',
            '  "dev":   "tsup --watch"',
            '},',
            '"bin": { "nexus-bridge": "dist/cli.js" }',
          ]
        },
      ],
      keyDecisions: [
        'pnpm build with topological ordering: shared must finish before bridge/extension can import from it; pnpm respects workspace dependency graph automatically',
        'tsup over tsc for bridge: tsup bundles all imports into a single file, avoiding Node.js module resolution issues when installed globally via npm link',
        'WXT for extension: handles the complexity of MV3 service worker build, content script manifest generation, and output directory structure for Chrome Load Unpacked',
      ]
    }
  },

  {
    number: 7,
    filename: 'phase-7-config.docx',
    title: 'Phase 7: Antigravity Configuration Update',
    subtitle: 'Wiring NexusAI to Your AI Agent',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'Antigravity (the AI coding assistant) needs to know where to find the new bridge. This is like giving someone your new phone number after you have changed it. The configuration file tells Antigravity: "When you want to control the browser, send your requests to port 12307 on this computer."',
        'We also updated the rules file — the behavioral guidelines that tell the AI agent how to use the browser tools correctly. The updated rules now include instructions for the two new tools we added (the quiz solver and smart form autofill), the new port number, and the new server name.',
        'The rules file is particularly important because it shapes how the AI thinks about browser tasks. It enforces a strict sequence of operations (always check which tab is active before doing anything, always read the page before filling forms), defines what the AI is not allowed to do (touch password fields or banking websites), and explains how to handle errors gracefully.',
      ],
      keyPoints: [
        'Updated mcp_config.json to point to the new NexusAI bridge on port 12307',
        'Updated rules file with documentation for the 2 new tools',
        'Rules enforce a strict, safe sequence for all browser interactions',
        'Security rules prevent the AI from touching sensitive fields like passwords or payment forms',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'The .agents/mcp_config.json file is loaded by Antigravity at workspace open time, triggering MCP server discovery via streamable HTTP. Antigravity sends a ListTools request to http://127.0.0.1:12307/mcp and caches the tool inventory. Tool calls are dispatched as POST requests with JSON-RPC bodies per the MCP specification.',
        'The .agents/rules/browser-agent.md is injected into Antigravity\'s system prompt context for every conversation in this workspace. It functions as a persistent behavioral constraint layer on top of the base model.',
      ],
      codeBlocks: [
        {
          label: '.agents/mcp_config.json',
          lines: [
            '{',
            '  "mcpServers": {',
            '    "nexus-browser": {',
            '      "type": "streamableHttp",',
            '      "url": "http://127.0.0.1:12307/mcp"',
            '    }',
            '  }',
            '}',
          ]
        },
        {
          label: 'Browser agent rules excerpt',
          lines: [
            '## Mandatory Sequence',
            '1. get_windows_and_tabs   → identify active tab',
            '2. chrome_read_page        → understand page structure',
            '3. nexus_form_autofill     → fill forms semantically',
            '   OR nexus_quiz_solver    → extract and answer quizzes',
            '4. chrome_click_element   → submit / confirm',
            '',
            '## Security: NEVER interact with:',
            '- input[type="password"]',
            '- URLs containing: bank, pay, checkout, stripe, paypal',
          ]
        },
      ],
      keyDecisions: [
        'Port 12307 in config: allows the old mcp-chrome-bridge on 12306 to remain installed without conflict during transition',
        'Server name "nexus-browser" (not "chrome-browser"): Antigravity uses this as the display name for the tool provider in its UI',
        'Rules as workspace file (not global): scope the browser automation rules to this workspace only, not to all Antigravity conversations',
      ]
    }
  },

  {
    number: 8,
    filename: 'phase-8-testing.docx',
    title: 'Phase 8: End-to-End Testing',
    subtitle: 'Proving Everything Works Together',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'Testing is how we make sure the software actually does what it is supposed to do — not just in theory, but in practice. After building all the components separately, this phase connects them and verifies that real-world tasks work correctly from start to finish.',
        'We designed four test scenarios that cover the main use cases of the project. First, a basic connection test to confirm the AI can see your browser. Second, a form fill test where we give the AI a specific form and specific data, and check that it fills everything correctly. Third, a quiz test where the AI reads a quiz, reasons about the answers, and clicks the correct options. Fourth, a popup test to confirm the extension interface is entirely in English with no Chinese characters anywhere.',
        'Each test has a clear pass/fail condition, so there is no ambiguity about whether it worked.',
      ],
      keyPoints: [
        'Four end-to-end test scenarios covering all major use cases',
        'Clear pass/fail criteria for each scenario',
        'Tests confirm English localization (no Chinese anywhere)',
        'Tests run against real browser tabs, not simulated environments',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'End-to-end tests are performed manually against live browser sessions. Each scenario specifies the exact Antigravity prompt, expected tool call sequence, and verifiable outcome. For automated regression testing, Playwright is configured to control Chrome with the extension loaded, enabling scripted validation of DOM outcomes after AI tool calls.',
        'The verify-bridge.ps1 script is extended to also check: extension load status via chrome.management API, tool count from a ListTools probe to the MCP endpoint, and port 12307 LISTENING state.',
      ],
      codeBlocks: [
        {
          label: 'Test A: Connection',
          lines: [
            'Prompt: "What is on my active Chrome tab?"',
            'Expected calls:',
            '  1. get_windows_and_tabs',
            '  2. chrome_read_page (or chrome_get_web_content)',
            'Pass: AI returns accurate page description without user pasting text',
          ]
        },
        {
          label: 'Test B: Form Fill',
          lines: [
            'URL: https://httpbin.org/forms/post',
            'Prompt: "Fill: Customer Name=John Doe, Email=j@test.com, Comments=Test"',
            'Expected calls:',
            '  1. get_windows_and_tabs',
            '  2. chrome_read_page',
            '  3. nexus_form_autofill { fields: {Customer Name: "John Doe", ...} }',
            'Pass: All 3 fields populated in browser, submit button clicked',
          ]
        },
        {
          label: 'Test C: Quiz',
          lines: [
            'URL: any Google Form or quiz page with radio buttons',
            'Prompt: "Answer the quiz on my browser tab"',
            'Expected calls:',
            '  1. get_windows_and_tabs',
            '  2. nexus_quiz_solver',
            '  3. chrome_click_element (×N, one per question)',
            '  4. chrome_click_element (submit)',
            'Pass: All questions answered, form submitted',
          ]
        },
      ],
      keyDecisions: [
        'Manual E2E over unit tests for browser tools: Chrome extension APIs cannot be mocked reliably; real browser execution is required to validate DOM interactions',
        'httpbin.org for form test: a stable, public endpoint with a predictable form structure — ideal for regression testing',
        'Playwright for future automation: can drive Chrome with extensions loaded using --load-extension flag, enabling CI/CD pipeline integration',
      ]
    }
  },

  {
    number: 9,
    filename: 'phase-9-docs.docx',
    title: 'Phase 9: Documentation — Word Documents Per Phase',
    subtitle: 'Making the Project Understandable for Everyone',
    nonTechnical: {
      heading: 'What We Built & Why',
      body: [
        'Good documentation is what separates a project that only its creator understands from one that anyone can contribute to, present, or hand off. For this project, we created a dedicated Word document for every phase of development.',
        'Each document has two distinct sections: a non-technical section that explains what was built and why in plain English — readable by a manager, client, or new team member with no coding background — and a technical section that provides the architectural details, code examples, and design decisions that a developer needs.',
        'The documents are generated automatically by a Node.js script, meaning they stay in sync with the project. Any time the project changes, the documentation can be regenerated in seconds.',
        'This phase documents itself: the document you are reading right now was generated by the same script that generated all the others.',
      ],
      keyPoints: [
        'One Word document per phase — 9 documents total',
        'Each document has a non-technical section (for managers/clients) and a technical section (for developers)',
        'Documents are generated automatically by a Node.js script — no manual formatting',
        'Stored in the docs/ folder of the project repository',
      ]
    },
    technical: {
      heading: 'Technical Architecture & Implementation',
      body: [
        'Documents are generated using the docx npm package, which produces proper Office Open XML (.docx) files without requiring Microsoft Word to be installed. The generator script (scripts/generate-docs.js) defines all phase content as structured JavaScript objects and renders them using a consistent design system: custom colors (indigo primary, violet secondary), code blocks rendered as styled table rows with Courier New font, info boxes as bordered tables with shaded backgrounds, and H1 headings with solid background fills.',
        'Each document is written to docs/ using Packer.toBuffer() then fs.writeFileSync(). The script runs in Node.js with no external dependencies beyond docx.',
      ],
      codeBlocks: [
        {
          label: 'Document generation (generate-docs.js excerpt)',
          lines: [
            'async function generateDoc(phase) {',
            '  const doc = new Document({ sections: [{',
            '    children: [',
            '      h1(phase.title),',
            '      h2("Non-Technical Overview"),',
            '      ...phase.nonTechnical.body.map(t => para([normal(t)])),',
            '      divider(),',
            '      h2("Technical Implementation"),',
            '      ...phase.technical.codeBlocks.map(cb => [',
            '        h3(cb.label), codeBlock(cb.lines)',
            '      ]).flat()',
            '    ]',
            '  }]}});',
            '  const buffer = await Packer.toBuffer(doc);',
            '  fs.writeFileSync(`docs/${phase.filename}`, buffer);',
            '  console.log(`Generated: docs/${phase.filename}`);',
            '}',
          ]
        },
      ],
      keyDecisions: [
        'docx package over pandoc: no external binary dependency, runs cross-platform in Node.js, produces native .docx without Office installed',
        'Programmatic generation over manual authoring: ensures documents stay in sync with code changes; regenerating takes <2 seconds',
        'Structured content objects: separates content from formatting, allowing the design system to be updated independently of phase content',
      ]
    }
  },
];

// ─── Document Builder ─────────────────────────────────────────────────────────

async function buildDocument(phase) {
  const children = [];

  // Cover header
  children.push(h1(`Phase ${phase.number}: ${phase.title}`));
  children.push(para([italic(`NexusAI Browser Agent — ${phase.subtitle}`)], { before: 60, after: 300 }));

  // Non-technical section
  children.push(h2('Non-Technical Overview'));
  children.push(h3(phase.nonTechnical.heading));
  phase.nonTechnical.body.forEach(text => {
    children.push(para([normal(text)], { before: 80, after: 120 }));
  });

  if (phase.nonTechnical.keyPoints) {
    children.push(h3('Key Accomplishments'));
    phase.nonTechnical.keyPoints.forEach(pt => children.push(bullet(pt, COLOR.text)));
  }

  children.push(divider());

  // Technical section
  children.push(h2('Technical Implementation'));
  children.push(h3(phase.technical.heading));
  phase.technical.body.forEach(text => {
    children.push(para([normal(text)], { before: 80, after: 120 }));
  });

  if (phase.technical.codeBlocks) {
    phase.technical.codeBlocks.forEach(cb => {
      children.push(h3(cb.label));
      children.push(codeBlock(cb.lines));
      children.push(para([], { before: 60, after: 60 }));
    });
  }

  if (phase.technical.keyDecisions) {
    children.push(h3('Key Design Decisions'));
    phase.technical.keyDecisions.forEach(d => {
      const parts = d.split(': ');
      children.push(new Paragraph({
        children: [
          bold('► ' + (parts[0] || d) + ': ', COLOR.primary),
          normal(parts.slice(1).join(': '), COLOR.text),
        ],
        bullet: { level: 0 },
        spacing: { before: 80, after: 80 },
      }));
    });
  }

  const doc = new Document({
    creator: 'NexusAI Browser Agent',
    title: phase.title,
    description: `Phase ${phase.number} documentation`,
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.2),
            right: convertInchesToTwip(1.2),
          }
        }
      },
      children,
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(OUTPUT_DIR, phase.filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Generated: docs/${phase.filename}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nNexusAI Browser Agent — Document Generator');
  console.log('===========================================');
  for (const phase of PHASES) {
    await buildDocument(phase);
  }
  console.log(`\n✓ All ${PHASES.length} documents generated in docs/\n`);
}

main().catch(err => {
  console.error('Error generating documents:', err.message);
  process.exit(1);
});
