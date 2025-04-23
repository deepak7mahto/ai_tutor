export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface StoredMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
}

export interface AIResponse {
  content: string;
  error?: string;
  followUpQuestions?: string[];
}

export interface TopicContext {
  name: string;
  description: string;
  prerequisites?: string[];
}

export interface SubjectContext {
  name: string;
  fullName: string;
  topic: TopicContext;
}

export interface IMessage {
  content: string | MessageContent[];
  role: 'user' | 'assistant' | 'system';
  timestamp?: Date;
}
