import { useEffect, useMemo, useRef, useState } from "react";

export function LazyYouTube({
  videoId,
  className = "",
  aspectRatio = "16/9",
  thumbnailQuality = "hqdefault",

  autoplay = true, // ✅ default autoplay ON
  mute = true,
  startAt = 0,
  loop = false,
  controls = true,

  privacyEnhanced = true,
  preloadOnHover = true,

  eagerIframeOnAutoplay = true, // ✅ when autoplay default ON, make this ON too
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
  eagerIframeOnAutoplay?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [userUnmuted, setUserUnmuted] = useState(false);
  const preconnectedRef = useRef(false);

  if (!videoId) return null;

  const embedHost = privacyEnhanced
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com";

  // ✅ Autoplay with sound is blocked in most browsers, so enforce mute on autoplay
  const effectiveMute = autoplay ? (userUnmuted ? false : true) : mute;

  const params = useMemo(() => {
    const p = new URLSearchParams({
      autoplay: loaded && autoplay ? "1" : "0",
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
  }, [loaded, autoplay, effectiveMute, startAt, controls, loop, videoId]);

  const preconnect = () => {
    if (preconnectedRef.current) return;
    preconnectedRef.current = true;

    const links: Array<{ rel: string; href: string; crossOrigin?: string }> = [
      { rel: "preconnect", href: embedHost, crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://i.ytimg.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.google.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.gstatic.com", crossOrigin: "anonymous" },
    ];

    links.forEach(({ rel, href, crossOrigin }) => {
      if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
  };

  // ✅ If autoplay + eager, load iframe immediately so autoplay works
  useEffect(() => {
    if (autoplay && eagerIframeOnAutoplay) {
      preconnect();
      setLoaded(true);
    }
  }, [autoplay, eagerIframeOnAutoplay]);

  const thumbnailSrc = `https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => preloadOnHover && preconnect()}
      onFocus={() => preloadOnHover && preconnect()}
    >
      {!loaded ? (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => {
            preconnect();
            setLoaded(true);
          }}
          className="absolute inset-0 group"
        >
          <img
            src={thumbnailSrc}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />

          {/* ▶ Play overlay */}
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
        <div className="absolute inset-0">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${embedHost}/embed/${videoId}?${params.toString()}`}
            title="YouTube video"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* ✅ Unmute button (needed because autoplay starts muted) */}
          {autoplay && !userUnmuted && (
            <button
              type="button"
              onClick={() => setUserUnmuted(true)}
              className="absolute bottom-3 left-3 z-10 bg-black/70 text-white text-sm px-3 py-2 rounded-md hover:bg-black/80"
              aria-label="Unmute video"
            >
              Unmute
            </button>
          )}
        </div>
      )}
    </div>
  );
}
