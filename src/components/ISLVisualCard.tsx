import React, { useState, useEffect } from 'react';

interface ISLVisualCardProps {
  letter: string;
  variant?: 'photo' | 'sketch';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const ISLVisualCard: React.FC<ISLVisualCardProps> = ({
  letter,
  variant = 'photo',
  size = 'md',
  showLabel = true,
  className = '',
  onClick,
  isActive = false,
}) => {
  const normalizedLetter = (letter || 'A').toUpperCase().charAt(0);
  const isAlpha = /^[A-Z]$/.test(normalizedLetter);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [normalizedLetter, variant]);

  const sizeClasses = {
    xs: 'w-12 h-12 text-xs',
    sm: 'w-16 h-16 sm:w-18 sm:h-18 text-sm',
    md: 'w-24 h-24 sm:w-28 sm:h-28 text-base',
    lg: 'w-36 h-36 sm:w-40 sm:h-40 text-xl',
    xl: 'w-52 h-52 sm:w-64 sm:h-64 text-2xl',
  }[size];

  // Primary rendering uses the user's authentic ISL gesture image when variant is 'photo' or on demand
  const shouldRenderImage = isAlpha && !imageError && variant !== 'sketch';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center rounded-2xl transition-all select-none overflow-hidden bg-white text-gray-900 border ${
        isActive
          ? 'border-[#0072B2] ring-3 ring-[#0072B2]/30 shadow-md scale-102'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`flex items-center justify-center p-1 sm:p-1.5 ${sizeClasses}`}>
        {shouldRenderImage ? (
          <img
            src={`/signs/${normalizedLetter}.png`}
            alt={`ISL sign gesture for letter ${normalizedLetter}`}
            className="w-full h-full object-contain pointer-events-none rounded-lg transition-transform duration-200"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : variant === 'sketch' ? (
          renderSketchSign(normalizedLetter)
        ) : (
          renderPhotoSign(normalizedLetter)
        )}
      </div>

      {showLabel && (
        <div
          className={`w-full py-1 text-center font-black font-heading tracking-wider flex items-center justify-center gap-1 text-xs sm:text-sm border-t transition-colors ${
            isActive
              ? 'bg-[#0072B2] text-white border-[#0072B2]'
              : 'bg-gray-50 text-gray-800 border-gray-100'
          }`}
        >
          <span>{normalizedLetter}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// REALISTIC PHOTO-STYLE VECTOR RENDERING (Matching the 26 ISL Photo Gestures)
// ============================================================================
function renderPhotoSign(letter: string) {
  const defs = (
    <defs>
      <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7D3B6" />
        <stop offset="50%" stopColor="#E5A87B" />
        <stop offset="100%" stopColor="#C97F50" />
      </linearGradient>
      <linearGradient id="skinLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDDFC7" />
        <stop offset="100%" stopColor="#E2A679" />
      </linearGradient>
      <linearGradient id="skinDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D48B59" />
        <stop offset="100%" stopColor="#9C5930" />
      </linearGradient>
      <linearGradient id="sleeve" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#303846" />
        <stop offset="100%" stopColor="#181D24" />
      </linearGradient>
      <radialGradient id="touchGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00E676" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>
  );

  switch (letter) {
    case 'A':
      // Two fists at bottom with thumbs extended up & inwards touching at apex
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeves */}
          <rect x="4" y="68" width="30" height="30" rx="6" fill="url(#sleeve)" />
          <rect x="66" y="68" width="30" height="30" rx="6" fill="url(#sleeve)" />
          {/* Left Fist Body */}
          <ellipse cx="28" cy="62" rx="15" ry="13" fill="url(#skinDark)" />
          <rect x="18" y="52" width="20" height="18" rx="7" fill="url(#skin)" filter="url(#shadow)" />
          {/* Left Thumb pointing up-right */}
          <path d="M 28 54 C 28 44 38 32 48 27 C 52 25 55 28 52 33 C 46 41 40 48 35 56 Z" fill="url(#skinLight)" />
          {/* Right Fist Body */}
          <ellipse cx="72" cy="62" rx="15" ry="13" fill="url(#skinDark)" />
          <rect x="62" y="52" width="20" height="18" rx="7" fill="url(#skin)" filter="url(#shadow)" />
          {/* Right Thumb pointing up-left touching apex */}
          <path d="M 72 54 C 72 44 62 32 52 27 C 48 25 45 28 48 33 C 54 41 60 48 65 56 Z" fill="url(#skinLight)" />
          {/* Apex Touch indicator */}
          <circle cx="50" cy="28" r="4" fill="url(#touchGlow)" />
          <circle cx="50" cy="28" r="2" fill="#00E676" />
        </svg>
      );

    case 'B':
      // Both hands with thumbs & index forming 2 circles touching (oo) + other 3 fingers spread upright
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left hand upright fingers */}
          <line x1="22" y1="16" x2="25" y2="44" stroke="url(#skinLight)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="14" y1="22" x2="20" y2="48" stroke="url(#skinLight)" strokeWidth="4" strokeLinecap="round" />
          <line x1="7" y1="30" x2="16" y2="54" stroke="url(#skin)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Left circle */}
          <circle cx="34" cy="56" r="15" fill="none" stroke="url(#skin)" strokeWidth="7" filter="url(#shadow)" />
          {/* Right hand upright fingers */}
          <line x1="78" y1="16" x2="75" y2="44" stroke="url(#skinLight)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="86" y1="22" x2="80" y2="48" stroke="url(#skinLight)" strokeWidth="4" strokeLinecap="round" />
          <line x1="93" y1="30" x2="84" y2="54" stroke="url(#skin)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Right circle */}
          <circle cx="66" cy="56" r="15" fill="none" stroke="url(#skinLight)" strokeWidth="7" filter="url(#shadow)" />
          {/* Center bridge touch point */}
          <circle cx="50" cy="56" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'C':
      // Single right hand forming a wide open C arc facing left
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Wrist / Sleeve */}
          <rect x="6" y="65" width="28" height="28" rx="5" fill="url(#sleeve)" />
          {/* Palm base */}
          <ellipse cx="32" cy="54" rx="14" ry="16" fill="url(#skinDark)" />
          {/* Upper curved fingers */}
          <path
            d="M 32 44 C 36 26 55 22 72 26 C 76 27 76 33 71 34 C 57 32 46 35 44 46 Z"
            fill="url(#skinLight)"
            filter="url(#shadow)"
          />
          {/* Lower curved thumb */}
          <path
            d="M 32 60 C 36 76 55 80 72 76 C 76 75 76 69 71 68 C 57 70 46 67 44 58 Z"
            fill="url(#skinLight)"
            filter="url(#shadow)"
          />
          {/* Back of hand contour */}
          <path d="M 28 42 C 20 48 20 60 28 66" stroke="url(#skin)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'D':
      // Left vertical index finger + Right hand thumb & index forming D loop
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left sleeve & fist */}
          <rect x="18" y="66" width="26" height="28" rx="6" fill="url(#sleeve)" />
          <ellipse cx="31" cy="62" rx="12" ry="10" fill="url(#skinDark)" />
          {/* Left vertical index */}
          <rect x="27" y="18" width="10" height="52" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Right hand loop forming D curve */}
          <path
            d="M 36 23 C 68 23 82 36 82 50 C 82 64 68 70 36 70"
            fill="none"
            stroke="url(#skin)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          {/* Contact points */}
          <circle cx="36" cy="23" r="2.5" fill="#00E676" />
          <circle cx="36" cy="70" r="2.5" fill="#00E676" />
        </svg>
      );

