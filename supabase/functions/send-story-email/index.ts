import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendStoryEmailRequest {
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  storyTitle: string;
  storyContent: string;
  templateType: 'simple' | 'elegant' | 'minimal';
  customMessage?: string;
}

const getEmailTemplate = (
  templateType: string,
  storyTitle: string,
  storyContent: string,
  senderName: string,
  customMessage?: string
): string => {
  const contentParagraphs = storyContent.split('\n\n').map(para => `<p style="margin: 1em 0; line-height: 1.8;">${para}</p>`).join('');
  
  const templates: Record<string, string> = {
    simple: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${customMessage ? `<p style="margin-bottom: 20px; color: #666;">${customMessage}</p>` : ''}
          <h1 style="color: #333; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">${storyTitle}</h1>
          ${contentParagraphs}
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-style: italic; text-align: center;">Shared by ${senderName} via StoryMaker AI</p>
        </div>
      </body>
      </html>
    `,
    elegant: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; max-width: 650px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 50px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 40px;">📖</span>
          </div>
          ${customMessage ? `<p style="margin-bottom: 30px; color: #888; text-align: center; font-style: italic;">"${customMessage}"</p>` : ''}
          <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 30px;">${storyTitle}</h1>
          <div style="border-left: 3px solid #667eea; padding-left: 20px;">
            ${contentParagraphs}
          </div>
          <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">Shared with love by ${senderName}</p>
            <p style="color: #aaa; font-size: 10px;">Created with StoryMaker AI</p>
          </div>
        </div>
      </body>
      </html>
    `,
    minimal: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; background: #fff;">
        ${customMessage ? `<p style="margin-bottom: 20px; color: #999; font-size: 14px;">${customMessage}</p>` : ''}
        <h1 style="color: #111; font-weight: 600; font-size: 24px; margin-bottom: 20px;">${storyTitle}</h1>
        ${contentParagraphs}
        <p style="margin-top: 30px; color: #ccc; font-size: 12px;">— ${senderName} via StoryMaker AI</p>
      </body>
      </html>
    `,
  };
  
  return templates[templateType] || templates.simple;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Send story email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please add RESEND_API_KEY." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { 
      recipientEmail, 
      recipientName, 
      senderName, 
      storyTitle, 
      storyContent, 
      templateType,
      customMessage 
    }: SendStoryEmailRequest = await req.json();

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Recipient email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!storyTitle || !storyContent) {
      return new Response(
        JSON.stringify({ error: "Story title and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending story "${storyTitle}" to ${recipientEmail}`);

    const html = getEmailTemplate(templateType || 'simple', storyTitle, storyContent, senderName || 'A StoryMaker User', customMessage);

    const emailResponse = await resend.emails.send({
      from: "StoryMaker AI <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `${senderName || 'Someone'} shared a story with you: "${storyTitle}"`,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
