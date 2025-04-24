import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Subject from '../models/Subject';
import { IUser } from '../models/User';
import { AIService } from '../services/ai';
import { TopicContext, SubjectContext, MessageContent } from '../types/ai';
import { ChatRequest, GreetingRequest } from '../types/request';

// Helper functions to parse AI response
function extractContent(response: string): string {
  try {
    const parsed = JSON.parse(response);
    return parsed.content || response;
  } catch (error) {
    return response;
  }
}

function extractQuestions(response: string): string[] {
  try {
    const parsed = JSON.parse(response);
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch (error) {
    return [];
  }
}

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
        greeting: extractContent(greetingResponse.content),
        questions: extractQuestions(greetingResponse.content)
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
    const { message, subjectId, topic, conversationId, image: rawImage } = req.body;
    
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
      ...(rawImage ? [{
        type: 'image_url' as const,
        image_url: {
          url: rawImage
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
        image: rawImage
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

    // Split response to handle large payloads
    const responseData = {
      success: true,
      data: {
        conversationId: conversation._id,
        latestMessage: {
          content: extractContent(aiResponse.content),
          questions: extractQuestions(aiResponse.content),
          role: 'assistant',
          timestamp: new Date()
        }
      }
    };

    res.json(responseData);
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

    // Normalize message content format for consistent client-side rendering
    const normalizedConversation = {
      ...conversation.toObject(),
      messages: conversation.messages.map(msg => {
        // Process message content based on its type
        let normalizedContent: string | MessageContent[] = '';
        
        // If content is a string (assistant message)
        if (typeof msg.content === 'string') {
          // Extract content from [CONTENT] tags if present
          normalizedContent = extractContent(msg.content);
        } 
        // If content is an array (user message with possible images)
        else if (Array.isArray(msg.content)) {
          // Extract text content from the array
          const textItems = msg.content.filter(item => item.type === 'text');
          normalizedContent = textItems.length > 0 && textItems[0].text ? textItems[0].text : '';
        }

        return {
          role: msg.role,
          content: normalizedContent,
          timestamp: msg.timestamp
        };
      })
    };

    res.json({
      success: true,
      data: normalizedConversation
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};
