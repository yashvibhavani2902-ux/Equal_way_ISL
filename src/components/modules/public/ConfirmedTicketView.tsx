import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Train, 
  Bus, 
  Plane, 
  QrCode, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Share2,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { ConfirmedTravelTicket } from '../../../types';

interface ConfirmedTicketViewProps {
  ticket: ConfirmedTravelTicket;
  onClose: () => void;
  onBookAnother: () => void;
}

export const ConfirmedTicketView: React.FC<ConfirmedTicketViewProps> = ({
  ticket,
  onClose,
  onBookAnother,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner with Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 no-print">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Desk</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBookAnother}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors cursor-pointer"
          >
            <span>Book Another Journey</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#009E73] hover:bg-[#007f5d] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer print-include"
          >
            <Printer className="w-4 h-4" />
            <span>Print Confirmed Ticket</span>
          </button>
        </div>
      </div>

      {/* Printable E-Ticket / Boarding Pass Card */}
      <div 
        id="printable-ticket" 
        className="print-area bg-white border-2 border-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-3xl mx-auto"
      >
        {/* Ticket Header */}
        <div className="bg-[#0B2545] text-white p-5 sm:p-6 flex items-center justify-between flex-wrap gap-4 border-b-4 border-[#009E73]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              {ticket.mode === 'Train' && <Train className="w-7 h-7 text-emerald-400" />}
              {ticket.mode === 'Bus' && <Bus className="w-7 h-7 text-emerald-400" />}
              {ticket.mode === 'Flight' && <Plane className="w-7 h-7 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  EqualWay Accessible Transit Network
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                  CNF
                </span>
              </div>
              <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                {ticket.serviceName}
              </h1>
              <p className="text-xs text-gray-300">
                Official Electronic Travel Ticket & Boarding Pass
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-gray-400 block uppercase">Booking Reference / PNR</span>
            <span className="font-mono font-black text-lg sm:text-xl text-white tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/20 inline-block mt-0.5">
              {ticket.pnr}
            </span>
          </div>
        </div>

        {/* Status Confirmation Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#009E73]" />
            <span>Booking Status: CONFIRMED • Priority Accessible Travel Quota (Divyangjan)</span>
          </div>
          <span className="font-mono text-gray-600 hidden sm:inline">Issued: {ticket.bookingTime}</span>
        </div>

        {/* Ticket Main Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Passenger Identity Row with Logged-in Image */}
          <div className="bg-gradient-to-r from-gray-50 via-emerald-50/30 to-blue-50/20 border-2 border-dashed border-gray-300 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* The Citizen's Login Image */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-[#009E73] shadow-md bg-white">
                  <img
                    src={ticket.photoUrl}
                    alt={ticket.passengerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 bg-[#009E73] text-white rounded text-[9px] font-black uppercase tracking-wider shadow-xs">
                  Verified
                </span>
              </div>

              {/* Passenger Metadata */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-[#009E73] rounded-md">
                    Passenger Identity
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 font-mono">
                    ID: {ticket.citizenId}
                  </span>
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-gray-900">
                  {ticket.passengerName}
                </h2>
                <p className="text-xs text-gray-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009E73]" />
                  <span>Accessible Quota: <strong>{ticket.quota}</strong></span>
                </p>
              </div>
            </div>

            {/* Seat & Class Allocation */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:text-right shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-gray-500 block">Class & Coach / Seat</span>
              <div className="font-heading font-black text-lg sm:text-xl text-[#0B2545]">
                {ticket.travelClass}
              </div>
              <div className="font-mono font-bold text-sm text-[#009E73]">
                {ticket.seatBerth}
              </div>
            </div>
          </div>

          {/* Route Grid: From -> To */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-gray-50 border border-gray-200 rounded-2xl p-5">
            {/* Origin (From) */}
            <div className="sm:col-span-5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                FROM (प्रारंभिक स्टेशन)
              </span>
              <div className="font-heading font-black text-xl text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{ticket.fromStation}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Boarding Point Confirmed</span>
            </div>

            {/* Transit Arrow */}
            <div className="sm:col-span-2 flex flex-col items-center justify-center py-2 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ticket.mode}</span>
              <div className="w-full flex items-center justify-center my-1">
                <div className="h-0.5 w-full bg-gray-300"></div>
                <div className="px-2 font-black text-gray-500">➔</div>
                <div className="h-0.5 w-full bg-gray-300"></div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Direct
              </span>
            </div>

            {/* Destination (To) */}
            <div className="sm:col-span-5 space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                TO (गंतव्य स्टेशन)
              </span>
              <div className="font-heading font-black text-xl text-gray-900 flex items-center sm:justify-end gap-2">
                <span>{ticket.toStation}</span>
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Destination Platform Terminal</span>
            </div>
          </div>

          {/* Schedule & Fare Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Journey Date</span>
              <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                {ticket.travelDate}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Departure</span>
              <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                08:30 IST (Scheduled)
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Fare</span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                {ticket.fare}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Booking Mode</span>
              <span className="font-bold text-blue-800 text-sm mt-0.5 block">
                ISL Camera Gesture
              </span>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="border-t border-gray-200 pt-5 flex items-center justify-between flex-wrap gap-4">
            {/* Visual Barcode Graphic */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-500 block">
                TICKET BARCODE & CONDUCTOR SCAN CODE
              </span>
              <div className="flex items-center gap-1 h-8">
                {/* SVG Barcode simulation */}
                <svg className="h-8 w-48 sm:w-60" viewBox="0 0 240 32" fill="none">
                  <rect x="0" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="5" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="9" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="17" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="22" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="28" y="0" width="1" height="32" fill="#1A1A1A" />
                  <rect x="32" y="0" width="6" height="32" fill="#1A1A1A" />
                  <rect x="41" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="46" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="52" y="0" width="7" height="32" fill="#1A1A1A" />
                  <rect x="62" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="67" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="74" y="0" width="1" height="32" fill="#1A1A1A" />
                  <rect x="78" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="86" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="92" y="0" width="6" height="32" fill="#1A1A1A" />
                  <rect x="101" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="106" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="113" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="119" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="127" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="132" y="0" width="6" height="32" fill="#1A1A1A" />
                  <rect x="141" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="148" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="153" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="161" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="167" y="0" width="7" height="32" fill="#1A1A1A" />
                  <rect x="177" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="182" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="189" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="197" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="202" y="0" width="6" height="32" fill="#1A1A1A" />
                  <rect x="211" y="0" width="3" height="32" fill="#1A1A1A" />
                  <rect x="217" y="0" width="5" height="32" fill="#1A1A1A" />
                  <rect x="225" y="0" width="2" height="32" fill="#1A1A1A" />
                  <rect x="230" y="0" width="4" height="32" fill="#1A1A1A" />
                  <rect x="237" y="0" width="3" height="32" fill="#1A1A1A" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-gray-500 block">
                *{ticket.pnr}*DIGITAL-EQUALWAY-VERIFIED*
              </span>
            </div>

            {/* Accessible Security Seal */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-[#009E73] p-1 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-6 h-6 text-[#009E73]" />
                <span className="text-[8px] font-black text-[#009E73] uppercase leading-tight">
                  ISL SEAL
                </span>
              </div>
              <div className="text-[11px] text-gray-500 max-w-xs leading-tight">
                <span className="font-bold text-gray-800 block">Valid Identification</span>
                Passenger photo embedded and authenticated via EqualWay Accessible Public Services Gateway.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tear-off Notice */}
        <div className="bg-gray-100 border-t border-gray-300 px-6 py-3 flex items-center justify-between text-[11px] text-gray-600 flex-wrap gap-2">
          <span>Carry original Photo ID / UDID card along with this printed ticket during travel.</span>
          <span className="font-mono font-bold text-gray-800">Govt. of India Certified</span>
        </div>
      </div>

      {/* Floating Bottom Print Prompt (Hidden on Print) */}
      <div className="text-center no-print pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#009E73] hover:bg-[#00825e] text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>Click Here to Print Ticket (with Login Photo)</span>
        </button>
      </div>
    </div>
  );
};
