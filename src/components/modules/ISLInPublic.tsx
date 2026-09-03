import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Train, 
  Bus, 
  Plane, 
  Scale, 
  HeartPulse, 
  ShieldAlert, 
  UserCheck, 
  UserRound,
  Building2,
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  BookOpen,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Accessibility,
  ArrowRightLeft,
  Calendar,
  MapPin,
  Printer,
  Plus,
  LogOut,
  Send,
  Volume2
} from 'lucide-react';
import { LiveCameraViewport } from '../LiveCameraViewport';
import { EqVocabularyModal } from '../EqVocabularyModal';
import { 
  CitizenProfile, 
  ConfirmedTravelTicket 
} from '../../types';
import { ISLPublicLogin, DEFAULT_AVATAR_SILHOUETTE } from './public/ISLPublicLogin';
import { DestinationAutocomplete } from './public/DestinationAutocomplete';
import { ConfirmedTicketView } from './public/ConfirmedTicketView';
import { AISymptomRecommender } from './public/AISymptomRecommender';
import { SymptomRecommendation } from '../../data/symptomRecommendations';
import { speechManager } from '../../utils/speech';

const POPULAR_STATIONS = [
  'Mumbai CSMT (CSMT)',
  'Delhi Junction (DLI)',
  'New Delhi (NDLS)',
  'Pune Junction (PUNE)',
  'Nashik Road (NK)',
  'Bengaluru City (SBC)',
  'Hyderabad Deccan (HYB)',
  'Chennai Central (MAS)',
  'Ahmedabad Junction (ADI)',
  'Jaipur Junction (JP)',
  'Kolkata Howrah (HWH)',
  'Lucknow Charbagh (LKO)',
  'Nagpur Junction (NGP)',
  'Chandigarh (CDG)',
  'Bhopal Junction (BPL)',
  'Goa Madgaon (MAO)'
];

const POPULAR_ROUTES = [
  { from: 'Mumbai CSMT (CSMT)', to: 'Pune Junction (PUNE)' },
  { from: 'Nashik Road (NK)', to: 'Mumbai CSMT (CSMT)' },
  { from: 'New Delhi (NDLS)', to: 'Jaipur Junction (JP)' },
  { from: 'Bengaluru City (SBC)', to: 'Chennai Central (MAS)' },
  { from: 'Ahmedabad Junction (ADI)', to: 'Mumbai CSMT (CSMT)' },
];

