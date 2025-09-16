# agent

## Generate new agent

Generate a new MCP agent

**Path:** src/tools/agent/create-agent.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| filepath | string | No |
| description | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| filepath | string | No |
| description | string | No |
| code | null | No |

## List Agents

List all MCP agents in the project

**Path:** src/tools/agent/list-agents.mcpx.ts

### Input
_None_

### Output
| Name | Type | Required |
| --- | --- | --- |
| agents | { id: string; name: string; description?: string | undefined; path?: string | undefined; }[] | Yes |

## Generate new agent

Generate a new MCP agent

**Path:** src/tools/agent/run-agent.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| filepath | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| filepath | string | No |
| response | unknown | Yes |

