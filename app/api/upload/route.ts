import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
};

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `${file.name} exceeds the maximum size of 100MB`,
          },
          { status: 400 }
        );
      }

      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        return NextResponse.json(
          {
            error: `Unsupported file type: ${file.type}`,
          },
          { status: 400 }
        );
      }

      const extension = MIME_TO_EXT[file.type];

      if (!extension) {
        return NextResponse.json(
          {
            error: `Unsupported MIME type: ${file.type}`,
          },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const randomString = Math.random()
        .toString(36)
        .substring(2, 15);

      const filename = `${timestamp}-${randomString}.${extension}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase Upload Error:', error);

        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 }
        );
      }

      const { data } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(filename);

      uploadedUrls.push(data.publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error('Upload error:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to upload files',
      },
      { status: 500 }
    );
  }
}