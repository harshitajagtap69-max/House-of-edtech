import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

type AIFeature = "summary" | "keypoints" | "questions" | "all";

type AIResult =
  | { feature: "summary"; result: string }
  | { feature: "keypoints"; result: string[] }
  | { feature: "questions"; result: string[] }
  | { feature: "all"; summary: string; keyPoints: string[]; questions: string[] };

async function ask(prompt: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

function parseJsonArray(text: string): string[] {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed.slice(0, 5);
  } catch {
    // fallback: split by newline
  }
  return text
    .split("\n")
    .map((l: string) => l.replace(/^[-•*\d.]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function generateSummary(content: string): Promise<string> {
  const prompt = `Summarize these study notes in 3-5 sentences. Be direct, no preamble.

Notes:
${content}`;
  return ask(prompt);
}

export async function generateKeyPoints(content: string): Promise<string[]> {
  const prompt = `Extract the 5 most important key points from these study notes.
Return ONLY a JSON array of strings. No explanation, no markdown.
Example: ["Point 1", "Point 2"]

Notes:
${content}`;
  const text = await ask(prompt);
  return parseJsonArray(text);
}

export async function generateQuestions(content: string): Promise<string[]> {
  const prompt = `Generate 5 exam-style questions from these study notes.
Return ONLY a JSON array of strings. No explanation, no markdown.
Example: ["Question 1?", "Question 2?"]

Notes:
${content}`;
  const text = await ask(prompt);
  return parseJsonArray(text);
}

// Single call — generates all three at once using structured prompt
export async function generateAll(content: string): Promise<{
  summary: string;
  keyPoints: string[];
  questions: string[];
}> {
  const prompt = `You are a study assistant. Analyze the study notes below and return a JSON object with exactly these three fields:
- "summary": a 3-5 sentence summary
- "keyPoints": array of 5 most important key points (strings)
- "questions": array of 5 exam-style questions (strings)

Return ONLY valid JSON. No explanation, no markdown code blocks.

Notes:
${content}`;

  const text = await ask(prompt);

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary ?? "",
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
    };
  } catch {
    // Fallback: run individually if JSON parse fails
    const [summary, keyPoints, questions] = await Promise.all([
      generateSummary(content),
      generateKeyPoints(content),
      generateQuestions(content),
    ]);
    return { summary, keyPoints, questions };
  }
}
