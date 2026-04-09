export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  resume?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'applied' | 'interviewing' | 'accepted' | 'rejected';

export interface JobApplication {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  status: JobStatus;
  description: string;
  applicationDate: string;
  notes?: string;
  parsedData?: {
    keyRequirements?: string[];
    skills?: string[];
    experience?: string;
    salaryRange?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ParseJobResponse {
  success: boolean;
  parsedData?: {
    keyRequirements: string[];
    skills: string[];
    experience: string;
    salaryRange: string;
  };
  message: string;
}

export interface ResumesuggestionResponse {
  success: boolean;
  suggestions?: {
    keySkills: string[];
    recommendedChanges: string[];
    strengthAreas: string[];
  };
  message: string;
}
