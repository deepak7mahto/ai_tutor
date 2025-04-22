import { Request, Response } from 'express';
import Subject, { ISubject } from '../models/Subject';

interface SubjectRequest extends Request {
  body: {
    name: string;
    topics: Array<{
      name: string;
      description: string;
    }>;
  };
}

// Get all subjects
export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await Subject.find({ isActive: true });
    
    res.json({
      success: true,
      data: subjects
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Get subject by ID with topics
export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    res.json({
      success: true,
      data: subject
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
};

// Create new subject
export const createSubject = async (req: SubjectRequest, res: Response): Promise<void> => {
  try {
    const { name, topics } = req.body;

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      res.status(400).json({
        success: false,
        message: 'Subject already exists'
      });
      return;
    }

    const subject = new Subject({
      name,
      topics
    });

    await subject.save();

    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
};

// Update subject
export const updateSubject = async (req: SubjectRequest, res: Response): Promise<void> => {
  try {
    const { name, topics } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // Update fields
    subject.name = name || subject.name;
    if (topics) {
      subject.topics = topics;
    }

    await subject.save();

    res.json({
      success: true,
      data: subject
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
};

// Delete subject (soft delete)
export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    subject.isActive = false;
    await subject.save();

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};
