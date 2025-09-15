# git

## Create Git Branch

Create a new branch in the current repository using VS Code's Git extension.

**Path:** src/tools/git/create-branch.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| branchName | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## Delete Git Branch

Delete the specified branch in the current repository using VS Code's Git extension.

**Path:** src/tools/git/delete-branch.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| branchName | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## Merge Git Branch

Merge the specified branch into the current branch using VS Code's Git extension.

**Path:** src/tools/git/merge-branch.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| branchName | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

