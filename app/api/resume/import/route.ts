import { NextRequest, NextResponse } from 'next/server';
import { importResume } from '@/lib/resume-import';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.name.toLowerCase().split('.').pop();
    if (fileType !== 'pdf' && fileType !== 'docx') {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX' },
        { status: 400 }
      );
    }

    // Import resume
    const resumeData = await importResume(file);

    return NextResponse.json({
      success: true,
      resumeData,
      message: 'Resume imported successfully'
    });
  } catch (error) {
    console.error('Resume import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import resume' },
      { status: 500 }
    );
  }
}
