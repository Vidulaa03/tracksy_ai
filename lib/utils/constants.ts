export const APP_NAME = 'Job Application Tracker';
export const APP_DESCRIPTION = 'AI-assisted job application tracking and resume management';

export const JOB_APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const STATUS_COLORS = {
  applied: 'bg-blue-100 text-blue-800 border-blue-300',
  interviewing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  accepted: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  APPLICATIONS: '/dashboard/applications',
  RESUME: '/dashboard/resume',
} as const;
