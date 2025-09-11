// mcp/servers/aiServer.ts
import { McpServer, McpTool, McpResource, McpSession, Json } from "../types";

function need(session: McpSession, scope: string) {
  if (!session.scopes.includes(scope)) throw new Error(`Missing scope: ${scope}`);
}

function getAI(session: McpSession): { generateText: (input: string, opts?: any) => Promise<string>; generateImages?: (prompt: string, opts?: any) => Promise<any[]> } {
  const ai = session.di?.["ai"] as any;
  if (!ai || typeof ai.generateText !== "function") {
    throw new Error("AI facade not available on session.di.ai");
  }
  return ai;
}

const tools: McpTool[] = [
  {
    name: "ai.generateText",
    description: "Generate plain text from a prompt.",
    schema: { prompt: "string", maxTokens: "number?=600", model: "string?", temperature: "number?" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { prompt, maxTokens = 600, model = "gpt-5-mini", temperature } = (args as any) ?? {};
      if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
      const ai = getAI(session);
      const text = await ai.generateText(prompt, { maxTokens, model, temperature });
      return { text };
    },
  },
  {
    name: "ai.generateData",
    description: "Generate structured data (e.g., JSON) from a prompt.",
    schema: { prompt: "string", schema: "string?", maxTokens: "number?=600", model: "string?", temperature: "number?" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { prompt, schema, maxTokens = 600, model = "gpt-5-mini", temperature } = (args as any) ?? {};
      if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
      const ai = getAI(session);
      const fullPrompt = schema
        ? `Generate structured data in JSON format matching this schema: ${schema}\nTask: ${prompt}\nReturn only valid JSON.`
        : `Generate structured data in JSON format.\nTask: ${prompt}\nReturn only valid JSON.`;
      const text = await ai.generateText(fullPrompt, { maxTokens, model, temperature });
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("AI did not return valid JSON");
      }
      return { data };
    },
  },
  {
    name: "ai.generateImages",
    description: "Generate images from a prompt.",
    schema: { prompt: "string", count: "number?=1", size: "string?='512x512'", model: "string?" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { prompt, count = 1, size = "512x512", model = "dall-e-3" } = (args as any) ?? {};
      if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
      const ai = getAI(session);
      // If your AI facade supports image generation, call it here. Otherwise, return a stub.
      if (typeof ai.generateImages === "function") {
        const images = await ai.generateImages(prompt, { count, size, model });
        return { images };
      } else {
        // Stub: return empty array or error
        return { images: [], note: "Image generation not implemented in AI facade." };
      }
    },
  },
  // ...existing code...
  {
    name: "ai.generateCode",
    description: "Generate new code from a natural language prompt.",
    schema: { prompt: "string", language: "string?=typescript", style: "string?='clean'", maxTokens: "number?=600" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { prompt, language = "typescript", style = "clean", maxTokens = 600 } = (args as any) ?? {};
      if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
      const ai = getAI(session);
      const code = await ai.generateText(
        `Generate ${language} code in a ${style} style.\nReturn only code.\n\nTask:\n${prompt}`,
        { maxTokens, model: "gpt-5-mini" }
      );
      return { code, language };
    },
  },
  {
    name: "ai.refactorCode",
    description: "Refactor existing code based on instructions.",
    schema: { code: "string", instructions: "string", language: "string?=typescript", style: "string?='clean'" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { code, instructions, language = "typescript", style = "clean" } = (args as any) ?? {};
      if (!code || !instructions) throw new Error("code:string and instructions:string required");
      const ai = getAI(session);
      const output = await ai.generateText(
        `Refactor the following ${language} code.\nGoal: ${instructions}\nStyle: ${style}\nReturn only code.\n\n---\n${code}\n---`
      );
      return { code: output };
    },
  },
  {
    name: "ai.testCode",
    description: "Generate unit tests for code.",
    schema: { code: "string", framework: "string?=vitest", language: "string?=typescript" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { code, framework = "vitest", language = "typescript" } = (args as any) ?? {};
      if (!code) throw new Error("code:string required");
      const ai = getAI(session);
      const tests = await ai.generateText(
        `Write comprehensive ${framework} tests in ${language} for the following code.\n` +
        `Cover edge cases and typical scenarios. Return only test code.\n\n---\n${code}\n---`
      );
      return { tests, framework, language };
    },
  },
  {
    name: "ai.writeDocumentation",
    description: "Write or update documentation for code.",
    schema: { code: "string", format: "string?='markdown'", audience: "string?='developers'" },
    async call(args: Json, session: McpSession) {
      need(session, "ai.generate");
      const { code, format = "markdown", audience = "developers" } = (args as any) ?? {};
      if (!code) throw new Error("code:string required");
      const ai = getAI(session);
      const docs = await ai.generateText(
        `Write ${format} documentation for the following code for ${audience}.\n` +
        `Explain purpose, API, usage, and gotchas. Include brief snippets as needed.\n\n---\n${code}\n---`
      );
      return { docs, format };
    },
  },
];

const resources: McpResource[] = []; // none for AI

export function createAiServer(): McpServer {
  return {
    async listTools() { return tools; },
    async listResources() { return resources; },
  };
}
