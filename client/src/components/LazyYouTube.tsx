import { useEffect, useState } from "react";

export function LazyYouTube({
  videoId,
  className = "",
  aspectRatio = "16/9",
  thumbnailQuality = "hqdefault",

  // ✅ New customizable options
  autoplay = false,
  mute = false,
  startAt = 0,
  loop = false,
  controls = true,
}: {
  videoId: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3";
  thumbnailQuality?: "hqdefault" | "mqdefault" | "sddefault";

  autoplay?: boolean;
  mute?: boolean;
  startAt?: number;
  loop?: boolean;
  controls?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  // ✅ Auto-load iframe if autoplay is enabled
  useEffect(() => {
    if (autoplay) {
      setLoaded(true);
    }
  }, [autoplay]);

  if (!videoId) return null;

  // Build query params cleanly
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    start: startAt ? String(startAt) : "0",
    controls: controls ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
  });

  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId); // required by YouTube for looping
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black ${className}`}
      style={{ aspectRatio }}
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

          {/* ▶ Play Button */}
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
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          title="YouTube video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