    case 'E':
      // Left horizontal index + Right index & middle touching left index (3 horizontal prongs)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left hand fist & index pointing right */}
          <rect x="4" y="38" width="22" height="26" rx="6" fill="url(#sleeve)" />
          <rect x="22" y="44" width="34" height="10" rx="5" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Right hand index pointing left (top prong) */}
          <rect x="50" y="32" width="38" height="9" rx="4.5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Right hand middle pointing left (bottom prong) */}
          <rect x="50" y="56" width="38" height="9" rx="4.5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Touch nodes */}
          <circle cx="52" cy="36" r="2.5" fill="#00E676" />
          <circle cx="52" cy="60" r="2.5" fill="#00E676" />
        </svg>
      );

    case 'F':
      // Left 2 fingers (index, middle) pointing up-right + Right 2 fingers pointing up-left crossing at tips
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left pair pointing up-right */}
          <line x1="22" y1="72" x2="48" y2="24" stroke="url(#skinDark)" strokeWidth="6" strokeLinecap="round" />
          <line x1="30" y1="74" x2="56" y2="26" stroke="url(#skin)" strokeWidth="6" strokeLinecap="round" />
          {/* Right pair pointing up-left */}
          <line x1="78" y1="72" x2="52" y2="24" stroke="url(#skinLight)" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="74" x2="44" y2="26" stroke="url(#skinLight)" strokeWidth="6" strokeLinecap="round" />
          {/* Peak contact */}
          <circle cx="50" cy="25" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'G':
      // Two closed fists stacked vertically (top fist resting on bottom fist)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Bottom Fist */}
          <rect x="24" y="52" width="52" height="28" rx="9" fill="url(#skinDark)" filter="url(#shadow)" />
          <line x1="36" y1="52" x2="36" y2="78" stroke="#8D4C20" strokeWidth="2" />
          <line x1="50" y1="52" x2="50" y2="78" stroke="#8D4C20" strokeWidth="2" />
          <line x1="64" y1="52" x2="64" y2="78" stroke="#8D4C20" strokeWidth="2" />
          {/* Top Fist */}
          <rect x="24" y="20" width="52" height="28" rx="9" fill="url(#skinLight)" filter="url(#shadow)" />
          <line x1="36" y1="20" x2="36" y2="46" stroke="#C97F50" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="46" stroke="#C97F50" strokeWidth="2" />
          <line x1="64" y1="20" x2="64" y2="46" stroke="#C97F50" strokeWidth="2" />
          {/* Contact boundary */}
          <line x1="28" y1="50" x2="72" y2="50" stroke="#00E676" strokeWidth="2.5" />
        </svg>
      );

    case 'H':
      // Left flat palm + Right flat hand sweeping diagonally across left palm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left horizontal palm */}
          <path d="M 12 50 C 12 40 40 42 70 46 C 74 47 74 58 70 60 C 40 64 12 62 12 50 Z" fill="url(#skinDark)" />
          {/* Right sweeping palm */}
          <path d="M 44 20 C 54 18 78 36 84 56 C 84 62 76 66 68 62 C 54 50 40 32 44 20 Z" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Motion arrow */}
          <path d="M 76 24 Q 68 38 52 46" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <polygon points="52,42 46,48 54,50" fill="#FFF" />
        </svg>
      );

    case 'I':
      // Single right hand in fist with index finger pointing straight up
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeve */}
          <rect x="30" y="68" width="38" height="28" rx="6" fill="url(#sleeve)" />
          {/* Closed fist */}
          <ellipse cx="49" cy="58" rx="18" ry="15" fill="url(#skinDark)" />
          <rect x="36" y="48" width="26" height="20" rx="7" fill="url(#skin)" filter="url(#shadow)" />
          {/* Upright Index Finger */}
          <rect x="44" y="14" width="11" height="42" rx="5.5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Nail */}
          <ellipse cx="49.5" cy="19" rx="3.5" ry="4" fill="#FFE5D1" />
        </svg>
      );

    case 'J':
      // Left flat palm + Right index tracing a hook/J shape downward into left palm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left palm */}
          <ellipse cx="42" cy="62" rx="30" ry="16" fill="url(#skinDark)" />
          {/* Right hand fist */}
          <rect x="52" y="24" width="24" height="20" rx="6" fill="url(#skin)" />
          {/* J Hook Stroke */}
          <path
            d="M 64 28 L 64 56 C 64 74 46 76 38 68"
            fill="none"
            stroke="url(#skinLight)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          <path d="M 64 36 L 64 54 C 64 66 52 68 46 64" fill="none" stroke="#00E676" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'K':
      // Left index straight up + Right index bent touching left index joint
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left upright index */}
          <rect x="28" y="16" width="10" height="60" rx="5" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Right hand bent finger touching left index */}
          <path
            d="M 76 22 L 56 44 L 38 44"
            fill="none"
            stroke="url(#skinLight)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          {/* Joint contact */}
          <circle cx="38" cy="44" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'L':
      // Single right hand: Index pointing straight up, Thumb pointing horizontally (L shape)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeve */}
          <rect x="18" y="66" width="34" height="28" rx="6" fill="url(#sleeve)" />
          {/* Curled 3 fingers */}
          <ellipse cx="35" cy="58" rx="14" ry="13" fill="url(#skinDark)" />
          {/* Vertical Index Finger */}
          <rect x="29" y="14" width="11" height="52" rx="5.5" fill="url(#skinLight)" filter="url(#shadow)" />
          <ellipse cx="34.5" cy="19" rx="3.5" ry="4" fill="#FFE5D1" />
          {/* Horizontal Thumb */}
          <rect x="32" y="54" width="48" height="11" rx="5.5" fill="url(#skinLight)" filter="url(#shadow)" />
          <ellipse cx="74" cy="59.5" rx="4" ry="3.5" fill="#FFE5D1" />
        </svg>
      );

    case 'M':
      // Left open palm + Right hand 3 fingers pointing down on left palm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left flat palm */}
          <ellipse cx="50" cy="68" rx="36" ry="15" fill="url(#skinDark)" />
          {/* Right hand base */}
          <rect x="30" y="14" width="40" height="18" rx="6" fill="url(#skinDark)" />
          {/* 3 Fingers pointing down */}
          <rect x="32" y="24" width="9" height="46" rx="4.5" fill="url(#skinLight)" filter="url(#shadow)" />
          <rect x="45.5" y="22" width="9" height="48" rx="4.5" fill="url(#skinLight)" filter="url(#shadow)" />
          <rect x="59" y="25" width="9" height="45" rx="4.5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Contact line */}
          <line x1="32" y1="70" x2="68" y2="70" stroke="#00E676" strokeWidth="2.5" />
        </svg>
      );

    case 'N':
      // Left open palm + Right hand 2 fingers pointing down on left palm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left flat palm */}
          <ellipse cx="50" cy="68" rx="36" ry="15" fill="url(#skinDark)" />
          {/* Right hand base */}
          <rect x="34" y="14" width="32" height="18" rx="6" fill="url(#skinDark)" />
          {/* 2 Fingers pointing down */}
          <rect x="38" y="22" width="10" height="48" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          <rect x="52" y="22" width="10" height="48" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Contact line */}
          <line x1="38" y1="70" x2="62" y2="70" stroke="#00E676" strokeWidth="2.5" />
        </svg>
      );

    case 'O':
      // Single right hand fingers curved into circular O
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeve */}
          <rect x="8" y="54" width="26" height="34" rx="6" fill="url(#sleeve)" />
          {/* Palm base */}
          <ellipse cx="32" cy="54" rx="14" ry="16" fill="url(#skinDark)" />
          {/* O Circle */}
          <circle cx="54" cy="48" r="22" fill="none" stroke="url(#skinLight)" strokeWidth="10" filter="url(#shadow)" />
          <ellipse cx="68" cy="38" rx="4" ry="3.5" fill="#FFE5D1" />
        </svg>
      );

    case 'P':
      // Left index straight up + Right thumb & index forming top loop touching left index tip
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left upright index stem */}
          <rect x="28" y="18" width="10" height="60" rx="5" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Right hand loop on top */}
          <circle cx="56" cy="34" r="16" fill="none" stroke="url(#skinLight)" strokeWidth="8" filter="url(#shadow)" />
          {/* Top contact node */}
          <circle cx="38" cy="34" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'Q':
      // Right hand loop + Left index pointing down through the loop (tail of Q)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Right hand circle loop */}
          <circle cx="48" cy="40" r="18" fill="none" stroke="url(#skinLight)" strokeWidth="9" filter="url(#shadow)" />
          {/* Left index pointing down through loop */}
          <line x1="48" y1="46" x2="68" y2="78" stroke="url(#skinDark)" strokeWidth="8" strokeLinecap="round" filter="url(#shadow)" />
          <circle cx="54" cy="56" r="3" fill="#00E676" />
        </svg>
      );

    case 'R':
      // Left flat palm + Right index finger hooked/curled across left palm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left open palm */}
          <ellipse cx="50" cy="68" rx="36" ry="15" fill="url(#skinDark)" />
          {/* Right fist */}
          <rect x="22" y="34" width="24" height="22" rx="7" fill="url(#skin)" />
          {/* Hooked index curling into palm */}
          <path
            d="M 40 44 C 54 28 72 36 62 58 C 56 66 48 64 44 60"
            fill="none"
            stroke="url(#skinLight)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          <circle cx="54" cy="64" r="3" fill="#00E676" />
        </svg>
      );

    case 'S':
      // Two fists with pinky fingers extended and hooked together horizontally
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left Fist */}
          <rect x="12" y="32" width="28" height="34" rx="8" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Right Fist */}
          <rect x="60" y="32" width="28" height="34" rx="8" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Interlocked pinkies */}
          <path
            d="M 38 52 C 46 44 54 44 62 52 C 54 60 46 60 38 52 Z"
            fill="none"
            stroke="url(#skinLight)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          <circle cx="50" cy="52" r="3" fill="#00E676" />
        </svg>
      );

    case 'T':
      // Left horizontal index + Right vertical index touching underside center
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Right vertical index */}
          <rect x="45" y="30" width="10" height="50" rx="5" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Left horizontal index */}
          <rect x="18" y="24" width="64" height="10" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Center T joint */}
          <circle cx="50" cy="29" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'U':
      // Single right hand: Index and middle fingers extended together straight up
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeve */}
          <rect x="28" y="68" width="44" height="28" rx="6" fill="url(#sleeve)" />
          {/* Fist */}
          <ellipse cx="50" cy="60" rx="18" ry="14" fill="url(#skinDark)" />
          <rect x="36" y="50" width="28" height="20" rx="7" fill="url(#skin)" />
          {/* 2 Straight Fingers Together */}
          <rect x="40" y="14" width="9.5" height="46" rx="4.75" fill="url(#skinLight)" filter="url(#shadow)" />
          <rect x="50.5" y="14" width="9.5" height="46" rx="4.75" fill="url(#skinLight)" filter="url(#shadow)" />
          <ellipse cx="44.75" cy="19" rx="3" ry="3.5" fill="#FFE5D1" />
          <ellipse cx="55.25" cy="19" rx="3" ry="3.5" fill="#FFE5D1" />
        </svg>
      );

    case 'V':
      // Single right hand: Index and middle fingers spread apart in peace / V sign
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Sleeve */}
          <rect x="28" y="68" width="44" height="28" rx="6" fill="url(#sleeve)" />
          {/* Fist */}
          <ellipse cx="50" cy="62" rx="18" ry="14" fill="url(#skinDark)" />
          <rect x="36" y="52" width="28" height="20" rx="7" fill="url(#skin)" />
          {/* Left V finger */}
          <line x1="46" y1="58" x2="28" y2="16" stroke="url(#skinLight)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow)" />
          {/* Right V finger */}
          <line x1="54" y1="58" x2="72" y2="16" stroke="url(#skinLight)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow)" />
        </svg>
      );

    case 'W':
      // Two hands facing each other with all fingers interlaced (lattice)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Palms base */}
          <ellipse cx="50" cy="74" rx="32" ry="14" fill="url(#skinDark)" />
          {/* Left fingers spreading up-right */}
          <line x1="26" y1="68" x2="42" y2="18" stroke="url(#skinLight)" strokeWidth="6" strokeLinecap="round" />
          <line x1="38" y1="70" x2="58" y2="18" stroke="url(#skinLight)" strokeWidth="6" strokeLinecap="round" />
          {/* Right fingers spreading up-left */}
          <line x1="74" y1="68" x2="58" y2="18" stroke="url(#skin)" strokeWidth="6" strokeLinecap="round" />
          <line x1="62" y1="70" x2="42" y2="18" stroke="url(#skin)" strokeWidth="6" strokeLinecap="round" />
          {/* Outer thumbs */}
          <line x1="16" y1="58" x2="18" y2="34" stroke="url(#skinLight)" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="84" y1="58" x2="82" y2="34" stroke="url(#skin)" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );

    case 'X':
      // Left and Right index fingers crossed at right angles in X
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Diagonal 1 */}
          <line x1="22" y1="22" x2="78" y2="78" stroke="url(#skinDark)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow)" />
          {/* Diagonal 2 */}
          <line x1="78" y1="22" x2="22" y2="78" stroke="url(#skinLight)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow)" />
          {/* Crossing center */}
          <circle cx="50" cy="50" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'Y':
      // Right hand in L shape (index up, thumb out) + Left index pointing into crook
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Right vertical index */}
          <rect x="52" y="14" width="10" height="48" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Right horizontal thumb */}
          <rect x="52" y="48" width="34" height="10" rx="5" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* Left index pointing up-right into the crook */}
          <line x1="22" y1="78" x2="52" y2="48" stroke="url(#skinDark)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow)" />
          {/* Contact node */}
          <circle cx="52" cy="48" r="3.5" fill="#00E676" />
        </svg>
      );

    case 'Z':
    default:
      // Left vertical flat palm + Right horizontal fingers pointing into left palm (90 degree Z shelf)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {defs}
          {/* Left upright flat vertical hand */}
          <rect x="24" y="16" width="12" height="64" rx="6" fill="url(#skinDark)" filter="url(#shadow)" />
          {/* Right horizontal hand pointing into middle */}
          <rect x="36" y="42" width="48" height="12" rx="6" fill="url(#skinLight)" filter="url(#shadow)" />
          {/* 90 deg joint */}
          <circle cx="36" cy="48" r="3.5" fill="#00E676" />
        </svg>
      );
  }
}

