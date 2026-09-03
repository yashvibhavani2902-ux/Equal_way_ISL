import React, { useState, useEffect } from 'react';
import { 
  HandMetal, 
  MessageSquare, 
  Volume2, 
  Copy, 
  Trash2, 
  Mic, 
  Play, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  CornerDownLeft,
  Delete,
  Info,
  CheckCircle2,
  BookOpen,
  Archive,
  FileDown,
  Clock
} from 'lucide-react';
import { LiveCameraViewport } from '../LiveCameraViewport';
import { parseTextToSignSequence, SignSequenceToken } from '../../data/islDictionary';
import { speechManager } from '../../utils/speech';
import { HandTelemetry, SignBranchTag } from '../../types';
import { ISLVisualCard } from '../ISLVisualCard';
import { ISL_ALPHABETS_FULL } from '../../data/islAlphabetFull';
import { EqVocabularyModal } from '../EqVocabularyModal';

// Common Indian Sign Language vocabulary dictionary for predictive suggestions
const ISL_VOCABULARY_LIST = [
  'HELLO', 'THANK YOU', 'WELCOME', 'PLEASE', 'GOOD MORNING', 'BYE',
  'DOCTOR', 'HOSPITAL', 'HELP', 'FEVER', 'MEDICINE', 'EMERGENCY',
  'TICKET', 'TRAIN', 'BUS', 'COMPLAINT', 'OFFICE', 'AADHAAR', 'POLICE',
  'YES', 'NO', 'NAME', 'WATER', 'FOOD', 'WHERE', 'WHEN', 'WHY', 'HOW',
  'FAMILY', 'MOTHER', 'FATHER', 'FRIEND', 'SCHOOL', 'TIME', 'TODAY'
];

interface ArchivedItem {
  id: string;
  text: string;
  timestamp: string;
}

