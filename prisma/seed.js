const { Client } = require('d:/logidecore/node_modules/pg');
const crypto = require('crypto');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is required to seed the database.');
}
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

function hashPassword(password) {
  const jwtSecret = process.env.JWT_SECRET || 'super-secret-luxury-key-1234567890';
  return crypto.createHash('sha256').update(password + jwtSecret).digest('hex');
}

// Function to upload an image from a URL to Cloudinary
async function uploadUrlToCloudinary(imageUrl, folder = 'seed') {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables are missing');
    }
    const timestamp = Math.round(Date.now() / 1000).toString();
    
    // Sort parameters alphabetically: folder, then timestamp
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (err) {
    console.error(`Cloudinary upload failed for ${imageUrl}, falling back. Error:`, err.message);
    // Fallback if network fails during seeding
    return {
      url: imageUrl,
      publicId: `fallback_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
}

async function main() {
  // 1. Define Category Seed Data
  const categoriesToSeed = [
    {
      id: 'cat_acrylic_frames',
      name: 'Acrylic Photo Frames',
      slug: 'acrylic-photo-frames',
      description: 'Luxury bespoke acrylic photo frames with high-definition prints.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'cat_uv_frames',
      name: 'UV Printed Frames',
      slug: 'uv-printed-frames',
      description: 'Premium UV-cured prints on acrylic or wood substrates.',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'cat_name_plates',
      name: 'House Name Plates',
      slug: 'house-name-plates',
      description: 'Designer acrylic and wood name plates for homes and offices.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'cat_car_frames',
      name: 'Car Frames',
      slug: 'car-frames',
      description: 'Dashboard and rearview mirror custom hanging acrylic photo frames.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'cat_canvas_prints',
      name: 'Canvas Prints',
      slug: 'canvas-prints',
      description: 'High-quality poly-cotton textured canvas prints with wooden frames.',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
    }
  ];

  // 2. Define Product Seed Data
  const productsToSeed = [
    {
      id: 'prod_acrylic_portrait',
      categoryId: 'cat_acrylic_frames',
      name: 'Acrylic Portrait Photo Print',
      slug: 'acrylic-portrait-photo-print',
      shortDescription: 'Our signature premium Acrylic Photo Frames deliver stunning depth, vibrant high-definition colors.',
      description: 'Our signature premium Acrylic Photo Frames deliver stunning depth, vibrant high-definition colors, and a clean modern aesthetic that looks floating on any architectural space. Handcrafted with museum-grade acrylic sheet and premium backing.',
      sku: 'ACRY-PORT-PRINT-01',
      basePrice: 599.00,
      comparePrice: 1199.00,
      images: [
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800'
      ],
      variants: [
        { size: '8"x12" (A4)', thickness: '3mm', price: 599.00, comparePrice: 1199.00, sku: 'ACRY-812-3MM', stock: 100 },
        { size: '8"x12" (A4)', thickness: '5mm', price: 699.00, comparePrice: 1399.00, sku: 'ACRY-812-5MM', stock: 100 },
        { size: '12"x18" (A3)', thickness: '3mm', price: 999.00, comparePrice: 1999.00, sku: 'ACRY-1218-3MM', stock: 100 },
        { size: '12"x18" (A3)', thickness: '5mm', price: 1199.00, comparePrice: 2399.00, sku: 'ACRY-1218-5MM', stock: 100 },
        { size: '18"x24" (A2)', thickness: '3mm', price: 1599.00, comparePrice: 2999.00, sku: 'ACRY-1824-3MM', stock: 50 }
      ],
      materials: [
        { title: 'Museum Grade Acrylic', description: 'Ultra-clear thick polished acrylic sheet for glass-like finish.' },
        { title: 'HD Printing', description: 'Printed on professional photo paper using premium pigment inks.' },
        { title: 'Laser Cut Finish', description: 'CNC laser cut edges for crystal clear, smooth polished sides.' }
      ]
    },
    {
      id: 'prod_house_plate',
      categoryId: 'cat_name_plates',
      name: 'Bespoke House Name Plate',
      slug: 'bespoke-house-name-plate',
      shortDescription: 'Designer name plates for your home entryway.',
      description: 'Create a lasting first impression with our custom designer house name plates. Made with weather-resistant premium acrylic and direct UV printing for maximum outdoor durability.',
      sku: 'PLATE-HOUSE-01',
      basePrice: 1499.00,
      comparePrice: 2999.00,
      images: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
      ],
      variants: [
        { size: '12"x18" (A3)', thickness: '5mm', price: 1499.00, comparePrice: 2999.00, sku: 'PLATE-1218-5MM', stock: 80 },
        { size: '18"x24" (A2)', thickness: '5mm', price: 2499.00, comparePrice: 4999.00, sku: 'PLATE-1824-5MM', stock: 50 }
      ],
      materials: [
        { title: 'Weatherproof Acrylic', description: 'Outdoor grade UV resistant acrylic that doesn\'t fade in sun or rain.' },
        { title: 'Stainless Steel Studs', description: 'Comes with heavy-duty metallic wall mounting studs.' }
      ]
    },
    {
      id: 'prod_car_frame',
      categoryId: 'cat_car_frames',
      name: 'Premium Car Interior Frame',
      slug: 'premium-car-interior-frame',
      shortDescription: 'Personalized hanging frame for car dashboard or mirror.',
      description: 'Take your loved ones wherever you go. Custom printed dual-sided acrylic mini frames with premium hanging thread, perfect for car interiors.',
      sku: 'CAR-INT-01',
      basePrice: 349.00,
      comparePrice: 699.00,
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'
      ],
      variants: [
        { size: '2x3 inches', thickness: '3mm', price: 349.00, comparePrice: 699.00, sku: 'CAR-23-3MM', stock: 200 }
      ],
      materials: [
        { title: 'Dual Sided Acrylic', description: '3mm thick acrylic sandwich structure with high-res photos printed on both sides.' }
      ]
    }
  ];

  console.log('Phase 1: Uploading assets to Cloudinary...');
  
  // Upload Category Images
  const categoryImagesMap = {};
  for (const cat of categoriesToSeed) {
    console.log(`Uploading cover image for category: ${cat.name}...`);
    const result = await uploadUrlToCloudinary(cat.image, 'categories');
    categoryImagesMap[cat.id] = result;
    console.log(`Uploaded cover for category: ${cat.name} => ${result.url}`);
  }

  // Upload Product Images
  const productImagesMap = {};
  for (const p of productsToSeed) {
    productImagesMap[p.id] = [];
    for (let i = 0; i < p.images.length; i++) {
      console.log(`Uploading image ${i + 1} of ${p.images.length} for product: ${p.name}...`);
      const result = await uploadUrlToCloudinary(p.images[i], 'products');
      productImagesMap[p.id].push(result);
      console.log(`Uploaded image ${i + 1} => ${result.url}`);
    }
  }

  console.log('Phase 2: Connecting to database...');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log('Connected to database!');

  try {
    // A. Seed Admin
    console.log('Seeding admin...');
    const adminId = 'admin_' + Math.random().toString(36).substr(2, 9);
    const adminEmail = 'admin@logidecore.com';
    const adminPasswordHash = hashPassword('admin123');
    
    const adminCheck = await client.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      await client.query(
        'INSERT INTO admins (id, name, email, password) VALUES ($1, $2, $3, $4)',
        [adminId, 'Logidecore Admin', adminEmail, adminPasswordHash]
      );
      console.log('Admin seeded.');
    } else {
      console.log('Admin already exists.');
    }

    // B. Seed Categories
    console.log('Seeding categories into database...');
    for (const cat of categoriesToSeed) {
      const catCheck = await client.query('SELECT id FROM categories WHERE slug = $1', [cat.slug]);
      if (catCheck.rows.length === 0) {
        const clResult = categoryImagesMap[cat.id];
        await client.query(
          'INSERT INTO categories (id, name, slug, description, image) VALUES ($1, $2, $3, $4, $5)',
          [cat.id, cat.name, cat.slug, cat.description, clResult.url]
        );
        console.log(`Category "${cat.name}" inserted.`);
      } else {
        console.log(`Category "${cat.name}" already exists.`);
      }
    }

    // C. Seed Products
    console.log('Seeding products, variants, and materials into database...');
    for (const p of productsToSeed) {
      const prodCheck = await client.query('SELECT id FROM products WHERE slug = $1', [p.slug]);
      if (prodCheck.rows.length === 0) {
        // Insert Product
        await client.query(
          `INSERT INTO products (id, category_id, name, slug, short_description, description, sku, base_price, compare_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [p.id, p.categoryId, p.name, p.slug, p.shortDescription, p.description, p.sku, p.basePrice, p.comparePrice]
        );

        // Insert Uploaded Images
        const uploadedImages = productImagesMap[p.id];
        for (let i = 0; i < uploadedImages.length; i++) {
          const imgInfo = uploadedImages[i];
          const imgId = `img_${p.id}_${i}`;
          const isThumbnail = i === 0;

          await client.query(
            `INSERT INTO product_images (id, product_id, cloudinary_public_id, image_url, alt_text, sort_order, is_thumbnail)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [imgId, p.id, imgInfo.publicId, imgInfo.url, `${p.name} Image ${i + 1}`, i, isThumbnail]
          );
        }

        // Insert Product Variants
        for (const v of p.variants) {
          const variantId = `var_${Math.random().toString(36).substr(2, 9)}`;
          await client.query(
            `INSERT INTO product_variants (id, product_id, size, thickness, price, compare_price, sku, stock)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [variantId, p.id, v.size, v.thickness, v.price, v.comparePrice, v.sku, v.stock]
          );
        }

        // Insert Product Materials
        for (let i = 0; i < p.materials.length; i++) {
          const mat = p.materials[i];
          const matId = `mat_${Math.random().toString(36).substr(2, 9)}`;
          await client.query(
            `INSERT INTO product_materials (id, product_id, title, description, sort_order)
             VALUES ($1, $2, $3, $4, $5)`,
            [matId, p.id, mat.title, mat.description, i]
          );
        }

        console.log(`Product "${p.name}" inserted.`);
      } else {
        console.log(`Product "${p.name}" already exists.`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during database insert seeding:', err);
  } finally {
    await client.end();
  }
}

// main();
