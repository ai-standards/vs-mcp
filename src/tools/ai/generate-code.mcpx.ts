import { getClient } from "../../lib/ai";

export type InputContext = {
  prompt: string;
  language?: string;
  style?: string;
  maxTokens?: number;
};

export type OutputContext = InputContext & {
  code: string;
  language: string;
};

/**
 * @namespace ai
 * @name Generate Code
 * @description Generate new code from a natural language prompt, specifying language and style.
 */
async function generateCode(context: InputContext): Promise<OutputContext> {
  const { prompt, language = "typescript", style = "clean", maxTokens = 600 } = context;
  if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Generate ${language} code in a ${style} style.\nReturn only code.\n\nTask:\n${prompt}` }],
    max_tokens: maxTokens,
  });
  const code = completion.choices[0]?.message?.content ?? "";
  return { ...context, code, language };
}

export default generateCode;
