"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

function subscribe() {
  return () => {};
}

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const safe = images.length ? images : ["/images/brand/logo-wordmark-on-light.png"];
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const go = useCallback(
    (delta: number) => {
      setActive((current) => {
        const next = current + delta;
        if (next < 0) return safe.length - 1;
        if (next >= safe.length) return 0;
        return next;
      });
    },
    [safe.length],
  );

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeLightbox, go, lightboxOpen]);

  useEffect(() => {
    if (lightboxOpen || safe.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, lightboxOpen, safe.length]);

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#f4f7fb] sm:aspect-[4/3]">
        <button
          type="button"
          onClick={openLightbox}
          className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`Open image gallery for ${alt}`}
        >
          <span className="sr-only">Open gallery</span>
        </button>
        <Image
          src={safe[active] || safe[0]}
          alt={`${alt} — image ${active + 1} of ${safe.length}`}
          fill
          className="object-contain p-3 sm:p-5"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          quality={90}
        />

        {safe.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-black/10 bg-white/90 text-lg font-semibold text-[#0b1220] shadow-sm backdrop-blur hover:bg-white"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-black/10 bg-white/90 text-lg font-semibold text-[#0b1220] shadow-sm backdrop-blur hover:bg-white"
              aria-label="Next image"
            >
              ›
            </button>
            <p className="pointer-events-none absolute bottom-2 right-2 z-[2] rounded-md bg-black/55 px-2 py-1 text-xs font-medium text-white">
              {active + 1} / {safe.length}
            </p>
          </>
        ) : null}

        <p className="pointer-events-none absolute bottom-2 left-2 z-[2] rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white">
          Tap to enlarge
        </p>
      </div>

      {safe.length > 1 ? (
        <div
          className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6"
          role="listbox"
          aria-label="Product images"
        >
          {safe.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setActive(index)}
                onDoubleClick={() => {
                  setActive(index);
                  openLightbox();
                }}
                className={`relative aspect-square min-h-16 overflow-hidden rounded-md border bg-[#f4f7fb] transition ${
                  selected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/15 hover:border-white/35"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="96px"
                  quality={75}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {mounted && lightboxOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={closeLightbox}
            >
              <div
                className="relative flex h-full w-full max-w-5xl flex-col"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-white">
                  <p id={titleId} className="min-w-0 truncate text-sm font-medium">
                    {alt}
                    {safe.length > 1 ? ` — ${active + 1} / ${safe.length}` : ""}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeLightbox}
                    className="flex h-11 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>

                <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-[#0b1220]">
                  <Image
                    src={safe[active] || safe[0]}
                    alt={`${alt} — enlarged image ${active + 1} of ${safe.length}`}
                    fill
                    className="object-contain p-2 sm:p-4"
                    sizes="100vw"
                    quality={95}
                    priority
                  />

                  {safe.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70"
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70"
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                </div>

                {safe.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {safe.map((src, index) => {
                      const selected = index === active;
                      return (
                        <button
                          key={`lightbox-${src}-${index}`}
                          type="button"
                          onClick={() => setActive(index)}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-[#f4f7fb] ${
                            selected
                              ? "border-accent ring-2 ring-accent/50"
                              : "border-white/20"
                          }`}
                          aria-label={`Show image ${index + 1}`}
                          aria-current={selected ? "true" : undefined}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
