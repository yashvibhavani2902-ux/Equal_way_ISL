import { FingerAngles, ISLSignItem } from '../types';

export const ISL_FINGER_PROFILES: Record<string, FingerAngles> = {
  // Alphabet Profiles (Thumb, Index, Middle, Ring, Pinky angles in degrees [0, 180])
  A: { thumb: 165, index: 40, middle: 35, ring: 30, pinky: 25 },
  B: { thumb: 50, index: 175, middle: 170, ring: 165, pinky: 160 },
  C: { thumb: 110, index: 105, middle: 100, ring: 95, pinky: 90 },
  D: { thumb: 80, index: 175, middle: 50, ring: 45, pinky: 40 },
  E: { thumb: 40, index: 45, middle: 40, ring: 35, pinky: 30 },
  F: { thumb: 75, index: 75, middle: 175, ring: 170, pinky: 165 },
  G: { thumb: 160, index: 165, middle: 35, ring: 30, pinky: 25 },
  H: { thumb: 45, index: 170, middle: 165, ring: 35, pinky: 30 },
  I: { thumb: 40, index: 35, middle: 30, ring: 25, pinky: 175 },
  J: { thumb: 40, index: 35, middle: 30, ring: 25, pinky: 165 },
  K: { thumb: 150, index: 175, middle: 120, ring: 30, pinky: 25 },
  L: { thumb: 170, index: 175, middle: 35, ring: 30, pinky: 25 },
  M: { thumb: 30, index: 50, middle: 45, ring: 40, pinky: 35 },
  N: { thumb: 30, index: 50, middle: 45, ring: 35, pinky: 30 },
  O: { thumb: 90, index: 85, middle: 80, ring: 75, pinky: 70 },
  P: { thumb: 140, index: 150, middle: 100, ring: 30, pinky: 25 },
  Q: { thumb: 150, index: 145, middle: 30, ring: 25, pinky: 20 },
  R: { thumb: 40, index: 170, middle: 170, ring: 30, pinky: 25 },
  S: { thumb: 50, index: 35, middle: 30, ring: 25, pinky: 20 },
  T: { thumb: 60, index: 55, middle: 30, ring: 25, pinky: 20 },
  U: { thumb: 40, index: 175, middle: 170, ring: 30, pinky: 25 },
  V: { thumb: 40, index: 175, middle: 170, ring: 30, pinky: 25 },
  W: { thumb: 40, index: 175, middle: 170, ring: 165, pinky: 25 },
  X: { thumb: 45, index: 95, middle: 35, ring: 30, pinky: 25 },
  Y: { thumb: 175, index: 35, middle: 30, ring: 25, pinky: 170 },
  Z: { thumb: 40, index: 175, middle: 35, ring: 30, pinky: 25 },

  // Words & Common Phrases
  "HELLO": { thumb: 165, index: 175, middle: 170, ring: 165, pinky: 160 },
  "THANK YOU": { thumb: 150, index: 170, middle: 165, ring: 160, pinky: 155 },
  "WELCOME": { thumb: 140, index: 165, middle: 160, ring: 155, pinky: 150 },
  "PLEASE": { thumb: 155, index: 160, middle: 155, ring: 150, pinky: 145 },
  "GOOD MORNING": { thumb: 170, index: 165, middle: 160, ring: 155, pinky: 150 },
  "BYE": { thumb: 160, index: 170, middle: 165, ring: 160, pinky: 155 },
  "YES": { thumb: 160, index: 40, middle: 35, ring: 30, pinky: 25 },
  "NO": { thumb: 150, index: 165, middle: 160, ring: 35, pinky: 30 },

  "DOCTOR": { thumb: 130, index: 165, middle: 160, ring: 40, pinky: 35 },
  "HOSPITAL": { thumb: 120, index: 170, middle: 35, ring: 30, pinky: 25 },
  "HELP": { thumb: 175, index: 35, middle: 30, ring: 25, pinky: 20 },
  "FEVER": { thumb: 140, index: 165, middle: 160, ring: 155, pinky: 150 },
  "MEDICINE": { thumb: 110, index: 150, middle: 145, ring: 35, pinky: 30 },
  "EMERGENCY": { thumb: 165, index: 170, middle: 165, ring: 160, pinky: 155 },

  "TICKET": { thumb: 110, index: 120, middle: 115, ring: 35, pinky: 30 },
  "TRAIN": { thumb: 45, index: 170, middle: 165, ring: 35, pinky: 30 },
  "BUS": { thumb: 150, index: 45, middle: 40, ring: 35, pinky: 30 },
  "COMPLAINT": { thumb: 120, index: 110, middle: 105, ring: 100, pinky: 95 },
  "OFFICE": { thumb: 130, index: 160, middle: 155, ring: 35, pinky: 30 },
  "AADHAAR": { thumb: 140, index: 165, middle: 160, ring: 35, pinky: 30 },
  "POLICE": { thumb: 155, index: 170, middle: 35, ring: 30, pinky: 25 }
};

