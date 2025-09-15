import { getClient } from "../../lib/ai";

export type InputContext = {
  code: string;
  format?: string;
  audience?: string;
};

export type OutputContext = InputContext & {
  docs: string;
};

/**
 * @namespace ai
 * @name Write Documentation
 * @description Write or update documentation for code in the specified format and audience.
 */
async function writeDocumentation(context: InputContext): Promise<OutputContext> {
  const { code, format = "markdown", audience = "developers" } = context;
  if (!code) throw new Error("code:string required");
  const openai = await getClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Write ${format} documentation for the following code for ${audience}.\nExplain purpose, API, usage, and gotchas. Include brief snippets as needed.\n\n---\n${code}\n---` }],
  });
  const docs = completion.choices[0]?.message?.content ?? "";
  return { ...context, docs };
}

export default writeDocumentation;
