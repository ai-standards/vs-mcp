import OpenAI from "openai";
import * as vscode from "vscode";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function getClient(context: vscode.ExtensionContext) {
  const apiKey = await ensureOpenAIKey(context, "openai-api-key3");
  const config: any = { apiKey };
  const apiUrl = vscode.workspace.getConfiguration().get<string>("vs-mcp.apiUrl");
  if (apiUrl) {
    config.baseURL = apiUrl;
  }

  const openai = new OpenAI(config);
  return createAIFacade(openai);
}

export async function ensureOpenAIKey(ctx: vscode.ExtensionContext, secretId = "openai-api-key3") {
  let key = await ctx.secrets.get(secretId);
  if (!key) {
    const input = await vscode.window.showInputBox({
      prompt: "Enter your OpenAI API Key",
      ignoreFocusOut: true,
      password: true,
    });
    if (!input) throw new Error("OpenAI API Key is required.");
    await ctx.secrets.store(secretId, input.trim());
    key = input.trim();
  }
  return key!;
}

// Safe text-first AI facade (no raw client/key passed to agents)
export function createAIFacade(openai: OpenAI) {
  return {
    async generateText(input: string, opts?: { maxTokens?: number; model?: string; temperature?: number }) {
      const resp = await openai.responses.create({
        model: opts?.model ?? "gpt-4o-mini",
        input,
        tool_choice: "none",
        max_output_tokens: Math.min(opts?.maxTokens ?? 600, 1200),
        ...(typeof opts?.temperature === "number" ? { temperature: opts.temperature } : {}),
      });

      console.log({resp});

      const text =
        (resp as any).output_text?.trim() ||
        (resp.output ?? [])
          .flatMap((o: any) => (o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text))
          .join("");

      if (!text) throw new Error("Empty model output");
      return text;
    },
    async generateImages(prompt: string, opts?: { count?: number; size?: string; model?: string }) {
      const allowedSizes = ["auto", "512x512", "1024x1024", "1536x1024", "1024x1536", "256x256", "1792x1024", "1024x1792"] as const;
      type OpenAISize = typeof allowedSizes[number];
      const requestedSize = opts?.size ?? "512x512";
      const size: OpenAISize = allowedSizes.includes(requestedSize as OpenAISize)
        ? (requestedSize as OpenAISize)
        : "512x512";
      const resp = await openai.images.generate({
        prompt,
        n: opts?.count ?? 1,
        size,
        model: opts?.model ?? "dall-e-3",
      });
      return (resp.data ?? []).map((img: any) => img.url);
    },
    async generateFile(prompt: string, opts?: { model?: string; maxTokens?: number; temperature?: number }) {
      // Prompt the model to return a filename and file text in a structured format
      const fullPrompt = `Generate a new file for the following task. The response should be formatted as json, with the following fields:
      - filename: a descriptive filename for the file. if the user specified one then use that, otherwise generate it
      - extension: the type of file
      - text: the file body text
      
      \nTask: ${prompt}`;

      const FileSchema = z.object({
        filename: z.string(),
        extension: z.string(),
        text: z.string(),
      });

      const resp = await openai.responses.parse({
        model: opts?.model ?? "gpt-4o-mini",
        input: fullPrompt,
        tool_choice: "none",
        // max_output_tokens: Math.min(opts?.maxTokens ?? 800, 1600),
        ...(typeof opts?.temperature === "number" ? { temperature: opts.temperature } : {}),
        text: {
          format: zodTextFormat(FileSchema, "file"),
        }
      });

      return resp.output_parsed;
    },
  } as const;
}