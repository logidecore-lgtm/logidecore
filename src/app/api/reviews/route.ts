import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('categorySlug');

    const reviews = await db.reviewScreenshot.findMany({
      where: categoryId || categorySlug
        ? {
            OR: [
              categoryId ? { categoryId } : undefined,
              categorySlug ? { category: { slug: categorySlug } } : undefined,
              { categoryId: null }, // Include global reviews as fallback
            ].filter(Boolean) as any,
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching review screenshots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { imageUrl, cloudinaryPublicId, categoryId } = await req.json();

    if (!imageUrl || !cloudinaryPublicId) {
      return NextResponse.json({ error: 'Image URL and Cloudinary Public ID are required' }, { status: 400 });
    }

    const review = await db.reviewScreenshot.create({
      data: {
        imageUrl,
        cloudinaryPublicId,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error('Error creating review screenshot:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Verify it exists
    const review = await db.reviewScreenshot.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: 'Review screenshot not found' }, { status: 404 });
    }

    // Delete record
    await db.reviewScreenshot.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review screenshot:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
