# vcs

## Commit Changes

Commit staged changes in the current repository with a message (supports any VCS provider).

**Path:** src/tools/vcs/commit.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| message | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## Pull Changes

Pull changes from the remote repository (supports any VCS provider).

**Path:** src/tools/vcs/pull.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## Push Changes

Push committed changes to the remote repository (supports any VCS provider).

**Path:** src/tools/vcs/push.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## VCS Status

Get the status of the current repository (supports any VCS provider).

**Path:** src/tools/vcs/status.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| status | string | Yes |
| error | string | No |

