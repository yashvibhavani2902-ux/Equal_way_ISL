import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  HandMetal, 
  HeartHandshake, 
  Stethoscope, 
  Landmark, 
  CheckCircle2, 
  Volume2,
  Sparkles
} from 'lucide-react';
import { speechManager } from '../utils/speech';

interface EqVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

type VocabCategory = 'alphabets' | 'greetings' | 'medical' | 'government';

interface VocabItem {
  term: string;
  hindi?: string;
  category: VocabCategory;
  handType: '1-Hand' | '2-Hands';
  description: string;
  signTip: string;
  keywords?: string[];
}

export const EQ_VOCABULARY_DATA: VocabItem[] = [
  // Alphabets A-Z
  { term: 'A', category: 'alphabets', handType: '2-Hands', description: 'Left index finger touches tip of right thumb.', signTip: 'Touch dominant right thumb with non-dominant index finger.' },
  { term: 'B', category: 'alphabets', handType: '2-Hands', description: 'Join both index and thumb circles together forming glasses/figure-8.', signTip: 'Form circles with both hands and place edges together.' },
  { term: 'C', category: 'alphabets', handType: '1-Hand', description: 'Curved C-shape with dominant hand facing forward.', signTip: 'Form an open arc like the letter C.' },
  { term: 'D', category: 'alphabets', handType: '2-Hands', description: 'Right index touches left index while right thumb forms loop on left index.', signTip: 'Left index finger vertical, right thumb & index touch it.' },
  { term: 'E', category: 'alphabets', handType: '2-Hands', description: 'Left index touches tip of right index finger.', signTip: 'Touch tip of right index finger with left index.' },
  { term: 'F', category: 'alphabets', handType: '2-Hands', description: 'Cross right index and middle fingers over left index and middle fingers.', signTip: 'Two fingers of each hand crossed in hash formation.' },
  { term: 'G', category: 'alphabets', handType: '2-Hands', description: 'Both fists together with knuckles facing outward.', signTip: 'Place both clenched fists one above the other.' },
  { term: 'H', category: 'alphabets', handType: '2-Hands', description: 'Right open palm brushes horizontally across left flat palm.', signTip: 'Horizontal swipe across non-dominant palm.' },
  { term: 'I', category: 'alphabets', handType: '1-Hand', description: 'Upright pinky finger extended, rest of fist closed.', signTip: 'Single little finger pointing straight up.' },
  { term: 'J', category: 'alphabets', handType: '1-Hand', description: 'Extend pinky finger and trace a J-hook curve downwards.', signTip: 'Trace the letter J in the air with little finger.' },
  { term: 'K', category: 'alphabets', handType: '2-Hands', description: 'Right index points like a hook over left vertical index finger.', signTip: 'Left index upright, right index bent over knuckle.' },
  { term: 'L', category: 'alphabets', handType: '1-Hand', description: 'Index finger pointing up, thumb extended 90° forming an L.', signTip: 'Classic single-hand L-shape.' },
  { term: 'M', category: 'alphabets', handType: '2-Hands', description: 'Place three right fingers (index, middle, ring) on left palm.', signTip: '3 fingers resting vertically on open left palm.' },
  { term: 'N', category: 'alphabets', handType: '2-Hands', description: 'Place two right fingers (index, middle) on left palm.', signTip: '2 fingers resting vertically on open left palm.' },
  { term: 'O', category: 'alphabets', handType: '1-Hand', description: 'All fingers curve to meet thumb forming an O ring.', signTip: 'Single-hand circular O configuration.' },
  { term: 'P', category: 'alphabets', handType: '2-Hands', description: 'Right hand circle held against tip of left vertical index.', signTip: 'Left index upright, right hand forms small circle touching top.' },
  { term: 'Q', category: 'alphabets', handType: '2-Hands', description: 'Right thumb & index circle hooked around left index finger.', signTip: 'Interlock circle of right hand onto left upright finger.' },
  { term: 'R', category: 'alphabets', handType: '2-Hands', description: 'Right index finger bent like a hook resting on left palm.', signTip: 'Hooked right index rests on horizontal left palm.' },
  { term: 'S', category: 'alphabets', handType: '2-Hands', description: 'Both pinky fingers hooked together.', signTip: 'Interlock little fingers of both hands.' },
  { term: 'T', category: 'alphabets', handType: '2-Hands', description: 'Right index finger edge touches left vertical index finger side.', signTip: 'Form a T-junction with both index fingers.' },
  { term: 'U', category: 'alphabets', handType: '1-Hand', description: 'Index and middle fingers extended together upright.', signTip: '2 fingers upright and touching like the letter U.' },
  { term: 'V', category: 'alphabets', handType: '1-Hand', description: 'Index and middle fingers extended spread in peace/V sign.', signTip: 'Spread index and middle fingers in V sign.' },
  { term: 'W', category: 'alphabets', handType: '2-Hands', description: 'Interlace fingers of both hands pointing upwards diagonally.', signTip: 'Interlocking fingertips pointing up forming W peaks.' },
  { term: 'X', category: 'alphabets', handType: '2-Hands', description: 'Cross both index fingers in an X shape.', signTip: 'Index fingers crossing each other in the air.' },
  { term: 'Y', category: 'alphabets', handType: '1-Hand', description: 'Thumb and pinky extended wide, middle 3 fingers curled in.', signTip: 'Shaka / phone gesture with palm facing forward.' },
  { term: 'Z', category: 'alphabets', handType: '2-Hands', description: 'Right palm facing left palm perpendicularly.', signTip: 'Left flat palm vertical, right palm horizontal against it.' },

  // GREETINGS
  { term: 'HELLO', hindi: 'नमस्ते', category: 'greetings', handType: '2-Hands', description: 'Namaste palms together at chest level with gentle nod, or salute outward wave.', signTip: 'Join palms at chest or touch temple and open palm forward.' },
  { term: 'THANK YOU', hindi: 'धन्यवाद', category: 'greetings', handType: '1-Hand', description: 'Touch fingertips of flat hand to chin/lips and extend forward toward person.', signTip: 'Fingertips to chin, then move outward with a polite smile.' },
  { term: 'WELCOME', hindi: 'स्वागत है', category: 'greetings', handType: '2-Hands', description: 'Both hands open, palms facing up, sweeping inward toward chest.', signTip: 'Open arms gently gesturing inward invitingly.' },
  { term: 'PLEASE', hindi: 'कृपया', category: 'greetings', handType: '1-Hand', description: 'Flat palm rub in a circular motion on the center of chest.', signTip: 'Circular gentle clockwise rub over heart.' },
  { term: 'GOOD MORNING', hindi: 'शुभ प्रभात', category: 'greetings', handType: '2-Hands', description: 'Thumbs up (GOOD) followed by sun rising gesture over horizontal forearm.', signTip: 'Sign "Good" then raise dominant hand up like the morning sun.' },
  { term: 'GOOD NIGHT', hindi: 'शुभ रात्रि', category: 'greetings', handType: '2-Hands', description: 'Thumbs up (GOOD) followed by dominant hand going down below forearm like setting sun.', signTip: 'Sign "Good" then curve hand downwards into darkness.' },
  { term: 'BYE / GOODBYE', hindi: 'अलवि‍दा', category: 'greetings', handType: '1-Hand', description: 'Open palm facing outward waving fingers gently side to side.', signTip: 'Standard friendly hand wave at shoulder height.' },
  { term: 'HOW ARE YOU', hindi: 'आप कैसे हैं?', category: 'greetings', handType: '2-Hands', description: 'Curled hands knuckles touching chest, roll outward to open palms with questioning face.', signTip: 'Roll hands from chest outward with raised eyebrows.' },
  { term: 'NICE TO MEET YOU', hindi: 'आपसे मिलकर खुशी हुई', category: 'greetings', handType: '2-Hands', description: 'Brush palms together (NICE) then bring index fingers together meeting (MEET).', signTip: 'Swipe right palm over left, then bring two pointing index fingers face-to-face.' },
  { term: 'YES', hindi: 'हाँ', category: 'greetings', handType: '1-Hand', description: 'Clenched fist nods up and down like a nodding head.', signTip: 'S-fist tilting forward and back affirmatively.' },
  { term: 'NO', hindi: 'नहीं', category: 'greetings', handType: '1-Hand', description: 'Index and middle fingers snap down quickly against thumb.', signTip: 'Quick pinch snap of index+middle onto thumb.' },
  { term: 'SORRY', hindi: 'माफ कीजिए', category: 'greetings', handType: '1-Hand', description: 'A-fist rubs in gentle circular motion over the heart.', signTip: 'Fist circling chest with an apologetic facial expression.' },

  // MEDICAL OR HOSPITAL TERMS
  { term: 'DOCTOR', hindi: 'डॉक्टर / चिकित्सक', category: 'medical', handType: '2-Hands', description: 'Tap index and middle fingertips on the inside of the non-dominant wrist (checking pulse).', signTip: 'Right 2 fingers tap left radial wrist pulse 2 times.' },
  { term: 'HOSPITAL', hindi: 'अस्पताल', category: 'medical', handType: '2-Hands', description: 'Draw a cross on upper left shoulder/arm with index finger or H-fingers.', signTip: 'Trace vertical then horizontal line forming Red Cross.' },
  { term: 'MEDICINE', hindi: 'दवा', category: 'medical', handType: '2-Hands', description: 'Grind middle fingertip into left palm like crushing a pill with a mortar.', signTip: 'Circular grinding motion on open palm.' },
  { term: 'EMERGENCY', hindi: 'आपातकालीन', category: 'medical', handType: '1-Hand', description: 'E-handshape shakes urgently side-to-side with alarmed facial expression.', signTip: 'Rapid shaking E-hand with high urgency.' },
  { term: 'FEVER', hindi: 'बुखार', category: 'medical', handType: '1-Hand', description: 'Back of hand placed against forehead checking temperature.', signTip: 'Place back of dominant hand on forehead.' },
  { term: 'PAIN / HURT', hindi: 'दर्द', category: 'medical', handType: '2-Hands', description: 'Point index fingers toward each other and twist back and forth near affected area.', signTip: 'Index fingers jab toward each other with wincing facial expression.' },
  { term: 'NURSE', hindi: 'नर्स', category: 'medical', handType: '2-Hands', description: 'Draw a cross on forehead or upper arm with N-handshape.', signTip: 'N-fingers touch forehead cap position.' },
  { term: 'AMBULANCE', hindi: 'एम्बुलेंस', category: 'medical', handType: '1-Hand', description: 'Hand held above head twisting/flashing like a revolving siren beacon.', signTip: 'Open and close flared fingers rotating above head.' },
  { term: 'BLOOD TEST', hindi: 'खून की जांच', category: 'medical', handType: '2-Hands', description: 'Sign "Blood" (red from lip) then pinch forearm vein like syringe sample.', signTip: 'Touch bottom lip then mimic syringe draw on inner elbow.' },
  { term: 'INJECTION / VACCINE', hindi: 'सुई / टीका', category: 'medical', handType: '2-Hands', description: 'Thumb pushes plunger of index/middle syringe into upper shoulder.', signTip: 'Simulate needle prick into upper arm.' },
  { term: 'REST / BED', hindi: 'आराम', category: 'medical', handType: '2-Hands', description: 'Cross arms across chest or tilt head onto joined prayer hands.', signTip: 'Head rests gently on hands like a pillow.' },
  { term: 'OXYGEN', hindi: 'ऑक्सीजन', category: 'medical', handType: '1-Hand', description: 'Cup hand over nose and mouth inhaling deeply.', signTip: 'Cupped hand simulates breathing mask.' },

  // GOVERNMENT SERVICE TERMS
  { term: 'UDID / DISABILITY CARD', hindi: 'दिव्यांगता कार्ड (UDID)', category: 'government', handType: '2-Hands', description: 'Trace rectangle in air (card) then tap chest with index finger for official disability ID.', signTip: 'Draw ID card boundaries in front of chest then tap badge.' },
  { term: 'PASSPORT', hindi: 'पासपोर्ट', category: 'government', handType: '2-Hands', description: 'Open both hands like a booklet, then stamp page with right fist.', signTip: 'Booklet opening gesture followed by official stamp.' },
  { term: 'POLICE', hindi: 'पुलिस', category: 'government', handType: '1-Hand', description: 'C-handshape or badge shape tapped on left chest pocket.', signTip: 'Tap badge location on left chest.' },
  { term: 'COMPLAINT / FIR', hindi: 'शिकायत / एफआईआर', category: 'government', handType: '2-Hands', description: 'Write vigorously on left palm then thrust paper forward to official desk.', signTip: 'Mimic writing grievance note on palm then handing it over.' },
  { term: 'TICKET', hindi: 'टिकट', category: 'government', handType: '2-Hands', description: 'Snip two fingers like a hole-punch through left flat ticket paper.', signTip: 'Bent index & middle fingers bite over edge of left hand.' },
  { term: 'TRAIN / RAILWAY', hindi: 'रेलवे / ट्रेन', category: 'government', handType: '2-Hands', description: 'Two fingers of right hand slide forward along two fingers of left hand (rails).', signTip: 'Slide right index+middle over left index+middle like a train on tracks.' },
  { term: 'BUS STAND', hindi: 'बस अड्डा', category: 'government', handType: '2-Hands', description: 'Steer large bus wheel with both hands, then sign Stop.', signTip: 'Two hands hold big steering wheel, then flat palm down.' },
  { term: 'BANK / MONEY', hindi: 'बैंक / पैसे', category: 'government', handType: '1-Hand', description: 'Rub thumb across fingertips (money) then place into vault/counter.', signTip: 'Rub thumb and index fingertips together.' },
  { term: 'PENSION', hindi: 'पेंशन', category: 'government', handType: '2-Hands', description: 'Sign "Old Age" (beard stroke) + "Monthly Money" into palm.', signTip: 'Stroke chin then count currency onto palm.' },
  { term: 'APPLICATION FORM', hindi: 'आवेदन पत्र', category: 'government', handType: '2-Hands', description: 'Hold flat paper in left hand and sign signature with right hand.', signTip: 'Left flat hand forms document, right index traces signature at bottom.' },
  { term: 'OFFICE / COUNTER', hindi: 'कार्यालय / खिड़की', category: 'government', handType: '2-Hands', description: 'Form square boundary with hands representing official counter booth.', signTip: 'Two L-hands form desk border window.' }
];

