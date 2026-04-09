import express, { Request, Response } from 'express';
import { z } from 'zod';

const router = express.Router();

const parseJobSchema = z.object({
  jobDescription: z.string().min(1),
});

const resumeSuggestionsSchema = z.object({
  resumeContent: z.string().min(1),
  jobDescription: z.string().min(1),
});

// Parse job description (with mock data fallback)
router.post('/parse-job', async (req: Request, res: Response) => {
  try {
    const { jobDescription } = parseJobSchema.parse(req.body);

    // TODO: Integrate with OpenAI API
    // For now, return mock data
    const mockInsight = {
      requiredSkills: [
        'JavaScript',
        'React',
        'TypeScript',
        'Express.js',
        'MongoDB',
      ],
      suggestedExperience: '3-5 years',
      seniority: 'Mid-level',
    };

    res.json(mockInsight);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get resume suggestions (with mock data fallback)
router.post('/resume-suggestions', async (req: Request, res: Response) => {
  try {
    const { resumeContent, jobDescription } = resumeSuggestionsSchema.parse(req.body);

    // TODO: Integrate with OpenAI API
    // For now, return mock data
    const mockSuggestions = [
      {
        section: 'Skills',
        suggestion: 'Add JavaScript and React to your technical skills',
        reason: 'These are key requirements for this role',
      },
      {
        section: 'Experience',
        suggestion: 'Highlight any full-stack development experience',
        reason: 'The role requires both frontend and backend skills',
      },
    ];

    res.json(mockSuggestions);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
