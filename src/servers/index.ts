import { McpToolApi } from "../types"
import { createAiServer } from "./ai-server"
import { createEditorServer } from "./editor-server"
import { createFsServer } from "./fs-server"
import { createStatusServer } from "./status-server"
import { createUiServer } from "./ui-server"

export const getMcpApi = async () => {
    const servers = [
        createAiServer(),
        createEditorServer(),
        createFsServer(),
        createStatusServer(),
        createUiServer()
    ];

    const api = await Promise.all(servers.map(s => s.listTools()));

    return api.reduce((acc, tools) => ([
        ...acc,
        ...tools.map(t => ({
            name: t.name,
            description: t.description,
            schema: t.schema,
            response: t.response
        }))
    ]), [] as McpToolApi[]);
}