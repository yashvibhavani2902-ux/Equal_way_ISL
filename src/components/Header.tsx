import React from 'react';
import { Home, HandMetal, BookOpen, Landmark, ShieldAlert } from 'lucide-react';
import { ModuleId } from '../types';
import { EqualWayLogo } from './EqualWayLogo';

interface HeaderProps {
  activeModule: ModuleId | null;
  onNavigateHome: () => void;
  onSelectModule: (id: ModuleId) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontScale: 'normal' | 'lg' | 'xl';
  onChangeFontScale: (scale: 'normal' | 'lg' | 'xl') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onNavigateHome,
  onSelectModule,
  fontScale,
  onChangeFontScale,
}) => {
  const getModuleTitle = (mod: ModuleId) => {
    switch (mod) {
      case 'signbridge':
        return 'SignBridge';
      case 'seekh':
        return 'Seekh ISL';
      case 'public':
        return 'ISL in Public';
      case 'suraksha':
        return 'SurakshaBridge';
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-xs" role="banner">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Group with Official Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          aria-label="EqualWay Platform Home"
        >
          <EqualWayLogo size={46} showText={true} />
        </div>

        {/* Global Navigation Controls & Breadcrumb */}
        <nav className="flex items-center gap-3" aria-label="Global Navigation">
          {activeModule ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#1A1A1A] bg-gray-100 hover:bg-gray-200 rounded-full transition-colors min-h-[40px] cursor-pointer"
                aria-label="Return to HOME"
              >
                <Home className="w-4 h-4 text-[#00A896]" aria-hidden="true" />
                <span>HOME</span>
              </button>

              <span className="text-gray-300 hidden sm:inline" aria-hidden="true">/</span>
              
              <span className="text-xs sm:text-sm font-bold text-white bg-[#0B2B68] px-3.5 py-1.5 rounded-full shadow-xs">
                {getModuleTitle(activeModule)}
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectModule('signbridge')}
                className="px-3.5 py-2 text-xs font-bold rounded-full bg-orange-50 text-[#E69F00] hover:bg-orange-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HandMetal className="w-3.5 h-3.5" />
                <span>SignBridge</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectModule('seekh')}
                className="px-3.5 py-2 text-xs font-bold rounded-full bg-blue-50 text-[#0072B2] hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Seekh ISL</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectModule('public')}
                className="px-3.5 py-2 text-xs font-bold rounded-full bg-emerald-50 text-[#009E73] hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>ISL in Public</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectModule('suraksha')}
                className="px-3.5 py-2 text-xs font-bold rounded-full bg-red-50 text-[#D55E00] hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SurakshaBridge</span>
              </button>
            </div>
          )}

          {/* Font Scaler Pill */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-0.5 shadow-2xs" role="group" aria-label="Text Size Controls">
            <button
              type="button"
              onClick={() => onChangeFontScale('normal')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${fontScale === 'normal' ? 'bg-[#0B2B68] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Normal text size"
              aria-pressed={fontScale === 'normal'}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale('lg')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${fontScale === 'lg' ? 'bg-[#0B2B68] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Large text size"
              aria-pressed={fontScale === 'lg'}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale('xl')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${fontScale === 'xl' ? 'bg-[#0B2B68] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Extra large text size"
              aria-pressed={fontScale === 'xl'}
            >
              A++
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

