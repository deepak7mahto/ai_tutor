import mongoose, { Document, Schema } from 'mongoose';

interface ITopic {
  name: string;
  description: string;
}

export interface ISubject extends Document {
  name: string;
  fullName: string;
  topics: ITopic[];
  isActive: boolean;
  createdAt: Date;
}

const topicSchema = new Schema<ITopic>({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Topic description is required'],
    trim: true
  }
});

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  topics: [topicSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
subjectSchema.index({ name: 1 });

const Subject = mongoose.model<ISubject>('Subject', subjectSchema);

export default Subject;
