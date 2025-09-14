import { getClient } from "@/lib/ai";

export type InputContext = {
  prompt: string;
  schema?: string;
  maxTokens?: number;
  model?: string;
  temperature?: number;
};

export type OutputContext = InputContext & {
  data: any;
};

/**
 * @name Generate Structured Data
 * @description Generate structured data (e.g., JSON) from a prompt and optional schema.
 */
async function generateData(context: InputContext): Promise<OutputContext> {
  const { prompt, schema, maxTokens = 600, model = "gpt-4o-mini", temperature } = context;
  if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
  const fullPrompt = schema
    ? `Generate structured data in JSON format matching this schema: ${schema}\nTask: ${prompt}\nReturn only valid JSON.`
    : `Generate structured data in JSON format.\nTask: ${prompt}\nReturn only valid JSON.`;
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: fullPrompt }],
    max_tokens: maxTokens,
    temperature,
  });
  let data;
  try {
    data = JSON.parse(completion.choices[0]?.message?.content ?? "");
  } catch {
    throw new Error("AI did not return valid JSON");
  }
  return { ...context, data };
}

export default generateData;
