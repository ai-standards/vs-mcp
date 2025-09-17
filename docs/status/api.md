# status

## Show Status Bar

Show a status message in the status bar. Optionally show a spinner.

* **Token:** `status.showStatusBar`
* **Path:** src/tools/status/bar.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |
| message | string | Yes |
| spinner | false | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |
| message | string | Yes |
| spinner | false | Yes |
| shown | false | Yes |

## Dismiss Status

Dismiss any status notification by id.

* **Token:** `status.dismissStatus`
* **Path:** src/tools/status/dismiss.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |
| dismissed | false | Yes |

## Show Status Window

Show a status message in a window notification.

* **Token:** `status.showStatusWindow`
* **Path:** src/tools/status/window.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |
| message | string | Yes |

### Output
| Name | Type | Required |
| --- | --- | --- |
| id | string | Yes |
| message | string | Yes |
| shown | false | Yes |

