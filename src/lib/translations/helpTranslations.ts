export interface HelpFaqLocalized {
  id: string;
  category: 'students' | 'owners' | 'marketplace' | 'roommates' | 'technical';
  question: {
    en: string;
    hi: string;
    hinglish: string;
  };
  answer: {
    en: string;
    hi: string;
    hinglish: string;
  };
  action?: {
    text: {
      en: string;
      hi: string;
      hinglish: string;
    };
    url: string;
  };
}

export const LOCALIZED_FAQS: HelpFaqLocalized[] = [
  {
    id: 'zero-brokerage',
    category: 'students',
    question: {
      en: 'Is there any brokerage or commission charged on Studolink?',
      hi: 'क्या स्टुडोलिंक (Studolink) पर कोई ब्रोकरेज या दलाली शुल्क लगता है?',
      hinglish: 'Kya Studolink par koi brokerage ya commission lagta hai?'
    },
    answer: {
      en: 'No, absolutely not! Studolink is a 100% zero-brokerage platform. All rooms, PGs, hostels, and mess listings are posted directly by verified property owners. You communicate directly via call or WhatsApp without any middleman fees.',
      hi: 'नहीं, बिल्कुल नहीं! स्टुडोलिंक 100% जीरो-ब्रोकरेज प्लेटफॉर्म है। सभी रूम, पीजी, हॉस्टल और मेस लिस्टिंग सीधे असली मालिकों द्वारा पोस्ट की जाती हैं। आप सीधे फोन या व्हाट्सएप पर बात कर सकते हैं, कोई दलाली नहीं ली जाती।',
      hinglish: 'Nahi, bilkul nahi! Studolink 100% zero-brokerage platform hai. Sabhi rooms, PGs, hostels aur mess listings verified property owners dwara directly post kiye jaate hain. Aap directly owner se call ya WhatsApp par baat kar sakte hain bina kisi middleman ke.'
    },
    action: {
      text: {
        en: 'Browse Verified Rooms',
        hi: 'सत्यापित कमरे देखें',
        hinglish: 'Browse Verified Rooms'
      },
      url: '/search'
    }
  },
  {
    id: 'advance-scam',
    category: 'students',
    question: {
      en: 'Should I transfer advance booking money or gate pass fee before seeing the room?',
      hi: 'क्या कमरा देखने से पहले ऑनलाइन एडवांस टोकन या गेट पास फीस भेजना चाहिए?',
      hinglish: 'Room lene se pehle advance token payment transfer karna chahiye?'
    },
    answer: {
      en: 'NEVER! Never transfer token advance or gate pass fees via UPI/QR code to anyone before physically inspecting the room in daylight. If anyone insists "transfer advance first to view the room", it is 100% cyber fraud. Report them immediately.',
      hi: 'कभी नहीं! दिन के उजाले में कमरा स्वयं जाकर देखे बिना किसी को भी ऑनलाइन एडवांस या गेट पास फीस न भेजें। यदि कोई कहे कि "पहले पैसे भेजो तब कमरा दिखाएंगे", तो वह 100% धोखाधड़ी (फ्रॉड) है।',
      hinglish: 'KABHI NAHI! Kabhi bhi kisi owner ya broker ko online token amount ya gate pass fee transfer mat karein bina room physically din ke ujale me dekhe. Agar koi phone par bole "Advance transfer karo tab room dikhayenge", toh wo 100% fraud hai. Aise cases ko turant report karein.'
    },
    action: {
      text: {
        en: 'Read Safety Policy',
        hi: 'सुरक्षा नियम पढ़ें',
        hinglish: 'Read Safety Policy'
      },
      url: '/safety'
    }
  },
  {
    id: 'post-listing-free',
    category: 'owners',
    question: {
      en: 'Is listing a property free for landlords and PG operators?',
      hi: 'क्या मकान मालिकों और पीजी संचालकों के लिए लिस्टिंग डालना मुफ्त (Free) है?',
      hinglish: 'Kya room owners aur landlords ke liye listing post karna free hai?'
    },
    answer: {
      en: 'Yes! Room owners, PG managers, hostel caretakers, and library operators can list their facilities 100% FREE on Studolink. Our verification team reviews and publishes the listing within 12-24 hours.',
      hi: 'हाँ, रूम मालिक, पीजी प्रबंधक, हॉस्टल संचालक और लाइब्रेरी ऑपरेटर अपनी प्रॉपर्टी बिल्कुल मुफ्त (FREE) में लिस्ट कर सकते हैं। हमारी वेरिफिकेशन टीम 12-24 घंटे के अंदर लिस्टिंग अप्रूव कर देती है।',
      hinglish: 'Haan, room owners, PG managers, hostel sanchalak aur library operators Studolink par apni properties bilkul muft (FREE) me post kar sakte hain. Post karne ke baad hamari verification team 12-24 ghante ke andar listing verify kar deti hai.'
    },
    action: {
      text: {
        en: 'Post a Listing',
        hi: 'कमरा लिस्ट करें',
        hinglish: 'Post a Listing'
      },
      url: '/add-listing'
    }
  },
  {
    id: 'marketplace-buy-sell',
    category: 'marketplace',
    question: {
      en: 'How to buy or sell second-hand study material and room furniture?',
      hi: 'स्टूडेंट मार्केटप्लेस पर पुरानी किताबें या रूम का सामान कैसे खरीदें या बेचें?',
      hinglish: 'Student Marketplace par second-hand items kaise bechein ya khareedein?'
    },
    answer: {
      en: 'You can directly list your used coaching modules (Allen, PW, Motion), study tables, room coolers, or cycles in the Student Marketplace. Interested aspirants contact you directly. Always verify items physically before paying.',
      hi: 'आप अपने पुराने कोचिंग नोट्स, किताबें, स्टडी टेबल, कूलर या साइकिल मार्केटप्लेस में आसानी से पोस्ट कर सकते हैं। इच्छुक छात्र आपसे सीधे संपर्क करेंगे। भुगतान हमेशा सामान देखकर ही करें।',
      hinglish: 'Aap apne puraane Allen/PW/Resonance study modules, reference books, study tables, room coolers ya cycle ko Marketplace me direct post kar sakte hain. Interested students aapse directly WhatsApp par deal kar sakte hain. Payment hamesha physically item check karne ke baad hi karein.'
    },
    action: {
      text: {
        en: 'Explore Marketplace',
        hi: 'मार्केटप्लेस देखें',
        hinglish: 'Explore Marketplace'
      },
      url: '/marketplace'
    }
  },
  {
    id: 'roommate-matching',
    category: 'roommates',
    question: {
      en: 'How can I find a compatible student flatmate or roommate?',
      hi: 'अपनी पढ़ाई के अनुकूल रूममेट या फ्लैटमेट कैसे खोजें?',
      hinglish: 'Compatible flatmate ya roommate kaise dhoondein?'
    },
    answer: {
      en: 'In the Roommate Finder section, you can filter student profiles by target exam (JEE, NEET, UPSC), study schedule (night owl vs early bird), dietary preferences (veg/non-veg), and budget to find like-minded study partners.',
      hi: 'रूममेट फाइंडर सेक्शन में आप अपने टारगेट एग्जाम (JEE, NEET, UPSC), पढ़ने का समय, खान-पान की आदत और बजट के अनुसार अन्य छात्रों की प्रोफाइल देखकर उनसे संपर्क कर सकते हैं।',
      hinglish: 'Roommate Finder section me aap apne study timings (night owl vs early bird), food preference (veg / non-veg), smoking/drinking habits aur budget ke hisab se verified student profiles filter kar sakte hain aur unse connect kar sakte hain.'
    },
    action: {
      text: {
        en: 'Find Roommates',
        hi: 'रूममेट खोजें',
        hinglish: 'Find Roommates'
      },
      url: '/roommates'
    }
  },
  {
    id: 'app-glitch-developer',
    category: 'technical',
    question: {
      en: 'What if I encounter an app error, login glitch, or bug?',
      hi: 'यदि ऐप में कोई तकनीकी समस्या, लॉगिन एरर या बग आए तो क्या करें?',
      hinglish: 'Agar app me koi technical issue, login error ya loading problem aaye toh?'
    },
    answer: {
      en: 'If you face any loading issues, login errors, or technical bugs, contact our Engineering Team directly at Developer@imprince.me with a screenshot and device model. We resolve technical bugs swiftly.',
      hi: 'यदि ऐप में कोई खराबी, लोडिंग दिक्कत या लॉगिन समस्या आए, तो स्क्रीनशॉट के साथ हमारी टेक्निकल टीम को Developer@imprince.me पर ईमेल भेजें। हम तुरंत सहायता करेंगे।',
      hinglish: 'Agar app slow chal rahi hai, page crash ho raha hai ya login/OTP me error aa rahi hai, toh aap direct hamare Technical Team ko Developer@imprince.me par email bhej sakte hain. Screenshot aur device model zaroor include karein taaki hum turant fix kar sakein.'
    }
  },
  {
    id: 'library-booking',
    category: 'students',
    question: {
      en: 'How to discover Silent AC Study Libraries nearby?',
      hi: 'शांत एसी स्टडी लाइब्रेरी (Self-Study Library) कैसे खोजें?',
      hinglish: 'Silent AC Libraries kaise find karein?'
    },
    answer: {
      en: 'Select the "Library" category on the Search page. You can view 24x7 shift timings, air-conditioned seating, high-speed Wi-Fi availability, and monthly pricing (typically ₹400 – ₹1,200/month).',
      hi: 'सर्च पेज पर "Library" श्रेणी चुनें। वहाँ आपको 24 घंटे शिफ्ट का समय, एसी व्यवस्था, वाई-फाई स्पीड और मासिक शुल्क (₹400 से ₹1,200) के साथ लाइब्रेरी मिल जाएगी।',
      hinglish: 'Search page par "Library" category select karein. Wahan aapko shift timings (Morning, Evening, Night 24x7), AC, Wi-Fi speed aur monthly charges (₹400 – ₹1,200) ke sath libraries mil jaayengi.'
    },
    action: {
      text: {
        en: 'Find Libraries',
        hi: 'लाइब्रेरी खोजें',
        hinglish: 'Find Libraries'
      },
      url: '/search?category=Library'
    }
  }
];

