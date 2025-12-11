import React, { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  onError?: (error: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  fallbackSrc,
  width,
  height,
  loading = "lazy",
  onError,
  onLoad,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // 🔁 Keep currentSrc in sync when `src` prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasTriedFallback(false);
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn("OptimizedImage failed to load:", currentSrc);

    // Try fallback ONLY once if provided
    if (!hasTriedFallback && fallbackSrc) {
      setHasTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      return;
    }

    onError?.(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad?.(e);
  };

  // ❗ IMPORTANT:
  // No path rewriting / normalize logic here.
  // - Imported assets (`import img from "@assets/foo.png"`) already resolve to correct URLs.
  // - Absolute URLs (Cloudinary, etc.) are already correct.
  // - Public assets like "/images/foo.png" also just work.
  // Let the bundler + browser handle it.

  return (
    <div className="relative overflow-hidden">
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onError={handleImageError}
        onLoad={handleImageLoad}
        decoding="async"
        style={{
          maxWidth: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
    </div>
  );
};
