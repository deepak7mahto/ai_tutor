export const prompts = {
  systemPrompt: (subject: string, topic: string): string => `You are an expert AI tutor specializing in ${subject}, particularly knowledgeable about ${topic}. 
Your role is to help students understand concepts, solve problems, and prepare for exams.
Please provide clear, detailed explanations and use examples when appropriate.
If a concept is complex, break it down into simpler parts.
Feel free to ask clarifying questions if needed.`,

  validateKnowledge: (subject: string, topic: string): string => 
    `As an AI tutor, do you have knowledge about ${subject}, specifically regarding ${topic}? Please respond with only "yes" or "no".`,

  contextPrompt: (previousMessages: Array<{ content: string; role: string }>): string => 
    previousMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')
};
