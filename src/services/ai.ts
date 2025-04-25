import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

import { prompts } from "../prompts/ai-tutor";
import {
  AIResponse,
  MessageContent,
  StoredMessage,
  TopicContext,
  SubjectContext,
} from "../types/ai";

export class AIService {
  static async getResponse(
    message: string | { text?: string; image?: string } | MessageContent[],
    subjectContext: SubjectContext,
    previousMessages: StoredMessage[] = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = prompts.systemPrompt(subjectContext);

      // Handle previous messages
      const formattedPreviousMessages = previousMessages.map((msg) => ({
        role: msg.role,
        content: Array.isArray(msg.content) ? msg.content : msg.content,
      }));

      // Format current message
      let currentMessage: any;
      if (typeof message === "string") {
        currentMessage = {
          role: "user",
          content: [{ type: "text", text: message }],
        };
      } else if (Array.isArray(message)) {
        currentMessage = {
          role: "user",
          content: message,
        };
      } else {
        currentMessage = {
          role: "user",
          content: [
            ...(message.text ? [{ type: "text", text: message.text }] : []),
            ...(message.image
              ? [{ type: "image_url", image_url: { url: message.image } }]
              : []),
          ],
        };
      }

      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...formattedPreviousMessages,
        currentMessage,
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "meta-llama/llama-4-scout-17b-16e-instruct" as const,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response from AI service");
      }

      return {
        content: response,
      };
    } catch (error: any) {
      console.error("AI Service Error:", error);
      return {
        content:
          "I apologize, but I encountered an error while processing your request. Please try again.",
        error: error.message,
      };
    }
  }

  static async validateSubjectKnowledge(
    subjectContext: SubjectContext
  ): Promise<boolean> {
    try {
      const prompt = prompts.validateKnowledge(subjectContext);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user" as const,
            content: prompt,
          },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct" as const,
        temperature: 0.1,
        max_tokens: 10,
      });

      const response =
        completion.choices[0]?.message?.content?.toLowerCase() || "";
      return response.includes("yes");
    } catch (error) {
      console.error("AI Validation Error:", error);
      return false;
    }
  }
}
