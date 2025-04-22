import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Subject from '../models/Subject';
import { IUser } from '../models/User';
import { AIService } from '../services/ai';

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

interface ChatRequest extends Request {
  user?: IUser;
  body: {
    message: string | { text?: string; image?: string };
    subjectId: string;
    topic: string;
    conversationId?: string;
  };
}

// Start new conversation or continue existing one
export const sendMessage = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const { message, subjectId, topic, conversationId } = req.body;
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
      const greetingResponse = await AIService.getResponse(
        "start_conversation",
        subject.name,
        topic,
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
    const userMessageContent = typeof message === 'string' ? message : [
      ...(message.text ? [{
        type: 'text' as const,
        text: message.text
      }] : []),
      ...(message.image ? [{
        type: 'image_url' as const,
        image_url: {
          url: message.image
        }
      }] : [])
    ];

    conversation.messages.push({
      content: userMessageContent,
      role: 'user',
      timestamp: new Date()
    });

    // Get AI response to user's message
    const aiResponse = await AIService.getResponse(
      message,
      subject.name,
      topic,
      conversation.messages.map(msg => {
        if (typeof msg.content === 'string') {
          return {
            role: msg.role,
            content: msg.content
          };
        } else {
          // Convert array content to string for context
          return {
            role: msg.role,
            content: msg.content
              .filter(c => c.type === 'text')
              .map(c => (c as { text: string }).text)
              .join('\n')
          };
        }
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
