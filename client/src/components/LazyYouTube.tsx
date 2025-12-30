import { useState } from "react";

export function LazyYouTube({
  videoId,
  className = "",
  aspectRatio = "16/9",
  thumbnailQuality = "hqdefault",
}: {
  videoId: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3";
  thumbnailQuality?: "hqdefault" | "mqdefault" | "sddefault";
}) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black ${className}`}
      style={{
        aspectRatio,
      }}
    >
      {!loaded ? (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => setLoaded(true)}
          className="absolute inset-0 group"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Play Button */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-[#ee4962] ml-1"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
