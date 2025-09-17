# workspace

## Create Workspace File

Create a new file in the workspace with optional content.

* **Token:** `workspace.createWorkspaceFile`
* **Path:** src/tools/workspace/create-file.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |
| content | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## Delete Workspace File

Delete a file from the workspace.

* **Token:** `workspace.deleteWorkspaceFile`
* **Path:** src/tools/workspace/delete-file.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

## List Workspace Files

List files in the workspace matching a glob pattern.

* **Token:** `workspace.listWorkspaceFiles`
* **Path:** src/tools/workspace/list-files.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| glob | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| files | string[] | Yes |

## List Workspace Folders

List all workspace folders.

* **Token:** `workspace.listWorkspaceFolders`
* **Path:** src/tools/workspace/list-folders.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| folders | string[] | Yes |

## Rename Workspace Folder

Rename a folder in the workspace using VS Code's file system API (preserves user security permissions).

* **Token:** `workspace.renameWorkspaceFolder`
* **Path:** src/tools/workspace/rename-folder.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| oldPath | string | Yes |
| newPath | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |
| error | string | No |

