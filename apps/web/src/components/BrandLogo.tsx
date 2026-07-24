'use client';

import { useState } from 'react';

interface BrandLogoProps {
  title: string;
  logoUrl?: string;
}

export default function BrandLogo({ title, logoUrl }: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasLogo = Boolean(logoUrl) && !imageFailed;

  return (
    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white">
      {!hasLogo ? <span>{String(title).charAt(0)}</span> : null}
      {hasLogo ? (
        <img
          src={logoUrl}
          alt={`${title} logo`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : null}
    </div>
  );
}