// ============================================================================
// SKETCH-STYLE VECTOR RENDERING (Clean Line Art on White)
// ============================================================================
function renderSketchSign(letter: string) {
  const lineCol = '#1A1A1A';

  switch (letter) {
    case 'A':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M 18 68 C 18 54 26 48 36 52 L 48 30 C 50 26 54 28 52 32 L 40 56 C 44 60 40 74 28 74 Z" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 82 68 C 82 54 74 48 64 52 L 52 30 C 50 26 46 28 48 32 L 60 56 C 56 60 60 74 72 74 Z" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <circle cx="50" cy="30" r="2.5" fill={lineCol} />
        </svg>
      );

    case 'B':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="36" cy="54" r="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="22" y1="20" x2="24" y2="44" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="26" x2="18" y2="48" stroke={lineCol} strokeWidth="2" strokeLinecap="round" />
          <circle cx="64" cy="54" r="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="78" y1="20" x2="76" y2="44" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="26" x2="82" y2="48" stroke={lineCol} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'C':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 68 28 C 42 28 32 42 32 54 C 32 66 42 78 68 78 C 72 78 74 74 72 70 C 50 70 44 60 44 54 C 44 48 50 36 72 36 C 74 32 72 28 68 28 Z"
            fill="#FFF"
            stroke={lineCol}
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'D':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="28" y="20" width="8" height="56" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 36 24 C 66 24 76 36 76 48 C 76 60 66 68 36 68" fill="none" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'E':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="22" y="44" width="30" height="8" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2" />
          <rect x="48" y="32" width="34" height="8" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2" />
          <rect x="48" y="56" width="34" height="8" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2" />
        </svg>
      );

    case 'F':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="24" y1="72" x2="48" y2="24" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="74" x2="56" y2="26" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <line x1="76" y1="72" x2="52" y2="24" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="74" x2="44" y2="26" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'G':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="26" y="22" width="48" height="24" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="26" y="52" width="48" height="24" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'H':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="44" cy="54" rx="26" ry="12" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 44 24 L 78 56" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 28 L 52 42" stroke={lineCol} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case 'I':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="36" y="48" width="28" height="28" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="46" y="16" width="8" height="36" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'J':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="40" cy="64" rx="28" ry="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 62 26 L 62 54 C 62 70 46 72 38 64" fill="none" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'K':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="28" y="18" width="8" height="58" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 72 24 L 54 44 L 36 44" fill="none" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'L':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="30" y="16" width="9" height="50" rx="4.5" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="30" y="57" width="46" height="9" rx="4.5" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'M':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="68" rx="34" ry="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="36" y1="24" x2="36" y2="68" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="22" x2="50" y2="68" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="64" y1="25" x2="64" y2="68" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'N':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="68" rx="34" ry="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="42" y1="22" x2="42" y2="68" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="58" y1="22" x2="58" y2="68" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'O':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="22" fill="#FFF" stroke={lineCol} strokeWidth="3" />
        </svg>
      );

    case 'P':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="28" y="20" width="8" height="58" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <circle cx="54" cy="34" r="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'Q':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="48" cy="40" r="16" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="48" y1="46" x2="66" y2="74" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'R':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="68" rx="32" ry="14" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 38 42 C 52 26 70 34 60 56" fill="none" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'S':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="16" y="36" width="24" height="28" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="60" y="36" width="24" height="28" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <path d="M 38 50 C 46 44 54 44 62 50 C 54 56 46 56 38 50 Z" fill="none" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'T':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="46" y="30" width="8" height="46" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="22" y="24" width="56" height="8" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'U':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="36" y="52" width="28" height="28" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="41" y="16" width="8" height="40" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="51" y="16" width="8" height="40" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );

    case 'V':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="36" y="56" width="28" height="26" rx="6" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="46" y1="56" x2="30" y2="18" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <line x1="54" y1="56" x2="70" y2="18" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'W':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="74" rx="30" ry="12" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="28" y1="68" x2="42" y2="20" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="70" x2="58" y2="20" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="68" x2="58" y2="20" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="70" x2="42" y2="20" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'X':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="26" y1="26" x2="74" y2="74" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
          <line x1="74" y1="26" x2="26" y2="74" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'Y':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="52" y="16" width="8" height="42" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="52" y="48" width="30" height="8" rx="4" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <line x1="24" y1="74" x2="52" y2="48" stroke={lineCol} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'Z':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="26" y="18" width="10" height="58" rx="5" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
          <rect x="36" y="42" width="44" height="10" rx="5" fill="#FFF" stroke={lineCol} strokeWidth="2.5" />
        </svg>
      );
  }
}
