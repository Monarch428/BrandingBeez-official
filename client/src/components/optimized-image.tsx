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
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [currentSrc, setCurrentSrc] = useState<string>("");

  // Normalize image path for consistent handling
  const normalizeImagePath = (imagePath: string): string => {
    if (!imagePath) return "";

    // Don’t modify external URLs or data URLs
    if (
      imagePath.startsWith("http") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("//")
    ) {
      return imagePath;
    }

    // If path already starts with / (public folder), leave it
    if (imagePath.startsWith("/")) {
      return imagePath;
    }

    // Handle attached_assets references
    if (imagePath.includes("attached_assets/")) {
      const filename = imagePath.split("/").pop();
      return `/images/${filename}`;
    }

    // Handle relative assets folder paths
    if (
      imagePath.startsWith("src/assets/") ||
      imagePath.startsWith("assets/")
    ) {
      const filename = imagePath.split("/").pop();
      return `/images/${filename}`;
    }

    // Default: just put inside /images/
    return `/images/${imagePath}`;
  };

  useEffect(() => {
    const normalized = normalizeImagePath(src);
    setCurrentSrc(normalized);
    setImageState("loading");
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn("Image failed to load:", currentSrc);

    // Try fallback source first if provided
    if (fallbackSrc) {
      const normalizedFallback = normalizeImagePath(fallbackSrc);
      if (normalizedFallback !== currentSrc) {
        setCurrentSrc(normalizedFallback);
        return;
      }
    }

    // If no fallback → mark as error
    setImageState("error");
    onError?.(e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState("loaded");
    onLoad?.(e);
  };

  // If image fails completely → show fallback placeholder
  if (imageState === "error") {
    const errorFallback = fallbackSrc || "/images/img_g1.png";
    return (
      <div className="relative overflow-hidden">
        <img
          src={errorFallback}
          alt={alt || "Image not available"}
          className={className}
          loading={loading}
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "100%",
            minHeight: height ? `${height}px` : "200px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading skeleton */}
      {imageState === "loading" && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded flex items-center justify-center z-10"
          style={{
            width: "100%",
            height: "100%",
            minHeight: height ? `${height}px` : "200px",
          }}
        >
          <div className="w-8 h-8 border-3 border-gray-300 border-t-brand-purple rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${imageState === "loaded" ? "opacity-100" : "opacity-0"} transition-opacity duration-500 ease-in-out`}
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
