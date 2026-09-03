import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  HeartPulse, 
  Plus, 
  Check, 
  Volume2, 
  HelpCircle,
  Activity,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { SYMPTOM_RECOMMENDATIONS_DICT, SymptomRecommendation } from '../../../data/symptomRecommendations';
import { speechManager } from '../../../utils/speech';

interface AISymptomRecommenderProps {
  detectedSign: string | null;
  onAddSymptom: (symptom: SymptomRecommendation) => void;
  accentColor?: string;
}

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const AISymptomRecommender: React.FC<AISymptomRecommenderProps> = ({
  detectedSign,
  onAddSymptom,
  accentColor = '#B3261E',
}) => {
  // Selected letter (either from live detected sign or manual ribbon click)
  const [activeLetter, setActiveLetter] = useState<string>('F');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Sync when live camera detects an alphabet sign
  useEffect(() => {
    if (detectedSign && detectedSign.length === 1 && /^[a-zA-Z]$/.test(detectedSign)) {
      const upper = detectedSign.toUpperCase();
      setActiveLetter(upper);
    }
  }, [detectedSign]);

  const recommendations = SYMPTOM_RECOMMENDATIONS_DICT[activeLetter] || [];

  const handleAdd = (symptom: SymptomRecommendation) => {
    onAddSymptom(symptom);
    setRecentlyAddedId(symptom.id);
    speechManager.speak(`Added symptom: ${symptom.name}`);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === symptom.id ? null : prev));
    }, 2500);
  };

  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-xs space-y-3">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h4 className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              <span>AI Health Symptom Recommender</span>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Sign Assist
              </span>
            </h4>
            <p className="text-[11px] text-red-100">
              Sign any ISL alphabet into the webcam or select a letter below to see instant clinical symptom suggestions.
            </p>
          </div>
        </div>

        {/* Active Letter Indicator */}
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          <span className="text-[11px] font-bold text-red-100 uppercase">Signed Letter:</span>
          <span className="w-7 h-7 rounded-lg bg-white text-red-700 font-heading font-black text-base flex items-center justify-center shadow-xs">
            {activeLetter}
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* A-Z Interactive Quick Ribbon */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
            <span>EXPLORE SYMPTOMS BY SIGNED ALPHABET (A–Z):</span>
            <span className="text-red-700">Tap or Sign letter in camera</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-300">
            {ALPHABETS.map((ltr) => (
              <button
                key={ltr}
                type="button"
                onClick={() => setActiveLetter(ltr)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-heading font-black text-xs shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                  activeLetter === ltr
                    ? 'bg-red-600 text-white shadow-md scale-105 ring-2 ring-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                }`}
                title={`Explore health symptoms starting with ${ltr}`}
              >
                {ltr}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Symptom Recommendations for Active Letter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-gray-800">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-600" />
              <span>AI Matched Symptoms for "{activeLetter}": ({recommendations.length} available)</span>
            </span>
            <span className="text-[11px] text-gray-500 font-normal">Click "+ Add" to append to triage note</span>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {recommendations.map((sym) => {
                const isRecentlyAdded = recentlyAddedId === sym.id;
                const isUrgent = sym.severity === 'Urgent';
                const isHigh = sym.severity === 'High';

                return (
                  <div
                    key={sym.id}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isUrgent
                        ? 'bg-red-50/70 border-red-200'
                        : isHigh
                        ? 'bg-orange-50/70 border-orange-200'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-bold text-xs text-gray-900 leading-tight">
                            {sym.name}
                          </h5>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              isUrgent
                                ? 'bg-red-600 text-white'
                                : isHigh
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {sym.severity}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-600">
                          {sym.hindi}
                        </p>
                      </div>

                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={() => handleAdd(sym)}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                          isRecentlyAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-800 hover:bg-red-600 hover:text-white hover:border-red-600'
                        }`}
                        title={`Add ${sym.name} to triage report`}
                      >
                        {isRecentlyAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-tight">
                      {sym.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500">
              No specific pre-indexed symptom for "{activeLetter}". Select another letter from A–Z or sign into the camera.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
