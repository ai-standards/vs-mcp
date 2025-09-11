# VS-MCP: AI Standards Labs Extension

> **Supercharge your VS Code workflow with AI-powered agents, code tools, and seamless workspace automation.**

---

## 🚀 Features

- **AI Agents:** Run custom agents that leverage OpenAI and workspace tools to automate tasks, generate code, refactor, write docs, and more.
- **MCP Tooling:** Unified Model Context Protocol (MCP) for safe, composable access to editor, filesystem, UI, and AI capabilities.
- **Code Generation & Refactoring:** Instantly generate, refactor, and test code using natural language prompts.
- **Data & Image Generation:** Create structured data and images directly from your prompts.
- **Workspace Automation:** Read, write, and search files and directories with confirmation and safety.
- **UI Integration:** Show messages, warnings, and prompt for input—all from your agents.
- **TypeScript & Vite:** Fast development, hot reload, and modern codebase.
- **Tested with Vitest:** Reliable, maintainable, and easy to extend.

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js 16+
- npm or pnpm

### Setup
1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```
2. **Build the extension:**
   ```bash
   npm run build
   ```
3. **Run in development mode:**
   ```bash
   npm run dev
   ```
4. **Run tests:**
   ```bash
   npm test
   # or
   npm run test:ui
   ```
5. **Package for VS Code:**
   ```bash
   npm run package
   ```

---

## 🛠️ Usage

1. **Install the extension in VS Code.**
2. **Open the Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3. **Run "Run MCP Agent"** on any `*.agent.js` file in your workspace.
4. **Explore AI, editor, filesystem, and UI tools**—see `/docs` for full documentation and agent examples.

---

## 📚 Documentation

- [AI Server](./docs/ai.md): Text, data, image, code, refactor, test, and documentation generation.
- [Editor Server](./docs/editor-server.md): Virtual docs, propose edits, active file, and selection.
- [Filesystem Server](./docs/fs-server.md): Read, write, list, and find files/directories.
- [UI Server](./docs/ui-server.md): Show info/warning messages, prompt for input.

---

## 🏗️ Project Structure

```
vs-mcp/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── lib/mcp/servers/      # MCP domain servers (ai, editor, fs, ui)
│   └── extension.test.ts     # Unit tests
├── example/agents/           # Example MCP agents
├── docs/                     # Server documentation & agent examples
├── out/                      # Built extension files
├── package.json              # Extension manifest and dependencies
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🤖 Example Agent

```js
// example/agents/hello.agent.js
export default async function hello({ mcp }) {
  await mcp.call("ui.info", {
    message: "👋 Hello, world! This message was shown via MCP.",
    actions: ["OK"]
  });
}
```

---

## 💡 Why VS-MCP?

- **Composable:** Mix and match AI, editor, filesystem, and UI tools in your agents.
- **Safe:** Scopes and confirmation dialogs prevent unwanted changes.
- **Extensible:** Add new tools, servers, and agents with ease.
- **Modern:** Built with TypeScript, Vite, and OpenAI for speed and reliability.

---

## 📝 Contributing

Pull requests, issues, and feedback are welcome! See the `/docs` folder for server and agent documentation.

---

## 📄 License

MIT
