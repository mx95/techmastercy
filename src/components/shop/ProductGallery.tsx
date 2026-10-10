"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const safe = images.length ? images : ["/images/brand/logo-wordmark-on-light.png"];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-background-soft">
        <Image
          src={safe[active] || safe[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {safe.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safe.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border ${
                index === active ? "border-accent" : "border-white/10"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
