import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "echo",
  title: "Echo",
  description: "Echo the input text back. Useful for verifying connectivity to the StoryMaker AI MCP server.",
  inputSchema: { text: z.string().min(1).describe("Text to echo back.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ text }) => ({ content: [{ type: "text", text }] }),
});
