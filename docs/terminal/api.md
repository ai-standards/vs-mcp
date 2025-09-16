# terminal

## Close Terminal

Close a specific integrated terminal in VS Code.

* **Token:** `terminal.closeTerminal`
* **Path:** src/tools/terminal/close.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| terminalId | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |

## Create Terminal

Create a new integrated terminal in VS Code.

* **Token:** `terminal.createTerminal`
* **Path:** src/tools/terminal/create.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| name | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| terminalId | string | Yes |

## List Terminals

List all open integrated terminals in VS Code.

* **Token:** `terminal.listTerminals`
* **Path:** src/tools/terminal/list.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| terminals | string[] | Yes |

## Send Text to Terminal

Send text or command to a specific integrated terminal.

* **Token:** `terminal.sendTextToTerminal`
* **Path:** src/tools/terminal/send.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| terminalId | string | Yes |
| text | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |

## Show Terminal

Show a specific integrated terminal in VS Code.

* **Token:** `terminal.showTerminal`
* **Path:** src/tools/terminal/show.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| terminalId | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| success | false | Yes |

