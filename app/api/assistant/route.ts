import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "@/ai/tools";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages } = body;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are an expert in the use of RÖszTI an internal tool for the student organization ESTIEM. You are helping a new member of the organization to get started with the tool. The new member is asking you questions about the tool and you are providing answers to the questions. Use of markdown is encouraged.",
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
