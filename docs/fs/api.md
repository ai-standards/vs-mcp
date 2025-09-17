# fs

## Find Files

Find files by glob pattern (workspace relative).

* **Token:** `fs.findFiles`
* **Path:** src/tools/fs/find.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| glob | string | No |
| maxResults | number | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| files | string[] | Yes |

## Read Directory

List directory entries (name + kind).

* **Token:** `fs.readDir`
* **Path:** src/tools/fs/read-dir.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| dir | string | Yes |
| workspaceRoot | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| dir | string | Yes |
| workspaceRoot | string | Yes |
| items | { name: string; type: string; }[] | Yes |

## Read File

Read a UTF-8 file inside the workspace.

* **Token:** `fs.readFile`
* **Path:** src/tools/fs/read-file.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |
| workspaceRoot | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |
| workspaceRoot | string | Yes |
| text | string | Yes |

## Write File

Write a UTF-8 file inside the workspace (with confirm).

* **Token:** `fs.writeFile`
* **Path:** src/tools/fs/write-file.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |
| content | string | Yes |
| workspaceRoot | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| path | string | Yes |
| content | string | Yes |
| workspaceRoot | string | Yes |
| ok | false | Yes |

