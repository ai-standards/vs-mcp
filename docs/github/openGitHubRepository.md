# Open GitHub Repository (github.openGitHubRepository)

Open a GitHub repository in your browser directly from VS Code via the GitHub integration. You pass an owner/repo slug, it opens the repo page, and returns the URL it opened.

Use it whenever you need a quick jump from code to the repository homepage—no copy/paste, no search. It pairs well with UI prompts and workspace utilities to resolve the repo slug dynamically.

- Backed by VS Code’s GitHub integration: [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github).
- Returns the exact URL used to open the repo (handy for logging or follow-up actions).

## Tool reference

- Namespace: **github**
- ID: **openGitHubRepository**
- Description: Open a GitHub repository in the browser using VS Code’s GitHub integration.

Inputs:
- repository (string, required): the repository slug in the form owner/repo (e.g., microsoft/vscode).

Outputs:
- repoUrl (string, required): the URL that was opened.

## Basic usage

Open a known repository by slug and capture the URL.

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)
const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', {
  repository: 'microsoft/vscode'
});

console.log('Opened:', repoUrl);
```

## Variations

### Prompt the user for a repository slug

Ask for input, validate minimally, then open the repo. This works well when you don’t know the repo ahead of time.

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter a GitHub repository (owner/repo):'
});

const repo = (value || '').trim();
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Invalid format. Use "owner/repo", e.g., microsoft/vscode.'
  });
} else {
  const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', {
    repository: repo
  });
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Opened ${repoUrl}`
  });
}
```

### Open the repository for the current workspace (from .git/config)

Derive owner/repo from the workspace’s Git remote without shelling out. This reads .git/config and handles common URL formats.

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)

// 1) Find a workspace root
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders.length) {
  throw new Error('No workspace folder is open.');
}
const workspaceRoot = folders[0];

// 2) Read .git/config
let remoteConfig = '';
try {
  const { text } = await mcp.dispatch('fs.readFile', {
    path: '.git/config',
    workspaceRoot
  });
  remoteConfig = text;
} catch {
  throw new Error('No .git/config found. Is this a Git repository?');
}

// 3) Extract "owner/repo" from common remote patterns
function parseOwnerRepo(configText) {
  // url = https://github.com/owner/repo.git
  const https = configText.match(/url\s*=\s*https?:\/\/github\.com\/(.+?)(?:\.git)?\s*$/mi);
  if (https) return https[1];

  // url = git@github.com:owner/repo.git
  const ssh = configText.match(/url\s*=\s*git@github\.com:(.+?)(?:\.git)?\s*$/mi);
  if (ssh) return ssh[1];

  return null;
}

const ownerRepo = parseOwnerRepo(remoteConfig);
if (!ownerRepo) {
  throw new Error('Could not parse GitHub remote from .git/config.');
}

// 4) Open the repository
const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', {
  repository: ownerRepo
});

console.log('Opened:', repoUrl);
```

### Open several repositories in sequence

Useful for jumping through related repos quickly (e.g., monorepo neighbors or dependencies).

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)
const repos = [
  'microsoft/vscode',
  'microsoft/typescript',
  'nodejs/node'
];

for (const repository of repos) {
  const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', { repository });
  console.log('Opened:', repoUrl);
}
```

### Handle failures cleanly

Wrap the call and surface a concise message. Invalid slugs or inaccessible repos can fail fast.

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)
async function openRepoSafe(repository) {
  try {
    const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', { repository });
    return repoUrl;
  } catch (err) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Could not open "${repository}". ${err?.message || 'Unknown error.'}`
    });
    return null;
  }
}

const url = await openRepoSafe('owner/repo');
if (url) console.log('Opened:', url);
```

## Tips

- Expect the input as owner/repo. If you have a full URL, strip protocol, domain, and .git to produce the slug.
- Private repositories open if your browser session has access. The tool itself doesn’t manage authentication; the browser and GitHub handle that.
- This tool only opens the repo homepage. For issues and PRs, see:
  - Create issue: github.createGitHubIssue
  - Create pull request: github.createGitHubPullRequest

## See also

- GitHub PRs & Issues extension for VS Code: [marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)