/**
 * Cloudinary Media Helper Utility
 */

export function getOptimizedImageUrl(url: string, options: { width?: number; height?: number; quality?: string | number } = {}) {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  // Split url to inject options
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformations: string[] = ['f_auto', 'q_auto'];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);

  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
}

export async function uploadToCloudinary(fileBuffer: Buffer | string, filename: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary environment variables missing. Returning fallback simulation URL.');
    // Simulated delay & mock URL for development
    await new Promise((r) => setTimeout(r, 800));
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800`;
  }

  // Server-side upload via fetch and manual signature calculation for absolute zero dependencies
  const timestamp = Math.round(Date.now() / 1000).toString();
  
  // Dynamic import of crypto to calculate HMAC SHA1 signature
  const crypto = await import('crypto');
  const signatureString = `public_id=${filename}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

  const formData = new FormData();
  
  // If base64 string, append directly. Otherwise construct blob from Buffer.
  if (typeof fileBuffer === 'string') {
    formData.append('file', fileBuffer);
  } else {
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append('file', blob);
  }

  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('public_id', filename);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const result = await response.json();
  return result.secure_url;
}
