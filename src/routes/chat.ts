import express from 'express';
import { 
  sendMessage, 
  getConversations, 
  getConversation 
} from '../controllers/chat';
import { auth } from '../middleware/auth';

const router = express.Router();

// All chat routes require authentication
router.use(auth);

// Start or continue conversation
router.post('/message', sendMessage);

// Get conversation history
router.get('/conversations', getConversations);

// Get single conversation
router.get('/conversations/:id', getConversation);

export default router;
