import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface AIResponse {
  content: string;
  error?: string;
}

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

interface StoredMessage {
  role: string;
  content: string;
}

type ImageURL = {
  url: string;
}

type ChatContentText = {
  type: 'text';
  text: string;
}

type ChatContentImage = {
  type: 'image_url';
  image_url: ImageURL;
}

type ChatContent = ChatContentText | ChatContentImage;

type ChatMessage = {
  role: 'system';
  content: string;
} | {
  role: 'user';
  content: string | ChatContent[];
} | {
  role: 'assistant';
  content: string;
};

import { prompts } from '../prompts/ai-tutor';

export class AIService {

  static async getResponse(
    message: string | { text?: string; image?: string },
    subject: string,
    topic: string,
    previousMessages: StoredMessage[] = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = prompts.systemPrompt(subject, topic);
      // Convert previous messages to string content for context
      const textMessages = previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const contextPrompt = prompts.contextPrompt(textMessages);

      const messages = [
        {
          role: 'system' as const,
          content: systemPrompt
        },
        ...previousMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: typeof message === 'string' ? message : 
            ([] as ChatContent[]).concat(
              message.text ? [{
                type: 'text',
                text: message.text
              }] : [],
              message.image ? [{
                type: 'image_url',
                image_url: {
                  url: message.image
                }
              }] : []
            )
        }
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "meta-llama/llama-4-scout-17b-16e-instruct" as const,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from AI service');
      }

      return {
        content: response
      };
    } catch (error: any) {
      console.error('AI Service Error:', error);
      return {
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        error: error.message
      };
    }
  }

  static async validateSubjectKnowledge(subject: string, topic: string): Promise<boolean> {
    try {
      const prompt = prompts.validateKnowledge(subject, topic);
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user' as const,
            content: prompt
          }
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct" as const,
        temperature: 0.1,
        max_tokens: 10
      });

      const response = completion.choices[0]?.message?.content?.toLowerCase() || '';
      return response.includes('yes');
    } catch (error) {
      console.error('AI Validation Error:', error);
      return false;
    }
  }
}