export const ISL_ALPHABETS_DICT: Record<string, ISLSignItem> = {
  A: {
    id: 'A',
    label: 'A',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Two hands in closed fists with thumbs upright, touching each other at thumb tips',
    steps: ['Make closed fists with both hands', 'Point both thumbs upward', 'Touch thumb tips together'],
    targetAngles: ISL_FINGER_PROFILES['A']
  },
  B: {
    id: 'B',
    label: 'B',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Index and thumb of both hands form two circles touching side-by-side (glasses shape)',
    steps: ['Pinch thumb and index of both hands into loops', 'Bring the two loops together side by side'],
    targetAngles: ISL_FINGER_PROFILES['B']
  },
  C: {
    id: 'C',
    label: 'C',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'One hand with curved fingers and thumb forming a clear C shape',
    steps: ['Curve fingers and thumb of right hand', 'Hold sideways to form letter C'],
    targetAngles: ISL_FINGER_PROFILES['C']
  },
  D: {
    id: 'D',
    label: 'D',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index upright as stem; right index and thumb form curved semicircle loop touching upright finger',
    steps: ['Hold left index finger straight up', 'Form semicircle with right thumb and index', 'Touch tips to left index to complete D'],
    targetAngles: ISL_FINGER_PROFILES['D']
  },
  E: {
    id: 'E',
    label: 'E',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index upright; right index finger points directly at tip of left index finger',
    steps: ['Hold left index pointing up', 'Point right index finger at tip of left index'],
    targetAngles: ISL_FINGER_PROFILES['E']
  },
  F: {
    id: 'F',
    label: 'F',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index finger held upright; right index and middle fingers cross horizontally over it',
    steps: ['Hold left index finger upright', 'Cross right index and middle fingers horizontally over left index'],
    targetAngles: ISL_FINGER_PROFILES['F']
  },
  G: {
    id: 'G',
    label: 'G',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Both hands in closed fists, right fist placed directly on top of left fist',
    steps: ['Form fist with left hand', 'Place right fist directly on top of left fist'],
    targetAngles: ISL_FINGER_PROFILES['G']
  },
  H: {
    id: 'H',
    label: 'H',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'dynamic',
    handRequirement: 2,
    description: 'Left flat open palm held diagonal; right flat fingers brush across left palm from wrist to fingertips',
    steps: ['Open left palm facing upward', 'Brush flat right hand across left palm'],
    targetAngles: ISL_FINGER_PROFILES['H']
  },
  I: {
    id: 'I',
    label: 'I',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'Right index finger points and touches the right cheek lightly',
    steps: ['Extend right index finger', 'Touch tip of index finger to cheek'],
    targetAngles: ISL_FINGER_PROFILES['I']
  },
  J: {
    id: 'J',
    label: 'J',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'dynamic',
    handRequirement: 2,
    description: 'Left index upright; right index traces down left index and draws a J-hook curve at bottom',
    steps: ['Hold left index upright', 'Trace right index down left index', 'Hook outward at base like J'],
    targetAngles: ISL_FINGER_PROFILES['J']
  },
  K: {
    id: 'K',
    label: 'K',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index upright; right crooked index finger hooks around the side of the left index',
    steps: ['Hold left index upright', 'Bend right index into a hook', 'Rest right hook around left index'],
    targetAngles: ISL_FINGER_PROFILES['K']
  },
  L: {
    id: 'L',
    label: 'L',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'Thumb and index finger extended at 90-degree right angle forming letter L',
    steps: ['Extend right index straight up', 'Extend right thumb horizontally', 'Keep other fingers closed'],
    targetAngles: ISL_FINGER_PROFILES['L']
  },
  M: {
    id: 'M',
    label: 'M',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left open palm facing up; right hand places 3 fingers (index, middle, ring) on left palm',
    steps: ['Hold open left palm', 'Place tips of right index, middle, and ring fingers on left palm'],
    targetAngles: ISL_FINGER_PROFILES['M']
  },
  N: {
    id: 'N',
    label: 'N',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left open palm facing up; right hand places 2 fingers (index, middle) on left palm',
    steps: ['Hold open left palm', 'Place tips of right index and middle fingers on left palm'],
    targetAngles: ISL_FINGER_PROFILES['N']
  },
  O: {
    id: 'O',
    label: 'O',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'All fingers curved with fingertips touching thumb tip to form a full circular O',
    steps: ['Curve all right fingers', 'Touch fingertips to thumb tip forming circle O'],
    targetAngles: ISL_FINGER_PROFILES['O']
  },
  P: {
    id: 'P',
    label: 'P',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index upright; right index and thumb form loop around upper section of left index',
    steps: ['Hold left index upright', 'Form loop with right index and thumb', 'Place loop over upper half of left index'],
    targetAngles: ISL_FINGER_PROFILES['P']
  },
  Q: {
    id: 'Q',
    label: 'Q',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index and thumb form circle; right index hooks downward into the circle',
    steps: ['Form circle with left thumb and index', 'Hook right index downward into left circle'],
    targetAngles: ISL_FINGER_PROFILES['Q']
  },
  R: {
    id: 'R',
    label: 'R',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left open palm held flat; right index finger crooked/bent rests in center of left palm',
    steps: ['Hold flat open left palm', 'Bend right index finger', 'Place crooked right index in center of left palm'],
    targetAngles: ISL_FINGER_PROFILES['R']
  },
  S: {
    id: 'S',
    label: 'S',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Both hands in closed fists with little fingers (pinkies) hooked securely together',
    steps: ['Make fists with both hands', 'Extend pinky fingers', 'Interlock pinky fingers together'],
    targetAngles: ISL_FINGER_PROFILES['S']
  },
  T: {
    id: 'T',
    label: 'T',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Left index held upright; right index placed horizontally on top like a T-bar',
    steps: ['Hold left index upright as vertical stem', 'Place right index horizontally on top of left index'],
    targetAngles: ISL_FINGER_PROFILES['T']
  },
  U: {
    id: 'U',
    label: 'U',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'Index and middle fingers extended straight up touching side-by-side; thumb folded',
    steps: ['Extend index and middle straight up together', 'Fold thumb over ring and pinky'],
    targetAngles: ISL_FINGER_PROFILES['U']
  },
  V: {
    id: 'V',
    label: 'V',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 1,
    description: 'Index and middle fingers extended apart in a clear V shape (peace sign)',
    steps: ['Extend index and middle fingers', 'Spread them apart into a V shape'],
    targetAngles: ISL_FINGER_PROFILES['V']
  },
  W: {
    id: 'W',
    label: 'W',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Fingers of both hands interlaced and crossed with index and middle extended forming W',
    steps: ['Cross fingers of both hands', 'Extend index and middle fingers upward together'],
    targetAngles: ISL_FINGER_PROFILES['W']
  },
  X: {
    id: 'X',
    label: 'X',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Index fingers of both hands extended and crossed over each other forming an X',
    steps: ['Extend index finger of both hands', 'Cross right index over left index in X shape'],
    targetAngles: ISL_FINGER_PROFILES['X']
  },
  Y: {
    id: 'Y',
    label: 'Y',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'static',
    handRequirement: 2,
    description: 'Right index finger rests in V-cleft between thumb and index of left hand',
    steps: ['Spread left thumb and index apart', 'Place right index finger into the cleft between them'],
    targetAngles: ISL_FINGER_PROFILES['Y']
  },
  Z: {
    id: 'Z',
    label: 'Z',
    type: 'alphabet',
    category: 'Alphabet',
    kinematicType: 'dynamic',
    handRequirement: 2,
    description: 'Left hand held vertical flat like a wall; right index finger traces horizontal Z against it',
    steps: ['Hold left hand vertical and flat', 'Trace right index across left palm in Z motion'],
    targetAngles: ISL_FINGER_PROFILES['Z']
  }
};

