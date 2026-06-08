import Groq from "groq-sdk";
import { AIFeature } from "@/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPTS: Record<AIFeature, (content: string) => string> = {
  summary: (content) =>
    `Summarize the following study notes in 3-5 clear sentences.
Be concise and focus on the main ideas. Do not add any intro line like "Here is a summary".

Notes:
${content}`,

  keypoints: (content) =>
    `Extract the 5 most important key points from these study notes.
Return ONLY a JSON array of strings, no other text, no markdown, no explanation.
Example format: ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]

Notes:
${content}`,

  questions: (content) =>
    `Generate 5 exam-style questions based on these study notes.
Return ONLY a JSON array of strings, no other text, no markdown, no explanation.
Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]

Notes:
${content}`,
};

export async function generateAIContent(
  content: string,
  feature: AIFeature
): Promise<string | string[]> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",   // fast + free on Groq
    messages: [
      {
        role: "user",
        content: PROMPTS[feature](content),
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";

  // Parse JSON array for keypoints and questions
  if (feature === "keypoints" || feature === "questions") {
    try {
      // Strip any accidental markdown code blocks
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleaned) as string[];
    } catch {
      // Fallback: split by newline if JSON parse fails
      return text
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line: string) => line.replace(/^[-•*\d.]+\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
    }
  }

  return text;
}
