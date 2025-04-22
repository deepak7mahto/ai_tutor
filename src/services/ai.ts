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

type MessageRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: MessageRole;
  content: string;
}

import { prompts } from '../prompts/ai-tutor';

export class AIService {

  static async getResponse(
    message: string,
    subject: string,
    topic: string,
    previousMessages: Array<{ content: string; role: string }> = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = prompts.systemPrompt(subject, topic);
      const contextPrompt = prompts.contextPrompt(previousMessages);

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...previousMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        } as ChatMessage)),
        {
          role: 'user',
          content: message
        }
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
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
            role: 'user',
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
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
