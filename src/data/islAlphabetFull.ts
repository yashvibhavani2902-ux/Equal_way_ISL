import React from 'react';

export interface ISLAlphabetDetail {
  letter: string;
  handType: '1-Hand' | '2-Hands';
  branchTag: 'one-handed' | 'symmetric' | 'asymmetric';
  kinematic: 'static' | 'dynamic';
  poseEnglish: string;
  poseHindi: string;
  stepsEnglish: string[];
  stepsHindi: string[];
  tipsEnglish: string;
  tipsHindi: string;
  targetAngles: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
}

export const ISL_ALPHABETS_FULL: Record<string, ISLAlphabetDetail> = {
  A: {
    letter: 'A',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Make closed fists with both hands. Extend both thumbs upright and bring the thumb tips together touching horizontally.',
    poseHindi: 'दोनों हाथों की मुट्ठियां बंद करें। दोनों अंगूठे ऊपर की ओर सीधे रखें और दोनों अंगूठों के सिरों को आपस में जोड़ें।',
    stepsEnglish: [
      'Clench both hands into fists.',
      'Point both thumbs straight up.',
      'Touch the tips of both thumbs together horizontally in front of your chest.'
    ],
    stepsHindi: [
      'दोनों हाथों की मुट्ठी बनाएं।',
      'दोनों अंगूठों को ऊपर की ओर उठाएं।',
      'दोनों अंगूठों के ऊपरी सिरों को छाती के सामने आपस में स्पर्श कराएं।'
    ],
    tipsEnglish: 'Keep knuckles facing outward and hold thumbs steady at equal height.',
    tipsHindi: 'अंगूठों को बराबर ऊंचाई पर रखें और मुट्ठियों को स्थिर रखें।',
    targetAngles: { thumb: 165, index: 40, middle: 35, ring: 30, pinky: 25 },
  },
  B: {
    letter: 'B',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Form two circles using the index finger and thumb of both hands (like spectacles/figure-8) with outer fingers extended and circles touching side-by-side.',
    poseHindi: 'दोनों हाथों के अंगूठे और तर्जनी (index finger) से गोल छल्ले बनाएं और दोनों छल्लों को चश्मे या 8 के आकार में जोड़ें।',
    stepsEnglish: [
      'Pinch right thumb and index finger into a circle.',
      'Pinch left thumb and index finger into a circle.',
      'Join both circles side-by-side so they touch, fanning outer fingers outward.'
    ],
    stepsHindi: [
      'दाहिने हाथ के अंगूठे और तर्जनी से गोल वृत्त बनाएं।',
      'बाएं हाथ के अंगूठे और तर्जनी से भी गोल वृत्त बनाएं।',
      'दोनों गोलों को आपस में सटाकर चश्मे की तरह सामने लाएं।'
    ],
    tipsEnglish: 'Make sure both circles are closed and touching at the index knuckle edges.',
    tipsHindi: 'दोनों गोले पूरी तरह बंद होने चाहिए और आपस में सटे होने चाहिए।',
    targetAngles: { thumb: 50, index: 175, middle: 170, ring: 165, pinky: 160 },
  },
  C: {
    letter: 'C',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'With your dominant hand, curve all fingers and thumb forward into a clear, open C-shaped arc facing inward.',
    poseHindi: 'दाहिने हाथ की उंगलियों और अंगूठे को मोड़कर अंग्रेजी के "C" अक्षर का खुला अर्ध-वृत्ताकार आकार बनाएं।',
    stepsEnglish: [
      'Raise dominant hand to shoulder level.',
      'Curve all four fingers together downward.',
      'Curve thumb upward to form a clear open C opening.'
    ],
    stepsHindi: [
      'हाथ को कंधे की ऊंचाई पर रखें।',
      'चारों उंगलियों को नीचे की ओर घुमावदार मोड़ें।',
      'अंगूठे को ऊपर की ओर मोड़कर स्पष्ट "C" बनाएं।'
    ],
    tipsEnglish: 'Keep palm facing perpendicular to camera so the curved C profile is fully visible.',
    tipsHindi: 'हथेली को कैमरे के सामने थोड़ा तिरछा रखें ताकि "C" की वक्रता साफ दिखे।',
    targetAngles: { thumb: 110, index: 105, middle: 100, ring: 95, pinky: 90 },
  },
  D: {
    letter: 'D',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left index finger straight up as a vertical stem. Form a curved semicircle with right index and thumb, touching the tips to the left vertical finger.',
    poseHindi: 'बाएं हाथ की तर्जनी उंगली को सीधा खड़ा रखें (खंभा)। दाहिने हाथ के अंगूठे और तर्जनी से अर्धवृत्त बनाकर बाएं उंगली पर सटाकर "D" बनाएं।',
    stepsEnglish: [
      'Extend left index finger vertically upright (base hand).',
      'Form an open arc with right thumb and index finger.',
      'Place top of right index at top of left index, and right thumb at base of left index.'
    ],
    stepsHindi: [
      'बाएं हाथ की तर्जनी उंगली को सीधा ऊपर खड़ा रखें।',
      'दाहिने हाथ के अंगूठे और तर्जनी से गोल चाप बनाएं।',
      'दाहिने सिरे को बाईं उंगली के ऊपर और नीचे जोड़कर बंद "D" बनाएं।'
    ],
    tipsEnglish: 'Ensure the right hand loop firmly contacts the left index finger at both ends.',
    tipsHindi: 'दाएं हाथ का चाप बाईं खड़ी उंगली को ऊपर और नीचे दोनों जगह छूना चाहिए।',
    targetAngles: { thumb: 80, index: 175, middle: 50, ring: 45, pinky: 40 },
  },
  E: {
    letter: 'E',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left index finger upright. Bring the tip of the right index finger to touch directly against the top tip of the left index finger.',
    poseHindi: 'बाएं हाथ की तर्जनी उंगली को ऊपर सीधा रखें। दाहिने हाथ की तर्जनी उंगली के सिरे से बाएं तर्जनी के ऊपरी सिरे को स्पर्श करें।',
    stepsEnglish: [
      'Point left index finger straight up.',
      'Point right index finger horizontally.',
      'Touch the tip of right index finger to the tip of left index finger.'
    ],
    stepsHindi: [
      'बाएं हाथ की तर्जनी को सीधा रखें।',
      'दाहिने हाथ की तर्जनी को क्षैतिज रूप से आगे लाएं।',
      'दाहिनी उंगली की नोक को बाईं उंगली की नोक पर लगाएं।'
    ],
    tipsEnglish: 'Touch just the fingertips together at eye level.',
    tipsHindi: 'उंगलियों के केवल पोरों को एक दूसरे से मिलाएं।',
    targetAngles: { thumb: 40, index: 45, middle: 40, ring: 35, pinky: 30 },
  },
  F: {
    letter: 'F',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Extend index and middle fingers on both hands. Cross right index and middle fingers horizontally over left index and middle fingers in a hash (#) formation.',
    poseHindi: 'दोनों हाथों की तर्जनी और मध्यमा (दो उंगलियां) खोलें। दाहिनी दो उंगलियों को बाईं दो उंगलियों पर आड़ा (Cross/#) रखें।',
    stepsEnglish: [
      'Extend index and middle fingers of both hands together.',
      'Hold left two fingers pointing up/diagonal.',
      'Lay right two fingers horizontally across left two fingers.'
    ],
    stepsHindi: [
      'दोनों हाथों की पहली दो-दो उंगलियां फैलाएं।',
      'बाएं हाथ की दो उंगलियां ऊपर की ओर रखें।',
      'दाएं हाथ की दो उंगलियों को उनके ऊपर आड़ा क्रॉस करें।'
    ],
    tipsEnglish: 'Keep remaining fingers curled securely into palms.',
    tipsHindi: 'बाकी उंगलियों को मुट्ठी में बंद रखें।',
    targetAngles: { thumb: 75, index: 75, middle: 175, ring: 170, pinky: 165 },
  },
  G: {
    letter: 'G',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Make closed fists with both hands. Stack the right fist directly on top of the left fist with knuckles facing outward.',
    poseHindi: 'दोनों हाथों की मुट्ठी बनाएं। दाहिने हाथ की मुट्ठी को बाईं मुट्ठी के ऊपर सीधा रखें (एक के ऊपर एक)।',
    stepsEnglish: [
      'Clench left hand into a fist (base).',
      'Clench right hand into a fist.',
      'Rest bottom knuckles of right fist on top of left fist.'
    ],
    stepsHindi: [
      'बाएं हाथ की मुट्ठी नीचे रखें।',
      'दाहिने हाथ की मुट्ठी बनाएं।',
      'दाहिनी मुट्ठी को बाईं मुट्ठी के ऊपर सटाकर रखें।'
    ],
    tipsEnglish: 'Stack fists vertically at chest center.',
    tipsHindi: 'दोनों मुट्ठियों को छाती के बीच में लंबवत एक सीध में रखें।',
    targetAngles: { thumb: 160, index: 165, middle: 35, ring: 30, pinky: 25 },
  },
  H: {
    letter: 'H',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'dynamic',
    poseEnglish: 'Hold left hand flat with palm facing upward. Brush flat right palm horizontally across the left palm from wrist to fingertips.',
    poseHindi: 'बाएं हाथ की हथेली को खुला और ऊपर की ओर रखें। दाहिने हाथ की हथेली को बाईं हथेली पर कलाई से उंगलियों की ओर सरकाएं (झाड़ें)।',
    stepsEnglish: [
      'Extend open left palm flat horizontally.',
      'Place open right hand across left palm.',
      'Swipe right hand across left palm in a smooth brushing stroke.'
    ],
    stepsHindi: [
      'बाईं हथेली को सामने सीधा खुला रखें।',
      'दाहिने हाथ की हथेली को बाईं हथेली पर रखें।',
      'दाहिने हाथ से बाईं हथेली को आगे की ओर ब्रश करें।'
    ],
    tipsEnglish: 'Keep palms flat and fingers straight during swipe.',
    tipsHindi: 'हथेली को सपाट रखें और उंगलियां सीधी रखें।',
    targetAngles: { thumb: 45, index: 170, middle: 165, ring: 35, pinky: 30 },
  },
  I: {
    letter: 'I',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'Extend dominant index finger and touch the tip of the index finger against your cheek or temple, or hold upright little finger.',
    poseHindi: 'दाहिने हाथ की तर्जनी (index) उंगली को सीधा खोलें और उंगली की नोक को अपने गाल / चेहरे के किनारे पर स्पर्श करें।',
    stepsEnglish: [
      'Form a fist with right hand, keeping index finger extended straight.',
      'Raise hand to face level.',
      'Touch the tip of the index finger gently to the right cheek.'
    ],
    stepsHindi: [
      'दाएं हाथ की तर्जनी उंगली को सीधा खोलें, बाकी उंगलियां बंद रखें।',
      'हाथ को चेहरे के पास लाएं।',
      'उंगली की नोक को अपने दाहिने गाल पर हल्के से छुएं।'
    ],
    tipsEnglish: 'Keep face clearly visible to camera while touching cheek.',
    tipsHindi: 'चेहरे को कैमरे के सामने सीधा रखें।',
    targetAngles: { thumb: 40, index: 175, middle: 30, ring: 25, pinky: 25 },
  },
  J: {
    letter: 'J',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'dynamic',
    poseEnglish: 'Extend pinky/index finger in the air and trace a curved downward "J" hook path smoothly in the air.',
    poseHindi: 'दाहिने हाथ की उंगली से हवा में नीचे की ओर अंग्रेजी अक्षर "J" का घुमावदार हुक बनाएं।',
    stepsEnglish: [
      'Extend right pinky or index finger pointing forward.',
      'Move finger downward vertically.',
      'Curve upward smoothly at the bottom tracing letter J.'
    ],
    stepsHindi: [
      'दाहिने हाथ की उंगली को आगे बढ़ाएं।',
      'उंगली को नीचे की ओर ले जाएं।',
      'नीचे पहुंचकर बाईं ओर घुमाकर "J" का हुक पूरा करें।'
    ],
    tipsEnglish: 'Trace the J curve deliberately so camera tracks the motion stroke.',
    tipsHindi: 'J का घुमाव स्पष्ट रूप से हवा में बनाएं।',
    targetAngles: { thumb: 40, index: 35, middle: 30, ring: 25, pinky: 165 },
  },
  K: {
    letter: 'K',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left index finger straight up. Bend right index finger like a hook and hook it over the upper knuckle of the left index finger.',
    poseHindi: 'बाएं हाथ की तर्जनी को सीधा ऊपर रखें। दाहिनी तर्जनी को हुक की तरह मोड़कर बाईं उंगली के जोड़ पर फंसाएं।',
    stepsEnglish: [
      'Extend left index finger vertically.',
      'Bend right index finger at 90° angle.',
      'Hook the bent right index over the left index knuckle forming a K branch.'
    ],
    stepsHindi: [
      'बाईं तर्जनी को सीधा ऊपर खड़ा करें।',
      'दाहिनी तर्जनी को मोड़कर हुक जैसा बनाएं।',
      'मुड़ी हुई दाहिनी उंगली को बाईं उंगली के जोड़ पर लगाएं।'
    ],
    tipsEnglish: 'Left finger is the vertical backbone; right finger hooks the upper limb.',
    tipsHindi: 'बाईं उंगली सीधी रहेगी, दाहिनी उंगली मुड़कर शाखा बनाएगी।',
    targetAngles: { thumb: 150, index: 175, middle: 120, ring: 30, pinky: 25 },
  },
  L: {
    letter: 'L',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'Extend dominant thumb out horizontally and index finger straight up at a 90° angle, forming the classic letter L.',
    poseHindi: 'दाहिने हाथ के अंगूठे और तर्जनी को 90 डिग्री के कोण पर खोलकर अंग्रेजी अक्षर "L" का आकार बनाएं।',
    stepsEnglish: [
      'Extend right index finger pointing straight up.',
      'Extend right thumb pointing outward to the side.',
      'Keep middle, ring, and pinky curled into palm.'
    ],
    stepsHindi: [
      'दाहिनी तर्जनी उंगली को ऊपर की ओर सीधा रखें।',
      'अंगूठे को 90 डिग्री पर बाहर की तरफ फैलाएं।',
      'बाकी तीनों उंगलियों को हथेली में मोड़कर रखें।'
    ],
    tipsEnglish: 'Maintain a clean 90-degree right angle between thumb and index.',
    tipsHindi: 'अंगूठे और तर्जनी के बीच 90° का स्पष्ट कोण रखें।',
    targetAngles: { thumb: 170, index: 175, middle: 35, ring: 30, pinky: 25 },
  },
  M: {
    letter: 'M',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold open left palm flat facing upward. Place three fingertips of right hand (index, middle, ring) vertically onto the left palm.',
    poseHindi: 'बाएं हाथ की हथेली को खुला और ऊपर रखें। दाहिने हाथ की तीन उंगलियों (तर्जनी, मध्यमा, अनामिका) को बाईं हथेली पर टिकाएं।',
    stepsEnglish: [
      'Open left hand flat facing up at chest height.',
      'Extend index, middle, and ring fingers of right hand.',
      'Rest the tips of these 3 fingers vertically in the center of the left palm.'
    ],
    stepsHindi: [
      'बाईं हथेली को सामने सीधा खुला रखें।',
      'दाएं हाथ की 3 उंगलियां (पहली तीन) खोलें।',
      'तीनों उंगलियों के पोरों को बाईं हथेली के बीच में टिकाएं।'
    ],
    tipsEnglish: 'Three fingers represent the 3 vertical strokes of the letter M.',
    tipsHindi: '3 उंगलियां "M" के 3 खंभों को दर्शाती हैं।',
    targetAngles: { thumb: 30, index: 50, middle: 45, ring: 40, pinky: 35 },
  },
  N: {
    letter: 'N',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold open left palm flat facing upward. Place two fingertips of right hand (index and middle) vertically onto the left palm.',
    poseHindi: 'बाएं हाथ की हथेली को खुला और ऊपर रखें। दाहिने हाथ की दो उंगलियों (तर्जनी और मध्यमा) को बाईं हथेली पर टिकाएं।',
    stepsEnglish: [
      'Open left hand flat facing up.',
      'Extend index and middle fingers of right hand.',
      'Rest the tips of these 2 fingers vertically on the left palm.'
    ],
    stepsHindi: [
      'बाईं हथेली को सपाट खुला रखें।',
      'दाहिने हाथ की 2 उंगलियां (तर्जनी व मध्यमा) खोलें।',
      'दोनों उंगलियों के पोरों को बाईं हथेली पर रखें।'
    ],
    tipsEnglish: 'Two fingers represent the 2 vertical strokes of the letter N.',
    tipsHindi: '2 उंगलियां "N" के 2 खंभों को दर्शाती हैं।',
    targetAngles: { thumb: 30, index: 50, middle: 45, ring: 35, pinky: 30 },
  },
  O: {
    letter: 'O',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'Curve all fingers and thumb of dominant hand until fingertips touch the thumb tip, forming a closed circular O ring.',
    poseHindi: 'दाहिने हाथ की सभी उंगलियों को मोड़कर अंगूठे के सिरे से मिलाएं ताकि एक पूरा गोल "O" बन जाए।',
    stepsEnglish: [
      'Raise dominant hand.',
      'Curve all four fingertips smoothly toward thumb.',
      'Touch fingertips firmly against thumb tip forming a circular aperture.'
    ],
    stepsHindi: [
      'दाहिने हाथ को ऊपर लाएं।',
      'चारों उंगलियों को अंगूठे की ओर मोड़ें।',
      'उंगलियों के पोरों को अंगूठे से सटाकर पूरा गोल चक्र बनाएं।'
    ],
    tipsEnglish: 'Ensure the circle is round and visible from the front.',
    tipsHindi: 'गोल चक्र पूरी तरह बंद और सामने से स्पष्ट दिखना चाहिए।',
    targetAngles: { thumb: 90, index: 85, middle: 80, ring: 75, pinky: 70 },
  },
  P: {
    letter: 'P',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left index finger straight up. Form a circle with right index and thumb and place it against the top tip of the left index finger.',
    poseHindi: 'बाएं हाथ की तर्जनी को सीधा ऊपर खड़ा रखें। दाहिने हाथ के अंगूठे और तर्जनी से गोल वृत्त बनाकर बाईं उंगली के ऊपरी सिरे पर जोड़ें।',
    stepsEnglish: [
      'Point left index finger straight up as the stem.',
      'Pinch right thumb and index into a circle.',
      'Touch the right circle against the upper section of the left index finger to form P.'
    ],
    stepsHindi: [
      'बाईं तर्जनी उंगली को ऊपर की ओर सीधा खड़ा रखें।',
      'दाहिने अंगूठे और तर्जनी से गोल छल्ला बनाएं।',
      'दाहिने छल्ले को बाईं उंगली के ऊपरी हिस्से पर लगाकर "P" बनाएं।'
    ],
    tipsEnglish: 'The circle must sit on the top half of the vertical index finger.',
    tipsHindi: 'गोला बाईं उंगली के केवल ऊपरी सिरे पर होना चाहिए।',
    targetAngles: { thumb: 140, index: 150, middle: 100, ring: 30, pinky: 25 },
  },
  Q: {
    letter: 'Q',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Form a circle with left thumb and index finger. Hook the right index finger downward through the circle like the tail of a Q.',
    poseHindi: 'बाएं हाथ के अंगूठे और तर्जनी से गोल चक्र बनाएं। दाहिने हाथ की तर्जनी को हुक बनाकर उस चक्र के अंदर नीचे लटकाएं।',
    stepsEnglish: [
      'Form an O circle with left thumb and index.',
      'Bend right index finger downward.',
      'Hook the right index finger into the bottom of the left circle.'
    ],
    stepsHindi: [
      'बाएं अंगूठे और तर्जनी से गोल बनाएं।',
      'दाहिनी तर्जनी उंगली को नीचे की ओर मोड़ें।',
      'दाहिनी उंगली को बाएं गोले के अंदर नीचे की तरफ हुक करें।'
    ],
    tipsEnglish: 'Right hooked finger acts as the Q tail descending from the loop.',
    tipsHindi: 'दाहिनी उंगली "Q" की पूंछ की तरह नीचे दिखेगी।',
    targetAngles: { thumb: 150, index: 145, middle: 30, ring: 25, pinky: 20 },
  },
  R: {
    letter: 'R',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left palm open and flat. Bend the right index finger like a hook and rest it flat in the center of the left palm.',
    poseHindi: 'बाएं हाथ की हथेली को खुला और सपाट रखें। दाहिनी तर्जनी उंगली को मोड़कर हुक जैसा बनाएं और बाईं हथेली के बीच में रखें।',
    stepsEnglish: [
      'Hold open left palm horizontal facing up.',
      'Curl right index finger into a hook/arc.',
      'Rest the crook of the right index finger onto the left palm.'
    ],
    stepsHindi: [
      'बाईं हथेली को सपाट खुला रखें।',
      'दाहिनी तर्जनी को आधा मोड़ें (हुक बनाएं)।',
      'मुड़ी हुई उंगली को बाईं हथेली के केंद्र में रखें।'
    ],
    tipsEnglish: 'Keep left palm stable and hook right index firmly.',
    tipsHindi: 'बाईं हथेली को स्थिर रखें और दाहिनी उंगली को मोड़कर रखें।',
    targetAngles: { thumb: 40, index: 170, middle: 170, ring: 30, pinky: 25 },
  },
  S: {
    letter: 'S',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Make closed fists with both hands. Extend both pinky fingers and hook them securely together in front of your chest.',
    poseHindi: 'दोनों हाथों की मुट्ठी बनाएं। दोनों छोटी उंगलियों (कनिष्ठा/pinky) को बाहर निकालें और आपस में एक दूसरे में हुक करें।',
    stepsEnglish: [
      'Form fists with both hands.',
      'Extend pinky fingers of both hands.',
      'Interlock the two pinky fingers together like linked chains.'
    ],
    stepsHindi: [
      'दोनों हाथों की मुट्ठी बनाएं।',
      'दोनों हाथों की सबसे छोटी उंगली को खोलें।',
      'दोनों छोटी उंगलियों को आपस में फंसाकर हुक करें।'
    ],
    tipsEnglish: 'Hook at the finger crooks at chest height.',
    tipsHindi: 'उंगलियों को छाती की ऊंचाई पर आपस में फंसाएं।',
    targetAngles: { thumb: 50, index: 35, middle: 30, ring: 25, pinky: 20 },
  },
  T: {
    letter: 'T',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Hold left index finger straight up as the vertical trunk. Place the tip of the right index finger horizontally against the top edge of the left index forming a T.',
    poseHindi: 'बाएं हाथ की तर्जनी को सीधा ऊपर खड़ा रखें। दाहिने हाथ की तर्जनी को आड़ा करके बाएं उंगली के ऊपरी सिरे पर रखें (T का आकार)।',
    stepsEnglish: [
      'Extend left index finger vertically upright.',
      'Extend right index finger horizontally.',
      'Touch the tip/side of right index finger to the top of left index finger forming a T-junction.'
    ],
    stepsHindi: [
      'बाएं हाथ की तर्जनी को सीधा ऊपर रखें।',
      'दाएं हाथ की तर्जनी को आड़ा (horizontal) करें।',
      'दाहिनी उंगली को बाईं उंगली के ऊपर जोड़कर "T" बनाएं।'
    ],
    tipsEnglish: 'Forms a clean 90-degree uppercase T intersection.',
    tipsHindi: 'दोनों उंगलियां 90° पर जुड़कर स्पष्ट "T" बनानी चाहिए।',
    targetAngles: { thumb: 60, index: 55, middle: 30, ring: 25, pinky: 20 },
  },
  U: {
    letter: 'U',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'Extend index and middle fingers straight up together, held tightly touching side-by-side with thumb folding over other fingers.',
    poseHindi: 'दाहिने हाथ की तर्जनी और मध्यमा (पहली दो उंगलियां) को एक साथ सीधा ऊपर खड़ा करें और आपस में सटाकर रखें।',
    stepsEnglish: [
      'Extend index and middle fingers straight up.',
      'Press the two extended fingers tightly together.',
      'Fold thumb over ring finger and pinky against the palm.'
    ],
    stepsHindi: [
      'तर्जनी और मध्यमा उंगली को सीधा ऊपर खोलें।',
      'दोनों उंगलियों को आपस में सटाकर रखें (बीच में दूरी न हो)।',
      'अंगूठे से बाकी दो उंगलियों को हथेली पर दबाएं।'
    ],
    tipsEnglish: 'Keep fingers parallel with zero gap between index and middle.',
    tipsHindi: 'दोनों उंगलियों के बीच कोई खाली जगह नहीं होनी चाहिए।',
    targetAngles: { thumb: 40, index: 175, middle: 170, ring: 30, pinky: 25 },
  },
  V: {
    letter: 'V',
    handType: '1-Hand',
    branchTag: 'one-handed',
    kinematic: 'static',
    poseEnglish: 'Extend index and middle fingers straight up, spread apart in a clear open V shape (peace / victory gesture).',
    poseHindi: 'दाहिने हाथ की तर्जनी और मध्यमा उंगलियों को सीधा खोलें और दोनों के बीच स्पष्ट "V" आकार में दूरी बनाएं (Peace Sign)।',
    stepsEnglish: [
      'Extend index and middle fingers straight up.',
      'Spread the two fingers wide apart into a V shape.',
      'Hold palm facing forward toward the camera.'
    ],
    stepsHindi: [
      'पहली दोनों उंगलियों को ऊपर की ओर खोलें।',
      'दोनों उंगलियों को फैलाकर "V" का आकार दें।',
      'हथेली को सामने कैमरे की ओर रखें।'
    ],
    tipsEnglish: 'Spread fingers wide so the open V wedge is distinct from U.',
    tipsHindi: 'उंगलियों को काफी फैलाएं ताकि यह "U" से अलग साफ दिखे।',
    targetAngles: { thumb: 40, index: 175, middle: 170, ring: 30, pinky: 25 },
  },
  W: {
    letter: 'W',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Interlace fingers of both hands pointing diagonally upward with index and middle fingertips creating the peaks of a W crown.',
    poseHindi: 'दोनों हाथों की उंगलियों को आपस में फंसाएं और ऊपर की ओर फैलाकर त्रिशूल या "W" के तीन शिखरों का आकार दें।',
    stepsEnglish: [
      'Bring both hands together in front of chest.',
      'Interlock fingers loosely pointing upward.',
      'Fan the upright fingers out to create multiple peaks like a letter W.'
    ],
    stepsHindi: [
      'दोनों हाथों को छाती के सामने लाएं।',
      'उंगलियों को आपस में फंसाकर ऊपर की ओर उठाएं।',
      'उंगलियों के शिखरों से "W" का मुकुट जैसा आकार बनाएं।'
    ],
    tipsEnglish: 'Keep knuckles crossed at base and fingertips pointing up.',
    tipsHindi: 'उंगलियों के पोरों को ऊपर की ओर खुला रखें।',
    targetAngles: { thumb: 40, index: 175, middle: 170, ring: 165, pinky: 25 },
  },
  X: {
    letter: 'X',
    handType: '2-Hands',
    branchTag: 'symmetric',
    kinematic: 'static',
    poseEnglish: 'Extend the index fingers of both hands and cross them over each other in the air to form an exact X shape.',
    poseHindi: 'दोनों हाथों की केवल तर्जनी (index) उंगली खोलें और दोनों उंगलियों को एक दूसरे के ऊपर क्रॉस करके "X" बनाएं।',
    stepsEnglish: [
      'Extend right index finger and left index finger.',
      'Curl remaining fingers into fists.',
      'Cross the right index finger over the middle of the left index finger in an X formation.'
    ],
    stepsHindi: [
      'दोनों हाथों की पहली उंगली (तर्जनी) खोलें।',
      'बाकी सभी उंगलियां मुट्ठी में बंद रखें।',
      'दाहिनी उंगली को बाईं उंगली के ऊपर क्रॉस करके "X" बनाएं।'
    ],
    tipsEnglish: 'Cross near the center of both fingers for maximum clarity.',
    tipsHindi: 'उंगलियों को बीच से क्रॉस करें।',
    targetAngles: { thumb: 45, index: 95, middle: 35, ring: 30, pinky: 25 },
  },
  Y: {
    letter: 'Y',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'static',
    poseEnglish: 'Form an open V with left index and middle fingers. Point the right index finger straight into the cleft between them.',
    poseHindi: 'बाएं हाथ से "V" बनाएं। दाहिने हाथ की तर्जनी उंगली को बाएं "V" के बीच की खाली जगह में सीधा टिकाएं।',
    stepsEnglish: [
      'Spread left index and middle fingers in a V sign.',
      'Extend right index finger straight.',
      'Place right index finger into the groove/cleft between the left two fingers.'
    ],
    stepsHindi: [
      'बाएं हाथ की दो उंगलियों से "V" बनाएं।',
      'दाहिने हाथ की तर्जनी उंगली को सीधा रखें।',
      'दाहिनी उंगली को बाएं V के बीच में रखकर "Y" बनाएं।'
    ],
    tipsEnglish: 'Right index forms the stem; left fingers form the upper Y arms.',
    tipsHindi: 'दाहिनी उंगली नीचे का खंभा और बाईं उंगलियां ऊपर की भुजाएं बनाती हैं।',
    targetAngles: { thumb: 175, index: 35, middle: 30, ring: 25, pinky: 170 },
  },
  Z: {
    letter: 'Z',
    handType: '2-Hands',
    branchTag: 'asymmetric',
    kinematic: 'dynamic',
    poseEnglish: 'Hold left flat hand vertically like a wall. Place right bent hand/index horizontally against the middle of the left palm forming Z.',
    poseHindi: 'बाएं हाथ की हथेली को सीधा खड़ा रखें (दीवार की तरह)। दाहिने हाथ की उंगलियों को मोड़कर बाएं हाथ की हथेली पर टिकाकर "Z" बनाएं।',
    stepsEnglish: [
      'Hold open left hand vertically with palm facing side.',
      'Bend right fingers at right angle.',
      'Place bent right hand horizontally against the vertical left palm to form Z.'
    ],
    stepsHindi: [
      'बाएं हाथ को सीधा खड़ा रखें।',
      'दाहिने हाथ को 90 डिग्री मोड़ें।',
      'दाहिने मुड़े हाथ को बाईं खड़ी हथेली के बीच में सटाएं।'
    ],
    tipsEnglish: 'Hold the perpendicular configuration steady.',
    tipsHindi: 'दोनों हाथों को एक दूसरे के 90° पर स्थिर रखें।',
    targetAngles: { thumb: 40, index: 175, middle: 35, ring: 30, pinky: 25 },
  },
};
