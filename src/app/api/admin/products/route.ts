import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await db.product.findMany({
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        materials: { orderBy: { sortOrder: 'asc' } },
        category: true,
        frameConfigs: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Admin fetch products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      categoryId,
      name,
      slug,
      shortDescription,
      description,
      sku,
      basePrice,
      comparePrice,
      isActive,
      isFeatured,
      images,     // array of { imageUrl, cloudinaryPublicId, isThumbnail, sortOrder }
      variants,   // array of { size, thickness, price, comparePrice, stock, sku }
      materials,  // array of { title, description }
      frameConfigs,
    } = body;

    // Basic validation
    if (!categoryId || !name || !slug || !sku || !basePrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create product and nested models
    const runWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err: any) {
          if (i === retries - 1) throw err;
          // Wait before retrying with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
      throw new Error("Transaction failed after retries");
    };

    const product = await runWithRetry(() => 
      db.$transaction(async (tx: Prisma.TransactionClient) => {
        const p = await tx.product.create({
          data: {
            categoryId,
            name,
            slug,
            shortDescription,
            description,
            sku,
            basePrice,
            comparePrice,
            isActive: isActive ?? true,
            isFeatured: isFeatured ?? false,
          },
        });

        // Create images
        if (images && images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any, idx: number) => ({
              productId: p.id,
              imageUrl: img.imageUrl,
              cloudinaryPublicId: img.cloudinaryPublicId,
              altText: img.altText || `${name} Image ${idx + 1}`,
              sortOrder: img.sortOrder ?? idx,
              isThumbnail: img.isThumbnail ?? (idx === 0),
            })),
          });
        }

        // Create variants
        if (variants && variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId: p.id,
              size: v.size,
              thickness: v.thickness,
              price: v.price,
              comparePrice: v.comparePrice,
              stock: v.stock ?? 0,
              sku: v.sku,
              isActive: true,
            })),
          });
        }

        // Create materials
        if (materials && materials.length > 0) {
          await tx.productMaterial.createMany({
            data: materials.map((m: any, idx: number) => ({
              productId: p.id,
              title: m.title,
              description: m.description,
              sortOrder: idx,
            })),
          });
        }

        // Create frame configs
        if (frameConfigs && frameConfigs.length > 0) {
          await tx.productFrameConfig.createMany({
            data: frameConfigs.map((fc: any) => ({
              productId: p.id,
              size: fc.size,
              frameImageUrl: fc.frameImageUrl,
              aspectRatioWidth: parseFloat(fc.aspectRatioWidth) || 1,
              aspectRatioHeight: parseFloat(fc.aspectRatioHeight) || 1,
              photoAreaLeft: parseFloat(fc.photoAreaLeft) ?? 0,
              photoAreaTop: parseFloat(fc.photoAreaTop) ?? 0,
              photoAreaWidth: parseFloat(fc.photoAreaWidth) ?? 100,
              photoAreaHeight: parseFloat(fc.photoAreaHeight) ?? 100,
              enabled: fc.enabled ?? true,
            })),
          });
        }

        return p;
      }, {
        timeout: 15000, // Wait for transaction completion
        maxWait: 10000,  // Wait for pool connection allocation
      })
    );

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
