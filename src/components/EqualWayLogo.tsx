import React, { useState } from 'react';

interface EqualWayLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColorVariant?: 'default' | 'white';
}

export const EqualWayLogo: React.FC<EqualWayLogoProps> = ({
  className = '',
  size = 46,
  showText = true,
  textColorVariant = 'default',
}) => {
  const [imageError, setImageError] = useState(false);

  // If the user uploaded logo image is available and text is requested, render the exact crisp brand asset
  if (showText && !imageError) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/logo_equal_way.png"
          alt="EqualWay"
          className="h-10 sm:h-11 w-auto object-contain"
          style={{ maxHeight: typeof size === 'number' ? Math.max(38, size) : size }}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Standalone emblem / fallback vector with the exact matching brand palette
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem: Navy OK Sign Hand with 3 Teal Radiance Bursts */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Navy Blue OK Sign Hand Body */}
        <path
          d="M 28 108 L 44 122 C 48 126 56 126 62 121 L 67 117 C 78 108 85 96 85 82 C 85 64 71 50 53 50 C 47 50 42 52 38 55 L 36 28 C 36 22 32 18 26 18 C 21 18 17 22 17 28 L 17 62 C 16 62 14 62 13 64 C 8 68 8 74 12 79 L 24 95 L 28 108 Z"
          fill="#0B2545"
        />
        {/* Middle Finger Extended Up */}
        <path
          d="M 37 54 L 37 20 C 37 14 42 10 47 10 C 52 10 57 14 57 20 L 57 52 C 53 53 47 54 37 54 Z"
          fill="#0B2545"
        />
        {/* Ring Finger Extended Up */}
        <path
          d="M 57 52 L 57 26 C 57 20 62 16 67 16 C 72 16 77 20 77 26 L 77 58 C 71 55 64 53 57 52 Z"
          fill="#0B2545"
        />
        {/* Pinky Finger Extended Up */}
        <path
          d="M 77 58 L 77 36 C 77 30 81 26 86 26 C 91 26 95 30 95 36 L 95 69 C 90 64 84 60 77 58 Z"
          fill="#0B2545"
        />
        {/* Thumb curving to meet Index Finger tip forming the circle */}
        <path
          d="M 54 50 C 72 50 86 64 86 82 C 86 96 76 108 62 110 C 50 112 38 104 35 92 C 32 80 39 68 49 60 C 51 58 53 54 54 50 Z"
          fill="#0B2545"
        />

        {/* Circular Opening of OK hand sign (Hole) */}
        <circle cx="60" cy="80" r="14" fill={textColorVariant === 'white' ? '#0B2545' : '#FFFFFF'} />

        {/* 3 Teal Radiance Lines on the right of the OK circle */}
        <line x1="88" y1="62" x2="104" y2="52" stroke="#00B49F" strokeWidth="6.5" strokeLinecap="round" />
        <line x1="91" y1="78" x2="110" y2="78" stroke="#00B49F" strokeWidth="6.5" strokeLinecap="round" />
        <line x1="88" y1="94" x2="104" y2="104" stroke="#00B49F" strokeWidth="6.5" strokeLinecap="round" />
      </svg>

      {/* Brand Typography: Equal in Deep Navy + Way in Teal */}
      {showText && (
        <div className="flex items-center tracking-tight leading-none text-2xl sm:text-3xl font-black font-heading">
          <span className={textColorVariant === 'white' ? 'text-white' : 'text-[#0B2545]'}>
            Equal
          </span>
          <span className="text-[#00B49F]">
            Way
          </span>
        </div>
      )}
    </div>
  );
};
