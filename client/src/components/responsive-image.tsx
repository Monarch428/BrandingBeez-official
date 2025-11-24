import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  // Normalize path
  const normalizeImagePath = (imagePath: string): string => {
    if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('//')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    return `/images/${imagePath}`;
  };

  const normalizedSrc = normalizeImagePath(src);
  const basePath = normalizedSrc.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const extension = normalizedSrc.match(/\.(png|jpg|jpeg|webp)$/i)?.[1] || 'jpg';

  // Generate WebP and fallback sources
  const webpSrc = `${basePath}.webp`;
  const originalSrc = extension === 'webp' ? normalizedSrc : `${basePath}.${extension}`;

  return (
    <picture className={className}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={originalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        decoding="async"
        className="w-full h-auto object-cover"
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
      />
    </picture>
  );
};