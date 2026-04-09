import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import JobApplication from '@/lib/models/JobApplication';
import { getCurrentUser } from '@/lib/auth';
import { validateJobApplication } from '@/lib/utils/validation';
import mongoose from 'mongoose';
import { isDemoMode, getServiceUnavailableResponse } from '@/lib/utils/demoMode';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (isDemoMode()) {
      return getServiceUnavailableResponse();
    }

    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const application = await JobApplication.findById(id);

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    if (application.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch application',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (isDemoMode()) {
      return getServiceUnavailableResponse();
    }

    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const { jobTitle, companyName, description, status, notes } = await request.json();

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

    const application = await JobApplication.findById(id);

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    if (application.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Update fields
    application.jobTitle = jobTitle;
    application.companyName = companyName;
    application.description = description;
    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;

    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Application updated successfully',
        data: application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update application',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (isDemoMode()) {
      return getServiceUnavailableResponse();
    }

    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const application = await JobApplication.findById(id);

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    if (application.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    await JobApplication.deleteOne({ _id: id });

    return NextResponse.json(
      {
        success: true,
        message: 'Application deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete application',
      },
      { status: 500 }
    );
  }
}
