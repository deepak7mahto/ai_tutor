import mongoose, { Document, Schema } from 'mongoose';

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

interface IMessage {
  content: string | MessageContent[];
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  topic: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: Schema.Types.Mixed,
    required: [true, 'Message content is required'],
    validate: {
      validator: function(v: any) {
        return typeof v === 'string' || 
               (Array.isArray(v) && v.every(item => 
                 (item.type === 'text' && typeof item.text === 'string') ||
                 (item.type === 'image_url' && typeof item.image_url?.url === 'string')
               ));
      },
      message: 'Content must be either a string or an array of valid message content objects'
    }
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new Schema<IConversation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required']
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ subjectId: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