export const ISL_WORDS_DICT: Record<string, ISLSignItem> = {
  "HELLO": {
    id: "HELLO",
    label: "Hello",
    type: "word",
    category: "Greetings",
    description: "Open right palm raised to temple and waved outward slightly",
    steps: ["Open palm at chest level", "Raise to forehead height", "Move horizontally outward"],
    targetAngles: ISL_FINGER_PROFILES["HELLO"]
  },
  "THANK YOU": {
    id: "THANK YOU",
    label: "Thank You",
    type: "word",
    category: "Greetings",
    description: "Flat hand touches chin/lips then moves forward toward person",
    steps: ["Fingertips touch lips", "Extend palm forward facing recipient"],
    targetAngles: ISL_FINGER_PROFILES["THANK YOU"]
  },
  "WELCOME": {
    id: "WELCOME",
    label: "Welcome",
    type: "word",
    category: "Greetings",
    description: "Open palm sweeps gracefully inward toward chest",
    steps: ["Extend open palm forward", "Sweep inward toward torso"],
    targetAngles: ISL_FINGER_PROFILES["WELCOME"]
  },
  "PLEASE": {
    id: "PLEASE",
    label: "Please",
    type: "word",
    category: "Greetings",
    description: "Open palm circles smoothly over center of chest",
    steps: ["Place flat palm on chest", "Rotate clockwise in a smooth circle"],
    targetAngles: ISL_FINGER_PROFILES["PLEASE"]
  },
  "GOOD MORNING": {
    id: "GOOD MORNING",
    label: "Good Morning",
    type: "word",
    category: "Greetings",
    description: "Flat hand moves from chin downward, then right hand rises like the sun",
    steps: ["Touch chin with palm", "Rise right arm upward over horizontal left forearm"],
    targetAngles: ISL_FINGER_PROFILES["GOOD MORNING"]
  },
  "BYE": {
    id: "BYE",
    label: "Bye",
    type: "word",
    category: "Greetings",
    description: "Open hand waves fingers up and down in friendly gesture",
    steps: ["Raise open palm", "Flex fingers up and down repeatedly"],
    targetAngles: ISL_FINGER_PROFILES["BYE"]
  },
  "DOCTOR": {
    id: "DOCTOR",
    label: "Doctor",
    type: "word",
    category: "Medical Terms",
    description: "Right fingertips tap inner left wrist (feeling pulse)",
    steps: ["Extend left arm forward", "Tap right index & middle fingertips twice on left wrist"],
    targetAngles: ISL_FINGER_PROFILES["DOCTOR"]
  },
  "HOSPITAL": {
    id: "HOSPITAL",
    label: "Hospital",
    type: "word",
    category: "Medical Terms",
    description: "Index finger draws a cross shape on upper left arm shoulder",
    steps: ["Extend right index finger", "Draw vertical line then horizontal line on left upper arm"],
    targetAngles: ISL_FINGER_PROFILES["HOSPITAL"]
  },
  "HELP": {
    id: "HELP",
    label: "Help",
    type: "word",
    category: "Medical Terms",
    description: "Closed fist with thumb up rested on flat left palm, lifted upward together",
    steps: ["Place thumbs-up right hand on left palm", "Lift both hands upward together"],
    targetAngles: ISL_FINGER_PROFILES["HELP"]
  },
  "FEVER": {
    id: "FEVER",
    label: "Fever",
    type: "word",
    category: "Medical Terms",
    description: "Back of right hand touches forehead lightly to check temperature",
    steps: ["Raise hand to forehead", "Touch back of hand against brow"],
    targetAngles: ISL_FINGER_PROFILES["FEVER"]
  },
  "MEDICINE": {
    id: "MEDICINE",
    label: "Medicine",
    type: "word",
    category: "Medical Terms",
    description: "Middle finger rubs circle on palm then moves to mouth",
    steps: ["Circle middle finger in opposite palm", "Bring finger tip toward mouth"],
    targetAngles: ISL_FINGER_PROFILES["MEDICINE"]
  },
  "EMERGENCY": {
    id: "EMERGENCY",
    label: "Emergency",
    type: "word",
    category: "Medical Terms",
    description: "E hand shape shakes side to side urgently",
    steps: ["Form E hand shape", "Shake hand horizontally with urgency"],
    targetAngles: ISL_FINGER_PROFILES["EMERGENCY"]
  },
  "TICKET": {
    id: "TICKET",
    label: "Ticket",
    type: "word",
    category: "Government & Public Services",
    description: "Bent index & middle fingers tap twice on flat palm edge",
    steps: ["Hold flat left hand horizontal", "Tap right bent index/middle fingers on left palm"],
    targetAngles: ISL_FINGER_PROFILES["TICKET"]
  },
  "TRAIN": {
    id: "TRAIN",
    label: "Train",
    type: "word",
    category: "Government & Public Services",
    description: "Two fingers of right hand rub back and forth on two fingers of left hand",
    steps: ["Extend index & middle finger on both hands", "Slide right fingers back & forth across left fingers"],
    targetAngles: ISL_FINGER_PROFILES["TRAIN"]
  },
  "BUS": {
    id: "BUS",
    label: "Bus",
    type: "word",
    category: "Government & Public Services",
    description: "Hands hold imaginary steering wheel and rotate left-right",
    steps: ["Form light fists with both hands", "Steer left and right in driving motion"],
    targetAngles: ISL_FINGER_PROFILES["BUS"]
  },
  "COMPLAINT": {
    id: "COMPLAINT",
    label: "Complaint",
    type: "word",
    category: "Government & Public Services",
    description: "Cupped palm strikes chest lightly twice",
    steps: ["Form loose cup with right hand", "Tap center of chest twice"],
    targetAngles: ISL_FINGER_PROFILES["COMPLAINT"]
  },
  "OFFICE": {
    id: "OFFICE",
    label: "Office",
    type: "word",
    category: "Government & Public Services",
    description: "Both O hands form room corners in air",
    steps: ["Form O shape with both hands", "Move outward to outline square room walls"],
    targetAngles: ISL_FINGER_PROFILES["OFFICE"]
  },
  "AADHAAR": {
    id: "AADHAAR",
    label: "UDID Card",
    type: "word",
    category: "Government & Public Services",
    description: "Draw rectangular card outline in air with index fingers",
    steps: ["Form rectangle outline with both index fingers", "Tap chest badge area"],
    targetAngles: ISL_FINGER_PROFILES["AADHAAR"]
  },
  "POLICE": {
    id: "POLICE",
    label: "Police",
    type: "word",
    category: "Government & Public Services",
    description: "C hand shape taps left chest over badge location",
    steps: ["Form C shape with right hand", "Tap twice over upper left chest"],
    targetAngles: ISL_FINGER_PROFILES["POLICE"]
  }
};

export interface SignSequenceToken {
  type: 'word' | 'alphabet';
  key: string;
  item: ISLSignItem;
}

export function parseTextToSignSequence(text: string): SignSequenceToken[] {
  if (!text || typeof text !== 'string') return [];
  
  const clean = text.trim().toUpperCase().replace(/[^A-Z0-9\s]/g, "");
  if (!clean) return [];

  const words = clean.split(/\s+/);
  const sequence: SignSequenceToken[] = [];

  words.forEach(word => {
    if (ISL_WORDS_DICT[word]) {
      sequence.push({
        type: 'word',
        key: word,
        item: ISL_WORDS_DICT[word]
      });
    } else {
      // Finger spell each character
      for (const char of word) {
        if (ISL_ALPHABETS_DICT[char]) {
          sequence.push({
            type: 'alphabet',
            key: char,
            item: ISL_ALPHABETS_DICT[char]
          });
        }
      }
    }
  });

  return sequence;
}
