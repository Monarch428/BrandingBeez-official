import { useEffect, useMemo, useState } from "react";

export function LazyYouTube({
  videoId,
  className = "",
  aspectRatio = "16/9",
  thumbnailQuality = "hqdefault",

  // ✅ Defaults set here
  autoplay = true,
  mute = true,
  startAt = 0,
  loop = false,
  controls = true,

  privacyEnhanced = true,
  preloadOnHover = true,
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

  privacyEnhanced?: boolean;
  preloadOnHover?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  // ✅ Autoplay requires muted video in modern browsers
  const effectiveMute = autoplay ? true : mute;

  // ✅ Auto-load iframe if autoplay is enabled
  useEffect(() => {
    if (autoplay) setLoaded(true);
  }, [autoplay]);

  if (!videoId) return null;

  const params = useMemo(() => {
    const p = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: effectiveMute ? "1" : "0",
      start: startAt > 0 ? String(startAt) : "0",
      controls: controls ? "1" : "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      iv_load_policy: "3",
      fs: "1",
    });

    if (loop) {
      p.set("loop", "1");
      p.set("playlist", videoId);
    }

    return p;
  }, [autoplay, effectiveMute, startAt, controls, loop, videoId]);

  const embedHost = privacyEnhanced
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com";

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
          onMouseEnter={() => preloadOnHover && setLoaded(true)}
          onFocus={() => preloadOnHover && setLoaded(true)}
          className="absolute inset-0 group"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* ▶ Play overlay (still useful if autoplay blocked) */}
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
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
          src={`${embedHost}/embed/${videoId}?${params.toString()}`}
          title="YouTube video"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
