import React, { useState, useRef } from 'react';
import { 
  UserRound, 
  Camera, 
  Upload, 
  ShieldCheck, 
  ArrowRight, 
  IdCard, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { CitizenProfile, UserProfile } from '../../../types';

export const DEFAULT_AVATAR_SILHOUETTE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='%23d1fae5' stroke='%23009E73' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

interface ISLPublicLoginProps {
  onLogin: (profile: CitizenProfile) => void;
}

export const ISLPublicLogin: React.FC<ISLPublicLoginProps> = ({ onLogin }) => {
  // Citizen Form States - starts completely blank for the user to enter their own details
  const [citizenName, setCitizenName] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [preferredSignMode, setPreferredSignMode] = useState('ISL Native (Signer)');
  const [citizenPhoto, setCitizenPhoto] = useState<string>('');

  // Camera Selfie State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCitizenPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Selfie Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Unable to access webcam for selfie capture', err);
      setIsCameraActive(false);
      alert('Camera access unavailable. You can upload an image file using the "Upload Image" option.');
    }
  };

  // Capture Selfie
  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 320);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCitizenPhoto(dataUrl);
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Submit Login
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim()) {
      alert('Please enter your full name (पूरा नाम).');
      return;
    }
    if (!citizenId.trim()) {
      alert('Please enter your UDID / Disability Card Number.');
      return;
    }

    const profile: CitizenProfile = {
      role: 'citizen',
      name: citizenName.trim(),
      citizenId: citizenId.trim(),
      photoUrl: citizenPhoto || DEFAULT_AVATAR_SILHOUETTE,
      phone: citizenPhone.trim() || undefined,
      preferredSignMode,
    };
    onLogin(profile);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-[#009E73] border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          EqualWay Citizen Portal
        </span>
        <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#000000]">
          Citizen ISL Services Access
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Please enter your details to access sign-language enabled travel booking, civic complaints, and emergency hospital triage.
        </p>
      </div>

      {/* Login Card Content */}
      <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Col: Photo Selection & Identity Badge */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 via-emerald-100/40 to-teal-50 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-emerald-100 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#009E73]">
                <IdCard className="w-4 h-4" />
                <span>Citizen Identity & Photo</span>
              </div>

              {/* Avatar Display - Empty placeholder by default or live webcam or uploaded image */}
              <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-white shadow-md flex items-center justify-center group">
                {isCameraActive ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 px-2">
                      <button
                        type="button"
                        onClick={captureSelfie}
                        className="px-2.5 py-1 bg-[#009E73] hover:bg-emerald-700 text-white text-[11px] font-black rounded-full shadow-md transition-colors cursor-pointer"
                      >
                        Snap Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-2 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : citizenPhoto ? (
                  <div className="relative w-full h-full">
                    <img
                      src={citizenPhoto}
                      alt="Citizen Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase shadow-xs">
                        Attached
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCitizenPhoto('')}
                        title="Remove photo"
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Clean Empty Photo Placeholder */
                  <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <UserRound className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                        No Photo Added
                      </p>
                      <p className="text-[10px] text-gray-500 max-w-[130px] leading-tight">
                        Add your picture using the options below
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Only Two Clear Options: Upload Image & Take Photo / Use Camera */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl font-bold hover:bg-emerald-50 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <Upload className="w-4 h-4 text-[#009E73]" />
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#009E73] hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCameraActive ? 'Close Camera' : 'Take Photo'}</span>
                </button>
              </div>

              {/* Verified Passenger Badge Hint */}
              <div className="p-3 bg-white/80 border border-emerald-200 rounded-xl text-[11px] text-gray-700 space-y-1 shadow-2xs">
                <div className="font-bold text-[#009E73] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Passenger Photo</span>
                </div>
                <p>
                  When added, your photo will be securely embedded on your official travel ticket / boarding pass upon confirmation.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 pt-4 flex items-center justify-between border-t border-emerald-100/80">
              <span>EqualWay Universal Sign Protocol</span>
              <span className="font-bold text-[#009E73]">Universal Access</span>
            </div>
          </div>

          {/* Right Col: Citizen Details Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-heading text-xl font-bold text-[#000000]">
                Citizen Profile Details
              </h3>
              <p className="text-xs text-gray-500">
                Please enter your personal details and disability identification to access public desks.
              </p>
            </div>

            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="cit-name" className="block text-xs font-extrabold text-gray-800">
                  Full Name (पूरा नाम) *
                </label>
                <input
                  id="cit-name"
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-gray-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UDID / Disability Card Number ONLY - No Aadhaar */}
                <div className="space-y-1">
                  <label htmlFor="cit-id" className="block text-xs font-extrabold text-gray-800">
                    UDID / Disability Card Number (यूडीआईडी / दिव्यांगता कार्ड नंबर) *
                  </label>
                  <input
                    id="cit-id"
                    type="text"
                    required
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="e.g. MH2610319980123456 or Card No."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-gray-900 transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-500">
                    Only valid UDID or State Disability Card accepted.
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="cit-phone" className="block text-xs font-extrabold text-gray-800">
                    Mobile Number (SMS / WhatsApp Updates)
                  </label>
                  <input
                    id="cit-phone"
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-gray-900 transition-all"
                  />
                </div>
              </div>

              {/* Preferred Mode of Communication */}
              <div className="space-y-1">
                <label htmlFor="cit-mode" className="block text-xs font-extrabold text-gray-800">
                  Preferred Communication Mode at Public Counters
                </label>
                <select
                  id="cit-mode"
                  value={preferredSignMode}
                  onChange={(e) => setPreferredSignMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#009E73] focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-gray-900 transition-all"
                >
                  <option value="ISL Native (Signer)">Indian Sign Language (ISL Native Signer)</option>
                  <option value="ISL + Written Text">ISL Bilingual (Sign + Real-time Text)</option>
                  <option value="Assisted / Signer">Assisted by Companion / Caregiver</option>
                </select>
              </div>

              {/* Available Services Notice */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs text-gray-700">
                <span className="font-semibold">Enabled Desks:</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold">1. Travel Ticket</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold">2. ServiceSathi</span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-md font-bold">3. Hospital Triage</span>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#009E73] hover:bg-[#008762] text-white font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Citizen Services Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
