import { Request } from "express";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
  };
  user?: IUser;
  token?: string;
}

export interface SubjectRequest extends Request {
  body: {
    name: string;
    topics: {
      name: string;
      description: string;
    }[];
  };
  user?: IUser;
  params: {
    id?: string;
  };
  query: {
    page?: string;
    limit?: string;
  };
}

export interface ChatRequest extends Request {
  user?: IUser;
  body: {
    message: string;
    subjectId: string;
    topic: string;
    conversationId?: string;
    image?: string;
  };
}

export interface GreetingRequest extends Request {
  user?: IUser;
  query: {
    subjectId: string;
    topic: string;
  };
}

export interface NetlifyRequest extends Request {
  apiGateway?: {
    event: {
      body?: string | null;
      requestContext: {
        authorizer?: {
          userId: string;
        };
      };
    };
  };
}