export const SignBridge: React.FC = () => {
  const [mode, setMode] = useState<'sign-to-text' | 'text-to-sign'>('sign-to-text');
  
  // Sign -> Text Real-Time Transcription State
  const [transcriptionStream, setTranscriptionStream] = useState<string>('');
  const [currentDraftWord, setCurrentDraftWord] = useState<string>('');
  const [lastDetectedSign, setLastDetectedSign] = useState<string>('--');
  const [lastBranchTag, setLastBranchTag] = useState<SignBranchTag>('one-handed');
  const [autoTTS, setAutoTTS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPipelineGuide, setShowPipelineGuide] = useState(false);

  // EQ Vocabulary Modal & Archive State
  const [isEqVocabOpen, setIsEqVocabOpen] = useState(false);
  const [archivedTexts, setArchivedTexts] = useState<ArchivedItem[]>(() => {
    try {
      const saved = localStorage.getItem('eq_archived_transcripts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showArchivedList, setShowArchivedList] = useState(false);
  const [archiveSuccessMsg, setArchiveSuccessMsg] = useState<string | null>(null);

  // Text -> Sign State
  const [inputText, setInputText] = useState('HELLO DOCTOR THANK YOU');
  const [signSequence, setSignSequence] = useState<SignSequenceToken[]>([]);
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState<number>(1500); // ms per sign
  const [isMicListening, setIsMicListening] = useState(false);

  // Sync archive to storage
  useEffect(() => {
    try {
      localStorage.setItem('eq_archived_transcripts', JSON.stringify(archivedTexts));
    } catch {}
  }, [archivedTexts]);

  // Update parsed sequence when text changes
  useEffect(() => {
    const seq = parseTextToSignSequence(inputText);
    setSignSequence(seq);
    setActiveTokenIndex(0);
  }, [inputText]);

  // Animated Sign Sequence Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (mode === 'text-to-sign' && isPlaying && signSequence.length > 1) {
      timer = setInterval(() => {
        setActiveTokenIndex((prev) => (prev + 1) % signSequence.length);
      }, animSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [mode, isPlaying, signSequence.length, animSpeed]);

  // Handle incoming stabilized camera recognition (Stage 6 gated)
  const handleSignRecognized = (result: {
    sign: string;
    confidence: number;
    type: 'word' | 'alphabet';
    tag: SignBranchTag;
    handCount: 1 | 2;
    telemetry: HandTelemetry;
    isStabilized: boolean;
  }) => {
    setLastDetectedSign(result.sign);
    setLastBranchTag(result.tag);

    if (result.isStabilized) {
      if (result.type === 'word') {
        // Direct word recognition -> append whole word with space
        setTranscriptionStream((prev) => (prev ? `${prev.trim()} ${result.sign} ` : `${result.sign} `));
        setCurrentDraftWord('');
        if (autoTTS) {
          speechManager.speak(result.sign);
        }
      } else {
        // Single alphabet recognition -> append to current draft word
        setCurrentDraftWord((prevDraft) => {
          const updatedDraft = prevDraft + result.sign;
          if (autoTTS) {
            speechManager.speak(result.sign);
          }
          return updatedDraft;
        });
      }
    }
  };

  // Compute smart AI suggestions based on current draft word or last typed text
  const currentSearchPrefix = currentDraftWord.trim().toUpperCase();
  const matchedSuggestions = currentSearchPrefix
    ? ISL_VOCABULARY_LIST.filter((w) => w.startsWith(currentSearchPrefix) && w !== currentSearchPrefix).slice(0, 3)
    : [];

  // User Actions
  const handleAcceptSuggestion = (suggestion?: string) => {
    const wordToAccept = suggestion || matchedSuggestions[0] || currentDraftWord;
    if (!wordToAccept) return;

    setTranscriptionStream((prev) => (prev ? `${prev.trim()} ${wordToAccept} ` : `${wordToAccept} `));
    setCurrentDraftWord('');
    if (autoTTS) speechManager.speak(wordToAccept);
  };

  const handleInsertSpace = () => {
    if (currentDraftWord) {
      setTranscriptionStream((prev) => (prev ? `${prev.trim()} ${currentDraftWord} ` : `${currentDraftWord} `));
      setCurrentDraftWord('');
    } else if (transcriptionStream && !transcriptionStream.endsWith(' ')) {
      setTranscriptionStream((prev) => prev + ' ');
    }
  };

  const handleDeleteBack = () => {
    if (currentDraftWord.length > 0) {
      setCurrentDraftWord((prev) => prev.slice(0, -1));
    } else if (transcriptionStream.length > 0) {
      setTranscriptionStream((prev) => prev.trimEnd().slice(0, -1));
    }
  };

  const handleClearAll = () => {
    setTranscriptionStream('');
    setCurrentDraftWord('');
    setLastDetectedSign('--');
  };

  const fullDisplayText = `${transcriptionStream}${currentDraftWord}`.trim();

  const handleArchiveText = () => {
    if (!fullDisplayText) return;
    const newItem: ArchivedItem = {
      id: Date.now().toString(),
      text: fullDisplayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setArchivedTexts((prev) => [newItem, ...prev]);
    setArchiveSuccessMsg('Transcript saved to archive!');
    setTimeout(() => setArchiveSuccessMsg(null), 3000);
  };

  const handleClearArchiveHistory = () => {
    if (window.confirm('Clear all saved transcripts?')) {
      setArchivedTexts([]);
    }
  };

  const handleSpeakText = () => {
    if (fullDisplayText) speechManager.speak(fullDisplayText);
  };

  const handleCopyText = () => {
    if (fullDisplayText) {
      navigator.clipboard.writeText(fullDisplayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMicInput = () => {
    setIsMicListening(true);
    speechManager.listen(
      (transcript) => {
        setInputText(transcript.toUpperCase());
        setIsMicListening(false);
      },
      (err) => {
        setIsMicListening(false);
        alert(err || 'Unable to capture microphone speech.');
      }
    );
  };

  const currentToken = signSequence[activeTokenIndex] || null;

  return (
    <div className="space-y-6">
      {/* Module Header with EQ Vocabulary Button */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E69F00] text-white shadow-xs">
              SignBridge AI
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#000000]">
              Real-Time ISL Translation Engine
            </h2>
          </div>

          {/* Top Actions: EQ Vocabulary & Pipeline Guide */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsEqVocabOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A896] hover:bg-[#008f80] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
              aria-label="Open EQ Vocabulary Guide"
            >
              <BookOpen className="w-4 h-4" />
              <span>EQ Vocabulary</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPipelineGuide((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0072B2] border border-blue-200 rounded-full text-xs font-bold transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showPipelineGuide ? 'Hide 6-Stage Pipeline' : '6-Stage Pipeline'}</span>
            </button>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          6-stage hand-role tagged ISL classifier with Right (Blue) & Left (Purple) skeleton tracking and stabilized debounce gating.
        </p>
      </div>

      {/* 6-Stage Pipeline Breakdown Banner (Expandable) */}
      {showPipelineGuide && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#56B4E9] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Architecture: Multi-Stage Hand-Role & Branched Classification Pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Stages 1-3 */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div className="font-bold text-[#00E676] flex items-center gap-1.5">
                <span>Stage 1–3: Landmark & Features</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Detects up to 2 hands per frame with 21 MediaPipe coordinates per hand.
              </p>
              <div className="pt-1 space-y-1 text-gray-400">
                <div>• <strong className="text-[#56B4E9]">Right Hand:</strong> Rendered in Blue skeleton</div>
                <div>• <strong className="text-[#CE93D8]">Left Hand:</strong> Rendered in Purple skeleton</div>
                <div>• Computes 5-finger 3D angles & extension states</div>
              </div>
            </div>

            {/* Stages 4-5 */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div className="font-bold text-[#E69F00] flex items-center gap-1.5">
                <span>Stage 4–5: Tagging & Branched Model</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Tags hand role (Dominant vs Base) and routes to specialized candidate branch:
              </p>
              <div className="pt-1 space-y-1 text-gray-400">
                <div>• <strong>One-Handed:</strong> C, I, V, U, O, L, Y, J</div>
                <div>• <strong>Symmetric:</strong> A, B, E, F, G, HELLO</div>
                <div>• <strong>Asymmetric:</strong> D, K, M, N, P, Q, R, S, T, W, X, Z</div>
              </div>
            </div>

            {/* Stage 6 */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div className="font-bold text-[#56B4E9] flex items-center gap-1.5">
                <span>Stage 6: Stabilized Gating</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Requires confidence ≥88% and 6 consecutive stable hold frames before locking in letters.
              </p>
              <div className="pt-1 space-y-1 text-gray-400">
                <div>• Eliminates repeated character jitter spam</div>
                <div>• Smart predictive auto-completion engine</div>
                <div>• 1.2s cooldown per repeated character</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-full border border-gray-200 max-w-2xl" role="tablist" aria-label="SignBridge Mode Switcher">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'sign-to-text'}
          onClick={() => setMode('sign-to-text')}
          className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[40px] cursor-pointer ${
            mode === 'sign-to-text'
              ? 'bg-[#E69F00] text-white shadow-sm'
              : 'text-[#1A1A1A] hover:bg-gray-200/70'
          }`}
        >
          <HandMetal className="w-4 h-4" aria-hidden="true" />
          <span>Sign → Text (Live Camera)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === 'text-to-sign'}
          onClick={() => setMode('text-to-sign')}
          className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[40px] cursor-pointer ${
            mode === 'text-to-sign'
              ? 'bg-[#0072B2] text-white shadow-sm'
              : 'text-[#1A1A1A] hover:bg-gray-200/70'
          }`}
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Text to Sign Converter</span>
        </button>
      </div>

      {/* Mode 1: Sign to Text */}
      {mode === 'sign-to-text' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live AI Camera Viewport */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <span>1. Multi-Hand AI Camera</span>
                <span className="text-[11px] font-bold text-[#0072B2] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Blue (Right) & Purple (Left)
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Hold sign steady inside the frame. When hold meter reaches 100% (Green), letter commits cleanly without duplicates.
              </p>
            </div>

            <LiveCameraViewport 
              onSignRecognized={handleSignRecognized}
              viewportTitle="SignBridge Live AI Camera Viewport"
              accentColor="#E69F00"
            />
          </div>

          {/* Right Column: Stabilized Stream, Controls, Clear All & Archive Text */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 flex-1 flex flex-col shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                    2. Stabilized Translation
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    Active Branch: <strong className="text-[#0072B2]">{lastBranchTag}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer select-none bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                    <input
                      type="checkbox"
                      checked={autoTTS}
                      onChange={(e) => setAutoTTS(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#E69F00] focus:ring-[#E69F00]"
                    />
                    <span>Auto TTS</span>
                  </label>

                  {/* Clear All Quick Icon */}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="p-1.5 text-xs text-gray-500 hover:text-[#D55E00] hover:bg-red-50 rounded-full border border-gray-200 transition-colors cursor-pointer"
                    title="Clear text output"
                    aria-label="Clear text output"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Stabilized Text Transcription Display */}
              <div
                className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 min-h-[140px] flex-1 text-xl sm:text-2xl font-extrabold text-[#1A1A1A] leading-relaxed overflow-y-auto mb-3 relative"
                role="status"
                aria-live="polite"
              >
                {transcriptionStream || currentDraftWord ? (
                  <span>
                    <span>{transcriptionStream}</span>
                    {currentDraftWord && (
                      <span className="text-[#0072B2] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {currentDraftWord}
                      </span>
                    )}
                    <span className="inline-block w-2 h-5 bg-[#E69F00] animate-pulse ml-1 align-middle"></span>
                  </span>
                ) : (
                  <span className="text-gray-400 font-normal italic text-sm">
                    Hold your hands in camera view. Stabilized ISL letters and words will appear here seamlessly...
                  </span>
                )}
              </div>

              {/* Archive Toast Message */}
              {archiveSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-[#008762] text-xs font-bold px-3 py-2 rounded-xl mb-3 flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#009E73]" />
                    {archiveSuccessMsg}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowArchivedList(true)}
                    className="underline text-[11px] font-black cursor-pointer"
                  >
                    View Archives ({archivedTexts.length})
                  </button>
                </div>
              )}

              {/* AI Suggestion Bar */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3 mb-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#009E73] flex items-center gap-1 uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3 h-3 text-[#009E73]" />
                    <span>AI Word Suggestion</span>
                  </span>

                  {matchedSuggestions.length > 0 && (
                    <span className="text-[10px] text-gray-500">
                      {matchedSuggestions.length} match{matchedSuggestions.length > 1 ? 'es' : ''} found
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-sm font-black text-gray-900 truncate">
                    {matchedSuggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSuggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleAcceptSuggestion(sug)}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg font-black text-emerald-800 text-xs shadow-2xs transition-colors cursor-pointer"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">
                        {currentDraftWord ? `Spelling: "${currentDraftWord}"` : 'Sign letters to receive word suggestions'}
                      </span>
                    )}
                  </div>

                  {matchedSuggestions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAcceptSuggestion()}
                      className="px-3 py-1.5 bg-[#009E73] hover:bg-[#008762] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>

              {/* Typing Toolbar: Space & Back Controls */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleInsertSpace}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-800 transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>Space Word</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteBack}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-800 transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                >
                  <Delete className="w-3.5 h-3.5" />
                  <span>Backspace</span>
                </button>
              </div>

              {/* Action Buttons: Speak Aloud, Copy, Clear All & Archive Text */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSpeakText}
                  disabled={!fullDisplayText}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#E69F00] hover:bg-[#c98900] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors min-h-[42px] shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>Speak Aloud</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!fullDisplayText}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[#1A1A1A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors min-h-[42px] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#009E73]" aria-hidden="true" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Clear All Button */}
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={!fullDisplayText}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 border border-red-200 text-[#D55E00] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors min-h-[42px] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear All</span>
                </button>

                {/* Archive Text Button */}
                <button
                  type="button"
                  onClick={handleArchiveText}
                  disabled={!fullDisplayText}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 border border-blue-200 text-[#0072B2] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors min-h-[42px] cursor-pointer"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive Text</span>
                </button>
              </div>
            </div>

            {/* Archived Transcripts Drawer / Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setShowArchivedList((prev) => !prev)}
                  className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-2 hover:text-[#0072B2] transition-colors cursor-pointer"
                >
                  <Archive className="w-4 h-4 text-[#0072B2]" />
                  <span>Archived Transcripts</span>
                  <span className="text-xs font-bold bg-blue-50 text-[#0072B2] px-2 py-0.5 rounded-full border border-blue-200">
                    {archivedTexts.length}
                  </span>
                </button>

                {archivedTexts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearArchiveHistory}
                    className="text-[11px] font-bold text-gray-500 hover:text-[#D55E00] cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {showArchivedList ? (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pt-2 border-t border-gray-100">
                  {archivedTexts.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2 text-center">
                      No archived transcripts yet. Sign phrases and click &quot;Archive Text&quot; to save records.
                    </p>
                  ) : (
                    archivedTexts.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.text}</p>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => speechManager.speak(item.text)}
                            className="p-1 text-gray-500 hover:text-[#E69F00] cursor-pointer"
                            title="Speak"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.text);
                              alert('Copied archived text!');
                            }}
                            className="p-1 text-gray-500 hover:text-[#0072B2] cursor-pointer"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Save interpreted conversation records, review logs, or copy previous transcripts.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Text to Sign */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Form & Quick Phrases */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="font-heading text-lg font-bold text-[#000000]">
                1. Enter Text or Use Voice Input
              </h3>

              <div className="space-y-2">
                <label htmlFor="text-to-sign-input" className="block text-xs font-bold text-[#1A1A1A]">
                  Type sentence, word, or name to convert to ISL animation:
                </label>
                <div className="flex gap-2">
                  <input
                    id="text-to-sign-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Hello Doctor, Thank You, Ticket..."
                    className="flex-1 border border-gray-300 focus:border-[#0072B2] rounded-xl px-4 py-2.5 text-base font-bold text-[#1A1A1A] min-h-[44px] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleMicInput}
                    className={`px-4 py-2.5 rounded-xl flex items-center justify-center font-bold text-xs gap-1.5 transition-colors min-h-[44px] shadow-xs cursor-pointer ${
                      isMicListening
                        ? 'bg-[#D55E00] text-white animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] border border-gray-200'
                    }`}
                    title="Microphone voice input"
                    aria-label="Use Microphone Speech Input"
                  >
                    <Mic className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{isMicListening ? 'Listening...' : 'Voice'}</span>
                  </button>
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-gray-500">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'HELLO DOCTOR',
                    'THANK YOU FOR HELP',
                    'TICKET TRAIN MUMBAI',
                    'EMERGENCY HOSPITAL',
                    'PLEASE HELP ME',
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setInputText(phrase)}
                      className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animation Speed & Playback Settings */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] block">Sign Playback Speed</span>
                  <span className="text-[11px] text-gray-500">Controls transition speed between gestures</span>
                </div>

                <select
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-[#1A1A1A] min-h-[38px] cursor-pointer"
                  aria-label="Sign playback speed"
                >
                  <option value={2200}>Slow (0.7x)</option>
                  <option value={1500}>Normal (1.0x)</option>
                  <option value={900}>Fast (1.5x)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Animated ISL Output Viewport */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#000000]">
                  2. ISL Converted Sign Cards & Sequence
                </h3>
                <span className="text-xs text-gray-500">
                  {signSequence.length} Sign Tokens ({signSequence.filter(t => t.type === 'alphabet').length} manual letters, {signSequence.filter(t => t.type === 'word').length} full words)
                </span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0072B2] hover:bg-[#005a8e] text-white rounded-full text-xs font-bold transition-colors min-h-[36px] shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isPlaying ? 'Pause' : 'Play Sequence'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTokenIndex(0)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[#1A1A1A] rounded-full text-xs font-bold transition-colors min-h-[36px] cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Visual Alphabet Sequence Gallery (Images of E-V-E-R-Y-O-N-E etc. from Image 2) */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2.5">
                <span className="font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ISL Sign Sequence Gallery (Click any letter to inspect):
                </span>
                <span className="text-[11px] text-gray-400">
                  Active: {activeTokenIndex + 1}/{signSequence.length}
                </span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                {signSequence.map((tok, idx) => {
                  const isCurrent = idx === activeTokenIndex;
                  return (
                    <div
                      key={`${tok.key}-${idx}`}
                      onClick={() => {
                        setActiveTokenIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`shrink-0 flex flex-col items-center cursor-pointer transition-all ${
                        isCurrent ? 'scale-105 ring-2 ring-[#00B49F] rounded-xl' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      {tok.type === 'alphabet' ? (
                        <ISLVisualCard
                          letter={tok.key}
                          variant="photo"
                          size="sm"
                          showLabel={true}
                          isActive={isCurrent}
                        />
                      ) : (
                        <div
                          className={`w-16 h-20 rounded-xl flex flex-col items-center justify-between p-1.5 border text-center ${
                            isCurrent
                              ? 'bg-[#0072B2] border-white text-white'
                              : 'bg-[#1C2026] border-gray-700 text-gray-200'
                          }`}
                        >
                          <span className="text-2xl mt-1">🤲</span>
                          <span className="text-[10px] font-black truncate max-w-[56px] uppercase">{tok.key}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Active Sign Display Card */}
            {currentToken ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center space-y-4">
                {/* Step indicator */}
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider text-[#0072B2]">
                    Token {activeTokenIndex + 1} of {signSequence.length} • {currentToken.type.toUpperCase()}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTokenIndex((prev) => (prev > 0 ? prev - 1 : signSequence.length - 1))
                      }
                      className="p-1.5 hover:bg-gray-200 border border-gray-200 rounded-full bg-white transition-colors cursor-pointer"
                      aria-label="Previous Token"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTokenIndex((prev) => (prev + 1) % signSequence.length)
                      }
                      className="p-1.5 hover:bg-gray-200 border border-gray-200 rounded-full bg-white transition-colors cursor-pointer"
                      aria-label="Next Token"
                    >
                      <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                  </div>
                </div>

                {/* Big Sign Label */}
                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#000000]">
                  {currentToken.key}
                </div>

                {/* Gesture Visual Card: Official ISL Gesture Image for Alphabets */}
                <div className="flex flex-col items-center justify-center my-2">
                  <span className="text-[11px] font-bold text-[#0072B2] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 mb-2">
                    Official ISL Gesture
                  </span>
                  {currentToken.type === 'alphabet' ? (
                    <ISLVisualCard
                      letter={currentToken.key}
                      variant="photo"
                      size="xl"
                      showLabel={false}
                      className="shadow-sm"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-[#121417] border-2 border-[#0072B2] flex flex-col items-center justify-center text-6xl shadow-md text-white">
                      <span>🤲</span>
                      <span className="text-xs font-bold text-teal-400 mt-2">Word Gesture</span>
                    </div>
                  )}
                </div>

                {/* Bilingual Gesture Instructions (English + Hindi) */}
                {(() => {
                  const fullAlpha = ISL_ALPHABETS_FULL[currentToken.key];
                  return (
                    <div className="max-w-xl mx-auto space-y-3 text-left">
                      {/* English Guidance */}
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0072B2] uppercase mb-1">
                          <span>🇬🇧 English Pose Direction:</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                          {fullAlpha ? fullAlpha.poseEnglish : currentToken.item.description}
                        </p>
                      </div>

                      {/* Hindi Guidance */}
                      {fullAlpha && (
                        <div className="bg-orange-50/70 p-3.5 rounded-xl border border-orange-200">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D55E00] uppercase mb-1">
                            <span>🇮🇳 हिंदी मुद्रा निर्देश (Hindi Pose Direction):</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                            {fullAlpha.poseHindi}
                          </p>
                        </div>
                      )}

                      {/* Step Details if available */}
                      {currentToken.item.steps && (
                        <div className="text-xs text-gray-600 space-y-1 bg-white p-3 rounded-xl border border-gray-200">
                          <span className="font-bold text-gray-900 block mb-1">Step-by-Step Breakdown:</span>
                          {currentToken.item.steps.map((st, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="font-bold text-[#0072B2]">{idx + 1}.</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] bg-white border border-gray-200 p-2 rounded-xl text-gray-500 font-mono text-center">
                        Joint Angles: Thumb {currentToken.item.targetAngles.thumb}° | Index {currentToken.item.targetAngles.index}° | Middle {currentToken.item.targetAngles.middle}°
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                Enter text on the left to start viewing sign animations.
              </div>
            )}
          </div>
        </div>
      )}


      {/* EQ Vocabulary Modal Component */}
      <EqVocabularyModal
        isOpen={isEqVocabOpen}
        onClose={() => setIsEqVocabOpen(false)}
        onSelectTerm={(term) => {
          if (mode === 'text-to-sign') {
            setInputText(term);
          } else {
            setTranscriptionStream((prev) => (prev ? `${prev.trim()} ${term} ` : `${term} `));
          }
        }}
      />
    </div>
  );
};
