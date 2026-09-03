import React from 'react';
import { 
  ArrowRight, 
  HandMetal, 
  BookOpen, 
  Landmark, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import { ModuleId } from '../types';

interface ModuleChooserProps {
  onSelectModule: (id: ModuleId) => void;
}

export const ModuleChooser: React.FC<ModuleChooserProps> = ({ onSelectModule }) => {
  const modules = [
    {
      id: 'signbridge' as ModuleId,
      title: 'SignBridge',
      badge: 'Two-Way AI Conversion',
      desc: 'Real-time ISL to text and speech translation for seamless interaction with the hearing world.',
      accentColor: '#E69F00',
      bgHoverClass: 'hover:border-[#E69F00]',
      iconBgClass: 'bg-[#E69F00]/10 text-[#E69F00]',
      btnClass: 'bg-[#E69F00] hover:bg-[#c98900] text-white',
      cardClass: 'bg-white border-2 border-gray-200/80 hover:border-[#E69F00]',
      icon: HandMetal,
      highlights: ['Webcam Gesture Recognition', 'Text to sign converter', 'Speech & Text Synthesis'],
      actionLabel: 'Launch SignBridge',
    },
    {
      id: 'seekh' as ModuleId,
      title: 'Seekh ISL',
      badge: 'Gamified Curriculum',
      desc: 'Interactive learning modules to master Indian Sign Language through AI-assisted practice.',
      accentColor: '#0072B2',
      bgHoverClass: 'hover:border-[#0072B2]',
      iconBgClass: 'bg-[#0072B2]/10 text-[#0072B2]',
      btnClass: 'bg-[#0072B2] hover:bg-[#005a8e] text-white',
      cardClass: 'bg-white border-2 border-gray-200/80 hover:border-[#0072B2]',
      icon: BookOpen,
      highlights: ['AI Auto-Generated Tests', 'Camera Production Drills', 'Learner Streak & Mastery'],
      actionLabel: 'Start Learning',
    },
    {
      id: 'public' as ModuleId,
      title: 'ISL in Public',
      badge: 'Institutional Services',
      desc: 'Sign-language access to public services: tickets, ServiceSathi civic desks, and hospital support.',
      accentColor: '#009E73',
      bgHoverClass: 'hover:border-[#009E73]',
      iconBgClass: 'bg-[#009E73]/10 text-[#009E73]',
      btnClass: 'bg-[#009E73] hover:bg-[#007f5c] text-white',
      cardClass: 'bg-white border-2 border-gray-200/80 hover:border-[#009E73]',
      icon: Landmark,
      highlights: ['Travel Ticket Booking', 'Legal Docs & Complaints', 'Hospital Triage Desk'],
      actionLabel: 'Open Public Counters',
    },
    {
      id: 'suraksha' as ModuleId,
      title: 'SurakshaBridge',
      badge: 'Child Safety Registry',
      desc: 'One-tap emergency assistance, unique safety IDs, and child safety registry for non-verbal minors.',
      accentColor: '#D55E00',
      bgHoverClass: 'hover:border-[#D55E00]',
      iconBgClass: 'bg-[#D55E00] text-white shadow-md shadow-red-200',
      btnClass: 'bg-[#D55E00] hover:bg-[#b04b00] text-white',
      cardClass: 'bg-white border-2 border-gray-200/80 hover:border-[#D55E00]',
      icon: ShieldAlert,
      highlights: ['Unique 3-Part Child ID', 'Printable Safety ID Card', 'Official PIN Lookup & Audit'],
      actionLabel: 'Open SurakshaBridge',
    },
  ];

  return (
    <section aria-labelledby="landing-heading" className="py-4 sm:py-8">
      {/* Intro Header - Centered */}
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
        <h1
          id="landing-heading"
          className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B2B68] tracking-tight leading-tight mb-3"
        >
          Empowering Inclusive Communication
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Real-time ISL interpretation, structured learning, public counters, and child safety registry — built for high performance and accessibility.
        </p>
      </div>

      {/* Centered 2x2 Grid for All 4 Modules matching user design */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectModule(mod.id);
                }
              }}
              role="listitem"
              tabIndex={0}
              aria-label={`Open ${mod.title} module: ${mod.desc}`}
              className={`p-6 sm:p-7 rounded-3xl transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group ${mod.cardClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${mod.iconBgClass}`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <span
                    className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs"
                  >
                    {mod.badge}
                  </span>
                </div>

                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 leading-snug">
                  {mod.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {mod.desc}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6 text-xs font-semibold text-gray-700">
                  {mod.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: mod.accentColor }} aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModule(mod.id);
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${mod.btnClass}`}
              >
                <span>{mod.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

