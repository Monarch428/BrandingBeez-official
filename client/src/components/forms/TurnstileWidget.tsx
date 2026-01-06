import React, { useEffect, useRef } from "react";

type Props = {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

type TurnstileApi = {
  render: (el: Element, opts: any) => string | number;
  remove?: (id: string | number) => void;
  reset?: (id: string | number) => void;
};

type WinWithTurnstile = Window & { turnstile?: TurnstileApi };

export function TurnstileWidget({
  siteKey,
  onToken,
  onExpire,
  onError,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  // ✅ keep latest callbacks without re-rendering widget
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as WinWithTurnstile;

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        if (w.turnstile) return resolve();

        const existing = document.querySelector(
          'script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]'
        ) as HTMLScriptElement | null;

        if (existing) {
          const t = setInterval(() => {
            if (w.turnstile) {
              clearInterval(t);
              resolve();
            }
          }, 50);

          const timeout = setTimeout(() => {
            clearInterval(t);
            reject(new Error("Turnstile script load timeout"));
          }, 8000);

          existing.addEventListener("load", () => {
            clearTimeout(timeout);
            clearInterval(t);
            resolve();
          });

          return;
        }

        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Turnstile script failed to load"));
        document.head.appendChild(script);
      });

    let cancelled = false;

    const renderWidget = async () => {
      try {
        await ensureScript();
        if (cancelled) return;
        if (!containerRef.current) return;
        if (!w.turnstile?.render) throw new Error("Turnstile not available on window");

        // ✅ IMPORTANT: only remove+render if there is already a widget and siteKey changed
        if (widgetIdRef.current !== null && w.turnstile.remove) {
          try {
            w.turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }

        widgetIdRef.current = w.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onErrorRef.current?.(),
        });
      } catch (e) {
        console.error(e);
        onErrorRef.current?.();
      }
    };

    renderWidget();

    return () => {
      cancelled = true;
      try {
        if (widgetIdRef.current !== null && (window as WinWithTurnstile).turnstile?.remove) {
          (window as WinWithTurnstile).turnstile!.remove!(widgetIdRef.current);
        }
      } catch {}
      widgetIdRef.current = null;
    };
    // ✅ only depend on siteKey so it doesn't re-render constantly
  }, [siteKey]);

  return <div ref={containerRef} className={className} />;
}