export const EqVocabularyModal: React.FC<EqVocabularyModalProps> = ({
  isOpen,
  onClose,
  onSelectTerm,
}) => {
  const [activeTab, setActiveTab] = useState<VocabCategory>('alphabets');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: VocabCategory; label: string; icon: React.ComponentType<{ className?: string }>; count: number; color: string }[] = [
    { id: 'alphabets', label: 'Alphabets A–Z', icon: HandMetal, count: 26, color: '#0072B2' },
    { id: 'greetings', label: 'GREETINGS', icon: HeartHandshake, count: 12, color: '#009E73' },
    { id: 'medical', label: 'Medical or Hospital Terms', icon: Stethoscope, count: 12, color: '#D55E00' },
    { id: 'government', label: 'Government Service Terms', icon: Landmark, count: 11, color: '#E69F00' },
  ];

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = EQ_VOCABULARY_DATA.filter((item) => {
    const matchesCategory = item.category === activeTab;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    
    return (
      (matchesCategory || searchQuery.length > 1) &&
      (item.term.toLowerCase().includes(q) ||
        (item.hindi && item.hindi.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.signTip.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eq-vocab-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden cursor-default">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-linear-to-r from-[#0B2545] to-[#00A896] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="eq-vocab-title" className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
                  EQ Vocabulary Library
                </h2>
                <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  ISL Certified
                </span>
              </div>
              <p className="text-xs text-teal-100 mt-0.5">
                Official Indian Sign Language signs, hand positions, and interactive practice dictionary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close EQ Vocabulary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap" role="tablist">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(cat.id);
                    setSearchQuery('');
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0B2545] shadow-xs border border-gray-200 ring-2 ring-[#00A896]/30'
                      : 'text-gray-600 hover:bg-gray-200/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sign, Hindi, meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#00A896] text-gray-800"
            />
          </div>
        </div>

        {/* Vocabulary Items List Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-sm">No vocabulary terms match your search.</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for letters, medical words, or civic services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.term}
                  className="bg-white border border-gray-200 hover:border-[#00A896] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black text-[#0B2545] font-heading">
                          {item.term}
                        </span>
                        {item.hindi && (
                          <span className="text-xs font-semibold text-gray-500">
                            ({item.hindi})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#0072B2] border border-blue-200">
                          {item.handType}
                        </span>
                        <button
                          type="button"
                          onClick={() => speechManager.speak(item.term)}
                          className="p-1 rounded-md text-gray-400 hover:text-[#00A896] hover:bg-teal-50 transition-colors cursor-pointer"
                          title={`Listen to pronunciation for ${item.term}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-gray-700 leading-relaxed mb-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-[#008762] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#00A896] shrink-0" />
                      <span className="line-clamp-1">{item.signTip}</span>
                    </div>

                    {onSelectTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTerm(item.term);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-[#00A896] text-[#008762] hover:text-white rounded-lg font-bold text-[10px] transition-colors shrink-0 cursor-pointer"
                      >
                        Try Sign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#009E73]" />
            <span>Standardized Indian Sign Language (ISL) Vocabulary Reference</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 font-bold text-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
