import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "generate_story_idea",
  title: "Generate story idea",
  description:
    "Generate a short, original story idea (title + 3-sentence premise) using StoryMaker AI. Provide a theme, age group, and optional genre.",
  inputSchema: {
    theme: z.string().min(1).describe("Theme or concept to base the story on."),
    ageGroup: z
      .string()
      .optional()
      .describe("Target age group (e.g. 'kids', 'teens', 'adults'). Defaults to 'adults'."),
    genre: z.string().optional().describe("Optional genre, e.g. 'fantasy'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ theme, ageGroup, genre }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        content: [{ type: "text", text: "LOVABLE_API_KEY is not configured." }],
        isError: true,
      };
    }
    const prompt = `Generate an original story idea for ${ageGroup ?? "adults"}${
      genre ? ` in the ${genre} genre` : ""
    } based on the theme: "${theme}". Return a compelling title on the first line, then a 3-sentence premise.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a creative story-idea generator for StoryMaker AI." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        content: [{ type: "text", text: `AI Gateway error (${res.status}): ${errText}` }],
        isError: true,
      };
    }
    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? "";
    return {
      content: [{ type: "text", text }],
      structuredContent: { idea: text, theme, ageGroup: ageGroup ?? "adults", genre: genre ?? null },
    };
  },
});
