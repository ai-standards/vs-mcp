/**
 * Core event/action interface for MCPX.
 * Inspired by Redux/Flux, this represents a protocol event or action.
 * - `action`: The tool or operation to invoke.
 * - `payload`: The data for the action (type-safe).
 */
export interface McpEvent<T = any> {
    action: string;
    payload?: T;
}

export interface McpTool {

}


export interface McpModule {
    id: string;
    tools: McpTool[];
    events: McpEvent[];
}

/**
 * Response from a tool, signed with tool name and optional metadata.
 */
export interface McpResponse<R = any> {
    tool: string;
    result: R;
    meta?: Record<string, any>;
}



export function createMcpModule(id: string, events: McpEvent[], tools: McpTool[]): McpModule {
    return {id, events, tools} as McpModule;
}

class McpServer {
    constructor(private modules: McpModule[]) {}
    
    async dispatch<T = any, R = any>(action: string, payload?: T): Promise<McpResponse<R> | void> {
    };
}

class McpServerRemote {

}