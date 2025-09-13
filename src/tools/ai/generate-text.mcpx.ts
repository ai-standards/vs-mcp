import { getClient } from "@/lib/ai";

type InputContext = {
  prompt: string;
  maxTokens?: number;
  model?: string;
  temperature?: number;
};

type OutputContext = InputContext & {
  text: string;
};

/**
 * @name Generate Text
 * @description Generate plain text from a prompt.
 * @returns something
 * 
 */
export default async function generateText(context: InputContext): Promise<OutputContext> {
  const { prompt, maxTokens = 600, model = "gpt-4o-mini", temperature = 0.2 } = context;
  if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature,
  });
  const text = completion.choices[0]?.message?.content ?? "";
  return { ...context, text };
}