export const HELP_UI_TEXT = {
  en: {
    heroTitle: 'Student Help & Support Hub',
    heroSubtitle: 'Instant answers to room hunting, landlord guidelines, safety checklists & grievance assistance.',
    searchPlaceholder: 'Search questions: advance scam, zero brokerage, room rent, library, mess...',
    categories: {
      all: 'All Topics',
      students: 'For Students',
      owners: 'For PG Owners',
      marketplace: 'Marketplace',
      roommates: 'Roommates',
      technical: 'App Support'
    },
    contactTitle: 'Still Need Help? Contact Our Support Team',
    contactSubtitle: 'Send a direct message to our support desk or engineering lead.',
    nameLabel: 'Your Full Name',
    emailLabel: 'Email Address',
    typeLabel: 'Inquiry Category',
    typeGeneral: 'Student Support & Verification',
    typeTech: 'Technical Glitch / Bug Report',
    messageLabel: 'Describe your issue or feedback in detail',
    messagePlaceholder: 'Tell us how we can help you...',
    submitBtn: 'Send Message to Support Desk',
    sending: 'Sending...',
    hotlineBannerTitle: '24/7 Student Emotional Well-Being & Emergency Helpline',
    hotlineBannerSubtitle: 'Tele-MANAS Toll-Free 14416 | National Emergency 112'
  },
  hi: {
    heroTitle: 'छात्र सहायता और सपोर्ट केंद्र',
    heroSubtitle: 'कमरा खोजने, सुरक्षा नियमों, मेस, लाइब्रेरी और मकान मालिक नियमों के तुरंत समाधान।',
    searchPlaceholder: 'प्रश्न खोजें: एडवांस स्कैम, जीरो ब्रोकरेज, किराया, लाइब्रेरी, मेस...',
    categories: {
      all: 'सभी विषय',
      students: 'छात्रों के लिए',
      owners: 'मकान मालिकों के लिए',
      marketplace: 'मार्केटप्लेस',
      roommates: 'रूममेट',
      technical: 'तकनीकी सहायता'
    },
    contactTitle: 'कोई और सहायता चाहिए? हमसे सीधे संपर्क करें',
    contactSubtitle: 'हमारी सपोर्ट टीम या तकनीकी लीड को तुरंत संदेश भेजें।',
    nameLabel: 'आपका पूरा नाम',
    emailLabel: 'ईमेल पता',
    typeLabel: 'समस्या का प्रकार',
    typeGeneral: 'छात्र सहायता व कमरा वेरिफिकेशन',
    typeTech: 'तकनीकी गड़बड़ी / बग रिपोर्ट',
    messageLabel: 'अपनी समस्या या सुझाव विस्तार से लिखें',
    messagePlaceholder: 'बताएं हम आपकी कैसे मदद कर सकते हैं...',
    submitBtn: 'सपोर्ट टीम को संदेश भेजें',
    sending: 'भेजा जा रहा है...',
    hotlineBannerTitle: '24/7 छात्र मानसिक स्वास्थ्य एवं आपातकालीन हेल्पलाइन',
    hotlineBannerSubtitle: 'टेली-मानस टोल-फ्री 14416 | राष्ट्रीय आपातकाल 112'
  },
  hinglish: {
    heroTitle: 'Student Help & Support Hub',
    heroSubtitle: 'Room hunting, landlord rules, safety checklists aur support ke aasaan answers.',
    searchPlaceholder: 'Search karein: advance scam, zero brokerage, room rent, library, mess...',
    categories: {
      all: 'Sabhi Topics',
      students: 'Students Ke Liye',
      owners: 'PG Owners Ke Liye',
      marketplace: 'Marketplace',
      roommates: 'Roommates',
      technical: 'App Support'
    },
    contactTitle: 'Kuchh Aur Poochna Hai? Support Team Se Baat Karein',
    contactSubtitle: 'Hamari support desk ya developer team ko direct message karein.',
    nameLabel: 'Aapka Naam',
    emailLabel: 'Email Address',
    typeLabel: 'Inquiry Category',
    typeGeneral: 'Student Support & Verification',
    typeTech: 'Technical Glitch / Bug Report',
    messageLabel: 'Apna sawaal ya dikkat yahan likhein',
    messagePlaceholder: 'Bataiye hum aapki kaise madad kar sakte hain...',
    submitBtn: 'Send Message to Support Desk',
    sending: 'Bheja ja raha hai...',
    hotlineBannerTitle: '24/7 Student Mental Health & Emergency Helpline',
    hotlineBannerSubtitle: 'Tele-MANAS Toll-Free 14416 | National Emergency 112'
  }
};
