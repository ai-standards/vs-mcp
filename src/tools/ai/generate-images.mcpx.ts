
import { getClient } from "@/lib/ai";

export type InputContext = {
  prompt: string;
  count?: number;
  size?: "512x512" | "auto" | "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "1792x1024" | "1024x1792";
  model?: string;
};

export type OutputContext = InputContext & {
  images: any[];
  note?: string;
};

/**
 * @name Generate Images
 * @description Generate images from a prompt using an AI model and optional parameters.
 */
async function generateImages(context: InputContext): Promise<OutputContext> {
  const { prompt, count = 1, size = "512x512", model = "dall-e-3" } = context;
  if (!prompt || typeof prompt !== "string") throw new Error("prompt:string required");
  const openai = await getClient();
  if (typeof openai.images?.generate !== "function") {
    return { ...context, images: [], note: "Image generation not implemented in AI client." };
  }
  // Ensure size is one of the allowed values
  const allowedSizes = ["512x512", "auto", "1024x1024", "1536x1024", "1024x1536", "256x256", "1792x1024", "1024x1792"];
  const safeSize = allowedSizes.includes(size ?? "512x512") ? size ?? "512x512" : "512x512";
  const result = await openai.images.generate({ prompt, n: count, size: safeSize, model });
  return { ...context, images: result.data ?? [], note: "" };
}

export default generateImages;
