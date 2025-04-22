import express, { Request, Response } from 'express';
import serverless from 'serverless-http';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API!' });
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

// Handle root path redirects
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
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
