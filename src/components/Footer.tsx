import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  // Unique cohesive accent color for all 3 compliance badges
  const badgeClass =
    'inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4338CA] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs';

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6 text-sm text-gray-500" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={badgeClass}>
              <CheckCircle2 className="w-3 h-3 text-[#4F46E5]" />
              Okabe-Ito Color Safe
            </span>
            <span className={badgeClass}>
              <CheckCircle2 className="w-3 h-3 text-[#4F46E5]" />
              Keyboard Accessible
            </span>
          </div>

          <div className="text-[11px] font-medium text-gray-500">
            EqualWay v2.4 • Empowering Through Technology
          </div>
        </div>

        <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <span>Indian Sign Language (ISL) Standard Dataset • MediaPipe 21 Hand Landmarks Skeleton</span>
          <span>Designed with High Contrast Accessible Architecture</span>
        </div>
      </div>
    </footer>
  );
};

