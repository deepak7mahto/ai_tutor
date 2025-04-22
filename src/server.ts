import express, { Request, Response } from 'express';
import { APIGatewayEvent } from 'aws-lambda';

interface NetlifyRequest extends Request {
  apiGateway?: {
    event: APIGatewayEvent;
  };
}
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth';
import subjectRoutes from './routes/subjects';
import chatRoutes from './routes/chat';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB and initialize data
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .then(async () => {
    const { initializeSubjects } = await import('./config/defaultSubjects');
    return initializeSubjects();
  })
  .catch(console.error);

// Middleware for parsing JSON from Netlify Functions
app.use((req: NetlifyRequest, res: Response, next) => {
  if (req.apiGateway?.event?.body) {
    req.body = req.apiGateway.event.body;
  }
  next();
});

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    message: 'AI Tutor API is running'
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export handler for Netlify Functions
export const handler = serverless(app);
