import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'EditAI API is running' });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// Plans endpoints
app.post('/api/plans/generate', (req, res) => {
  res.json({ 
    id: '1',
    title: 'Sample Edit Plan',
    scenes: [],
    captions: [],
    animations: []
  });
});

app.get('/api/plans', (req, res) => {
  res.json([]);
});

// Start server
app.listen(port, () => {
  console.log(`EditAI server running on port ${port}`);
});

export default app;
