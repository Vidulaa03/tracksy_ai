import express, { Response } from 'express';
import Resume from '../models/Resume';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = express.Router();

const createResumeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updateResumeSchema = createResumeSchema.partial();

// Get all resumes for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get resume by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create resume
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const data = createResumeSchema.parse(req.body);

    const resume = new Resume({
      ...data,
      userId: req.userId,
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update resume
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const data = updateResumeSchema.parse(req.body);

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      data,
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete resume
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
