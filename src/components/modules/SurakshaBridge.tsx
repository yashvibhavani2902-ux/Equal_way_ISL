import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Printer, 
  Lock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  QrCode, 
  ShieldCheck,
  BookOpen,
  Sparkles,
  Check,
  Fingerprint,
  RefreshCw,
  Info,
  Calendar,
  MapPin,
  HeartPulse,
  User
} from 'lucide-react';
import { LiveCameraViewport } from '../LiveCameraViewport';
import { EqVocabularyModal } from '../EqVocabularyModal';
import { WardRecord } from '../../types';
import { 
  saveNewWard, 
  findWardByMudraId
} from '../../utils/supabaseClient';
import { generate3LetterMudraId } from '../../utils/geminiMudraId';

export const SurakshaBridge: React.FC = () => {
  // Navigation Flow: 'hub' (Image 1) | 'register' | 'identify' (Image 2) | 'id-card' | 'result'
  const [activeFlow, setActiveFlow] = useState<'hub' | 'register' | 'identify' | 'id-card' | 'result'>('hub');
  const [isEqVocabOpen, setIsEqVocabOpen] = useState(false);

  // Registration Form State
  const [wardName, setWardName] = useState('');
  const [parentName, setParentName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [primaryPreference, setPrimaryPreference] = useState<'Hearing Impaired' | 'Speech Impaired' | 'Speech & Hearing Impaired' | 'General Accessibility' | 'Other'>('Speech & Hearing Impaired');
  const [otherDisorder, setOtherDisorder] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalConditions, setMedicalConditions] = useState(''); // optional
  const [identificationNotes, setIdentificationNotes] = useState(''); // optional

  // 3-Letter MudraID state
  const [generatedMudraId, setGeneratedMudraId] = useState('GAV');
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [idGenerationSource, setIdGenerationSource] = useState<string>('gemini_flash');

  // Active Ward for Generated Card / Identified Match
  const [activeWard, setActiveWard] = useState<WardRecord | null>(null);

  // Identification (Search / Scan) State (Image 2)
  const [typedSequence, setTypedSequence] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [cameraDetectedSequence, setCameraDetectedSequence] = useState<string[]>([]);

  // Trigger Gemini Flash to generate unique 3-letter MudraID
  const handleGenerateMudraId = async (customName?: string) => {
    const targetName = customName || wardName;
    if (!targetName.trim()) return;

    setIsGeneratingId(true);
    try {
      const result = await generate3LetterMudraId({
        wardName: targetName,
        parentName,
        birthDate,
        primaryPreference: primaryPreference === 'Other' ? otherDisorder : primaryPreference,
      });

      setGeneratedMudraId(result.mudraId);
      setIdGenerationSource(result.source);
    } catch (err) {
      console.error('Error generating MudraID with Gemini Flash:', err);
    } finally {
      setIsGeneratingId(false);
    }
  };

  // Auto-generate MudraID when user finishes typing ward name
  const handleWardNameBlur = () => {
    if (wardName.trim().length >= 2) {
      handleGenerateMudraId();
    }
  };

  // Handle Form Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardName.trim() || !parentName.trim() || !birthDate || !address.trim() || !emergencyContact.trim()) {
      return;
    }

    const finalMudraId = (generatedMudraId.trim().toUpperCase() || 'WKD').slice(0, 3);

    const newWard: WardRecord = {
      id: finalMudraId,
      wardName: wardName.trim(),
      parentName: parentName.trim(),
      birthDate,
      primaryPreference,
      otherDisorder: primaryPreference === 'Other' ? otherDisorder.trim() : undefined,
      address: address.trim(),
      emergencyContact: emergencyContact.trim(),
      medicalConditions: medicalConditions.trim() || undefined,
      identificationNotes: identificationNotes.trim() || undefined,
      registeredAt: new Date().toLocaleDateString(),
    };

    const saveResult = await saveNewWard(newWard);
    newWard.syncedWithSupabase = saveResult.syncedWithSupabase;

    setActiveWard(newWard);
    setActiveFlow('id-card');
  };

  // Handle Manual Sequence / Live Identification (Image 2)
  const handleExecuteIdentification = async (queryId?: string) => {
    const code = (queryId || typedSequence).trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    if (!code || code.length < 3) {
      setSearchError('Please enter a valid 3-letter MudraID code (e.g., GAV, VKR, SAM).');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const match = await findWardByMudraId(code);
      if (match) {
        setActiveWard(match);
        setActiveFlow('result');
      } else {
        setSearchError(`No registered ward found with MudraID sequence "${code}".`);
      }
    } catch (err) {
      setSearchError('Error querying safety registry database.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Camera Recognition of Letters
  const handleCameraLetterRecognized = (res: { sign: string; confidence: number }) => {
    const letter = res.sign.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      setCameraDetectedSequence((prev) => {
        if (prev[prev.length - 1] === letter) return prev;
        const next = [...prev, letter].slice(-3);
        if (next.length === 3) {
          const candidateCode = next.join('');
          setTypedSequence(candidateCode);
          handleExecuteIdentification(candidateCode);
        }
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header (Refer Image 1) */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          {activeFlow !== 'hub' && (
            <button
              type="button"
              onClick={() => {
                setActiveFlow('hub');
                setSearchError(null);
              }}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Back to main hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FF3B5C]/15 text-[#E60033] border border-[#FF3B5C]/30">
                EMERGENCY SUPPORT
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black italic tracking-wide text-[#0B101B]">
                SURAKSHA BRIDGE
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              MUDRAID IDENTITY SYSTEM • EQUAL WAY
            </p>
          </div>
        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Secure Identity Layer Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-extrabold text-gray-700 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span className="uppercase tracking-wider text-[10px]">SECURE IDENTITY LAYER</span>
          </div>

          {/* EQ Vocabulary Button */}
          <button
            type="button"
            onClick={() => setIsEqVocabOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-full text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
            aria-label="Open EQ Vocabulary Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>EQ Vocabulary</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MAIN HUB VIEW (IMAGE 1 EXACT DESIGN - ONLY THE TWO MAIN ACTION CARDS) */}
      {/* ========================================================================= */}
      {activeFlow === 'hub' && (
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Card 1: REGISTER PROFILE */}
            <div
              onClick={() => {
                setActiveFlow('register');
                setWardName('');
                setParentName('');
                setBirthDate('');
                setAddress('');
                setEmergencyContact('');
                setMedicalConditions('');
                setIdentificationNotes('');
                setGeneratedMudraId('GAV');
              }}
              className="relative bg-white border border-gray-200/90 hover:border-[#0072B2] rounded-[32px] p-8 sm:p-9 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer overflow-hidden min-h-[300px]"
            >
              {/* Corner decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-bl-[100px] pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />

              <div className="relative space-y-4">
                {/* UserPlus Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-[#EBF3FC] text-[#0072B2] flex items-center justify-center shadow-xs">
                  <UserPlus className="w-6 h-6 stroke-[2.5]" />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#0B101B] tracking-tight">
                  REGISTER PROFILE
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
                  Create your personalized emergency accessibility profile and generate your unique MudraID.
                </p>
              </div>

              <div className="relative pt-6">
                <span className="inline-flex items-center gap-1.5 font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-[#0072B2] group-hover:translate-x-1.5 transition-transform">
                  <span>START SETUP</span>
                  <span className="text-lg leading-none">→</span>
                </span>
              </div>
            </div>

            {/* Card 2: IDENTIFY USER (Image 1 Dark Navy Card) */}
            <div
              onClick={() => {
                setActiveFlow('identify');
                setTypedSequence('');
                setSearchError(null);
                setCameraDetectedSequence([]);
              }}
              className="relative bg-[#10141E] border border-gray-800 hover:border-[#FF3B5C] rounded-[32px] p-8 sm:p-9 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer overflow-hidden min-h-[300px]"
            >
              {/* Corner dark accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A2234] rounded-bl-[100px] pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />

              <div className="relative space-y-4">
                {/* Fingerprint Coral/Red Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-[#FF3358] text-white flex items-center justify-center shadow-md shadow-[#FF3358]/30">
                  <Fingerprint className="w-7 h-7 stroke-[2.5]" />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                  IDENTIFY USER
                </h3>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md">
                  Scan a MudraID gesture sequence to retrieve emergency accessibility information instantly.
                </p>
              </div>

              <div className="relative pt-6">
                <span className="inline-flex items-center gap-1.5 font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-[#FF3358] group-hover:translate-x-1.5 transition-transform">
                  <span>EMERGENCY SCAN</span>
                  <span className="text-lg leading-none">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTRATION FLOW (GEMINI FLASH 3-LETTER MUDRAID + FORM FIELDS) */}
      {/* ========================================================================= */}
      {activeFlow === 'register' && (
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-[32px] p-6 sm:p-9 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0072B2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Guardian Portal
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#000000] mt-1.5">
                Register Safety Ward Profile
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveFlow('hub')}
              className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* Row 1: Ward Name & Parent Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="ward-name" className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Name of Ward *
                </label>
                <input
                  id="ward-name"
                  type="text"
                  required
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  onBlur={handleWardNameBlur}
                  placeholder="e.g. Gaurav Sharma"
                  className="w-full border border-gray-300 focus:border-[#0072B2] focus:ring-1 focus:ring-[#0072B2] rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="parent-name" className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Name of Parent / Guardian *
                </label>
                <input
                  id="parent-name"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full border border-gray-300 focus:border-[#0072B2] focus:ring-1 focus:ring-[#0072B2] rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Row 2: Birth Date & Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="birth-date" className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Birth Date *
                </label>
                <input
                  id="birth-date"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full border border-gray-300 focus:border-[#0072B2] focus:ring-1 focus:ring-[#0072B2] rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="emergency-phone" className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Emergency Contact Number *
                </label>
                <input
                  id="emergency-phone"
                  type="tel"
                  required
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. +91 98200 45678"
                  className="w-full border border-gray-300 focus:border-[#0072B2] focus:ring-1 focus:ring-[#0072B2] rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Row 3: Primary Preference / Impairment Disorders (Radio Options) */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                Primary Preference / Impairment Disorder *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  'Hearing Impaired',
                  'Speech Impaired',
                  'Speech & Hearing Impaired',
                  'General Accessibility',
                  'Other'
                ].map((pref) => {
                  const isSelected = primaryPreference === pref;
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setPrimaryPreference(pref as any)}
                      className={`p-3 rounded-2xl border-2 text-left font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0072B2] bg-blue-50/70 text-[#0072B2] shadow-xs'
                          : 'border-gray-200 bg-gray-50/50 hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{pref}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#0072B2]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" selected, allow user to write the issue */}
              {primaryPreference === 'Other' && (
                <div className="pt-2">
                  <input
                    type="text"
                    required
                    value={otherDisorder}
                    onChange={(e) => setOtherDisorder(e.target.value)}
                    placeholder="Please specify custom accessibility or medical condition..."
                    className="w-full border border-[#0072B2] rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-900 bg-blue-50/30"
                  />
                </div>
              )}
            </div>

            {/* Row 4: Residential Address */}
            <div className="space-y-1.5">
              <label htmlFor="res-address" className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                Residential Address & City *
              </label>
              <input
                id="res-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 402, Shanti Heights, Sector 14, Navi Mumbai, MH"
                className="w-full border border-gray-300 focus:border-[#0072B2] rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 shadow-2xs"
              />
            </div>

            {/* Row 5: Gemini Flash 3-Letter MudraID Generator Box */}
            <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0072B2] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0072B2] uppercase tracking-wider block">
                      Gemini Flash MudraID Engine
                    </span>
                    <span className="text-[11px] text-gray-600">
                      Generates unique 3-letter ISL manual fingerspelling emergency code
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateMudraId()}
                  disabled={isGeneratingId}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-blue-300 text-[#0072B2] rounded-full text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingId ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingId ? 'Generating...' : 'Regenerate Code'}</span>
                </button>
              </div>

              {/* 3-Letter Display */}
              <div className="flex items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-200 flex-wrap">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    Assigned 3-Letter MudraID:
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-[#0072B2]">
                    {generatedMudraId}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Engine: {idGenerationSource === 'gemini_flash' ? 'Gemini 3.7 Flash AI' : 'Deterministic Algorithm'}
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0072B2] block">
                    Identity Code
                  </span>
                  <span className="font-mono text-lg font-black text-gray-900 tracking-wider">
                    {generatedMudraId}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 6: Optional Fields (Medical & Identify details) */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-600">
                <HeartPulse className="w-4 h-4 text-gray-500" />
                <span>Medical & Identification Details (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="med-cond" className="block text-xs font-bold text-gray-700">
                    Medical Conditions <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="med-cond"
                    rows={2}
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Allergic to peanuts, carries inhaler, cochlear implant on right ear..."
                    className="w-full border border-gray-300 rounded-2xl p-3 text-xs font-medium text-gray-900 shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="id-notes" className="block text-xs font-bold text-gray-700">
                    Identification Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="id-notes"
                    rows={2}
                    value={identificationNotes}
                    onChange={(e) => setIdentificationNotes(e.target.value)}
                    placeholder="e.g. Responds to gentle hand wave, wears blue wristband with GAV code..."
                    className="w-full border border-gray-300 rounded-2xl p-3 text-xs font-medium text-gray-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 bg-[#0072B2] hover:bg-[#005a8e] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Register Ward & Generate Safety ID Card</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. IDENTIFY FLOW (IMAGE 2 EXACT DESIGN: WEBCAM ON LEFT, MANUAL TEXT ON RIGHT) */}
      {/* ========================================================================= */}
      {activeFlow === 'identify' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveFlow('hub')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Hub</span>
            </button>

            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF3358] bg-[#FF3358]/10 px-3 py-1 rounded-full border border-[#FF3358]/30">
              Active Identification Protocol
            </span>
          </div>

          {/* 2-Column Split: Left = Live Camera, Right = Image 2 Manual Sequence Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Live Webcam Viewport */}
            <div className="lg:col-span-6 space-y-4">
              <LiveCameraViewport
                viewportTitle="MudraID Live Sign Scanner"
                accentColor="#FF3358"
                onSignRecognized={handleCameraLetterRecognized}
              />

              {/* Detected letters buffer */}
              <div className="bg-gray-900 text-white rounded-2xl p-4 border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Real-Time Camera Buffer (3-Letter MudraID):
                  </span>
                  <div className="font-mono text-xl font-black text-teal-400 tracking-widest mt-1">
                    {cameraDetectedSequence.length > 0 ? cameraDetectedSequence.join(' - ') : 'Waiting for gesture...'}
                  </div>
                </div>
                {cameraDetectedSequence.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCameraDetectedSequence([])}
                    className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Clear Buffer
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: MANUAL SEQUENCE CARD (Image 2 EXACT DESIGN) */}
            <div className="lg:col-span-6 bg-white border border-gray-200/90 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Header with Red Accent Bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-[#FF3358] rounded-full" />
                  <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0B101B]">
                    MANUAL SEQUENCE
                  </h3>
                </div>

                <p className="text-xs font-semibold uppercase italic tracking-wide text-gray-500 leading-relaxed">
                  IN A REAL EMERGENCY, THE AI PERFORMS RECOGNITION. FOR THIS DEMO, PLEASE ENTER A MUDRAID SEQUENCE BELOW.
                </p>
              </div>

              {/* Input Form */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="sequence-string-input" className="block text-[11px] font-black uppercase tracking-widest text-gray-500">
                    SEQUENCE STRING
                  </label>

                  <div className="relative">
                    <input
                      id="sequence-string-input"
                      type="text"
                      maxLength={3}
                      value={typedSequence}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
                        setTypedSequence(val);
                        setSearchError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleExecuteIdentification();
                        }
                      }}
                      placeholder="TYPE MUDRAID (E.G. GAV)"
                      className="w-full bg-white border-2 border-blue-200 focus:border-[#0072B2] focus:ring-2 focus:ring-blue-100 rounded-2xl px-6 py-4 text-center font-mono text-xl sm:text-2xl font-black tracking-widest uppercase text-gray-900 placeholder:text-gray-300 placeholder:font-mono shadow-xs"
                    />
                  </div>
                </div>

                {/* Error Banner if ID not found */}
                {searchError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                {/* BEGIN IDENTIFICATION BUTTON (Image 2) */}
                <button
                  type="button"
                  onClick={() => handleExecuteIdentification()}
                  disabled={isSearching}
                  className="w-full py-4 px-6 bg-[#6B7280] hover:bg-[#4B5563] text-white font-heading font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSearching ? 'SEARCHING REGISTRY...' : 'BEGIN IDENTIFICATION'}</span>
                </button>
              </div>

              {/* Info Alert Pill (Image 2) */}
              <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#3730A3]">
                <Info className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                <p className="font-extrabold uppercase text-[11px] tracking-wide leading-relaxed">
                  IF SCANNING FAILS, ENSURE LIGHTING IS CONSISTENT. IDENTIFICATION CAN ALSO BE PERFORMED VIA GUARDIAN BIOMETRIC BYPASS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RESULT VIEW (IDENTIFIED WARD DETAILS - CLEAN WITHOUT UNNECESSARY EMOJIS) */}
      {/* ========================================================================= */}
      {activeFlow === 'result' && activeWard && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveFlow('identify')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Search Another Ward</span>
            </button>

            <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Identity Match Verified
            </span>
          </div>

          <div className="bg-white border-2 border-emerald-500 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-md">
            {/* Header with 3-Letter MudraID Badge */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  OFFICIAL REUNIFICATION FILE
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {activeWard.wardName}
                </h3>
              </div>

              <div className="text-center bg-gray-900 text-teal-400 p-3 rounded-2xl border border-gray-800 font-mono">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block">MUDRAID</span>
                <span className="text-2xl font-black tracking-widest">{activeWard.id}</span>
              </div>
            </div>

            {/* Emergency Phone Call Card */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  PRIMARY GUARDIAN / EMERGENCY CONTACT:
                </span>
                <div className="font-heading text-lg font-black text-gray-900">
                  {activeWard.parentName}
                </div>
                <div className="text-sm font-mono font-bold text-emerald-900">
                  {activeWard.emergencyContact}
                </div>
              </div>

              <a
                href={`tel:${activeWard.emergencyContact}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Guardian Now</span>
              </a>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Birth Date:
                </span>
                <div className="font-extrabold text-sm text-gray-900">{activeWard.birthDate || 'Recorded'}</div>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Primary Preference:
                </span>
                <div className="font-extrabold text-sm text-[#0072B2]">
                  {activeWard.primaryPreference}
                  {activeWard.otherDisorder ? ` (${activeWard.otherDisorder})` : ''}
                </div>
              </div>

              <div className="sm:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Residential Address:
                </span>
                <div className="font-bold text-gray-900">{activeWard.address}</div>
              </div>

              {activeWard.medicalConditions && (
                <div className="sm:col-span-2 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-[#0072B2] uppercase tracking-wider text-[10px]">
                    Medical Conditions (Optional):
                  </span>
                  <div className="font-medium text-gray-800">{activeWard.medicalConditions}</div>
                </div>
              )}

              {activeWard.identificationNotes && (
                <div className="sm:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                    Identification Notes (Optional):
                  </span>
                  <div className="font-medium text-gray-800">{activeWard.identificationNotes}</div>
                </div>
              )}
            </div>

            {/* MudraID Verification Footnote */}
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold">Official MudraID: <strong className="text-gray-900 font-mono text-sm">{activeWard.id}</strong></span>
              <span className="text-[11px] bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-semibold">Verified Safe Ward File</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PRINTABLE ID CARD VIEW (ONLY GENERATED CODE - NO HAND SIGNS) */}
      {/* ========================================================================= */}
      {activeFlow === 'id-card' && activeWard && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between no-print">
            <button
              type="button"
              onClick={() => setActiveFlow('hub')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Hub</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0072B2] hover:bg-[#005a8e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Safety ID Card</span>
            </button>
          </div>

          <div className="p-3 bg-[#F2F9F4] border border-[#1E6B3C] rounded-2xl text-[#1E6B3C] text-xs font-bold flex items-center gap-2 no-print">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ward registered successfully! MudraID: {activeWard.id}</span>
          </div>

          {/* Actual Card - Clean with Generated Code Only */}
          <div className="bg-white border-4 border-[#0072B2] rounded-3xl p-6 sm:p-8 shadow-md space-y-6 print-area">
            <div className="flex items-center justify-between border-b-2 border-[#0072B2] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0072B2] block">
                  EQUALWAY • SURAKSHABRIDGE
                </span>
                <h4 className="font-heading text-xl font-black text-gray-900">
                  Child Safety & Emergency ID Card
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
                  MUDRAID CODE
                </span>
                <div className="text-3xl font-black font-mono tracking-widest bg-blue-50 text-[#0072B2] border-2 border-blue-200 px-4 py-1.5 rounded-xl">
                  {activeWard.id}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-800">
              <div className="font-black text-xl text-gray-900">{activeWard.wardName}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div><strong>Parent / Guardian:</strong> {activeWard.parentName}</div>
                <div><strong>Emergency Tel:</strong> <span className="font-bold text-[#0072B2] font-mono">{activeWard.emergencyContact}</span></div>
                <div><strong>Birth Date:</strong> {activeWard.birthDate || 'N/A'}</div>
                <div><strong>Primary Preference:</strong> {activeWard.primaryPreference}</div>
              </div>
              <div className="pt-1"><strong>Address:</strong> {activeWard.address}</div>
              {activeWard.medicalConditions && (
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-900 text-xs">
                  <strong>Medical Alerts:</strong> {activeWard.medicalConditions}
                </div>
              )}
              {activeWard.identificationNotes && (
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs">
                  <strong>Identification Notes:</strong> {activeWard.identificationNotes}
                </div>
              )}
            </div>

            {/* Prominent Generated MudraID Code Strip (No Hand Signs) */}
            <div className="bg-gray-950 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                  OFFICIAL EMERGENCY MUDRAID
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-teal-400 tracking-widest mt-0.5">
                  {activeWard.id}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">SECURITY PROTOCOL</span>
                <span className="text-xs font-bold text-gray-200">ISO/ISL COMPLIANT</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-[11px] text-gray-500">
              <span>Verified MudraID: <strong className="text-gray-900 font-mono">{activeWard.id}</strong></span>
              <span className="flex items-center gap-1 font-bold text-[#0072B2]">
                <QrCode className="w-4 h-4" />
                <span>Encrypted Registry ID</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* EQ Vocabulary Modal Component */}
      <EqVocabularyModal
        isOpen={isEqVocabOpen}
        onClose={() => setIsEqVocabOpen(false)}
        onSelectTerm={(term) => {
          if (activeFlow === 'register') {
            setIdentificationNotes((prev) => (prev ? `${prev} | ${term}` : term));
          }
          setIsEqVocabOpen(false);
        }}
      />
    </div>
  );
};
