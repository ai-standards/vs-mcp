# Show Input Box (ui.showInputBox)

Prompt the user for a short piece of text directly in VS Code. It’s the fastest way to turn a conversation into a parameter: a branch name, a commit message, a file path, or an AI prompt.

Use it whenever you need lightweight input without building custom UI. It returns the typed value or null if the user cancels.

- Tool id: ui.showInputBox
- Description: Prompt user for a string input.
- Inputs:
  - prompt (string, required): The message shown above the input.
  - placeHolder (string, optional): Hint text inside the input.
- Output:
  - value (string | null): The user’s input, or null if the input was cancelled.

## Basic Usage

Ask for a topic. If the user cancels, value is null.

```javascript
// given: mcp, server, scope
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What topic do you want to write about?'
}, { server, scope });

if (value === null) {
  // user cancelled
  console.log('No input provided.');
} else {
  console.log('User topic:', value);
}
```

## Show a Placeholder

Provide a hint without pre-filling the field.

```javascript
// given: mcp, server, scope
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Name the new feature branch',
  placeHolder: 'feature/awesome-improvement'
}, { server, scope });

if (value !== null) {
  console.log('Branch name:', value);
}
```

## Handle Cancellation Explicitly

Abort the flow early if the user backs out.

```javascript
// given: mcp, server, scope
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter a short commit message',
  placeHolder: 'Fix race condition in parser'
}, { server, scope });

if (value === null) {
  // stop the workflow
  await mcp.dispatch('status.showStatusWindow', {
    id: 'commit',
    message: 'Commit cancelled'
  }, { server, scope });
  return;
}

// continue with a commit using the provided message
await mcp.dispatch('vcs.commitChanges', { message: value }, { server, scope });
```

## Require Non-Empty Input

Loop until you get a non-empty, trimmed string, or the user cancels.

```javascript
// given: mcp, server, scope
async function promptNonEmpty(prompt, placeHolder) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { value } = await mcp.dispatch('ui.showInputBox', { prompt, placeHolder }, { server, scope });
    if (value === null) return null;             // cancelled
    if (value.trim().length > 0) return value;   // valid
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'Please enter a non-empty value.'
    }, { server, scope });
  }
  return null; // too many attempts
}

const branchName = await promptNonEmpty('New branch name', 'feature/my-topic');
if (branchName) {
  await mcp.dispatch('git.createGitBranch', { branchName }, { server, scope });
}
```

## Drive Another Tool With the Result

Collect a topic, generate text using AI, and open it as a virtual document.

```javascript
// given: mcp, server, scope
const { value: topic } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Topic to draft about',
  placeHolder: 'Event-driven architecture'
}, { server, scope });

if (topic === null) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Draft cancelled.' }, { server, scope });
  return;
}

const { text } = await mcp.dispatch('ai.generateText', {
  prompt: `Write a concise intro about: ${topic}`,
  maxTokens: 300
}, { server, scope });

await mcp.dispatch('editor.openVirtual', {
  content: text,
  language: 'markdown'
}, { server, scope });
```

## Use the Input as a File Path

Ask for an absolute path and open it.

```javascript
// given: mcp, server, scope
const { value: path } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter an absolute file path to open',
  placeHolder: '/absolute/path/to/file.ts'
}, { server, scope });

if (path !== null) {
  await mcp.dispatch('editor.openFile', { path }, { server, scope });
}
```

## Compose With Version Control

Collect a commit message, commit, then optionally push.

```javascript
// given: mcp, server, scope
const { value: message } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Commit message',
  placeHolder: 'Refactor: extract parser into module'
}, { server, scope });

if (message === null) return;

const { success: committed, error } = await mcp.dispatch('vcs.commitChanges', { message }, { server, scope });
if (!committed) {
  await mcp.dispatch('ui.showWarningMessage', { message: `Commit failed: ${error || 'unknown error'}` }, { server, scope });
  return;
}

const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Commit created. Push now?',
  actions: ['Push', 'Later']
}, { server, scope });

if (choice === 'Push') {
  await mcp.dispatch('vcs.pushChanges', {}, { server, scope });
}
```

## Practical Notes

- The tool returns null on cancel; always check before continuing.
- Validation happens in your code. Re-prompt if needed.
- Keep prompts specific. Clear instructions reduce retries.