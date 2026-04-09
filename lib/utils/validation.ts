export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }

  return errors;
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
}

export function validateName(name: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  return errors;
}

export function validateSignUp(email: string, password: string, name: string): ValidationError[] {
  const errors: ValidationError[] = [];
  errors.push(...validateEmail(email));
  errors.push(...validatePassword(password));
  errors.push(...validateName(name));
  return errors;
}

export function validateJobApplication(jobTitle: string, companyName: string, description: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!jobTitle || jobTitle.trim().length === 0) {
    errors.push({ field: 'jobTitle', message: 'Job title is required' });
  }

  if (!companyName || companyName.trim().length === 0) {
    errors.push({ field: 'companyName', message: 'Company name is required' });
  }

  if (!description || description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Job description is required' });
  }

  return errors;
}
