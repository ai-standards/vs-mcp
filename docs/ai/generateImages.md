# Generate Images (ai.generateImages)

Turn a short description into one or more images. The ai.generateImages tool asks your configured AI image model to synthesize images from a text prompt. You can optionally request multiple variations, pick a model, and set size.

Use this when you want quick concept art, thumbnails, or visual placeholders without leaving your editor. It fits well into interactive flows: collect a prompt from the user, generate, then post-process or save metadata.

- Tool id: ai.generateImages
- Path: src/tools/ai/generate-images.mcpx.ts
- Description: Generate images from a prompt using an AI model and optional parameters.

Note: In the code examples below, assume you already have:
- mcp: the MCP client instance
- server: the MCP server instance
- scope: an optional workspace filepath context (string) you can use for saving outputs

## Inputs and outputs

- Input
  - prompt (string, required): What to draw.
  - count (number, optional): How many images to return.
  - size ("512x512", optional): Requested image dimensions. Currently supports "512x512".
  - model (string, optional): Model identifier. If omitted, the server default is used.

- Output
  - prompt (string): Echo of the input prompt.
  - count (number, optional)
  - size ("512x512", optional)
  - model (string, optional)
  - images (any[], required): The generated images. Format depends on the backend (e.g., URLs, data URLs, or base64 blobs).
  - note (string, optional): Extra info from the provider.

## Basic usage

Generate a single image from a prompt.

```javascript
const { images, prompt } = await mcp.dispatch('ai.generateImages', {
  prompt: 'A watercolor fox sitting under a maple tree, autumn palette'
});

console.log('Prompt:', prompt);
console.log('Got images:', images.length);
```

## Examples

### Prompt from user input, then generate

Collect a prompt in the editor and pass it through.

```javascript
const { value: userPrompt } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Describe the image you want to generate'
});

if (!userPrompt) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No prompt provided.' });
} else {
  const result = await mcp.dispatch('ai.generateImages', { prompt: userPrompt });
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Created ${result.images.length} image(s) for: "${result.prompt}"`
  });
}
```

### Generate multiple variations (count)

Request several images at once for comparison.

```javascript
const { images, note } = await mcp.dispatch('ai.generateImages', {
  prompt: 'Futuristic city skyline at dusk, soft rim lighting',
  count: 4
});

console.log('Variations:', images.length);
if (note) console.log('Provider note:', note);
```

### Specify size

If your backend supports sizes, request a specific one. This tool currently accepts "512x512".

```javascript
const { images, size } = await mcp.dispatch('ai.generateImages', {
  prompt: 'Isometric game asset: pine tree with snow',
  size: '512x512'
});

console.log('Requested size:', size); // '512x512'
console.log('Images:', images.length);
```

### Choose a model

Target a specific image model if your environment provides multiple.

```javascript
const { images, model } = await mcp.dispatch('ai.generateImages', {
  prompt: 'Studio portrait of an astronaut, dramatic lighting',
  model: 'my-image-model'
});

console.log('Model used:', model);
console.log('Images:', images.length);
```

### End-to-end: prompt user, generate 3, and save a JSON manifest

Persist a simple manifest with metadata and whatever the backend returned for images. Use scope as a folder hint if supplied.

```javascript
// 1. Ask for the prompt
const { value: idea } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What should we draw?'
});
if (!idea) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Canceled.' });
} else {
  // 2. Generate
  const generated = await mcp.dispatch('ai.generateImages', {
    prompt: idea,
    count: 3,
    size: '512x512'
  });

  // 3. Save a text manifest (JSON) into the workspace
  const dir = scope || 'images';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `${dir}/manifest-${timestamp}.json`;
  const content = JSON.stringify({
    server: server?.id || 'unknown-server',
    prompt: generated.prompt,
    count: generated.count,
    size: generated.size,
    model: generated.model,
    images: generated.images
  }, null, 2);

  const { success, error } = await mcp.dispatch('workspace.create-file', {
    path,
    content
  });

  if (success === false && error) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Failed to save manifest at ${path}: ${error}`
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', {
      message: `Saved manifest: ${path}`
    });
  }
}
```

Note: workspace.create-file writes UTF-8 text. This example stores whatever image payloads are returned (URLs, data URLs, or base64 strings) as JSON. If you need binary image files, use a backend or tool that supports binary write, or convert base64 data into a proper file via an appropriate MCP tool.

### Minimal error handling

Wrap generation in try/catch and surface issues to the user.

```javascript
try {
  const result = await mcp.dispatch('ai.generateImages', {
    prompt: 'Mechanical hummingbird, exploded view diagram'
  });
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Generated ${result.images.length} image(s).`
  });
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Image generation failed: ${err?.message || String(err)}`
  });
}
```

## Tips

- Prompt quality matters. Be explicit about style, lighting, composition, and medium.
- When requesting multiple images, keep count reasonable to reduce latency.
- The images array is backend-defined. Check types at runtime before assuming URL vs. base64.
- If your server supports models, set model to get consistent results across sessions.

## API reference

```json
{
  "id": "generateImages",
  "namespace": "ai",
  "description": "Generate images from a prompt using an AI model and optional parameters.",
  "input": {
    "prompt": "string (required)",
    "count": "number (optional)",
    "size": "\"512x512\" (optional)",
    "model": "string (optional)"
  },
  "output": {
    "prompt": "string (required)",
    "count": "number (optional)",
    "size": "\"512x512\" (optional)",
    "model": "string (optional)",
    "images": "any[] (required)",
    "note": "string (optional)"
  }
}
```