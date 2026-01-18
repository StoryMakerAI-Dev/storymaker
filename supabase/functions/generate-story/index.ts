import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

async function checkRateLimit(supabase: any, userId: string, functionName: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  // Get or create rate limit record
  const { data: existingLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('function_name', functionName)
    .single();

  if (!existingLimit) {
    // Create new rate limit record
    await supabase.from('rate_limits').insert({
      user_id: userId,
      function_name: functionName,
      request_count: 1,
      window_start: now.toISOString()
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  const recordWindowStart = new Date(existingLimit.window_start);
  
  if (recordWindowStart < windowStart) {
    // Window expired, reset
    await supabase
      .from('rate_limits')
      .update({ request_count: 1, window_start: now.toISOString() })
      .eq('id', existingLimit.id);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (existingLimit.request_count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  // Increment counter
  await supabase
    .from('rate_limits')
    .update({ request_count: existingLimit.request_count + 1 })
    .eq('id', existingLimit.id);

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existingLimit.request_count - 1 };
}

async function logUsage(supabase: any, userId: string, functionName: string, modelUsed: string) {
  try {
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      function_name: functionName,
      model_used: modelUsed,
      tokens_used: 0 // Could be enhanced to track actual tokens
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from header (set by frontend with Clerk user ID)
    const userId = req.headers.get('x-user-id') || 'anonymous';
    
    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(supabase, userId, 'generate-story');
    
    if (!allowed) {
      console.log(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a minute before trying again." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + 60)
          } 
        }
      );
    }

    const { characters, setting, theme, ageGroup, pronouns, wordCount, existingStory, refinementInstruction, model, genre } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const modelToUse = model || "google/gemini-2.5-flash";

    // Build the story generation prompt based on parameters
    const targetWords = wordCount || (ageGroup === 'children' ? 300 : ageGroup === 'teens' ? 500 : 700);
    
    let systemPrompt: string;
    let userPrompt: string;

    if (refinementInstruction && existingStory) {
      systemPrompt = `You are a creative story editor. Refine existing stories based on specific instructions while maintaining the original story's essence.`;
      userPrompt = `Here is an existing story:

${existingStory}

Please refine this story with the following instruction: ${refinementInstruction}

Maintain approximately ${targetWords} words and keep it age-appropriate for ${ageGroup}.
Provide the refined story with its title on the first line, prefixed with "TITLE: "`;
    } else {
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

    console.log("Generating story with model:", modelToUse, "for user:", userId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelToUse,
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

    // Log usage after successful generation
    await logUsage(supabase, userId, 'generate-story', modelToUse);

    const data = await response.json();
    const fullResponse = data.choices[0].message.content;
    
    let title = "An Amazing Story";
    let story = fullResponse;
    
    if (fullResponse.startsWith("TITLE:")) {
      const lines = fullResponse.split("\n");
      title = lines[0].replace("TITLE:", "").trim();
      story = lines.slice(1).join("\n").trim();
    }

    console.log("Story generated successfully:", title);

    return new Response(
      JSON.stringify({ title, story }), 
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-story function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate story" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
