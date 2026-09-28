/**
 * Client service to communicate with the Studolink AI Mitra server route (/api/chat).
 * Also includes an intelligent offline domain knowledge base if running in purely static
 * hosting environments (e.g., Firebase Hosting static SPA without Cloud Functions).
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestions?: string[];
  actionLink?: {
    text: string;
    url: string;
  };
}

const STATIC_KNOWLEDGE_BASE = [
  {
    keywords: ['nawada', 'gaya', 'nalanda', 'bihar sharif', 'jehanabad', 'magadh', 'kls college', 'ts college'],
    reply: `📍 **Nawada & Magadh Division Student Guide (Bihar):**
- **Top Localities for Hostels & Lodges in Nawada:**
  - **Station Road & Railway Station area:** Highest concentration of private student lodges, direct connectivity to colleges and coaching centers.
  - **Prajatantra Chowk & Main Market:** Central hub with access to mess/tiffin, books, study material, and local transport.
  - **Near K.L.S. College & T.S. College:** Affordable rooms for degree and 11th/12th intermediate aspirants.
- **Estimated Monthly Rent in Nawada:**
  - **Double Sharing Lodge:** ₹1,200 – ₹2,200/month per student.
  - **Single Private Room (Self-cook):** ₹2,000 – ₹3,500/month.
  - **Hostel with Mess (Food):** ₹4,000 – ₹6,000/month.
  - **Self-Study Library:** ₹350 – ₹600/month.
- **Safety Tip:** Kisi ko online token ya booking advance na bhejein. Room physically daylight me check karke hi finalize karein!`,
    suggestions: ['Search Rooms in Nawada', 'Nawada Student Budget', 'Anti-Scam Rules'],
    actionLink: { text: 'Browse Verified Listings', url: '/search?city=Nawada' },
  },
  {
    keywords: ['hostel', 'hostal', 'pg', 'room', 'lodge', 'kamra', 'kiraya', 'rent'],
    reply: `🏠 **Student Hostel & PG Finder Guide:**
- **Zero-Brokerage Guarantee:** Studolink par sabhi listings direct verified owners dwara post hoti hain. Kisi bhi broker ko commission dene ki zaroorat nahi hai.
- **Room Inspection Checklist:**
  1. **Daylight Visit:** Din ke samay room ka natural sunlight aur ventilation zaroor dekhein.
  2. **Water & Power:** 24x7 drinking water, bathroom supply aur summer power backup confirm karein.
  3. **Electricity Unit Rate:** Agreement par entry date ka sub-meter reading likhein (Standard ₹7–₹10/unit).
  4. **Strict Safety:** Bina physical room visit kiye online advance token transfer mat karein!`,
    suggestions: ['Search PGs in my city', 'Calculate Monthly Budget', 'How to avoid scams'],
    actionLink: { text: 'Search Verified Rooms', url: '/search' },
  },
  {
    keywords: ['kota', 'allen', 'motion', 'pw', 'vidyapeeth', 'indraprastha', 'talwandi', 'landmark'],
    reply: `📍 **Kota Education Hub Guide:**
- **Prime Student Areas:**
  - **Landmark City (Kunadi):** Best for Allen Samyak & Allen Sangyan students. Average single room: ₹7,500 – ₹13,000/mo (with mess).
  - **Indraprastha (IP) Industrial Area:** Near Allen Supath & Career Point. Large hostels, good mess facilities: ₹8,000 – ₹14,000/mo.
  - **Talwandi & Vigyan Nagar:** Very calm, great for self-study and libraries: ₹5,000 – ₹9,000/mo.
  - **Mahaveer Nagar (1, 2, 3):** Budget-friendly options starting from ₹4,500/mo (double sharing).
- **Pro-Tip:** Kota me room lene se pehle electricity sub-meter reading note karein (govt rate ~₹8-9/unit). Kisi ko online advance token na dein!`,
    suggestions: ['Search PGs in Kota', 'Kota Budget Estimator', 'Safety Guidelines'],
    actionLink: { text: 'Browse Kota Listings', url: '/search?city=Kota' },
  },
  {
    keywords: ['patna', 'boring road', 'kankarbagh', 'khan sir', 'bazar samiti', 'musallahpur', 'patna pg'],
    reply: `📍 **Patna Student Zone Guide:**
- **Boring Road & Boring Canal Road:**
  - Top hub for JEE, NEET, and Foundation coachings.
  - Double sharing room: ₹4,000 – ₹6,500/month.
  - Single room with mess: ₹8,000 – ₹11,000/month.
- **Bazar Samiti & Musallahpur Hat:**
  - Most famous hub for General Competitions (BPSC, SSC, Railway, Daroga, Khan GS Research Centre).
  - Very budget-friendly: ₹2,500 – ₹4,500/month (self-cooking lodge & sharing rooms).
- **Kankarbagh & Rajendra Nagar:**
  - Peaceful residential areas with numerous 24x7 AC study libraries: ₹600 – ₹1,200/month.`,
    suggestions: ['Search PGs in Patna', 'Patna Student Budget', 'View Libraries in Patna'],
    actionLink: { text: 'Browse Patna Listings', url: '/search?city=Patna' },
  },
  {
    keywords: ['delhi', 'mukherjee nagar', 'orn', 'old rajinder nagar', 'upsc', 'laxmi nagar', 'kalu sarai'],
    reply: `📍 **Delhi NCR Aspirants Hub Guide:**
- **Mukherjee Nagar & Nehru Vihar:**
  - India's epicenter for Hindi-medium UPSC, SSC CGL, State PCS.
  - Sharing PG with food: ₹6,500 – ₹12,000/mo.
  - Single room: ₹10,000 – ₹16,000/mo.
- **Old Rajinder Nagar (ORN) & Karol Bagh:**
  - Core hub for English-medium UPSC (Vajiram, Next IAS, Vision IAS).
  - Premium pricing: ₹12,000 – ₹22,000/mo (Food + AC).
- **Laxmi Nagar:** CA, CS, CMA, Commerce capital of India. Affordable sharing from ₹4,500/mo.
- **Kalu Sarai & Jia Sarai:** Near IIT Delhi, hub for JEE Advanced & GATE aspirants.`,
    suggestions: ['Search Delhi PGs', 'Delhi Student Budget', 'Book Second Hand Items'],
    actionLink: { text: 'Browse Delhi Listings', url: '/search?city=Delhi' },
  },
  {
    keywords: ['sikar', 'piprali road', 'matrix', 'clc', 'gurukripa', 'sikar pg'],
    reply: `📍 **Sikar (Shekhawati Education Hub) Guide:**
- **Piprali Road:** Main coaching corridor for NEET & JEE (Matrix, Allen, CLC, Gurukripa).
  - Average Hostel with 4-time food: ₹7,000 – ₹11,000/month.
  - Standard Double Room: ₹4,500 – ₹6,500/month.
- **Palwas Road & Nawalgarh Road:**
  - Peaceful areas with excellent self-study libraries and pocket-friendly rooms.`,
    suggestions: ['Search PGs in Sikar', 'Sikar Budget Calculator'],
    actionLink: { text: 'Browse Sikar Listings', url: '/search?city=Sikar' },
  },
  {
    keywords: ['advance', 'token', 'fraud', 'scam', 'police', 'safe', 'paise', 'broker', 'dalal'],
    reply: `⚠️ **Student Safety & Anti-Scam Golden Rules:**
1. **Never Pay Token Advance Online:** Agar koi WhatsApp ya call par bole *"₹1,500 gate pass ya token advance transfer karo tab room dikhayenge"*, toh wo **100% FRAUD** hai. Kabhi paise na bhejein!
2. **Physical Inspection in Daylight:** Hamesha din ke ujale me room, bathroom ka paani pressure, aur ceiling fans check karein.
3. **Electricity Sub-Meter Reading:** Agreement par entry ke din ka exact meter unit likhein.
4. **Written Rent Receipts:** Har mahine rent cash ya UPI se dete waqt signed receipt zaroor lein.
5. **No Brokerage:** Studolink par 100% listings zero brokerage hain. Kisi broker ko commision na dein!`,
    suggestions: ['Read Full Safety Policy', 'Calculate Monthly Budget'],
    actionLink: { text: 'View Safety Advisory', url: '/safety' },
  },
  {
    keywords: ['stress', 'tension', 'dar', 'depression', 'alone', 'lonely', 'suicide', 'anxiety', 'pressure'],
    reply: `💙 **Aap akele nahi hain, hum aapke saath hain:**
Exam ki taiyari me pressure aur loneliness feel hona bohot normal hai. Lekin yaad rakhein — **koi bhi exam aapki zindagi aur khushiyo se bada nahi hai.**

- Agar bohot zyada anxiety ya stress ho raha hai, toh turant 24/7 Free & Confidential Helpline par baat karein:
  - 📞 **Tele-MANAS (Govt of India):** **14416** (Toll-Free, 24x7)
  - 📞 **Alternative Toll-Free:** **1800-891-4416**
  - 🚨 **National Emergency Helpline:** **112**
- Apne mummy-papa ya kisi dost se baat karein, thoda walk karein aur deep breathing karein. Aap zaroor kamiyab honge!`,
    suggestions: ['Contact Tele-MANAS (14416)', 'Read Safety & Wellness'],
    actionLink: { text: 'Open Wellness Support', url: '/safety' },
  },
  {
    keywords: ['budget', 'kharcha', 'expense', 'calculator', 'mahine ka kharcha'],
    reply: `📊 **Standard Student Monthly Budget Breakdown:**
- **Room Rent + Electricity:** ₹4,000 – ₹8,000 (Sharing/Single)
- **Mess / Tiffin (Breakfast + 2 Meals):** ₹2,800 – ₹4,200
- **AC Study Library (Shift-wise):** ₹700 – ₹1,400
- **Study Material & Stationary:** ₹500 – ₹1,000
- **Laundry & Personal Misc:** ₹800 – ₹1,500
- **Total Expected Monthly Cost:** ₹8,800 – ₹16,000

💡 Aap hamare built-in **Budget Calculator** ka use karke apne shehar aur coaching ke anusaar exact kharcha estimate kar sakte hain!`,
    suggestions: ['Open Budget Calculator', 'Search Budget PGs'],
    actionLink: { text: 'Calculate Student Budget', url: '/budget' },
  },
  {
    keywords: ['marketplace', 'book', 'cycle', 'cooler', 'second hand', 'purana', 'bechna', 'khareedna'],
    reply: `🛒 **Studolink Student Marketplace:**
- Aap seniors ke second-hand books (Allen, Resonance, PW modules), room coolers, study tables, cycle, aur calculators seedhe students se bina kisi middleman ke le sakte hain.
- **Rule:** Physical meetup karke item check karein, tabhi UPI payment karein.`,
    suggestions: ['Browse Marketplace', 'Post an Item for Sale'],
    actionLink: { text: 'Explore Marketplace', url: '/marketplace' },
  },
];

export async function sendChatMessage(
  message: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<{ text: string; suggestions?: string[]; actionLink?: { text: string; url: string } }> {
  const cleanMsg = message.trim();
  if (!cleanMsg) {
    throw new Error('Message cannot be empty.');
  }

  // 1. Try server-side Gemini API route first
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: cleanMsg,
        history,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        const lower = cleanMsg.toLowerCase();
        let dynamicSuggestions = [
          'Find verified rooms',
          'How to avoid advance scams?',
          'Student budget breakdown',
        ];

        if (lower.includes('nawada')) {
          dynamicSuggestions = [
            'Rooms near Station Road',
            'Lodge rates in Nawada',
            'Hostel with Mess in Nawada',
          ];
        } else if (lower.includes('kota')) {
          dynamicSuggestions = [
            'Landmark City room rates',
            'Indraprastha hostels',
            'Electricity meter guide',
          ];
        } else if (lower.includes('patna')) {
          dynamicSuggestions = [
            'Boring Road PGs',
            'Bazar Samiti Lodges',
            'AC Libraries in Patna',
          ];
        } else if (lower.includes('hostel') || lower.includes('hostal') || lower.includes('pg') || lower.includes('room')) {
          dynamicSuggestions = [
            'Check room amenities',
            'Average single room rent',
            'Agreement & deposit rules',
          ];
        }

        return {
          text: data.reply,
          suggestions: dynamicSuggestions,
        };
      }
    } else {
      const errData = await res.json().catch(() => null);
      if (errData && errData.reply) {
        return {
          text: errData.reply,
          suggestions: ['Find verified rooms', 'How to avoid advance scams?', 'Student budget breakdown'],
        };
      }
      console.warn(`Backend /api/chat returned status ${res.status}:`, errData?.error || 'Unknown error');
    }
  } catch (err) {
    console.warn('Backend /api/chat unreachable, falling back to local student knowledge base:', err);
  }

  // 2. Intelligent offline/static knowledge base matching
  const lower = cleanMsg.toLowerCase();
  for (const entry of STATIC_KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return {
        text: entry.reply,
        suggestions: entry.suggestions,
        actionLink: entry.actionLink,
      };
    }
  }

  // Default helpful response
  return {
    text: `Namaste! Main **Studolink AI Mitra** hu — aapka student advisor aur local guide. 🎓

Aap mujhse kisi bhi educational hub ke baare me pooch sakte hain:
- 🏢 **PGs, Hostels & Rooms:** Kota, Patna, Delhi NCR, Sikar, Prayagraj, Indore, Bengaluru
- 🍱 **Mess & Tiffin Services:** Monthly rates aur food hygiene advice
- ⚠️ **Anti-Scam & Advance Advisory:** Token payment frauds se kaise bachein
- 📚 **Study Libraries & 2nd-Hand Marketplace:** Books, coolers, cycles
- 📊 **Monthly Student Budget:** Rent aur living expense calculation

Bataiye, aaj main aapki kya madad kar sakta hu?`,
    suggestions: [
      'Kota me best PGs under ₹7,000?',
      'Patna Boring Road room rates?',
      'Online advance token dena chahiye?',
      'Student monthly budget kitna hota hai?',
    ],
    actionLink: { text: 'Browse All Cities', url: '/search' },
  };
}
