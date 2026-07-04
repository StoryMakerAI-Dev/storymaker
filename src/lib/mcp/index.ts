import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listStoryTemplatesTool from "./tools/list-story-templates";
import generateStoryIdeaTool from "./tools/generate-story-idea";

export default defineMcp({
  name: "storymaker-ai-mcp",
  title: "StoryMaker AI",
  version: "0.1.0",
  instructions:
    "Tools for StoryMaker AI. Use `echo` to verify connectivity, `list_story_templates` to browse available public story templates by age group or genre, and `generate_story_idea` to generate an original story premise from a theme.",
  tools: [echoTool, listStoryTemplatesTool, generateStoryIdeaTool],
});
