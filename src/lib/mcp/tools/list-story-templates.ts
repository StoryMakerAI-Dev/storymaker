import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_story_templates",
  title: "List story templates",
  description:
    "List publicly available StoryMaker AI story templates. Optionally filter by age group or genre to narrow results.",
  inputSchema: {
    ageGroup: z
      .string()
      .optional()
      .describe("Optional age group filter, e.g. 'kids', 'teens', 'adults'."),
    genre: z
      .string()
      .optional()
      .describe("Optional genre filter, e.g. 'fantasy', 'mystery'."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of templates to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ ageGroup, genre, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let query = supabase
      .from("story_templates")
      .select("id, name, genre, description, starter_text, age_group")
      .limit(limit ?? 20);
    if (ageGroup) query = query.eq("age_group", ageGroup);
    if (genre) query = query.eq("genre", genre);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { templates: data ?? [] },
    };
  },
});
