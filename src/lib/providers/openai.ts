import OpenAI from "openai";
import * as vscode from "vscode";

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
        model: opts?.model ?? "gpt-5-mini",
        input,
        tool_choice: "none",
        // Remove reasoning.effort or set to a valid value if required by API
        max_output_tokens: Math.min(opts?.maxTokens ?? 600, 1200),
        ...(typeof opts?.temperature === "number" ? { temperature: opts.temperature } : {}),
      });

      const text =
        (resp as any).output_text?.trim() ||
        (resp.output ?? [])
          .flatMap((o: any) => (o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text))
          .join("");

      if (!text) throw new Error("Empty model output");
      return text;
    },
    async generateImages(prompt: string, opts?: { count?: number; size?: string; model?: string }) {
      // Uses OpenAI's images.generate endpoint
      // Only allow valid sizes per OpenAI API
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
      // Return array of image URLs
      return (resp.data ?? []).map((img: any) => img.url);
    },
  } as const;
}