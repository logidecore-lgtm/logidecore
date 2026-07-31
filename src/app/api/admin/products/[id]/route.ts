import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        materials: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Admin fetch product detail error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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
      images,
      variants,
      materials,
    } = body;

    const updated = await db.$transaction(async (tx) => {
      // Update product
      const p = await tx.product.update({
        where: { id },
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

      // Sync Images: Drop old, insert new
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            imageUrl: img.imageUrl,
            cloudinaryPublicId: img.cloudinaryPublicId,
            altText: img.altText || `${name} Image ${idx + 1}`,
            sortOrder: img.sortOrder ?? idx,
            isThumbnail: img.isThumbnail ?? (idx === 0),
          })),
        });
      }

      // Sync Variants: Drop old, insert new
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
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

      // Sync Materials: Drop old, insert new
      await tx.productMaterial.deleteMany({ where: { productId: id } });
      if (materials && materials.length > 0) {
        await tx.productMaterial.createMany({
          data: materials.map((m: any, idx: number) => ({
            productId: id,
            title: m.title,
            description: m.description,
            sortOrder: idx,
          })),
        });
      }

      return p;
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Admin update product error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Delete product (cascades variants, images, and materials)
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin delete product error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
