import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Subject from '../models/Subject';
import { IUser } from '../models/User';
import { AIService } from '../services/ai';
import { TopicContext, SubjectContext, MessageContent } from '../types/ai';
import { ChatRequest, GreetingRequest } from '../types/request';

const createSubjectContext = (subject: any, topicName: string): SubjectContext | null => {
  const topic = subject.topics.find((t: any) => t.name === topicName);
  if (!topic) return null;

  return {
    name: subject.name,
    fullName: subject.fullName,
    topic: {
      name: topic.name,
      description: topic.description
    }
  };
};

// Get initial greeting when chat page loads
export const getInitialGreeting = async (req: GreetingRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, topic } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Validate subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // Create subject context
    const subjectContext = createSubjectContext(subject, topic);
    if (!subjectContext) {
      res.status(404).json({
        success: false,
        message: 'Topic not found in subject'
      });
      return;
    }

    // Get AI greeting
    const greetingResponse = await AIService.getResponse(
      "start_conversation",
      subjectContext,
      []
    );

    res.json({
      success: true,
      data: {
        greeting: greetingResponse.content
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating greeting',
      error: error.message
    });
  }
};

// Start new conversation or continue existing one
export const sendMessage = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const { message, subjectId, topic, conversationId, image } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Validate subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    let conversation;
    let isNewConversation = false;

    if (conversationId) {
      // Continue existing conversation
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
        isActive: true
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
        return;
      }
    } else {
      // Start new conversation
      conversation = new Conversation({
        userId,
        subjectId,
        topic,
        messages: []
      });
      isNewConversation = true;
    }

    // For new conversations, get AI greeting first
    if (isNewConversation) {
      const subjectContext = createSubjectContext(subject, topic);
      if (!subjectContext) {
        res.status(404).json({
          success: false,
          message: 'Topic not found in subject'
        });
        return;
      }

      const greetingResponse = await AIService.getResponse(
        "start_conversation",
        subjectContext,
        []
      );

      if (!greetingResponse.error) {
        conversation.messages.push({
          content: greetingResponse.content,
          role: 'assistant',
          timestamp: new Date()
        });
      }
    }

    // Add user message
    const userMessageContent = [
      {
        type: 'text' as const,
        text: message
      },
      ...(image ? [{
        type: 'image_url' as const,
        image_url: {
          url: image
        }
      }] : [])
    ];

    conversation.messages.push({
      content: userMessageContent,
      role: 'user',
      timestamp: new Date()
    });

    // Get AI response to user's message
    const subjectContext = createSubjectContext(subject, topic);
    if (!subjectContext) {
      res.status(404).json({
        success: false,
        message: 'Topic not found in subject'
      });
      return;
    }

    const aiResponse = await AIService.getResponse(
      {
        text: message,
        image: image
      },
      subjectContext,
      conversation.messages.map(msg => {
        if (Array.isArray(msg.content)) {
          // For messages with array content (user messages with images)
          return {
            role: msg.role,
            content: msg.content
              .filter(c => c.type === 'text')
              .map(c => c.text)
              .join('\n')
          };
        }
        // For simple text messages
        return {
          role: msg.role,
          content: msg.content
        };
      })
    );
    
    // Add AI response
    conversation.messages.push({
      content: aiResponse.content,
      role: 'assistant',
      timestamp: new Date()
    });

    if (aiResponse.error) {
      console.error('AI Service Error:', aiResponse.error);
    }

    await conversation.save();

    res.json({
      success: true,
      data: {
        conversation,
        latestResponse: aiResponse
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error processing message',
      error: error.message
    });
  }
};

// Get conversation history
export const getConversations = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({ 
      userId,
      isActive: true 
    })
    .sort({ updatedAt: -1 })
    .populate('subjectId', 'name')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

    const total = await Conversation.countDocuments({ 
      userId,
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Get single conversation
export const getConversation = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const conversationId = req.params.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
      isActive: true
    }).populate('subjectId', 'name');

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
      return;
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};
