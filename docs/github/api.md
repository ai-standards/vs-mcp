# github

## Create GitHub Issue

Create a new issue in a GitHub repository using VS Code's GitHub integration.

* **Token:** `github.createGitHubIssue`
* **Path:** src/tools/github/create-issue.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| repository | string | Yes |
| title | string | Yes |
| body | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| issueUrl | null | Yes |

## Create GitHub Pull Request

Create a new pull request in a GitHub repository using VS Code's GitHub integration.

* **Token:** `github.createGitHubPullRequest`
* **Path:** src/tools/github/create-pr.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| repository | string | Yes |
| title | string | Yes |
| body | string | No |
| base | string | No |
| head | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| prUrl | null | Yes |

## Open GitHub Repository

Open a GitHub repository in the browser using VS Code's GitHub integration.

* **Token:** `github.openGitHubRepository`
* **Path:** src/tools/github/open-repo.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| repository | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| repoUrl | string | Yes |

