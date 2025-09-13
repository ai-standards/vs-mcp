import { getClient } from "@/lib/ai";

export type InputContext = {
  code: string;
  framework?: string;
  language?: string;
};

export type OutputContext = InputContext & {
  tests: string;
};

/**
 * @name Generate Tests
 * @description Generate unit tests for code using the specified framework and language.
 */
export async function testCode(context: InputContext): Promise<OutputContext> {
  const { code, framework = "vitest", language = "typescript" } = context;
  if (!code) throw new Error("code:string required");
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Write comprehensive ${framework} tests in ${language} for the following code.\nCover edge cases and typical scenarios. Return only test code.\n\n---\n${code}\n---` }],
  });
  const tests = completion.choices[0]?.message?.content ?? "";
  return { ...context, tests };
}
