import mongoose from 'mongoose';
import Subject from '../models/Subject';

export const defaultSubjects = [
  {
    name: 'SSC Exam',
    topics: [
      {
        name: 'Mathematics',
        description: 'Covers arithmetic, algebra, geometry, and mensuration with focus on SSC-level problem solving.'
      },
      {
        name: 'English Language',
        description: 'Includes grammar, vocabulary, reading comprehension, and verbal ability.'
      },
      {
        name: 'General Intelligence',
        description: 'Focus on logical reasoning, analytical ability, and problem-solving skills.'
      },
      {
        name: 'General Knowledge',
        description: 'Covers current affairs, history, geography, Indian polity, and general science.'
      }
    ]
  },
  {
    name: 'CAT Exam',
    topics: [
      {
        name: 'Quantitative Aptitude',
        description: 'Advanced mathematics including arithmetic, algebra, geometry, and modern maths.'
      },
      {
        name: 'Verbal Ability',
        description: 'Reading comprehension, grammar, vocabulary, and verbal reasoning.'
      },
      {
        name: 'Data Interpretation',
        description: 'Analysis of data presented in tables, graphs, and charts.'
      },
      {
        name: 'Logical Reasoning',
        description: 'Critical thinking, analytical reasoning, and problem-solving.'
      }
    ]
  }
];

export const initializeSubjects = async (): Promise<void> => {
  try {
    // Check if subjects already exist
    const existingSubjects = await Subject.countDocuments();
    
    if (existingSubjects === 0) {
      console.log('Initializing default subjects...');
      await Subject.insertMany(defaultSubjects);
      console.log('Default subjects created successfully');
    } else {
      console.log('Subjects already exist, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing subjects:', error);
    throw error;
  }
};
