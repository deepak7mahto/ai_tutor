import express from 'express';
import { 
  getSubjects, 
  getSubjectById, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '../controllers/subjects';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all subjects - public access
router.get('/', getSubjects);

// Get subject by ID - public access
router.get('/:id', getSubjectById);

// Protected routes - admin only
// TODO: Add admin middleware
router.post('/', auth, createSubject);
router.put('/:id', auth, updateSubject);
router.delete('/:id', auth, deleteSubject);

export default router;
