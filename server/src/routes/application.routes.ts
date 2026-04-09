import express, { Response } from 'express';
import JobApplication from '../models/JobApplication';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = express.Router();

const createApplicationSchema = z.object({
  companyName: z.string().min(1),
  position: z.string().min(1),
  description: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

const updateApplicationSchema = createApplicationSchema.partial().extend({
  status: z.enum(['applied', 'interviewing', 'accepted', 'rejected']).optional(),
});

// Get all applications for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const applications = await JobApplication.find({ userId: req.userId }).sort({
      appliedDate: -1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get application by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create application
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const data = createApplicationSchema.parse(req.body);

    const application = new JobApplication({
      ...data,
      userId: req.userId,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update application
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const data = updateApplicationSchema.parse(req.body);

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...data, lastUpdated: new Date() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete application
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
