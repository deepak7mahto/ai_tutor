import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject';

dotenv.config();

const dropSubjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_tutor');
    console.log('Connected to MongoDB');
    
    await Subject.collection.drop();
    console.log('Subjects collection dropped successfully');
  } catch (error) {
    console.error('Error dropping subjects:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

dropSubjects();
