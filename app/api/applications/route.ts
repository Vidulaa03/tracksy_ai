import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import JobApplication from '@/lib/models/JobApplication';
import { getCurrentUser } from '@/lib/auth';
import { validateJobApplication } from '@/lib/utils/validation';
import { isDemoMode, getServiceUnavailableResponse } from '@/lib/utils/demoMode';

export async function GET(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return getServiceUnavailableResponse();
    }

    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const applications = await JobApplication.find({ userId: user.userId }).sort({ applicationDate: -1 });

    return NextResponse.json(
      {
        success: true,
        data: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch applications',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return getServiceUnavailableResponse();
    }

    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, companyName, description, notes } = await request.json();

    // Validate input
    const validationErrors = validateJobApplication(jobTitle, companyName, description);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Create new application
    const application = new JobApplication({
      userId: user.userId,
      jobTitle,
      companyName,
      description,
      notes,
      status: 'applied',
      applicationDate: new Date(),
    });

    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Application created successfully',
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create application',
      },
      { status: 500 }
    );
  }
}
