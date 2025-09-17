# ui

## Show Info Message

Show info message with optional actions.

* **Token:** `ui.showInfoMessage`
* **Path:** src/tools/ui/info.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| message | string | Yes |
| actions | string[] | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| choice | null | Yes |

## Show Input Box

Prompt user for a string input.

* **Token:** `ui.showInputBox`
* **Path:** src/tools/ui/input.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| placeHolder | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| value | null | Yes |

## Show Warning Message

Show warning message with optional actions.

* **Token:** `ui.showWarningMessage`
* **Path:** src/tools/ui/warn.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| message | string | Yes |
| actions | string[] | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| choice | null | Yes |

