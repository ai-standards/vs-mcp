// create-hello.agent.js
// Minimal MCP-based agent: shows a Hello World message via the UI tool.
// Expects your extension to pass `{ mcp }` into the default export.

export const metadata = {
  id: 'hello',
  name: 'Hello World',
  description: 'Greets the current user'
}

export const run = async({ mcp, scope }) => {
  mcp.call('ui.info', {message: 'FILE: ' + scope})
  try {
    // Use the MCP UI tool to show a simple message.
    await mcp.call("ui.info", {
      message: "👋 Hello, world! This message was shown via MCP.",
      actions: ["OK"]
    });

    // If you want to also open a small virtual doc, uncomment:
    // await mcp.call("editor.openVirtual", {
    //   content: "# Hello, world!\n\nThis document was opened via MCP.",
    //   language: "markdown"
    // });

  } catch (err) {
    // Best-effort friendly error surface
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    try {
      await mcp.call("ui.error", { message: `Agent error: ${msg}` });
    } catch {
      // swallow to avoid unhandled rejections in extension host
      // (ui.error might not be available if the MCP server failed to init)
    }
  }
}
