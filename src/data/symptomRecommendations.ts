export interface SymptomRecommendation {
  id: string;
  letter: string;
  name: string;
  hindi: string;
  severity: 'Urgent' | 'High' | 'Moderate' | 'Mild';
  category: string;
  description: string;
  triageCode: string;
}

export const SYMPTOM_RECOMMENDATIONS_DICT: Record<string, SymptomRecommendation[]> = {
  A: [
    { id: 's-a1', letter: 'A', name: 'Abdominal Pain', hindi: 'पेट में तेज दर्द', severity: 'High', category: 'Gastrointestinal', description: 'Acute abdominal cramping or localized pain requiring immediate palpation.', triageCode: 'MED-ABD' },
    { id: 's-a2', letter: 'A', name: 'Allergic Reaction / Anaphylaxis', hindi: 'गंभीर एलर्जी / सांस फूलना', severity: 'Urgent', category: 'Emergency', description: 'Skin hives, facial swelling, or airway restriction.', triageCode: 'EMG-ALL' },
    { id: 's-a3', letter: 'A', name: 'Asthma Attack', hindi: 'दमा का दौरा / सांस लेने में परेशानी', severity: 'Urgent', category: 'Respiratory', description: 'Wheezing sound with sudden drop in oxygenation.', triageCode: 'RES-AST' },
    { id: 's-a4', letter: 'A', name: 'Anxiety & Panic Tremors', hindi: 'घबराहट एवं कंपन', severity: 'Moderate', category: 'Neurological', description: 'Rapid pulse accompanied by hyperventilation.', triageCode: 'NEU-ANX' },
    { id: 's-a5', letter: 'A', name: 'Acid Reflux / Heartburn', hindi: 'सीने में जलन / एसिडिटी', severity: 'Mild', category: 'Gastrointestinal', description: 'Retrosternal burning after meals.', triageCode: 'GAS-ACD' },
  ],
  B: [
    { id: 's-b1', letter: 'B', name: 'Breathing Difficulty / Dyspnea', hindi: 'सांस लेने में भारी कठिनाई', severity: 'Urgent', category: 'Respiratory', description: 'Inability to complete sentences, gasping, shallow respirations.', triageCode: 'EMG-BRT' },
    { id: 's-b2', letter: 'B', name: 'Bleeding / Acute Hemorrhage', hindi: 'अत्यधिक रक्तस्राव / खून बहना', severity: 'Urgent', category: 'Trauma', description: 'Uncontrolled external or internal bleeding requiring pressure dressing.', triageCode: 'TRM-BLD' },
    { id: 's-b3', letter: 'B', name: 'Back Pain (Acute Lumbar)', hindi: 'पीठ एवं रीढ़ का गंभीर दर्द', severity: 'Moderate', category: 'Orthopedic', description: 'Sudden lumbar strain or radiation down lower limbs.', triageCode: 'ORT-BCK' },
    { id: 's-b4', letter: 'B', name: 'Bruising & Swelling', hindi: 'गंभीर नील पड़ना एवं सूजन', severity: 'Mild', category: 'Trauma', description: 'Subcutaneous hematoma from recent blunt impact.', triageCode: 'TRM-BRU' },
    { id: 's-b5', letter: 'B', name: 'Burn Injury (Thermal/Chemical)', hindi: 'जलने की चोट / घाव', severity: 'High', category: 'Trauma', description: 'Partial or full-thickness dermal burn lesion.', triageCode: 'TRM-BRN' },
  ],
  C: [
    { id: 's-c1', letter: 'C', name: 'Chest Pain (Suspected Angina/MI)', hindi: 'सीने में असहनीय दबाव व दर्द', severity: 'Urgent', category: 'Cardiovascular', description: 'Crushing sub-sternal pressure radiating to jaw or left arm. Red flag.', triageCode: 'EMG-CST' },
    { id: 's-c2', letter: 'C', name: 'Cough (Severe Persistent / Blood)', hindi: 'लगातार खांसी / बलगम में खून', severity: 'High', category: 'Respiratory', description: 'Violent coughing spells with suspected hemoptysis.', triageCode: 'RES-CPB' },
    { id: 's-c3', letter: 'C', name: 'Chills & Rigors', hindi: 'कंपकंपी के साथ तेज जाड़ा लगना', severity: 'Moderate', category: 'Infectious', description: 'Violent shivering preceding spiking temperatures.', triageCode: 'INF-CHL' },
    { id: 's-c4', letter: 'C', name: 'Cramps & Muscle Spasms', hindi: 'मांसपेशियों में तीव्र ऐंठन', severity: 'Mild', category: 'Musculoskeletal', description: 'Electrolyte depletion or dehydration spasms.', triageCode: 'MSK-CRM' },
    { id: 's-c5', letter: 'C', name: 'Cyanosis (Bluish Lips/Fingers)', hindi: 'होठों या उंगलियों का नीला पड़ना', severity: 'Urgent', category: 'Emergency', description: 'Hypoxemia marker indicating critical low oxygen.', triageCode: 'EMG-CYA' },
  ],
  D: [
    { id: 's-d1', letter: 'D', name: 'Dizziness & Lightheadedness', hindi: 'सिर चकराना एवं बेहोशी का अहसास', severity: 'Moderate', category: 'Neurological', description: 'Postural instability or presyncope feeling.', triageCode: 'NEU-DIZ' },
    { id: 's-d2', letter: 'D', name: 'Diarrhea (Severe / Watery)', hindi: 'गंभीर दस्त एवं उल्टी', severity: 'High', category: 'Gastrointestinal', description: 'Frequent loose stools with risk of hypovolemic shock.', triageCode: 'GAS-DIR' },
    { id: 's-d3', letter: 'D', name: 'Dehydration (Dry Tongue/Sunken Eyes)', hindi: 'शरीर में पानी की अत्यधिक कमी', severity: 'High', category: 'General', description: 'Skin turgor loss, dry mucosa, prolonged thirst.', triageCode: 'GEN-DHY' },
    { id: 's-d4', letter: 'D', name: 'Disorientation & Confusion', hindi: 'मानसिक भ्रम एवं याददाश्त में कमी', severity: 'Urgent', category: 'Neurological', description: 'Altered mental status or delirium needing neurological triage.', triageCode: 'NEU-DIS' },
  ],
  E: [
    { id: 's-e1', letter: 'E', name: 'Eye Injury / Sudden Vision Loss', hindi: 'आंख में चोट / अचानक दिखना बंद होना', severity: 'Urgent', category: 'Ophthalmology', description: 'Traumatic corneal abrasion or sudden monocular blindness.', triageCode: 'OPH-EYE' },
    { id: 's-e2', letter: 'E', name: 'Ear Infection & Throbbing Pain', hindi: 'कान में तेज दर्द एवं मवाद आना', severity: 'Moderate', category: 'ENT', description: 'Otitis media with tympanic membrane tenderness.', triageCode: 'ENT-EAR' },
    { id: 's-e3', letter: 'E', name: 'Epistaxis (Severe Nosebleed)', hindi: 'नाक से लगातार खून बहना', severity: 'Moderate', category: 'ENT', description: 'Persistent anterior/posterior nasal hemorrhage.', triageCode: 'ENT-EPI' },
    { id: 's-e4', letter: 'E', name: 'Extreme Exhaustion / Collapse', hindi: 'अत्यधिक थकान / अचानक गिर पड़ना', severity: 'High', category: 'General', description: 'Inability to stand or bear weight.', triageCode: 'GEN-EXH' },
  ],
  F: [
    { id: 's-f1', letter: 'F', name: 'Fever (High Grade > 102°F)', hindi: 'तेज बुखार (102°F से अधिक)', severity: 'High', category: 'Infectious', description: 'Pyrexia with systemic heat, tachycardia, flushing.', triageCode: 'INF-FVR' },
    { id: 's-f2', letter: 'F', name: 'Fracture / Bone Deformity', hindi: 'हड्डी टूटना / अंगों का मुड़ना', severity: 'Urgent', category: 'Orthopedic', description: 'Suspected closed or open long-bone rupture with crepitus.', triageCode: 'ORT-FRC' },
    { id: 's-f3', letter: 'F', name: 'Fainting / Syncope', hindi: 'अचानक बेहोशी (सिंकोप)', severity: 'Urgent', category: 'Cardiovascular', description: 'Transient loss of consciousness and postural tone.', triageCode: 'EMG-FNT' },
    { id: 's-f4', letter: 'F', name: 'Flu-like Systemic Malaise', hindi: 'फ्लू के लक्षण / बदन दर्द', severity: 'Mild', category: 'Infectious', description: 'Generalized myalgia, nasal catarrh, sore throat.', triageCode: 'INF-FLU' },
  ],
  G: [
    { id: 's-g1', letter: 'G', name: 'Gastroenteritis & Food Poisoning', hindi: 'फूड पॉइजनिंग / पेट संक्रमण', severity: 'High', category: 'Gastrointestinal', description: 'Concurrent emesis and spasmodic enteric pain.', triageCode: 'GAS-GAS' },
    { id: 's-g2', letter: 'G', name: 'Giddiness & Loss of Balance', hindi: 'सिर घूमना एवं संतुलन बिगड़ना', severity: 'Moderate', category: 'Neurological', description: 'Vestibular imbalance or cerebral hypo-perfusion.', triageCode: 'NEU-GID' },
    { id: 's-g3', letter: 'G', name: 'Gum Bleeding & Oral Trauma', hindi: 'मसूड़ों या मुंह से खून निकलना', severity: 'Mild', category: 'Dental', description: 'Gingival hemorrhage or soft palate laceration.', triageCode: 'DEN-GUM' },
  ],
  H: [
    { id: 's-h1', letter: 'H', name: 'Headache (Thunderclap / Severe)', hindi: 'अत्यधिक तेज सिरदर्द / माइग्रेन', severity: 'Urgent', category: 'Neurological', description: 'Sudden maximal headache onset. Rule out subarachnoid bleed.', triageCode: 'NEU-HDA' },
    { id: 's-h2', letter: 'H', name: 'Heart Palpitations & Arrhythmia', hindi: 'दिल की धड़कन अत्यधिक तेज होना', severity: 'High', category: 'Cardiovascular', description: 'Sensation of skipping beats, racing pulse > 120 bpm.', triageCode: 'CRD-PLP' },
    { id: 's-h3', letter: 'H', name: 'High Blood Pressure Crisis', hindi: 'अत्यधिक उच्च रक्तचाप (हाइपरटेंशन)', severity: 'Urgent', category: 'Cardiovascular', description: 'Hypertensive emergency with blurred vision or occipital pain.', triageCode: 'CRD-HBP' },
    { id: 's-h4', letter: 'H', name: 'Heat Stroke & Dehydration', hindi: 'लू लगना / अत्यधिक शरीर का तपना', severity: 'Urgent', category: 'Environmental', description: 'Hyperthermia with anhidrosis and neurological clouding.', triageCode: 'ENV-HTS' },
  ],
  I: [
    { id: 's-i1', letter: 'I', name: 'Injury / Major Blunt Trauma', hindi: 'गंभीर चोट / दुर्घटना आघात', severity: 'Urgent', category: 'Trauma', description: 'High-velocity road collision or fall from height.', triageCode: 'TRM-INJ' },
    { id: 's-i2', letter: 'I', name: 'Infection (Spreading Cellulitis)', hindi: 'फैलता हुआ त्वचा संक्रमण / पस', severity: 'Moderate', category: 'Dermatology', description: 'Erythema with advancing margins, warmth, induration.', triageCode: 'DER-INF' },
    { id: 's-i3', letter: 'I', name: 'Insect Sting / Toxic Envenomation', hindi: 'कीट या बिच्छू का डंक / जहर', severity: 'Urgent', category: 'Toxicology', description: 'Localized neurotoxic or cytotoxic reaction.', triageCode: 'TOX-INS' },
  ],
  J: [
    { id: 's-j1', letter: 'J', name: 'Joint Swelling & Acute Arthritis', hindi: 'जोड़ों में तीव्र सूजन एवं दर्द', severity: 'Moderate', category: 'Rheumatology', description: 'Effusion in knee, ankle, or wrist preventing mobilization.', triageCode: 'RHE-JNT' },
    { id: 's-j2', letter: 'J', name: 'Jaundice (Yellowish Sclera/Skin)', hindi: 'पीलिया (आंखों व त्वचा का पीलापन)', severity: 'High', category: 'Hepatic', description: 'Icteric sclera with dark urine and right upper quadrant ache.', triageCode: 'HEP-JAU' },
  ],
  K: [
    { id: 's-k1', letter: 'K', name: 'Kidney Stone Flank Colic', hindi: 'गुर्दे की पथरी का असहनीय दर्द', severity: 'High', category: 'Nephrology', description: 'Intense unilateral flank spasms radiating to groin.', triageCode: 'NEP-KDN' },
    { id: 's-k2', letter: 'K', name: 'Knee Dislocation / Ligament Tear', hindi: 'घुटने का जोड़ खिसकना या टूटना', severity: 'Moderate', category: 'Orthopedic', description: 'Joint locking with significant hemarthrosis.', triageCode: 'ORT-KNE' },
  ],
  L: [
    { id: 's-l1', letter: 'L', name: 'Low Blood Sugar (Hypoglycemia)', hindi: 'रक्त शर्करा गिरना / कांपना व पसीना', severity: 'Urgent', category: 'Endocrine', description: 'Diaphoresis, confusion, tremors requiring oral or IV glucose.', triageCode: 'END-LBS' },
    { id: 's-l2', letter: 'L', name: 'Leg Swelling (Unilateral DVT Risk)', hindi: 'एक पैर में अचानक अत्यधिक सूजन', severity: 'High', category: 'Vascular', description: 'Calf tenderness, erythema with deep vein thrombosis suspicion.', triageCode: 'VAS-LEG' },
    { id: 's-l3', letter: 'L', name: 'Laceration & Deep Cut', hindi: 'गहरा घाव / टांके की आवश्यकता', severity: 'Moderate', category: 'Trauma', description: 'Linear dermal rupture requiring primary wound closure.', triageCode: 'TRM-LAC' },
  ],
  M: [
    { id: 's-m1', letter: 'M', name: 'Migraine Attack (Aura & Nausea)', hindi: 'माइग्रेन का दौरा (आधा सीसी सिरदर्द)', severity: 'Moderate', category: 'Neurological', description: 'Unilateral pulsating hemicrania with photophobia.', triageCode: 'NEU-MIG' },
    { id: 's-m2', letter: 'M', name: 'Muscle Tear / Strain', hindi: 'मांसपेशी खिंचाव / तीव्र दर्द', severity: 'Mild', category: 'Orthopedic', description: 'Acute myofascial rupture during physical exertion.', triageCode: 'ORT-MSC' },
    { id: 's-m3', letter: 'M', name: 'Mouth / Dental Abscess', hindi: 'दांत व मसूड़े में फोड़ा / सूजन', severity: 'Moderate', category: 'Dental', description: 'Periapical infection with facial swelling.', triageCode: 'DEN-MTH' },
  ],
  N: [
    { id: 's-n1', letter: 'N', name: 'Nausea & Repeated Dry Heaving', hindi: 'जी मिचलाना एवं लगातार उल्टी की इच्छा', severity: 'Moderate', category: 'Gastrointestinal', description: 'Gastric distress impeding oral medication intake.', triageCode: 'GAS-NAU' },
    { id: 's-n2', letter: 'N', name: 'Numbness / Paresthesia (Face/Arm)', hindi: 'चेहरे या हाथ का सुन्न पड़ जाना', severity: 'Urgent', category: 'Neurological', description: 'Possible stroke / TIA precursor symptom. Assess FAST criteria.', triageCode: 'EMG-NUM' },
    { id: 's-n3', letter: 'N', name: 'Neck Stiffness (Meningismus)', hindi: 'गर्दन में गंभीर जकड़न (झुक न पाना)', severity: 'Urgent', category: 'Infectious', description: 'Nuchal rigidity combined with fever, photophobia.', triageCode: 'INF-NCK' },
  ],
  O: [
    { id: 's-o1', letter: 'O', name: 'Oxygen Saturation Drop (< 92%)', hindi: 'ऑक्सीजन का स्तर खतरनाक कम होना', severity: 'Urgent', category: 'Respiratory', description: 'Pulse oximetry desaturation demanding supplemental O2.', triageCode: 'EMG-OXY' },
    { id: 's-o2', letter: 'O', name: 'Ocular Chemical Burn', hindi: 'आंख में केमिकल या एसिड जाना', severity: 'Urgent', category: 'Ophthalmology', description: 'Immediate saline copious flush protocol needed.', triageCode: 'OPH-CHM' },
  ],
  P: [
    { id: 's-p1', letter: 'P', name: 'Pain - Unbearable Acute Scale 10/10', hindi: 'असहनीय तीव्र दर्द (10/10 स्तर)', severity: 'Urgent', category: 'Emergency', description: 'Intolerable acute agony requiring analgesic intervention.', triageCode: 'EMG-PAN' },
    { id: 's-p2', letter: 'P', name: 'Poisoning / Ingestion of Toxic Agent', hindi: 'विषपान / जहरीली वस्तु का सेवन', severity: 'Urgent', category: 'Toxicology', description: 'Accidental or deliberate poisoning. Secure airway and antidotes.', triageCode: 'TOX-PSN' },
    { id: 's-p3', letter: 'P', name: 'Palpitations & Fluttering Heart', hindi: 'सीने में दिल का धड़कना व फड़कना', severity: 'High', category: 'Cardiovascular', description: 'Irregular rhythm or supraventricular tachycardia sensation.', triageCode: 'CRD-PLP' },
    { id: 's-p4', letter: 'P', name: 'Pale & Clammy Cold Skin', hindi: 'त्वचा का पीला व ठंडा पसीना आना', severity: 'High', category: 'Shock', description: 'Hypoperfusion signs indicative of cardiogenic or septic shock.', triageCode: 'SHK-PAL' },
  ],
  Q: [
    { id: 's-q1', letter: 'Q', name: 'Quick Pulse / Tachycardia', hindi: 'अत्यधिक तेज नाड़ी (>130 BPM)', severity: 'High', category: 'Cardiovascular', description: 'Rapid pulse resting above baseline threshold.', triageCode: 'CRD-TCY' },
    { id: 's-q2', letter: 'Q', name: 'Quivering / Shivering Rigors', hindi: 'अंगों में अनियंत्रित कंपकंपी', severity: 'Moderate', category: 'Neurological', description: 'Involuntary somatic tremors.', triageCode: 'NEU-QVR' },
  ],
  R: [
    { id: 's-r1', letter: 'R', name: 'Respiratory Arrest / Distress', hindi: 'सांस रुकने की स्थिति / गंभीर संकट', severity: 'Urgent', category: 'Emergency', description: 'Agonal breathing or severe hypoventilation.', triageCode: 'EMG-RSP' },
    { id: 's-r2', letter: 'R', name: 'Rash (Spreading Petechiae/Purpura)', hindi: 'फैलते हुए लाल-बैंगनी दाने', severity: 'High', category: 'Dermatology', description: 'Non-blanching purpuric rash. Immediate meningococcal triage.', triageCode: 'DER-RSH' },
    { id: 's-r3', letter: 'R', name: 'Rib Fracture / Chest Wall Pain', hindi: 'पसलियों में दर्द / सांस लेते ही चुभन', severity: 'Moderate', category: 'Trauma', description: 'Point tenderness over thoracic cage aggravated by deep inspiration.', triageCode: 'TRM-RIB' },
  ],
  S: [
    { id: 's-s1', letter: 'S', name: 'Shortness of Breath (Sudden)', hindi: 'अचानक सांस फूलना / दम घुटना', severity: 'Urgent', category: 'Respiratory', description: 'Pulmonary embolism or acute pulmonary edema suspect.', triageCode: 'EMG-SOB' },
    { id: 's-s2', letter: 'S', name: 'Seizure / Convulsion Episode', hindi: 'मिर्गी का दौरा / शरीर का अकड़ना', severity: 'Urgent', category: 'Neurological', description: 'Tonic-clonic movements with post-ictal somnolence.', triageCode: 'EMG-SZR' },
    { id: 's-s3', letter: 'S', name: 'Stomach Cramping & Severe Gastralgia', hindi: 'पेट में मरोड़ एवं तीव्र दर्द', severity: 'Moderate', category: 'Gastrointestinal', description: 'Spasmodic peristaltic pain.', triageCode: 'GAS-STM' },
    { id: 's-s4', letter: 'S', name: 'Sore Throat & Inability to Swallow', hindi: 'गले में भयंकर दर्द / निगल न पाना', severity: 'High', category: 'ENT', description: 'Peritonsillar phlegmon or epiglottitis warning sign.', triageCode: 'ENT-SOR' },
    { id: 's-s5', letter: 'S', name: 'Stroke Symptoms (FAST Check)', hindi: 'लकवा / चेहरे या वाणी में विकार', severity: 'Urgent', category: 'Neurological', description: 'Facial droop, arm weakness, slurred signing/speech.', triageCode: 'EMG-STR' },
  ],
  T: [
    { id: 's-t1', letter: 'T', name: 'Throat Swelling & Stridor', hindi: 'गले में अंदरूनी सूजन / सीटी की आवाज', severity: 'Urgent', category: 'Respiratory', description: 'Upper airway narrowing requiring rapid airway rescue.', triageCode: 'EMG-STR' },
    { id: 's-t2', letter: 'T', name: 'Trauma to Head (Concussion)', hindi: 'सिर में गंभीर चोट / सिर चकराना', severity: 'Urgent', category: 'Trauma', description: 'Loss of memory, vomiting following cranial impact.', triageCode: 'TRM-HED' },
    { id: 's-t3', letter: 'T', name: 'Tremors / Involuntary Shaking', hindi: 'हाथ-पैरों में अनियंत्रित कंपन', severity: 'Moderate', category: 'Neurological', description: 'Resting or kinetic tremors of bilateral extremities.', triageCode: 'NEU-TRM' },
  ],
  U: [
    { id: 's-u1', letter: 'U', name: 'Urinary Retention / Severe Bladder Pain', hindi: 'पेशाब रुक जाना / मूत्राशय में तेज दर्द', severity: 'High', category: 'Urology', description: 'Acute urinary obstruction requiring catheter decompression.', triageCode: 'URO-URN' },
    { id: 's-u2', letter: 'U', name: 'Unconsciousness / Unresponsive State', hindi: 'पूरी तरह अचेत होना / होश न होना', severity: 'Urgent', category: 'Emergency', description: 'GCS < 8. Immediate resuscitation and airway management.', triageCode: 'EMG-UNC' },
  ],
  V: [
    { id: 's-v1', letter: 'V', name: 'Vomiting (Incessant / Coffee-Ground)', hindi: 'लगातार उल्टियां / खून या काला उल्टी', severity: 'High', category: 'Gastrointestinal', description: 'Risk of upper GI hemorrhage or severe alkalosis.', triageCode: 'GAS-VOM' },
    { id: 's-v2', letter: 'V', name: 'Vision Blur & Double Vision (Diplopia)', hindi: 'धुंधला या दोहरा दिखाई देना', severity: 'High', category: 'Neurological', description: 'Sudden cranial nerve deficit or retinal detachment.', triageCode: 'NEU-VIS' },
    { id: 's-v3', letter: 'V', name: 'Vertigo (Spinning Environment)', hindi: 'कमरा घूमना / भयंकर चक्कर आना', severity: 'Moderate', category: 'ENT', description: 'Acute vestibular neuronitis or BPPV.', triageCode: 'ENT-VER' },
  ],
  W: [
    { id: 's-w1', letter: 'W', name: 'Wheezing & Bronchospasm', hindi: 'सीने से सीटी जैसी आवाज आना', severity: 'High', category: 'Respiratory', description: 'Expiratory wheezes with prolonged expiratory phase.', triageCode: 'RES-WHZ' },
    { id: 's-w2', letter: 'W', name: 'Weakness in One Side of Body', hindi: 'शरीर के एक तरफ कमजोरी व लाचारी', severity: 'Urgent', category: 'Neurological', description: 'Hemiparesis sign requiring hyperacute stroke protocol.', triageCode: 'EMG-WKN' },
    { id: 's-w3', letter: 'W', name: 'Wound Gaping & Active Exudate', hindi: 'खुला घाव / संक्रमण व मवाद', severity: 'Moderate', category: 'Trauma', description: 'Contaminated laceration requiring debridement and tetanus shot.', triageCode: 'TRM-WND' },
  ],
  X: [
    { id: 's-x1', letter: 'X', name: 'X-Ray Urgently Needed / Deformity', hindi: 'एक्स-रे की आवश्यकता / संदिग्ध फ्रैक्चर', severity: 'High', category: 'Radiology', description: 'Extreme skeletal tenderness with inability to bear weight.', triageCode: 'RAD-XRY' },
    { id: 's-x2', letter: 'X', name: 'Xerostomia / Severe Oral Dryness', hindi: 'मुंह का अत्यधिक सूख जाना', severity: 'Mild', category: 'General', description: 'Extreme mucosal dryness accompanied by dehydration.', triageCode: 'GEN-XER' },
  ],
  Y: [
    { id: 's-y1', letter: 'Y', name: 'Yellow Sclera / Acute Hepatitis Sign', hindi: 'आंखों का गहरा पीलापन / हेपेटाइटिस', severity: 'High', category: 'Hepatic', description: 'Acute hepatic tender enlargement with icterus.', triageCode: 'HEP-YEL' },
    { id: 's-y2', letter: 'Y', name: 'Yawning Incessantly / Air Hunger', hindi: 'लगातार उबासी / हवा की भूख (हाइपोक्सिया)', severity: 'Moderate', category: 'Respiratory', description: 'Compensatory respiratory effort due to hypoxemia.', triageCode: 'RES-YAW' },
  ],
  Z: [
    { id: 's-z1', letter: 'Z', name: 'Zoster Rash & Burning Neuralgia', hindi: 'हर्पीज ज़ोस्टर (दाद) / अत्यधिक जलन', severity: 'Moderate', category: 'Dermatology', description: 'Dermatomal vesicular rash with intense burning pain.', triageCode: 'DER-ZOS' },
    { id: 's-z2', letter: 'Z', name: 'Zero Urine Output (Anuria)', hindi: 'बिल्कुल पेशाब न बनना (एन्यूरिका)', severity: 'Urgent', category: 'Nephrology', description: 'Absence of urine for > 8 hours indicating acute renal failure.', triageCode: 'NEP-ZRO' },
  ],
};
