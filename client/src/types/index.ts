export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface JobApplication {
  _id: string;
  userId: string;
  companyName: string;
  position: string;
  description: string;
  status: 'applied' | 'interviewing' | 'accepted' | 'rejected';
  appliedDate: string;
  lastUpdated: string;
  notes: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JobInsight {
  requiredSkills: string[];
  suggestedExperience: string;
  seniority: string;
}

export interface ResumeSuggestion {
  section: string;
  suggestion: string;
  reason: string;
}
