export interface TransportDestination {
  id: string;
  name: string;
  code?: string;
  city: string;
  stateOrCountry: string;
  mode: 'Train' | 'Bus' | 'Flight';
  popular?: boolean;
}

export const TRANSPORT_DESTINATIONS: TransportDestination[] = [
  // ================= TRAIN DESTINATIONS =================
  { id: 'tr-1', name: 'Mumbai CSMT', code: 'CSMT', city: 'Mumbai', stateOrCountry: 'Maharashtra', mode: 'Train', popular: true },
  { id: 'tr-2', name: 'Mumbai Central', code: 'MMCT', city: 'Mumbai', stateOrCountry: 'Maharashtra', mode: 'Train', popular: true },
  { id: 'tr-3', name: 'Madgaon Junction', code: 'MAO', city: 'Goa', stateOrCountry: 'Goa', mode: 'Train', popular: true },
  { id: 'tr-4', name: 'Mangaluru Central', code: 'MAQ', city: 'Mangalore', stateOrCountry: 'Karnataka', mode: 'Train' },
  { id: 'tr-5', name: 'Mysuru Junction', code: 'MYS', city: 'Mysuru', stateOrCountry: 'Karnataka', mode: 'Train' },
  { id: 'tr-6', name: 'Mathura Junction', code: 'MTJ', city: 'Mathura', stateOrCountry: 'Uttar Pradesh', mode: 'Train' },
  { id: 'tr-7', name: 'Meerut City', code: 'MTC', city: 'Meerut', stateOrCountry: 'Uttar Pradesh', mode: 'Train' },
  { id: 'tr-8', name: 'Moradabad Junction', code: 'MB', city: 'Moradabad', stateOrCountry: 'Uttar Pradesh', mode: 'Train' },
  { id: 'tr-9', name: 'Delhi Junction (Old Delhi)', code: 'DLI', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Train', popular: true },
  { id: 'tr-10', name: 'New Delhi', code: 'NDLS', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Train', popular: true },
  { id: 'tr-11', name: 'Hazrat Nizamuddin', code: 'NZM', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Train' },
  { id: 'tr-12', name: 'Dehradun Terminal', code: 'DDN', city: 'Dehradun', stateOrCountry: 'Uttarakhand', mode: 'Train', popular: true },
  { id: 'tr-13', name: 'Dhanbad Junction', code: 'DHN', city: 'Dhanbad', stateOrCountry: 'Jharkhand', mode: 'Train' },
  { id: 'tr-14', name: 'Darbhanga Junction', code: 'DBG', city: 'Darbhanga', stateOrCountry: 'Bihar', mode: 'Train' },
  { id: 'tr-15', name: 'Pune Junction', code: 'PUNE', city: 'Pune', stateOrCountry: 'Maharashtra', mode: 'Train', popular: true },
  { id: 'tr-16', name: 'Patna Junction', code: 'PNBE', city: 'Patna', stateOrCountry: 'Bihar', mode: 'Train', popular: true },
  { id: 'tr-17', name: 'Prayagraj Junction', code: 'PRYJ', city: 'Prayagraj', stateOrCountry: 'Uttar Pradesh', mode: 'Train' },
  { id: 'tr-18', name: 'Puri Terminal', code: 'PURI', city: 'Puri', stateOrCountry: 'Odisha', mode: 'Train' },
  { id: 'tr-19', name: 'Bengaluru City (KSR)', code: 'SBC', city: 'Bengaluru', stateOrCountry: 'Karnataka', mode: 'Train', popular: true },
  { id: 'tr-20', name: 'Bhopal Junction', code: 'BPL', city: 'Bhopal', stateOrCountry: 'Madhya Pradesh', mode: 'Train' },
  { id: 'tr-21', name: 'Bhubaneswar', code: 'BBS', city: 'Bhubaneswar', stateOrCountry: 'Odisha', mode: 'Train' },
  { id: 'tr-22', name: 'Chennai Central', code: 'MAS', city: 'Chennai', stateOrCountry: 'Tamil Nadu', mode: 'Train', popular: true },
  { id: 'tr-23', name: 'Chandigarh Junction', code: 'CDG', city: 'Chandigarh', stateOrCountry: 'Punjab / Haryana', mode: 'Train' },
  { id: 'tr-24', name: 'Ahmedabad Junction', code: 'ADI', city: 'Ahmedabad', stateOrCountry: 'Gujarat', mode: 'Train', popular: true },
  { id: 'tr-25', name: 'Amritsar Junction', code: 'ASR', city: 'Amritsar', stateOrCountry: 'Punjab', mode: 'Train' },
  { id: 'tr-26', name: 'Agra Cantt', code: 'AGC', city: 'Agra', stateOrCountry: 'Uttar Pradesh', mode: 'Train' },
  { id: 'tr-27', name: 'Kolkata Howrah', code: 'HWH', city: 'Kolkata', stateOrCountry: 'West Bengal', mode: 'Train', popular: true },
  { id: 'tr-28', name: 'Kolkata Sealdah', code: 'SDAH', city: 'Kolkata', stateOrCountry: 'West Bengal', mode: 'Train' },
  { id: 'tr-29', name: 'Jaipur Junction', code: 'JP', city: 'Jaipur', stateOrCountry: 'Rajasthan', mode: 'Train', popular: true },
  { id: 'tr-30', name: 'Jodhpur Junction', code: 'JU', city: 'Jodhpur', stateOrCountry: 'Rajasthan', mode: 'Train' },
  { id: 'tr-31', name: 'Lucknow Charbagh', code: 'LKO', city: 'Lucknow', stateOrCountry: 'Uttar Pradesh', mode: 'Train', popular: true },
  { id: 'tr-32', name: 'Nagpur Junction', code: 'NGP', city: 'Nagpur', stateOrCountry: 'Maharashtra', mode: 'Train' },
  { id: 'tr-33', name: 'Nashik Road', code: 'NK', city: 'Nashik', stateOrCountry: 'Maharashtra', mode: 'Train', popular: true },
  { id: 'tr-34', name: 'Hyderabad Deccan (Nampally)', code: 'HYB', city: 'Hyderabad', stateOrCountry: 'Telangana', mode: 'Train', popular: true },
  { id: 'tr-35', name: 'Secunderabad Junction', code: 'SC', city: 'Hyderabad', stateOrCountry: 'Telangana', mode: 'Train' },
  { id: 'tr-36', name: 'Varanasi Cantt', code: 'BSB', city: 'Varanasi', stateOrCountry: 'Uttar Pradesh', mode: 'Train', popular: true },
  { id: 'tr-37', name: 'Visakhapatnam', code: 'VSKP', city: 'Visakhapatnam', stateOrCountry: 'Andhra Pradesh', mode: 'Train' },
  { id: 'tr-38', name: 'Surat Central', code: 'ST', city: 'Surat', stateOrCountry: 'Gujarat', mode: 'Train' },
  { id: 'tr-39', name: 'Coimbatore Junction', code: 'CBE', city: 'Coimbatore', stateOrCountry: 'Tamil Nadu', mode: 'Train' },
  { id: 'tr-40', name: 'Thiruvananthapuram Central', code: 'TVC', city: 'Thiruvananthapuram', stateOrCountry: 'Kerala', mode: 'Train' },

  // ================= BUS DESTINATIONS =================
  { id: 'bus-1', name: 'Mumbai Borivali Bus Terminal', code: 'ISBT', city: 'Mumbai', stateOrCountry: 'Maharashtra', mode: 'Bus', popular: true },
  { id: 'bus-2', name: 'Mumbai Dadar TT Bus Stand', code: 'ST', city: 'Mumbai', stateOrCountry: 'Maharashtra', mode: 'Bus' },
  { id: 'bus-3', name: 'Mahabaleshwar Bus Stand', code: 'MSRTC', city: 'Mahabaleshwar', stateOrCountry: 'Maharashtra', mode: 'Bus', popular: true },
  { id: 'bus-4', name: 'Manali Volvo Bus Stand', code: 'HRTC', city: 'Manali', stateOrCountry: 'Himachal Pradesh', mode: 'Bus', popular: true },
  { id: 'bus-5', name: 'Madurai Mattuthavani Bus Stand', code: 'TNSTC', city: 'Madurai', stateOrCountry: 'Tamil Nadu', mode: 'Bus' },
  { id: 'bus-6', name: 'Mangalore KSRTC Bus Stand', code: 'KSRTC', city: 'Mangalore', stateOrCountry: 'Karnataka', mode: 'Bus' },
  { id: 'bus-7', name: 'Delhi Kashmiri Gate ISBT', code: 'ISBT', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Bus', popular: true },
  { id: 'bus-8', name: 'Delhi Anand Vihar ISBT', code: 'ISBT', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Bus' },
  { id: 'bus-9', name: 'Delhi Sarai Kale Khan ISBT', code: 'ISBT', city: 'Delhi', stateOrCountry: 'Delhi NCR', mode: 'Bus' },
  { id: 'bus-10', name: 'Dehradun ISBT', code: 'UTC', city: 'Dehradun', stateOrCountry: 'Uttarakhand', mode: 'Bus', popular: true },
  { id: 'bus-11', name: 'Dharamsala McLeod Ganj Bus Stand', code: 'HRTC', city: 'Dharamsala', stateOrCountry: 'Himachal Pradesh', mode: 'Bus' },
  { id: 'bus-12', name: 'Pune Swargate Bus Terminal', code: 'MSRTC', city: 'Pune', stateOrCountry: 'Maharashtra', mode: 'Bus', popular: true },
  { id: 'bus-13', name: 'Pune Shivaji Nagar Bus Station', code: 'MSRTC', city: 'Pune', stateOrCountry: 'Maharashtra', mode: 'Bus' },
  { id: 'bus-14', name: 'Patna Mithapur Bus Stand', code: 'BSRTC', city: 'Patna', stateOrCountry: 'Bihar', mode: 'Bus' },
  { id: 'bus-15', name: 'Panaji KTC Bus Stand', code: 'KTC', city: 'Goa', stateOrCountry: 'Goa', mode: 'Bus', popular: true },
  { id: 'bus-16', name: 'Bengaluru Majestic KSRTC Bus Stand', code: 'KSRTC', city: 'Bengaluru', stateOrCountry: 'Karnataka', mode: 'Bus', popular: true },
  { id: 'bus-17', name: 'Bengaluru Shantinagar Bus Station', code: 'BMTC', city: 'Bengaluru', stateOrCountry: 'Karnataka', mode: 'Bus' },
  { id: 'bus-18', name: 'Chennai CMBT Koyambedu', code: 'CMBT', city: 'Chennai', stateOrCountry: 'Tamil Nadu', mode: 'Bus', popular: true },
  { id: 'bus-19', name: 'Chandigarh ISBT Sector 43', code: 'CTU', city: 'Chandigarh', stateOrCountry: 'Punjab / Haryana', mode: 'Bus', popular: true },
  { id: 'bus-20', name: 'Ahmedabad Geeta Mandir Bus Stand', code: 'GSRTC', city: 'Ahmedabad', stateOrCountry: 'Gujarat', mode: 'Bus', popular: true },
  { id: 'bus-21', name: 'Jaipur Sindhi Camp Bus Stand', code: 'RSRTC', city: 'Jaipur', stateOrCountry: 'Rajasthan', mode: 'Bus', popular: true },
  { id: 'bus-22', name: 'Shimla ISBT Tutikandi', code: 'HRTC', city: 'Shimla', stateOrCountry: 'Himachal Pradesh', mode: 'Bus', popular: true },
  { id: 'bus-23', name: 'Nashik CBS Central Bus Station', code: 'MSRTC', city: 'Nashik', stateOrCountry: 'Maharashtra', mode: 'Bus' },
  { id: 'bus-24', name: 'Hyderabad MGBS Imlibun Bus Terminal', code: 'TSRTC', city: 'Hyderabad', stateOrCountry: 'Telangana', mode: 'Bus', popular: true },
  { id: 'bus-25', name: 'Kolkata Esplanade Bus Terminus', code: 'SBSTC', city: 'Kolkata', stateOrCountry: 'West Bengal', mode: 'Bus' },
  { id: 'bus-26', name: 'Varanasi Cantt Bus Stand', code: 'UPSRTC', city: 'Varanasi', stateOrCountry: 'Uttar Pradesh', mode: 'Bus' },
  { id: 'bus-27', name: 'Rishikesh Yatra Bus Stand', code: 'UTC', city: 'Rishikesh', stateOrCountry: 'Uttarakhand', mode: 'Bus', popular: true },
  { id: 'bus-28', name: 'Udaipur Central Bus Stand', code: 'RSRTC', city: 'Udaipur', stateOrCountry: 'Rajasthan', mode: 'Bus' },
  { id: 'bus-29', name: 'Haridwar Bus Stand', code: 'UTC', city: 'Haridwar', stateOrCountry: 'Uttarakhand', mode: 'Bus' },
  { id: 'bus-30', name: 'Agra ISBT Transport Nagar', code: 'UPSRTC', city: 'Agra', stateOrCountry: 'Uttar Pradesh', mode: 'Bus' },

  // ================= FLIGHT DESTINATIONS =================
  { id: 'fl-1', name: 'Mumbai (BOM) - Chhatrapati Shivaji Int\'l', code: 'BOM', city: 'Mumbai', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-2', name: 'Munich (MUC) - Franz Josef Strauss', code: 'MUC', city: 'Munich', stateOrCountry: 'Germany', mode: 'Flight' },
  { id: 'fl-3', name: 'Madrid (MAD) - Barajas Airport', code: 'MAD', city: 'Madrid', stateOrCountry: 'Spain', mode: 'Flight' },
  { id: 'fl-4', name: 'Melbourne (MEL) - Tullamarine', code: 'MEL', city: 'Melbourne', stateOrCountry: 'Australia', mode: 'Flight' },
  { id: 'fl-5', name: 'Malé (MLE) - Velana Int\'l Airport', code: 'MLE', city: 'Malé', stateOrCountry: 'Maldives', mode: 'Flight', popular: true },
  { id: 'fl-6', name: 'Muscat (MCT) - Muscat Int\'l Airport', code: 'MCT', city: 'Muscat', stateOrCountry: 'Oman', mode: 'Flight' },
  { id: 'fl-7', name: 'Mauritius (MRU) - Sir Seewoosagur', code: 'MRU', city: 'Mauritius', stateOrCountry: 'Mauritius', mode: 'Flight' },
  { id: 'fl-8', name: 'Milan (MXP) - Malpensa Airport', code: 'MXP', city: 'Milan', stateOrCountry: 'Italy', mode: 'Flight' },
  { id: 'fl-9', name: 'Delhi (DEL) - Indira Gandhi Int\'l', code: 'DEL', city: 'Delhi', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-10', name: 'Dubai (DXB) - Dubai Int\'l Airport', code: 'DXB', city: 'Dubai', stateOrCountry: 'United Arab Emirates', mode: 'Flight', popular: true },
  { id: 'fl-11', name: 'Doha (DOH) - Hamad Int\'l Airport', code: 'DOH', city: 'Doha', stateOrCountry: 'Qatar', mode: 'Flight', popular: true },
  { id: 'fl-12', name: 'Dhaka (DAC) - Hazrat Shahjalal Int\'l', code: 'DAC', city: 'Dhaka', stateOrCountry: 'Bangladesh', mode: 'Flight', popular: true },
  { id: 'fl-13', name: 'Dehradun (DED) - Jolly Grant Airport', code: 'DED', city: 'Dehradun', stateOrCountry: 'India', mode: 'Flight' },
  { id: 'fl-14', name: 'Dallas (DFW) - Fort Worth Int\'l', code: 'DFW', city: 'Dallas', stateOrCountry: 'United States', mode: 'Flight' },
  { id: 'fl-15', name: 'Pune (PNQ) - Pune Int\'l Airport', code: 'PNQ', city: 'Pune', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-16', name: 'Patna (PAT) - Jayprakash Narayan', code: 'PAT', city: 'Patna', stateOrCountry: 'India', mode: 'Flight' },
  { id: 'fl-17', name: 'Paris (CDG) - Charles de Gaulle', code: 'CDG', city: 'Paris', stateOrCountry: 'France', mode: 'Flight', popular: true },
  { id: 'fl-18', name: 'Phuket (HKT) - Phuket Int\'l Airport', code: 'HKT', city: 'Phuket', stateOrCountry: 'Thailand', mode: 'Flight', popular: true },
  { id: 'fl-19', name: 'Bengaluru (BLR) - Kempegowda Int\'l', code: 'BLR', city: 'Bengaluru', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-20', name: 'Bangkok (BKK) - Suvarnabhumi', code: 'BKK', city: 'Bangkok', stateOrCountry: 'Thailand', mode: 'Flight', popular: true },
  { id: 'fl-21', name: 'Chennai (MAA) - Chennai Int\'l', code: 'MAA', city: 'Chennai', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-22', name: 'Singapore (SIN) - Changi Airport', code: 'SIN', city: 'Singapore', stateOrCountry: 'Singapore', mode: 'Flight', popular: true },
  { id: 'fl-23', name: 'London (LHR) - Heathrow Airport', code: 'LHR', city: 'London', stateOrCountry: 'United Kingdom', mode: 'Flight', popular: true },
  { id: 'fl-24', name: 'Kolkata (CCU) - Netaji Subhash Chandra', code: 'CCU', city: 'Kolkata', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-25', name: 'Hyderabad (HYD) - Rajiv Gandhi Int\'l', code: 'HYD', city: 'Hyderabad', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-26', name: 'Goa (GOI) - Dabolim / Manohar Int\'l', code: 'GOI', city: 'Goa', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-27', name: 'Ahmedabad (AMD) - Sardar Vallabhbhai', code: 'AMD', city: 'Ahmedabad', stateOrCountry: 'India', mode: 'Flight', popular: true },
  { id: 'fl-28', name: 'Jaipur (JAI) - Jaipur Int\'l Airport', code: 'JAI', city: 'Jaipur', stateOrCountry: 'India', mode: 'Flight' },
  { id: 'fl-29', name: 'Tokyo (HND) - Haneda Int\'l', code: 'HND', city: 'Tokyo', stateOrCountry: 'Japan', mode: 'Flight' },
  { id: 'fl-30', name: 'New York (JFK) - John F. Kennedy', code: 'JFK', city: 'New York', stateOrCountry: 'United States', mode: 'Flight', popular: true },
];

/**
 * Intelligent Destination Search Service
 * Simulates a fast, transport-aware destination search API.
 * Ranks exact starting matches first, word-boundary matches second, and substring matches third.
 */
export async function searchDestinations(
  query: string,
  mode: 'Train' | 'Bus' | 'Flight',
  limit: number = 8
): Promise<TransportDestination[]> {
  const trimmed = query.trim().toLowerCase();

  // Filter primarily by selected transport mode
  const modePool = TRANSPORT_DESTINATIONS.filter((d) => d.mode === mode);

  if (!trimmed) {
    // If no query yet, return popular ones for this mode
    return modePool.filter((d) => d.popular).slice(0, limit);
  }

  // Scoring function
  const scored = modePool
    .map((dest) => {
      let score = 0;
      const nameLower = dest.name.toLowerCase();
      const cityLower = dest.city.toLowerCase();
      const codeLower = (dest.code || '').toLowerCase();
      const stateLower = dest.stateOrCountry.toLowerCase();

      // Highest priority: name or city starts with query (e.g. "M" -> "Mumbai", "D" -> "Delhi")
      if (nameLower.startsWith(trimmed) || cityLower.startsWith(trimmed)) {
        score += 100;
      }
      // Airport/Station code starts with query (e.g. "D" -> "DXB", "DEL")
      else if (codeLower.startsWith(trimmed)) {
        score += 90;
      }
      // Word inside name starts with query (e.g. "CSMT" or "Central" when typing "C")
      else if (
        nameLower.split(/\s+/).some((word) => word.startsWith(trimmed)) ||
        cityLower.split(/\s+/).some((word) => word.startsWith(trimmed))
      ) {
        score += 70;
      }
      // Substring match
      else if (
        nameLower.includes(trimmed) ||
        cityLower.includes(trimmed) ||
        codeLower.includes(trimmed) ||
        stateLower.includes(trimmed)
      ) {
        score += 40;
      }

      // Bonus for popular hubs
      if (score > 0 && dest.popular) {
        score += 10;
      }

      return { dest, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.dest);

  return scored.slice(0, limit);
}
