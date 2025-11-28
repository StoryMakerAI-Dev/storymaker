import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characters, setting, theme, ageGroup, pronouns, wordCount, existingStory, refinementInstruction, model } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the story generation prompt based on parameters
    const targetWords = wordCount || (ageGroup === 'children' ? 300 : ageGroup === 'teens' ? 500 : 700);
    
    let systemPrompt: string;
    let userPrompt: string;

    if (refinementInstruction && existingStory) {
      // Refinement mode
      systemPrompt = `You are a creative story editor. Refine existing stories based on specific instructions while maintaining the original story's essence.`;
      userPrompt = `Here is an existing story:

${existingStory}

Please refine this story with the following instruction: ${refinementInstruction}

Maintain approximately ${targetWords} words and keep it age-appropriate for ${ageGroup}.
Provide the refined story with its title on the first line, prefixed with "TITLE: "`;
    } else {
      // Check if we're generating a poem
      const isPoem = genre === 'poem';
      
      if (isPoem) {
        systemPrompt = `You are a creative poet. Generate beautiful, evocative poems based on the provided parameters.
- Keep the poem around ${targetWords > 200 ? Math.floor(targetWords / 2) : targetWords} words
- Use proper stanza breaks for readability
- Make the poem age-appropriate for ${ageGroup}
- Include vivid imagery, metaphors, and poetic devices
- Create a complete poem with emotional depth
- Use ${pronouns} pronouns when referring to the main subject(s)`;

        userPrompt = `Write a ${ageGroup} poem with these details:
Subject: ${characters || 'Create an interesting poetic subject'}
Setting/Imagery: ${setting || 'Create vivid imagery'}
Theme: ${theme || 'Create an emotional journey'}
Target length: approximately ${targetWords > 200 ? Math.floor(targetWords / 2) : targetWords} words

Also provide a poetic title (on the first line, prefixed with "TITLE: ")`;
      } else {
        // New story generation mode
        systemPrompt = `You are a creative story writer. Generate engaging, well-structured stories based on the provided parameters. 
- Keep the story around ${targetWords} words
- Use proper paragraph breaks for readability
- Make the story age-appropriate for ${ageGroup}
- Include dialogue and vivid descriptions
- Create a complete story with beginning, middle, and end
- Use ${pronouns} pronouns when referring to the main character(s)`;

        userPrompt = `Write a ${ageGroup} story with these details:
Characters: ${characters || 'Create interesting characters'}
Setting: ${setting || 'Create an interesting setting'}
Theme: ${theme || 'Create an engaging adventure'}
Target length: approximately ${targetWords} words

Also provide a creative title for this story (on the first line, prefixed with "TITLE: ")`;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate story");
    }

    const data = await response.json();
    const fullResponse = data.choices[0].message.content;
    
    // Extract title and story
    let title = "An Amazing Story";
    let story = fullResponse;
    
    if (fullResponse.startsWith("TITLE:")) {
      const lines = fullResponse.split("\n");
      title = lines[0].replace("TITLE:", "").trim();
      story = lines.slice(1).join("\n").trim();
    }

    return new Response(
      JSON.stringify({ title, story }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-story function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate story" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
