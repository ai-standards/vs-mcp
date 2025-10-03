import { getClient, getModel } from "../../lib/ai";

export type InputContext = {
  code: string;
  instructions: string;
  language?: string;
  style?: string;
};

export type OutputContext = InputContext & {
  refactoredCode: string;
};

/**
 * @namespace ai
 * @name Refactor Code
 * @description Refactor existing code based on instructions, language, and style.
 */
export async function refactorCode(context: InputContext): Promise<OutputContext> {
  const { code, instructions, language = "typescript", style = "clean" } = context;
  if (!code || !instructions) throw new Error("code:string and instructions:string required");
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
  model: getModel(),
    messages: [{ role: "user", content: `Refactor the following ${language} code.\nGoal: ${instructions}\nStyle: ${style}\nReturn only code.\n\n---\n${code}\n---` }],
  });
  const refactoredCode = completion.choices[0]?.message?.content ?? "";
  return { ...context, refactoredCode };
}
