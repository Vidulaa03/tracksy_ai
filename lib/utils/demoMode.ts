/**
 * Demo Mode Utilities
 * Provides mock data and fallback responses when database is not configured
 * Remove these functions once MONGODB_URI is set up
 */

import { NextResponse } from 'next/server';

export function isDemoMode(): boolean {
  return !process.env.MONGODB_URI;
}

export function getDemoUser() {
  return {
    id: 'demo-user-123',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  };
}

export function getUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: isDemoMode()
        ? 'Demo mode: Database not configured. Set MONGODB_URI in .env.local to enable full functionality.'
        : 'Unauthorized',
    },
    { status: isDemoMode() ? 503 : 401 }
  );
}

export function getServiceUnavailableResponse(message?: string) {
  return NextResponse.json(
    {
      success: false,
      message: message || 'Database service is not configured. Please set MONGODB_URI in .env.local',
      demoMode: true,
    },
    { status: 503 }
  );
}
