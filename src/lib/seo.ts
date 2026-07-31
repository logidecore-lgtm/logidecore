import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description: string;
  slug?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

export function generateSeoMetadata({
  title,
  description,
  slug = '',
  ogImage = '/og-image.jpg',
  type = 'website',
  keywords = ['Logidecore', 'Acrylic Frames', 'Personalized Decor', 'Bespoke Art'],
}: SeoProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://logidecore.com';
  const canonicalUrl = `${siteUrl}${slug ? `/${slug}` : ''}`;
  const fullTitle = `${title} | Logidecore`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Logidecore',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  sku: string;
  reviewsCount?: number;
  ratingValue?: number;
  availability?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://logidecore.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: siteUrl,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.availability || 'https://schema.org/InStock',
    },
    ...(product.ratingValue && product.reviewsCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewsCount,
          },
        }
      : {}),
  };
}

export function generateOrgSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://logidecore.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Logidecore',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://www.instagram.com/logidecore',
      'https://www.facebook.com/logidecore',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-99999-99999',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };
}
