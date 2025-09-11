// lib/mcp/types.ts
export type Json =
  | null | boolean | number | string | Json[] | { [k: string]: Json };

export interface McpSession {
  /** Capability scopes for this run, e.g. ["ai.generate","fs.write","editor.apply"] */
  scopes: string[];
  /** Extra tags for tracing / auditing */
  tags?: Record<string, string>;
  /** Clock fn for reproducibility */
  now(): number;
  /** Dependency Injection bag (facades, config, workspaceRoot, etc.) */
  di?: Record<string, unknown>;
}

export interface McpTool {
  name: string;
  description?: string;
  schema?: { [field: string]: string };
  call(args: Json, session: McpSession): Promise<Json>;
}

export interface McpResource {
  name: string;
  description?: string;
  list?(session: McpSession): Promise<Json[]>;
  read?(id: string, session: McpSession): Promise<Json>;
}

export interface McpServer {
  listTools(): Promise<McpTool[]>;
  listResources(): Promise<McpResource[]>;
}
