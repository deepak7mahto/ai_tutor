import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Subject from '../models/Subject';
import { IUser } from '../models/User';

interface ChatRequest extends Request {
  user?: IUser;
  body: {
    message: string;
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
    }

    // Add user message
    conversation.messages.push({
      content: message,
      role: 'user',
      timestamp: new Date()
    });

    // TODO: Integrate with actual AI service
    // For now, return a simple response
    const aiResponse = `I understand you're asking about ${topic} in ${subject.name}. How can I help you learn more about this topic?`;
    
    // Add AI response
    conversation.messages.push({
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date()
    });

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
