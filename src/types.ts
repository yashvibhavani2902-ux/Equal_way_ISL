export type ModuleId = 'signbridge' | 'seekh' | 'public' | 'suraksha';

export type SignBranchTag = 'one-handed' | 'two-handed-symmetric' | 'two-handed-asymmetric';

export type HandPresenceState = 'no-hands' | 'one-hand' | 'two-hands';

export type SignKinematicType = 'static' | 'dynamic';

export interface FingerAngles {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
  thumbIndexSpread?: number;
  indexMiddleSpread?: number;
}

export interface FingerConfidence {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface SingleHandData {
  id: string;
  handedness: 'Right Hand' | 'Left Hand';
  confidence: number;
  landmarks: [number, number][]; // 21 landmarks
  box: { x: number; y: number; width: number; height: number };
  angles: FingerAngles;
  states: {
    thumb: 'EXTENDED' | 'CURVED' | 'CURLED';
    index: 'EXTENDED' | 'CURVED' | 'CURLED';
    middle: 'EXTENDED' | 'CURVED' | 'CURLED';
    ring: 'EXTENDED' | 'CURVED' | 'CURLED';
    pinky: 'EXTENDED' | 'CURVED' | 'CURLED';
  };
  fingerConfidence: FingerConfidence;
  movementScore: number;
  role: 'Dominant (Acting)' | 'Non-Dominant (Base)' | 'Single Hand';
  missingFrames: number; // for occlusion interpolation (up to 8 frames)
}

export interface MultiHandDetectionResult {
  presenceState: HandPresenceState;
  hands: SingleHandData[];
  handCount: 0 | 1 | 2;
  tag: SignBranchTag;
  kinematicType: SignKinematicType;
  dominantHand?: 'Right Hand' | 'Left Hand';
  symmetryScore: number; // 0 to 100
  candidateSet: string[];
  classifiedSign: string | null;
  confidence: number;
  rankedCandidates: { sign: string; score: number }[];
  isStabilized: boolean;
  stabilizationProgress: number; // 0 to 100%
  statusMessage: string;
}

export interface HandTelemetry {
  angles: FingerAngles;
  states: {
    thumb: 'EXTENDED' | 'CURVED' | 'CURLED';
    index: 'EXTENDED' | 'CURVED' | 'CURLED';
    middle: 'EXTENDED' | 'CURVED' | 'CURLED';
    ring: 'EXTENDED' | 'CURVED' | 'CURLED';
    pinky: 'EXTENDED' | 'CURVED' | 'CURLED';
  };
  fingerConfidence: FingerConfidence;
  handedness: 'Right Hand' | 'Left Hand';
  confidence: number;
  handPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
    detected: boolean;
  };
  branchTag?: SignBranchTag;
  handCount?: 0 | 1 | 2;
}

export interface ISLSignItem {
  id: string;
  label: string;
  type: 'alphabet' | 'word';
  category: 'Alphabet' | 'Greetings' | 'Medical Terms' | 'Government & Public Services' | 'Everyday';
  kinematicType?: SignKinematicType;
  handRequirement?: 1 | 2;
  description: string;
  steps?: string[];
  targetAngles: FingerAngles;
  icon?: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  category: string;
  signsCount: number;
  signs: string[];
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CitizenProfile {
  role: 'citizen';
  name: string;
  citizenId: string;
  photoUrl: string;
  phone?: string;
  preferredSignMode: string;
}

export type UserProfile = CitizenProfile;

export interface ConfirmedTravelTicket {
  pnr: string;
  passengerName: string;
  citizenId: string;
  photoUrl: string;
  fromStation: string;
  toStation: string;
  mode: 'Train' | 'Bus' | 'Flight';
  serviceName: string;
  travelDate: string;
  travelClass: string;
  seatBerth: string;
  quota: string;
  bookingTime: string;
  fare: string;
  status: 'CONFIRMED' | 'RAC' | 'WAITLIST';
  signRecognitionNotes?: string;
}

export interface PublicServiceRequest {
  id: string;
  type: string;
  category: 'ticket' | 'servicesathi' | 'hospital';
  mode?: string;
  details: string;
  status: 'Pending Review' | 'Approved & Resolved' | 'Transmitted to Staff';
  timestamp: string;
  urgency?: 'Normal' | 'High' | 'Urgent';
}

export interface WardRecord {
  id: string; // 3-letter unique MudraID (e.g. "GAV", "VKR", "SAM")
  wardName: string;
  parentName: string;
  birthDate: string;
  primaryPreference: 'Hearing Impaired' | 'Speech Impaired' | 'Speech & Hearing Impaired' | 'General Accessibility' | 'Other';
  otherDisorder?: string;
  address: string;
  emergencyContact: string;
  medicalConditions?: string; // (optional)
  identificationNotes?: string; // (optional)
  registeredAt: string;
  syncedWithSupabase?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  officerBadge: string;
  searchedWardId: string;
  status: string;
}
