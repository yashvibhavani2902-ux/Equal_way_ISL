import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModuleChooser } from './components/ModuleChooser';
import { SignBridge } from './components/modules/SignBridge';
import { SeekhISL } from './components/modules/SeekhISL';
import { ISLInPublic } from './components/modules/ISLInPublic';
import { SurakshaBridge } from './components/modules/SurakshaBridge';
import { ModuleId } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<'normal' | 'lg' | 'xl'>('normal');

  // Sync high-contrast class on html root element
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Sync font-scale class on html root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-lg', 'font-scale-xl');
    if (fontScale === 'lg') root.classList.add('font-scale-lg');
    if (fontScale === 'xl') root.classList.add('font-scale-xl');
  }, [fontScale]);

  const handleNavigateHome = () => {
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (id: ModuleId) => {
    setActiveModule(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1A]">
      {/* Keyboard Skip Link for Screen Readers & Keyboard Users */}
      <a href="#app-main-container" className="skip-link">
        Skip to main content
      </a>

      {/* App Header & Navigation Bar */}
      <Header
        activeModule={activeModule}
        onNavigateHome={handleNavigateHome}
        onSelectModule={handleSelectModule}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
      />

      {/* Main Content Region */}
      <main
        id="app-main-container"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
        role="main"
      >
        {!activeModule ? (
          <ModuleChooser onSelectModule={handleSelectModule} />
        ) : activeModule === 'signbridge' ? (
          <SignBridge />
        ) : activeModule === 'seekh' ? (
          <SeekhISL />
        ) : activeModule === 'public' ? (
          <ISLInPublic />
        ) : activeModule === 'suraksha' ? (
          <SurakshaBridge />
        ) : null}
      </main>

      {/* App Footer */}
      <Footer />
    </div>
  );
}

