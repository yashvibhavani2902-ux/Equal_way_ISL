import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Video, 
  Sparkles, 
  Volume2,
  ChevronRight,
  HelpCircle,
  Hand,
  Layers,
  X
} from 'lucide-react';
import { LiveCameraViewport } from '../LiveCameraViewport';
import { 
  ISL_ALPHABETS_DICT, 
  ISL_WORDS_DICT, 
  ISL_FINGER_PROFILES 
} from '../../data/islDictionary';
import { ISL_ALPHABETS_FULL, ISLAlphabetDetail } from '../../data/islAlphabetFull';
import { ISLVisualCard } from '../ISLVisualCard';
import { EqVocabularyModal } from '../EqVocabularyModal';
import { speechManager } from '../../utils/speech';
import { CurriculumModule } from '../../types';

export const SeekhISL: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeDrillType, setActiveDrillType] = useState<'recognition' | 'production' | null>(null);
  const [inspectedLetter, setInspectedLetter] = useState<string | null>(null);
  const [isEqVocabOpen, setIsEqVocabOpen] = useState(false);

  // Keyboard shortcut listener: ESC key returns back from inspected sign modal or active drill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (inspectedLetter) {
          setInspectedLetter(null);
        } else if (activeDrillType) {
          setActiveDrillType(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedLetter, activeDrillType]);

  // Curriculum Data: Module 1 now has ALL 26 ALPHABETS A–Z
  const curriculum: CurriculumModule[] = [
    {
      id: 'mod-1',
      title: 'Module 1: Alphabets A to Z (Complete 26 Signs)',
      category: 'Alphabet Foundation',
      signsCount: 26,
      signs: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      description: 'Master all 26 foundational Indian Sign Language manual alphabets with bilingual Hindi & English pose guides.',
      level: 'Beginner',
    },
    {
      id: 'mod-2',
      title: 'Module 2: Essential Greetings & Courtesy',
      category: 'Social Interaction',
      signsCount: 6,
      signs: ['HELLO', 'THANK YOU', 'WELCOME', 'PLEASE', 'GOOD MORNING', 'BYE'],
      description: 'Learn everyday polite social interactions and dynamic greeting movements.',
      level: 'Beginner',
    },
    {
      id: 'mod-3',
      title: 'Module 3: Medical & Hospital Terms',
      category: 'Healthcare & Emergency',
      signsCount: 6,
      signs: ['DOCTOR', 'HOSPITAL', 'HELP', 'FEVER', 'MEDICINE', 'EMERGENCY'],
      description: 'Critical signs for hospitals, pharmacies, clinics, and emergency medical triage.',
      level: 'Intermediate',
    },
    {
      id: 'mod-4',
      title: 'Module 4: Public Transport & Civic Services',
      category: 'Public Infrastructure',
      signsCount: 7,
      signs: ['TICKET', 'TRAIN', 'BUS', 'COMPLAINT', 'OFFICE', 'AADHAAR', 'POLICE'],
      description: 'Essential signs for train stations, bus terminals, and government public counters.',
      level: 'Intermediate',
    },
  ];

  // Recognition Drill Question State
  const [recQuestionIndex, setRecQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Production Drill State
  const [prodSignIndex, setProdSignIndex] = useState(0);
  const [prodResult, setProdResult] = useState<{ sign: string; confidence: number } | null>(null);

  const selectedModule = curriculum.find((m) => m.id === selectedModuleId) || curriculum[0];

  // Start Recognition Drill
  const startRecognitionDrill = () => {
    setActiveDrillType('recognition');
    setRecQuestionIndex(0);
    setSelectedChoice(null);
    setIsAnswerCorrect(null);
  };

  // Start Production Drill
  const startProductionDrill = (initialSign?: string) => {
    setActiveDrillType('production');
    if (initialSign) {
      const idx = selectedModule.signs.indexOf(initialSign);
      setProdSignIndex(idx >= 0 ? idx : 0);
    } else {
      setProdSignIndex(0);
    }
    setProdResult(null);
    setInspectedLetter(null);
  };

  // Handle Recognition choice submit
  const handleSelectChoice = (choice: string, correctSign: string) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choice);
    const correct = choice === correctSign;
    setIsAnswerCorrect(correct);
  };

  const handleNextQuestion = () => {
    setSelectedChoice(null);
    setIsAnswerCorrect(null);
    setRecQuestionIndex((prev) => (prev + 1) % selectedModule.signs.length);
  };

  // Handle live production sign evaluation
  const handleProductionSign = (res: { sign: string; confidence: number }) => {
    const targetSign = selectedModule.signs[prodSignIndex];
    if (res.sign === targetSign) {
      setProdResult(res);
    }
  };

  const currentTargetSign = selectedModule.signs[prodSignIndex] || selectedModule.signs[0];
  const targetItem =
    ISL_WORDS_DICT[currentTargetSign] || ISL_ALPHABETS_DICT[currentTargetSign];
  const targetProfile =
    ISL_FINGER_PROFILES[currentTargetSign] || ISL_FINGER_PROFILES['A'];

  // Current Recognition Target Sign
  const recTargetSign = selectedModule.signs[recQuestionIndex] || selectedModule.signs[0];
  const recTargetItem =
    ISL_WORDS_DICT[recTargetSign] || ISL_ALPHABETS_DICT[recTargetSign];
  const recTargetAlphabet = ISL_ALPHABETS_FULL[recTargetSign];

  // Distractor pool for recognition drill
  const allPossibleSigns = selectedModule.signs;
  const distractors = allPossibleSigns
    .filter((s) => s !== recTargetSign)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  const quizChoices = Array.from(new Set([recTargetSign, ...distractors])).sort();

  return (
    <div className="space-y-6">
      {/* View Header with EQ Vocabulary Button */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0072B2] text-white shadow-xs">
              Seekh ISL
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#000000]">
              Learn Indian Sign Language (A to Z Curriculum & Drills)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Official 26 A–Z alphabet poses, bilingual Hindi & English directions, Image-3 visual drills, and live webcam verification.
          </p>
        </div>

        {/* EQ Vocabulary Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEqVocabOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A896] hover:bg-[#008f80] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            aria-label="Open EQ Vocabulary Guide"
          >
            <BookOpen className="w-4 h-4" />
            <span>EQ Vocabulary</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeDrillType === 'recognition' ? (
        /* Recognition Drill View: Uses Image 3 Line Art Sketches */
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveDrillType(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Visual Drill</span>
            </button>
            <span className="text-xs font-extrabold uppercase text-[#0072B2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {selectedModule.title} • Q{recQuestionIndex + 1} of {selectedModule.signs.length}
            </span>
          </div>

          <div className="text-center space-y-4">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#000000]">
              Identify the ISL Sign Gesture Shown in this Illustration:
            </h3>

            {/* Question Visual Card: Official ISL Hand Gesture Photo */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 shadow-xs">
              {recTargetSign.length === 1 ? (
                <ISLVisualCard
                  letter={recTargetSign}
                  variant="photo"
                  size="xl"
                  showLabel={false}
                  className="shadow-sm"
                />
              ) : (
                <div className="w-44 h-44 rounded-2xl bg-white border border-gray-300 flex flex-col items-center justify-center text-6xl shadow-sm">
                  <span>🤲</span>
                  <span className="text-xs font-bold text-gray-500 mt-2">Word Sign Illustration</span>
                </div>
              )}
              <span className="text-xs font-semibold text-gray-500">
                Official ISL Hand Gesture Photo
              </span>
            </div>

            {/* Multiple Choices */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {quizChoices.map((choice) => {
                const isSelected = selectedChoice === choice;
                const isCorrect = choice === recTargetSign;

                let btnClass = 'bg-white border-gray-300 text-[#1A1A1A] hover:bg-gray-50 hover:border-[#0072B2]';
                if (selectedChoice !== null) {
                  if (isCorrect) {
                    btnClass = 'bg-[#F2F9F4] border-[#1E6B3C] text-[#1E6B3C] ring-2 ring-[#1E6B3C]';
                  } else if (isSelected && !isCorrect) {
                    btnClass = 'bg-[#FDF2F2] border-[#B3261E] text-[#B3261E]';
                  }
                }

                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleSelectChoice(choice, recTargetSign)}
                    className={`py-3.5 px-4 font-extrabold text-lg rounded-xl border-2 transition-all min-h-[56px] cursor-pointer ${btnClass}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback with English & Hindi Pose directions */}
            {selectedChoice !== null && (
              <div className="pt-4 space-y-4 text-left">
                {isAnswerCorrect ? (
                  <div className="p-4 bg-[#F2F9F4] border border-[#1E6B3C] rounded-2xl text-[#1E6B3C] text-sm font-bold flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <span>Correct! You accurately identified sign "{recTargetSign}".</span>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FDF2F2] border border-[#B3261E] rounded-2xl text-[#B3261E] text-sm font-bold flex items-center gap-3">
                    <XCircle className="w-6 h-6 shrink-0" />
                    <span>Not quite. The correct sign is "{recTargetSign}".</span>
                  </div>
                )}

                {/* Explanatory Pose Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-[#0072B2] uppercase">
                    🇬🇧 English Gesture Details:
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800">
                    {recTargetAlphabet ? recTargetAlphabet.poseEnglish : recTargetItem?.description}
                  </p>

                  {recTargetAlphabet && (
                    <>
                      <div className="text-xs font-bold text-[#D55E00] uppercase pt-2 border-t border-gray-200">
                        🇮🇳 हिंदी मुद्रा निर्देश:
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800">
                        {recTargetAlphabet.poseHindi}
                      </p>
                    </>
                  )}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#0072B2] hover:bg-[#005a8e] text-white font-bold text-sm rounded-full transition-colors min-h-[44px] shadow-sm cursor-pointer"
                  >
                    <span>Next Drill Question →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeDrillType === 'production' ? (
        /* Live Camera Production Drill View */
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveDrillType(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Camera Drill</span>
            </button>
            <span className="text-xs font-extrabold uppercase text-[#0072B2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Sign {prodSignIndex + 1} of {selectedModule.signs.length}
            </span>
          </div>

          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0072B2]">
              Perform Gesture in Front of Camera:
            </span>
            <div className="font-heading text-4xl font-black text-[#000000]">
              {currentTargetSign}
            </div>

            {/* Visual Photo Card for reference */}
            <div className="flex justify-center my-1">
              {currentTargetSign.length === 1 ? (
                <ISLVisualCard
                  letter={currentTargetSign}
                  variant="photo"
                  size="md"
                  showLabel={false}
                />
              ) : null}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              {ISL_ALPHABETS_FULL[currentTargetSign]?.poseEnglish || targetItem?.description}
            </p>
            {ISL_ALPHABETS_FULL[currentTargetSign] && (
              <p className="text-xs sm:text-sm font-semibold text-[#D55E00] max-w-md mx-auto">
                {ISL_ALPHABETS_FULL[currentTargetSign].poseHindi}
              </p>
            )}

            <div className="text-[11px] font-mono text-[#0072B2] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block">
              Target Angles: Index {targetProfile.index}° | Thumb {targetProfile.thumb}° | Middle {targetProfile.middle}°
            </div>
          </div>

          {/* Live Camera Viewport */}
          <LiveCameraViewport
            targetSign={currentTargetSign}
            onSignRecognized={handleProductionSign}
            viewportTitle="Seekh ISL Live Production Drill"
            accentColor="#0072B2"
          />

          {/* AI Result Card */}
          {prodResult && (
            <div className="p-4 bg-[#F2F9F4] border-2 border-[#1E6B3C] rounded-2xl text-center space-y-2">
              <div className="text-[#1E6B3C] font-extrabold text-base flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Target Sign "{prodResult.sign}" Verified! ({prodResult.confidence}% Accuracy)</span>
              </div>
              <p className="text-xs text-gray-700">
                AI joint analysis confirmed hand posture alignment matching official ISL standards.
              </p>
              <button
                type="button"
                onClick={() => {
                  setProdResult(null);
                  setProdSignIndex((prev) => (prev + 1) % selectedModule.signs.length);
                }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#0072B2] hover:bg-[#005a8e] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                <span>Next Target Sign →</span>
              </button>
            </div>
          )}
        </div>
      ) : selectedModuleId ? (
        /* Selected Module Details & Sign Chooser with Bilingual Inspector */
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedModuleId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Curriculum Modules</span>
          </button>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0072B2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {selectedModule.level} Level
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#000000] mt-2">
                  {selectedModule.title}
                </h3>
              </div>
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-700">
                {selectedModule.signsCount} Signs Total
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{selectedModule.description}</p>

            {/* Target Vocabulary Grid: Click ANY letter (e.g. 'B') to view detailed Hindi & English pose directions */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-[#0072B2]" />
                  Interactive Sign Tiles (Click any sign to view Hindi/English pose directions):
                </span>
                <span className="text-xs text-gray-400">
                  {selectedModule.signs.length} signs
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2.5">
                {selectedModule.signs.map((s) => {
                  const isAlpha = s.length === 1;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInspectedLetter(s)}
                      className="group flex flex-col items-center justify-center p-2 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#0072B2] transition-all hover:scale-105 shadow-2xs cursor-pointer"
                      title={`Inspect sign ${s}`}
                    >
                      {isAlpha ? (
                        <ISLVisualCard
                          letter={s}
                          variant="photo"
                          size="xs"
                          showLabel={false}
                        />
                      ) : (
                        <span className="text-xl my-1">🤲</span>
                      )}
                      <span className="text-xs font-extrabold text-gray-900 group-hover:text-[#0072B2] mt-1">
                        {s}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drill Launcher Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Recognition Drill Card (Image 3) */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0072B2] border border-blue-100 flex items-center justify-center font-bold mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-xl font-bold text-[#000000] mb-2">
                  1. Visual Recognition Drills
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Multiple-choice challenges showing official ISL line-art sketch illustrations (Image 3) to test your symbol recognition.
                </p>
              </div>

              <button
                type="button"
                onClick={startRecognitionDrill}
                className="w-full py-3 px-4 bg-[#0072B2] hover:bg-[#005a8e] text-white font-bold text-sm rounded-full transition-colors min-h-[44px] shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch Recognition Drill →</span>
              </button>
            </div>

            {/* Live Camera Production Drill Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D55E00] border border-orange-100 flex items-center justify-center font-bold mb-4">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-xl font-bold text-[#000000] mb-2">
                  2. Live Camera Production Drills
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Perform target gestures in front of the webcam. AI evaluates your 3D joint angles and confirms mastery in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => startProductionDrill()}
                className="w-full py-3 px-4 bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm rounded-full transition-colors min-h-[44px] shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch Live Camera Drill →</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* All Curriculum Modules Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.map((mod, idx) => (
            <div
              key={mod.id}
              onClick={() => setSelectedModuleId(mod.id)}
              className="bg-white border border-gray-200 rounded-3xl p-7 cursor-pointer hover:border-[#0072B2] hover:shadow-md transition-all duration-200 flex flex-col justify-between group shadow-xs min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0072B2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Module 0{idx + 1} • {mod.category}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {mod.signsCount} Signs
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#000000] mb-2 group-hover:text-[#0072B2] transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {mod.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#0072B2] group-hover:translate-x-1 transition-transform">
                <span>Explore Signs & Drills</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Bilingual Sign Pose Inspector Modal (Triggered when user clicks any letter like 'B') */}
      {inspectedLetter && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label={`Sign details for letter ${inspectedLetter}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectedLetter(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header with Prominent Back Option */}
            <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white flex items-center justify-between gap-2 sm:gap-3 shadow-2xs">
              {/* Left: Back (Esc) Button */}
              <button
                type="button"
                onClick={() => setInspectedLetter(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer shadow-2xs group"
                title="Go back to curriculum (or press Esc)"
                aria-label="Go back to curriculum"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
                <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-500 font-semibold shadow-2xs">Esc</kbd>
              </button>

              {/* Center: Sign Title & Tag */}
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#0072B2] font-heading font-black text-lg sm:text-xl flex items-center justify-center shadow-2xs">
                  {inspectedLetter}
                </span>
                <div className="text-left">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#000000] leading-tight">
                    ISL Sign: "{inspectedLetter}"
                  </h3>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {ISL_ALPHABETS_FULL[inspectedLetter]?.handType || 'Standard Sign'} • {ISL_ALPHABETS_FULL[inspectedLetter]?.branchTag || 'Manual'}
                  </span>
                </div>
              </div>

              {/* Right: Close X Button */}
              <button
                type="button"
                onClick={() => setInspectedLetter(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close sign modal (Esc)"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Visual Images Side-by-Side: Official ISL Gesture Photo and Anatomy Sketch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-bold uppercase text-[#0072B2] mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0072B2]"></span>
                    Official ISL Gesture Photo
                  </span>
                  {inspectedLetter.length === 1 ? (
                    <ISLVisualCard
                      letter={inspectedLetter}
                      variant="photo"
                      size="lg"
                      showLabel={false}
                    />
                  ) : (
                    <div className="text-4xl py-4">🤲</div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase text-gray-700 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Hand Pose Anatomy Sketch
                  </span>
                  {inspectedLetter.length === 1 ? (
                    <ISLVisualCard
                      letter={inspectedLetter}
                      variant="sketch"
                      size="lg"
                      showLabel={false}
                    />
                  ) : (
                    <div className="text-4xl py-4">🤲</div>
                  )}
                </div>
              </div>

              {/* Bilingual Directions */}
              {(() => {
                const alphaData = ISL_ALPHABETS_FULL[inspectedLetter];
                const dictData = ISL_WORDS_DICT[inspectedLetter] || ISL_ALPHABETS_DICT[inspectedLetter];

                return (
                  <div className="space-y-3">
                    {/* English Pose Direction */}
                    <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#0072B2] uppercase">
                        <span>🇬🇧 English Pose Direction:</span>
                        <button
                          type="button"
                          onClick={() => speechManager.speak(alphaData ? alphaData.poseEnglish : dictData?.description || inspectedLetter)}
                          className="flex items-center gap-1 text-[11px] text-[#0072B2] hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                        {alphaData ? alphaData.poseEnglish : dictData?.description}
                      </p>
                    </div>

                    {/* Hindi Pose Direction */}
                    {alphaData && (
                      <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#D55E00] uppercase">
                          <span>🇮🇳 हिंदी मुद्रा निर्देश (Hindi Pose Direction):</span>
                          <button
                            type="button"
                            onClick={() => speechManager.speak(alphaData.poseHindi)}
                            className="flex items-center gap-1 text-[11px] text-[#D55E00] hover:underline cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>बोलें</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                          {alphaData.poseHindi}
                        </p>
                      </div>
                    )}

                    {/* Step list if present */}
                    {alphaData?.stepsEnglish && (
                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs space-y-1">
                        <span className="font-bold text-gray-900 block mb-1">Step Details:</span>
                        {alphaData.stepsEnglish.map((st, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-gray-700">
                            <span className="font-bold text-[#0072B2]">{i + 1}.</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Sticky Modal Footer with Back and Camera Practice Buttons */}
            <div className="shrink-0 px-5 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/90 backdrop-blur-xs flex items-center justify-between gap-3 shadow-2xs">
              <button
                type="button"
                onClick={() => setInspectedLetter(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition-colors cursor-pointer shadow-xs min-h-[42px]"
                title="Go back to curriculum (or press Esc)"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
                <span>Back (Esc)</span>
              </button>

              <button
                type="button"
                onClick={() => startProductionDrill(inspectedLetter)}
                className="flex-1 py-2.5 px-4 bg-[#0072B2] hover:bg-[#005a8e] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[42px]"
              >
                <Video className="w-4 h-4" />
                <span>Practice "{inspectedLetter}" with Live Camera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EQ Vocabulary Modal Component */}
      <EqVocabularyModal
        isOpen={isEqVocabOpen}
        onClose={() => setIsEqVocabOpen(false)}
        onSelectTerm={(term) => {
          setInspectedLetter(term);
          setIsEqVocabOpen(false);
        }}
      />
    </div>
  );
};
