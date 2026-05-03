import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePostContent(title: string, context?: string) {
  const prompt = `You are an expert technical writer and blogger. 
Write a comprehensive, engaging, and highly readable blog post based on the following title.
${context ? `Use the following context to guide the article: ${context}` : ''}

Title: "${title}"

Instructions:
1. Write the post entirely in valid MDX format.
2. Use headings (##, ###), bullet points, and code blocks where appropriate.
3. Keep the tone professional but conversational.
4. Do NOT output any preamble or conversational filler. Only output the MDX content.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error('Failed to generate content with AI');
  }
}

export async function extractSEOMetadata(content: string) {
  const prompt = `Analyze the following blog post content and extract the best SEO metadata.
Return ONLY a valid JSON object with the following structure:
{
  "metaTitle": "A highly clickable SEO title under 60 characters",
  "metaDescription": "A compelling meta description under 160 characters that includes main keywords"
}

Content to analyze:
${content.substring(0, 3000)}`; // Send first 3000 chars to save tokens

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    // Parse the JSON out of the response (stripping markdown codeblocks if they exist)
    const text = response.text || '{}';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini SEO error:', error);
    return null;
  }
}

export async function checkCommentSpam(content: string) {
  const prompt = `Analyze the following blog comment and return a float value between 0.0 and 1.0 indicating how likely it is to be spam.
0.0 = completely genuine and safe
1.0 = obvious spam, self-promotion, or bot behavior.

Return ONLY the float number. Do not return any other text.

Comment: "${content}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    const score = parseFloat(response.text || '0');
    return isNaN(score) ? 0 : score;
  } catch (error) {
    return 0; // Default to not spam if AI fails
  }
}