export const ISLInPublic: React.FC = () => {
  // User Profile & Authentication State (Citizen Profile Only)
  const [userProfile, setUserProfile] = useState<CitizenProfile | null>(() => {
    try {
      const saved = localStorage.getItem('equalway_public_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'citizen') {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeService, setActiveService] = useState<'picker' | 'ticket' | 'servicesathi' | 'hospital'>('picker');
  const [isEqVocabOpen, setIsEqVocabOpen] = useState(false);

  // ================= TICKET BOOKING STATE =================
  const [ticketMode, setTicketMode] = useState<'Train' | 'Bus' | 'Flight'>('Train');
  const [fromStation, setFromStation] = useState('Mumbai CSMT (CSMT)');
  const [toStation, setToStation] = useState('Delhi Junction (DLI)');
  const [travelDate, setTravelDate] = useState('2026-09-05');
  const [travelClass, setTravelClass] = useState('3A - 3rd AC (Accessible Lower Berth)');
  const [ticketDetails, setTicketDetails] = useState('');
  const [detectedTicketSigns, setDetectedTicketSigns] = useState<string[]>([]);
  const [confirmedTicket, setConfirmedTicket] = useState<ConfirmedTravelTicket | null>(null);

  // ================= SERVICESATHI STATE =================
  // Requirement 4: First two options should be generated for request category civic complaint desk and legal document update, and after clicking one of these, show webcam
  const [sathiCategory, setSathiCategory] = useState<'Civic Complaint Desk' | 'Legal Document Update' | null>(null);
  const [sathiDetails, setSathiDetails] = useState('');
  const [sathiSubmitted, setSathiSubmitted] = useState<string | null>(null);
  const [detectedSathiSigns, setDetectedSathiSigns] = useState<string[]>([]);

  // ================= HOSPITAL TRIAGE STATE =================
  // Requirement 5 & 6: Webcam on left and conversion on right, integrated AI recommendation box for health symptoms when user signs any alphabet
  const [hospitalSymptoms, setHospitalSymptoms] = useState('');
  const [hospitalUrgency, setHospitalUrgency] = useState<'Normal' | 'High' | 'Urgent'>('High');
  const [hospitalSubmitted, setHospitalSubmitted] = useState<string | null>(null);
  const [detectedHospitalSign, setDetectedHospitalSign] = useState<string | null>('F');
  const [detectedHospitalSignsList, setDetectedHospitalSignsList] = useState<string[]>([]);

  // Sync ticket details when from/to/mode changes
  useEffect(() => {
    const passengerName = userProfile?.name || 'Citizen Passenger';
    setTicketDetails(
      `Passenger: ${passengerName} | Mode: ${ticketMode} | Route: ${fromStation} -> ${toStation} | Date: ${travelDate} | Class: ${travelClass} | Quota: Divyangjan Accessible`
    );
  }, [ticketMode, fromStation, toStation, travelDate, travelClass, userProfile]);

  // Handle Login
  const handleLogin = (profile: CitizenProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('equalway_public_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile in localStorage', e);
    }
  };

  // Handle Logout / Switch
  const handleLogout = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('equalway_public_profile');
    } catch (e) {
      console.warn(e);
    }
    setActiveService('picker');
    setConfirmedTicket(null);
    setSathiCategory(null);
  };

  // Swap From & To
  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Handle incoming camera gesture for ticket booking
  const handleTicketCameraSign = (res: { sign: string }) => {
    const sign = res.sign;
    setDetectedTicketSigns((prev) => [sign, ...prev.slice(0, 7)]);
    setTicketDetails((prev) => `${prev} | Sign: "${sign}"`);
  };

  // Submit Ticket Booking
  const handleConfirmTicketBooking = () => {
    const pnrRef = `PNR-IR-${Math.floor(100000 + Math.random() * 900000)}`;
    const passengerName = userProfile?.name || 'Citizen Passenger';
    const citizenId = userProfile?.role === 'citizen' ? userProfile.citizenId : 'UDID-MH-2026-4920';
    const photoUrl = userProfile?.photoUrl || DEFAULT_AVATAR_SILHOUETTE;

    const newTicket: ConfirmedTravelTicket = {
      pnr: pnrRef,
      passengerName,
      citizenId,
      photoUrl,
      fromStation,
      toStation,
      mode: ticketMode,
      serviceName: ticketMode === 'Train' ? '12138 Vande Bharat / Express' : ticketMode === 'Bus' ? 'Airawat Club Class (State Transport)' : 'AI-104 Accessible Flight',
      travelDate,
      travelClass,
      seatBerth: 'Coach B2, Berth 33 (Lower - Accessible Priority)',
      quota: 'Divyangjan / Accessible Priority',
      bookingTime: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
      fare: '₹0 (100% Accessible Concession Voucher Applied)',
      status: 'CONFIRMED',
      signRecognitionNotes: detectedTicketSigns.join(', ') || 'Direct camera sign verified',
    };

    setConfirmedTicket(newTicket);
  };

  // Handle incoming camera gesture for ServiceSathi
  const handleSathiCameraSign = (res: { sign: string }) => {
    const sign = res.sign;
    setDetectedSathiSigns((prev) => [sign, ...prev.slice(0, 7)]);
    setSathiDetails((prev) => `${prev} | Sign: "${sign}"`);
  };

  // Submit ServiceSathi Request
  const handleSubmitSathi = () => {
    const ref = `CMP-EQW-${Math.floor(1000 + Math.random() * 9000)}`;
    setSathiSubmitted(ref);
  };

  // Handle incoming camera gesture for Hospital Triage
  const handleHospitalCameraSign = (res: { sign: string }) => {
    const sign = res.sign;
    setDetectedHospitalSign(sign);
    setDetectedHospitalSignsList((prev) => [sign, ...prev.slice(0, 7)]);
    setHospitalSymptoms((prev) => `${prev} [Sign: ${sign}]`);
  };

  // Add Symptom from AI Recommender Box
  const handleAddSymptomFromAI = (symptom: SymptomRecommendation) => {
    setHospitalSymptoms((prev) => {
      const addition = `Symptom: ${symptom.name} (${symptom.hindi}) [Severity: ${symptom.severity}]`;
      return prev ? `${prev} | ${addition}` : addition;
    });

    if (symptom.severity === 'Urgent') {
      setHospitalUrgency('Urgent');
    } else if (symptom.severity === 'High' && hospitalUrgency !== 'Urgent') {
      setHospitalUrgency('High');
    }
  };

  // Submit Hospital Triage
  const handleSubmitHospital = () => {
    const ref = `MED-EQW-${Math.floor(1000 + Math.random() * 9000)}`;
    setHospitalSubmitted(ref);
    speechManager.speak(`Emergency triage request ${ref} transmitted to attending triage nurse.`);
  };

  // 1. IF NOT LOGGED IN, RENDER THE CITIZEN LOGIN PAGE
  if (!userProfile) {
    return <ISLPublicLogin onLogin={handleLogin} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Main View Header with Logged-in Citizen Profile Badge */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between flex-wrap gap-4 no-print">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#009E73] text-white shadow-xs">
              ISL in Public
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#000000]">
              Citizen Services & Public Counters
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Direct sign-language accessibility for travel booking, civic complaints, and emergency hospital triage.
          </p>
        </div>

        {/* Right Header Controls: EQ Vocab + Active Citizen User Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsEqVocabOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00A896] hover:bg-[#008f80] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            aria-label="Open EQ Vocabulary Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>EQ Vocabulary</span>
          </button>

          {/* Active Logged-in Citizen Profile Pill with Photo */}
          <div className="flex items-center gap-2.5 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-xs">
            <div className="relative">
              <img
                src={userProfile.photoUrl}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
            </div>

            <div className="text-left leading-none">
              <div className="font-extrabold text-xs text-gray-900 flex items-center gap-1">
                <span>{userProfile.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Citizen
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                UDID: {userProfile.citizenId}
              </span>
            </div>

            {/* Logout / Switch Profile Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Public Services Views */}
      <div className="space-y-6">
        {activeService === 'picker' ? (
            /* Service Chooser Grid */
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#000000]">
                  Select Public Institutional Counter
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Welcome, <strong>{userProfile.name}</strong>. Choose a service desk to initiate your sign-accessible request.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Travel Ticket Booking */}
                <div
                  onClick={() => setActiveService('ticket')}
                  className="bg-white border-2 border-emerald-100 hover:border-[#009E73] rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between group min-h-[250px] shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#009E73] flex items-center justify-center font-bold mb-3 border border-emerald-200 group-hover:scale-105 transition-transform">
                      <Train className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#009E73] bg-emerald-50 px-2 py-0.5 rounded">
                        Desk #1
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] group-hover:text-[#009E73] transition-colors">
                      Travel Ticket Booking Desk
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Choose "From" and "To" destinations, sign details into the webcam, and print your confirmed ticket with your profile photo.
                    </p>
                  </div>
                  <div className="font-extrabold text-xs text-[#009E73] pt-4 group-hover:underline flex items-center gap-1">
                    <span>Open Ticket Desk</span>
                    <span>→</span>
                  </div>
                </div>

                {/* 2. ServiceSathi Civic Desk */}
                <div
                  onClick={() => {
                    setActiveService('servicesathi');
                    setSathiCategory(null);
                  }}
                  className="bg-white border-2 border-blue-100 hover:border-[#0072B2] rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between group min-h-[250px] shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0072B2] flex items-center justify-center font-bold mb-3 border border-blue-200 group-hover:scale-105 transition-transform">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0072B2] bg-blue-50 px-2 py-0.5 rounded">
                        Desk #2
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] group-hover:text-[#0072B2] transition-colors">
                      ServiceSathi Civic & Legal Desk
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Select Civic Complaint Desk or Legal Document Update first, then use the webcam to sign your request details.
                    </p>
                  </div>
                  <div className="font-extrabold text-xs text-[#0072B2] pt-4 group-hover:underline flex items-center gap-1">
                    <span>Open ServiceSathi</span>
                    <span>→</span>
                  </div>
                </div>

                {/* 3. Hospital Triage Desk */}
                <div
                  onClick={() => setActiveService('hospital')}
                  className="bg-white border-2 border-red-100 hover:border-red-600 rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between group min-h-[250px] shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-3 border border-red-200 group-hover:scale-105 transition-transform">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        Emergency Desk #3
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A] group-hover:text-red-700 transition-colors">
                      Hospital Triage & Symptom Desk
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      Webcam on left and text conversion on right, featuring AI symptom recommendations whenever you sign any alphabet.
                    </p>
                  </div>
                  <div className="font-extrabold text-xs text-red-600 pt-4 group-hover:underline flex items-center gap-1">
                    <span>Open Hospital Triage</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeService === 'ticket' ? (
            /* ================= 1. PUBLIC TRAVEL TICKET BOOKING DESK ================= */
            /* Requirement 2: webcam on left and text conversion on right, show options from and to where person can choose from where to where they want to go */
            /* Requirement 3: After ticket is confirmed, give option to print that ticket with the image they logged in with */
            confirmedTicket ? (
              <ConfirmedTicketView
                ticket={confirmedTicket}
                onClose={() => setConfirmedTicket(null)}
                onBookAnother={() => {
                  setConfirmedTicket(null);
                  setTicketDetails('');
                  setDetectedTicketSigns([]);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Back Link */}
                <button
                  type="button"
                  onClick={() => setActiveService('picker')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Institutional Counters</span>
                </button>

                {/* Desk Header */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#009E73] flex items-center justify-center font-bold border border-emerald-100 shrink-0">
                      <Train className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl font-black text-[#000000] flex items-center gap-2">
                        <span>Public Travel Ticket Booking Desk</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-[#009E73] text-xs rounded-full font-bold">
                          Accessible Priority
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Choose Origin & Destination, sign details in the camera on the left, and view live converted ticket details on the right.
                      </p>
                    </div>
                  </div>

                  {/* Mode Buttons */}
                  <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl border border-gray-200">
                    {(['Train', 'Bus', 'Flight'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTicketMode(m)}
                        className={`py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          ticketMode === m
                            ? 'bg-[#009E73] text-white shadow-xs'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {m === 'Train' && <Train className="w-3.5 h-3.5" />}
                        {m === 'Bus' && <Bus className="w-3.5 h-3.5" />}
                        {m === 'Flight' && <Plane className="w-3.5 h-3.5" />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TWO-COLUMN LAYOUT: WEBCAM ON LEFT, CONVERSION ON RIGHT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN: Route Picker (From & To) + Live Webcam */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* FROM & TO DESTINATION SELECTOR */}
                    <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#009E73]" />
                          <span>Select Route: From & To Where You Want to Go</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-semibold">Priority Transit</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
                        {/* FROM */}
                        <div className="sm:col-span-5 space-y-1">
                          <label htmlFor="from-station" className="block text-[11px] font-black uppercase text-gray-700">
                            From (शुरुआत / Boarding) *
                          </label>
                          <select
                            id="from-station"
                            value={fromStation}
                            onChange={(e) => setFromStation(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] text-xs sm:text-sm font-bold text-gray-900 bg-white"
                          >
                            {POPULAR_STATIONS.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        {/* SWAP BUTTON */}
                        <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-4">
                          <button
                            type="button"
                            onClick={handleSwapStations}
                            className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-[#009E73] transition-colors border border-gray-200 cursor-pointer shadow-2xs"
                            title="Swap Origin and Destination"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        </div>

                        {/* TO - Transport-Aware Autocomplete */}
                        <div className="sm:col-span-5">
                          <DestinationAutocomplete
                            id="to-station"
                            label="To (गंतव्य / Destination)"
                            sublabel={
                              ticketMode === 'Train' 
                                ? 'City or Station Code' 
                                : ticketMode === 'Bus' 
                                ? 'City or Bus Stand' 
                                : 'City or Airport Code'
                            }
                            value={toStation}
                            onChange={(val) => setToStation(val)}
                            mode={ticketMode}
                            placeholder={
                              ticketMode === 'Train'
                                ? 'Type city or station (e.g. Pune, NDLS, HWH)...'
                                : ticketMode === 'Bus'
                                ? 'Type city or bus stand (e.g. Swargate, Majestic)...'
                                : 'Type city or airport (e.g. DEL, BOM, BLR)...'
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* Quick Popular Route Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-[11px]">
                        <span className="font-bold text-gray-500 shrink-0">Popular Routes:</span>
                        {POPULAR_ROUTES.map((r, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setFromStation(r.from);
                              setToStation(r.to);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 shrink-0 font-medium transition-colors cursor-pointer"
                          >
                            {r.from.split(' ')[0]} ⇄ {r.to.split(' ')[0]}
                          </button>
                        ))}
                      </div>

                      {/* Date & Class Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                        <div className="space-y-1">
                          <label htmlFor="travel-date" className="block text-[11px] font-bold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            <span>Travel Date (यात्रा की तारीख)</span>
                          </label>
                          <input
                            id="travel-date"
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="travel-class" className="block text-[11px] font-bold text-gray-700">
                            Travel Class (श्रेणी)
                          </label>
                          <select
                            id="travel-class"
                            value={travelClass}
                            onChange={(e) => setTravelClass(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 bg-white"
                          >
                            <option value="3A - 3rd AC (Accessible Lower Berth)">3A - 3rd AC (Accessible Lower Berth)</option>
                            <option value="2A - 2nd AC (Priority)">2A - 2nd AC (Priority)</option>
                            <option value="SL - Sleeper Class">SL - Sleeper Class</option>
                            <option value="CC - AC Chair Car">CC - AC Chair Car</option>
                            <option value="1A - First AC">1A - First AC</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* LIVE WEBCAM ON LEFT */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold uppercase text-gray-800">
                          Sign Travel Details into Camera
                        </label>
                        <span className="text-[11px] font-semibold text-[#009E73]">
                          Sign letters (A-Z) or gestures
                        </span>
                      </div>
                      <LiveCameraViewport
                        onSignRecognized={handleTicketCameraSign}
                        viewportTitle="Ticket Booking Sign Recognition Viewport"
                        accentColor="#009E73"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Live Text Conversion, Structured Synopsis & Print Trigger */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
                      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                        <h4 className="font-heading font-black text-base text-gray-900">
                          Live Text Conversion
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#009E73]">
                          Live Sync
                        </span>
                      </div>

                      {/* Passenger Badge from Login */}
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center gap-3">
                        <img
                          src={userProfile.photoUrl}
                          alt={userProfile.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-[#009E73] shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase text-[#009E73] block">
                            Authenticated Passenger
                          </span>
                          <h5 className="font-extrabold text-sm text-gray-900 truncate">
                            {userProfile.name}
                          </h5>
                          <p className="text-[11px] font-mono text-gray-500 truncate">
                            {(userProfile as CitizenProfile).citizenId}
                          </p>
                        </div>
                      </div>

                      {/* Detected Signs Stream */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-extrabold uppercase text-gray-600 block">
                          Camera Recognized Gestures:
                        </span>
                        {detectedTicketSigns.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {detectedTicketSigns.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-emerald-50 text-[#009E73] border border-emerald-200 rounded-lg text-xs font-heading font-black shadow-2xs"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Waiting for gestures... Sign letters or words in the webcam on the left.
                          </p>
                        )}
                      </div>

                      {/* Quick Sign Travel Phrases */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-gray-500 block">
                          Quick Add Accessible Requests:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            '+ 1 Passenger',
                            '+ Accessible Lower Berth',
                            '+ Wheelchair Assistance',
                            '+ Return Journey'
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setTicketDetails((prev) => `${prev} | ${chip}`)}
                              className="px-2 py-1 rounded-md bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-[11px] font-semibold border border-gray-200 transition-colors cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Converted Booking Text Box */}
                      <div className="space-y-1">
                        <label htmlFor="ticket-details-box" className="block text-xs font-bold text-gray-800">
                          Structured Booking Confirmation Notes (Editable)
                        </label>
                        <textarea
                          id="ticket-details-box"
                          rows={4}
                          value={ticketDetails}
                          onChange={(e) => setTicketDetails(e.target.value)}
                          className="w-full border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 rounded-2xl p-3 text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed"
                        />
                      </div>

                      {/* Booking Action Button */}
                      <button
                        type="button"
                        onClick={handleConfirmTicketBooking}
                        className="w-full py-3.5 px-4 bg-[#009E73] hover:bg-[#007f5d] text-white font-heading font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Train className="w-4 h-4" />
                        <span>Confirm Ticket & Generate Boarding Pass</span>
                      </button>

                      <p className="text-[11px] text-gray-500 text-center leading-tight">
                        After confirmation, you can print your official ticket with your verified profile photo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : activeService === 'servicesathi' ? (
            /* ================= 2. SERVICESATHI CIVIC & LEGAL DESK ================= */
            /* Requirement 4: First two options should be generated for request category civic complaint desk and legal document update and after clicking one of these, show the webcam */
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setActiveService('picker');
                  setSathiCategory(null);
                  setSathiSubmitted(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Institutional Counters</span>
              </button>

              <div className="border-b border-gray-200 pb-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0072B2] flex items-center justify-center font-bold border border-blue-100">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-[#000000]">
                      ServiceSathi Civic & Legal Document Desk
                    </h3>
                    <p className="text-xs text-gray-600">
                      Sign-language accessibility for government legal certificates, civic grievances, and municipal assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* STAGE 1: FIRST TWO OPTIONS FOR REQUEST CATEGORY (BEFORE WEBCAM) */}
              {!sathiCategory ? (
                <div className="max-w-2xl mx-auto py-4 space-y-6 animate-in fade-in duration-200">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0072B2] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Step 1: Choose Service Desk Request Category
                    </span>
                    <h4 className="font-heading text-xl sm:text-2xl font-extrabold text-gray-900 pt-2">
                      What would you like assistance with today?
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Click one of the two options below to initialize the camera interpreter viewport.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* OPTION 1: Civic Complaint Desk */}
                    <button
                      type="button"
                      onClick={() => {
                        setSathiCategory('Civic Complaint Desk');
                        setSathiDetails('Requesting ISL assistance at municipal civic counter for grievance submission.');
                      }}
                      className="bg-white border-2 border-gray-200 hover:border-[#0072B2] hover:bg-blue-50/40 rounded-3xl p-6 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[220px]"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-[#0072B2] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#0072B2] block">
                            Option 1
                          </span>
                          <h5 className="font-heading font-black text-lg text-gray-900 group-hover:text-[#0072B2] transition-colors">
                            Civic Complaint Desk
                          </h5>
                          <p className="text-xs text-gray-600 leading-relaxed mt-1">
                            File municipal grievances, public road & sanitation issues, accessibility barrier reports, or request in-person ISL interpreter support.
                          </p>
                        </div>
                      </div>
                      <div className="font-extrabold text-xs text-[#0072B2] group-hover:underline flex items-center gap-1 pt-3">
                        <span>Select Civic Complaint →</span>
                      </div>
                    </button>

                    {/* OPTION 2: Legal Document Update */}
                    <button
                      type="button"
                      onClick={() => {
                        setSathiCategory('Legal Document Update');
                        setSathiDetails('Requesting ISL guidance for Unique Disability ID (UDID) card certification and civic assistance.');
                      }}
                      className="bg-white border-2 border-gray-200 hover:border-[#009E73] hover:bg-emerald-50/40 rounded-3xl p-6 text-left transition-all group shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[220px]"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#009E73] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#009E73] block">
                            Option 2
                          </span>
                          <h5 className="font-heading font-black text-lg text-gray-900 group-hover:text-[#009E73] transition-colors">
                            Legal Document Update
                          </h5>
                          <p className="text-xs text-gray-600 leading-relaxed mt-1">
                            Apply for or update Unique Disability ID (UDID) certification, Disability Pension verification, Voter ID correction, or legal affidavits.
                          </p>
                        </div>
                      </div>
                      <div className="font-extrabold text-xs text-[#009E73] group-hover:underline flex items-center gap-1 pt-3">
                        <span>Select Legal Document Update →</span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* STAGE 2: AFTER CLICKING ONE OF THE TWO OPTIONS -> SHOW WEBCAM */
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Category Banner with Back Button */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0072B2] text-white">
                        Active Category
                      </span>
                      <span className="font-heading font-extrabold text-base text-gray-900">
                        {sathiCategory}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSathiCategory(null)}
                      className="text-xs font-bold text-[#0072B2] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Change Category</span>
                    </button>
                  </div>

                  {/* Two Column ServiceSathi View: Webcam on Left, Request Description on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: WEBCAM VIEWPORT */}
                    <div className="lg:col-span-7 space-y-2">
                      <label className="block text-xs font-extrabold uppercase text-gray-800">
                        Sign Document or Complaint Details into Camera
                      </label>
                      <LiveCameraViewport
                        onSignRecognized={handleSathiCameraSign}
                        viewportTitle="ServiceSathi Recognition Viewport"
                        accentColor="#0072B2"
                      />
                    </div>

                    {/* RIGHT: STRUCTURED CONVERSION & SUBMIT */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
                        <h4 className="font-heading font-black text-base text-gray-900">
                          Recognized Complaint & Document Notes
                        </h4>

                        {/* Signs Stream */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold uppercase text-gray-600 block">
                            Detected Gesture Signs:
                          </span>
                          {detectedSathiSigns.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {detectedSathiSigns.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-blue-50 text-[#0072B2] border border-blue-200 rounded-lg text-xs font-heading font-black shadow-2xs"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              Sign into the camera on the left to add details...
                            </p>
                          )}
                        </div>

                        {/* Editable Description */}
                        <div className="space-y-1">
                          <label htmlFor="sathi-notes-box" className="block text-xs font-bold text-gray-800">
                            Filing Description (Editable)
                          </label>
                          <textarea
                            id="sathi-notes-box"
                            rows={4}
                            value={sathiDetails}
                            onChange={(e) => setSathiDetails(e.target.value)}
                            className="w-full border border-gray-300 focus:border-[#0072B2] focus:ring-2 focus:ring-blue-100 rounded-2xl p-3 text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={handleSubmitSathi}
                          className="w-full py-3.5 px-4 bg-[#0072B2] hover:bg-[#005a8e] text-white font-heading font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit {sathiCategory} Request</span>
                        </button>

                        {sathiSubmitted && (
                          <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-center space-y-1 animate-in zoom-in-95">
                            <div className="font-extrabold text-emerald-800 text-sm flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Request Successfully Logged!</span>
                            </div>
                            <div className="text-xs text-gray-700">
                              Tracking Acknowledgment: <strong className="font-mono">{sathiSubmitted}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= 3. HOSPITAL TRIAGE & SYMPTOM REPORTING DESK ================= */
            /* Requirement 5: webcam on left and conversion on right */
            /* Requirement 6: integrate ai recommendation box for health symptoms if the user sign any alphabet and with that alphabet recommend some of the symptoms */
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setActiveService('picker');
                  setHospitalSubmitted(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Institutional Counters</span>
              </button>

              {/* Emergency Callout Notice */}
              <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl flex items-start gap-3 text-xs sm:text-sm shadow-xs">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Urgent Medical Triage Notice:</strong> This desk allows signing symptoms and requests for hospital triage staff. For immediate life-threatening collapse, call <strong className="underline font-bold">112 / 108</strong> immediately.
                </div>
              </div>

              {/* Header */}
              <div className="border-b border-gray-200 pb-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-gray-900">
                      Hospital Triage & Symptom Reporting Desk
                    </h3>
                    <p className="text-xs text-gray-600">
                      Webcam on left, live conversion and AI clinical symptom assist on right.
                    </p>
                  </div>
                </div>
              </div>

              {/* TWO-COLUMN LAYOUT: WEBCAM ON LEFT, CONVERSION & AI SYMPTOM BOX ON RIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: WEBCAM VIEWPORT */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold uppercase text-gray-800">
                        Sign Medical Symptoms into Camera
                      </label>
                      <span className="text-[11px] font-bold text-red-600">
                        Sign letter (e.g. F for Fever, C for Chest Pain)
                      </span>
                    </div>

                    <LiveCameraViewport
                      onSignRecognized={handleHospitalCameraSign}
                      viewportTitle="Hospital Triage Recognition Viewport"
                      accentColor="#B3261E"
                    />
                  </div>

                  {/* Recognition Hint Card */}
                  <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl text-xs text-red-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-red-600" />
                      <span>Smart Alphabet-to-Symptom Matching</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-red-800">
                      Sign the first letter of your discomfort (e.g. <strong>"F"</strong> for Fever, <strong>"H"</strong> for Headache, <strong>"C"</strong> for Chest Pain, <strong>"B"</strong> for Breathing Difficulty). The AI box on the right will instantly recommend relevant medical symptoms.
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: AI SYMPTOM RECOMMENDER BOX & TRIAGE NOTE CONVERSION */}
                <div className="lg:col-span-6 space-y-4">
                  {/* REQUIREMENT 6: AI RECOMMENDATION BOX FOR HEALTH SYMPTOMS */}
                  <AISymptomRecommender
                    detectedSign={detectedHospitalSign}
                    onAddSymptom={handleAddSymptomFromAI}
                    accentColor="#B3261E"
                  />

                  {/* Converted Triage Note & Submission */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-sm sm:text-base text-gray-900">
                        Recognized Symptoms & Triage Note (Editable)
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-gray-500">Triage Urgency:</span>
                        <select
                          value={hospitalUrgency}
                          onChange={(e) => setHospitalUrgency(e.target.value as any)}
                          className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                            hospitalUrgency === 'Urgent'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : hospitalUrgency === 'High'
                              ? 'bg-orange-50 text-orange-700 border-orange-300'
                              : 'bg-gray-50 text-gray-700 border-gray-300'
                          }`}
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent (Immediate Nurse)</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      id="hospital-symptom-box"
                      rows={3}
                      value={hospitalSymptoms}
                      onChange={(e) => setHospitalSymptoms(e.target.value)}
                      placeholder="Recognized symptoms will appear here automatically when signed..."
                      className="w-full border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed"
                    />

                    {/* Transmit Button */}
                    <button
                      type="button"
                      onClick={handleSubmitHospital}
                      className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <HeartPulse className="w-4 h-4" />
                      <span>Transmit to Hospital Triage Staff</span>
                    </button>

                    {hospitalSubmitted && (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-center space-y-1 animate-in zoom-in-95">
                        <div className="font-bold text-emerald-800 text-sm flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Symptom Logged & Transmitted to Triage Nurse!</span>
                        </div>
                        <div className="text-xs text-gray-700">
                          Triage Reference: <strong className="font-mono">{hospitalSubmitted}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* EQ Vocabulary Modal Component */}
      <EqVocabularyModal
        isOpen={isEqVocabOpen}
        onClose={() => setIsEqVocabOpen(false)}
        onSelectTerm={(term) => {
          if (activeService === 'ticket') {
            setTicketDetails((prev) => `${prev} | ${term}`);
          } else if (activeService === 'servicesathi') {
            setSathiDetails((prev) => `${prev} | ${term}`);
          } else if (activeService === 'hospital') {
            setHospitalSymptoms((prev) => `${prev} | ${term}`);
          }
          setIsEqVocabOpen(false);
        }}
      />
    </div>
  );
};
