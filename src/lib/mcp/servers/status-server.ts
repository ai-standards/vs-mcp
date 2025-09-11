
import * as vscode from "vscode";
import { McpServer, McpTool, McpResource } from "../types";

export type StatusMode = "statusSpinner" | "statusBar" | "window";

const statusMap = new Map<string, { message: string; mode: StatusMode }>();

const statusBarMap = new Map<string, vscode.Disposable>();
const statusSpinnerMap = new Map<string, { resolve: () => void }>();
const windowNotificationMap = new Map<string, { close: () => void }>();

const tools: McpTool[] = [
    {
        name: "status.window",
        description: "Show a status message in a window notification.",
        schema: { id: "string", message: "string" },
        async call(args) {
            const { id, message } = (args as any) ?? {};
            if (!id || typeof id !== "string") throw new Error("id:string required");
            if (!message || typeof message !== "string") throw new Error("message:string required");
            statusMap.set(id, { message, mode: "window" });
            // Show notification and track for dismissal
            const notification = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10000);
            notification.text = message;
            notification.show();
            windowNotificationMap.set(id, { close: () => notification.dispose() });
            setTimeout(() => notification.dispose(), 3000); // auto-dismiss after 3s
            return { shown: true };
        },
    },
    {
        name: "status.bar",
        description: "Show a status message in the status bar. Optionally show a spinner.",
        schema: { id: "string", message: "string", spinner: "boolean?" },
        async call(args) {
            const { id, message, spinner } = (args as any) ?? {};
            if (!id || typeof id !== "string") throw new Error("id:string required");
            if (!message || typeof message !== "string") throw new Error("message:string required");
            statusMap.set(id, { message, mode: "statusBar" });
            if (spinner) {
                let resolveFn: () => void;
                const promise = new Promise<void>(resolve => { resolveFn = resolve; });
                statusSpinnerMap.set(id, { resolve: resolveFn! });
                vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: message, cancellable: false }, () => promise);
                return { shown: true, spinner: true };
            } else {
                const disposable = vscode.window.setStatusBarMessage(message);
                statusBarMap.set(id, disposable);
                return { shown: true, spinner: false };
            }
        },
    },
    {
        name: "status.dismiss",
        description: "Dismiss any status notification by id.",
        schema: { id: "string" },
        async call(args) {
            const { id } = (args as any) ?? {};
            if (!id || typeof id !== "string") throw new Error("id:string required");
            statusMap.delete(id);
            // Dismiss status bar
            const barDisposable = statusBarMap.get(id);
            if (barDisposable) {
                barDisposable.dispose();
                statusBarMap.delete(id);
            }
            // Dismiss spinner
            const spinnerEntry = statusSpinnerMap.get(id);
            if (spinnerEntry) {
                spinnerEntry.resolve();
                statusSpinnerMap.delete(id);
            }
            // Dismiss window notification
            const windowEntry = windowNotificationMap.get(id);
            if (windowEntry) {
                windowEntry.close();
                windowNotificationMap.delete(id);
            }
            return { dismissed: true };
        },
    },
];

export function createStatusServer(): McpServer {
    return {
        async listTools() { return tools; },
        async listResources() { return [] as McpResource[]; },
    };
}
