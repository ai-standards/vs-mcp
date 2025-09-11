// lib/mcp/client.ts
import { McpServer, McpTool, McpResource, McpSession, Json } from "./types";

/**
 * MCP client for calling tools/resources from an MCP server.
 * Wraps the server and session together into a convenient API.
 */
export class McpClient {
  private server: McpServer;
  private session: McpSession;
  private toolCache?: Map<string, McpTool>;
  private resourceCache?: Map<string, McpResource>;

  constructor(server: McpServer, session: McpSession) {
    this.server = server;
    this.session = session;
  }

  /** List all tools */
  async listTools(): Promise<McpTool[]> {
    return this.server.listTools();
  }

  /** List all resources */
  async listResources(): Promise<McpResource[]> {
    return this.server.listResources();
  }

  /** Call a tool by name with args */
  async call(toolName: string, args: Json = {}): Promise<Json> {
    if (!this.toolCache) {
      const tools = await this.server.listTools();
      this.toolCache = new Map(tools.map((t) => [t.name, t]));
    }
    const tool = this.toolCache.get(toolName);
    if (!tool) throw new Error(`Unknown tool: ${toolName}`);
    return tool.call(args, this.session);
  }

  /** Read a resource (optionally by id) */
  async read(resourceName: string, id: string = ""): Promise<Json> {
    if (!this.resourceCache) {
      const resources = await this.server.listResources();
      this.resourceCache = new Map(resources.map((r) => [r.name, r]));
    }
    const resource = this.resourceCache.get(resourceName);
    if (!resource) throw new Error(`Unknown resource: ${resourceName}`);
    if (!resource.read) throw new Error(`Resource not readable: ${resourceName}`);
    return resource.read(id, this.session);
  }

  /** List a resource’s contents (if supported) */
  async list(resourceName: string): Promise<Json[]> {
    if (!this.resourceCache) {
      const resources = await this.server.listResources();
      this.resourceCache = new Map(resources.map((r) => [r.name, r]));
    }
    const resource = this.resourceCache.get(resourceName);
    if (!resource) throw new Error(`Unknown resource: ${resourceName}`);
    if (!resource.list) throw new Error(`Resource not listable: ${resourceName}`);
    return resource.list(this.session);
  }

}
