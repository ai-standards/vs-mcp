export const metadata = {
  id: 'hello',
  name: 'Hello World',
  description: 'Greets the current user'
}

export const run = async({ mcp, scope }) => {
  mcp.call('status.bar', {
    message: 'Creating greeting',
    id: 'create',
    spinner: true
  })
  
  try {
    const message = await mcp.call('ai.generateText', {
      prompt: 'Create a short, friendly greeting for this vs-mcp extension user'
    })

    mcp.call('status.dismiss', {
      id: 'create'
    })

    await mcp.call("ui.info", {
      message: message.text
    });

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
