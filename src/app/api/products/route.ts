import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const isFeatured = searchParams.get('featured');

    const whereClause: any = { isActive: true };

    if (isFeatured === 'true') {
      whereClause.isFeatured = true;
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    const products = await db.product.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
        },
        materials: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
