export interface LocalizedContent {
  title: string;
  subtitle: string;
  badge: string;
  heroIntro: string;
  lastUpdated: string;
  jurisdiction: string;
  zeroBrokerageBadge: string;
  tabs: {
    privacy: string;
    terms: string;
    safety: string;
    listingPolicy: string;
    grievance: string;
  };
  safety: {
    title: string;
    subtitle: string;
    alertTitle: string;
    alertDesc: string;
    goldenRulesTitle: string;
    rules: Array<{ title: string; desc: string }>;
    antiFraudTitle: string;
    antiFraudPoints: string[];
    helplineTitle: string;
    helplineSubtitle: string;
    teleManasDesc: string;
    emergencyDesc: string;
    womenHelplineDesc: string;
    checklistTitle: string;
    checklistItems: string[];
  };
  privacy: {
    title: string;
    subtitle: string;
    introTitle: string;
    introText: string;
    dataCollectTitle: string;
    dataCollectIntro: string;
    studentDataTitle: string;
    studentDataItems: string[];
    ownerDataTitle: string;
    ownerDataItems: string[];
    geoTitle: string;
    geoText: string;
    dataUsageTitle: string;
    dataUsageItems: string[];
    dataSharingTitle: string;
    dataSharingHighlight: string;
    rightsTitle: string;
    rightsItems: string[];
  };
  terms: {
    title: string;
    subtitle: string;
    acceptTitle: string;
    acceptText: string;
    intermediaryTitle: string;
    intermediaryText: string;
    zeroBrokerageTitle: string;
    zeroBrokerageText: string;
    conductTitle: string;
    conductItems: string[];
    ownerObligationsTitle: string;
    ownerObligationsItems: string[];
    liabilityTitle: string;
    liabilityText: string;
  };
  listingPolicy: {
    title: string;
    subtitle: string;
    standardsTitle: string;
    standardsItems: string[];
    bannedPracticesTitle: string;
    bannedPracticesItems: string[];
    photoStandardsTitle: string;
    photoStandardsText: string;
  };
  grievance: {
    title: string;
    subtitle: string;
    officerTitle: string;
    officerName: string;
    officerRole: string;
    slaTitle: string;
    slaText: string;
    cyberCoopTitle: string;
    cyberCoopText: string;
  };
}

export const LEGAL_TRANSLATIONS: Record<'en' | 'hi' | 'hinglish', LocalizedContent> = {
  en: {
    title: 'Legal, Privacy & Student Safety Hub',
    subtitle: 'Zero-brokerage terms, user conduct, privacy rights & aspirant protection guidelines',
    badge: 'Legal & Safety',
    heroIntro: 'Studolink is India’s dedicated zero-brokerage educational housing and resource ecosystem. Read our legally binding terms, strict anti-fraud safety rules, and privacy practices.',
    lastUpdated: 'Updated: September 2026',
    jurisdiction: 'Jurisdiction: India (IT Act & DPDP 2023)',
    zeroBrokerageBadge: '100% Zero Brokerage Platform',
    tabs: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      safety: 'Student Safety & Anti-Fraud',
      listingPolicy: 'Listing & Owner Rules',
      grievance: 'Grievance & Legal Officer',
    },
    safety: {
      title: 'Student Safety, Scam Protection & Anti-Fraud Advisory',
      subtitle: 'Mandatory inspection checklist and safety protocols for students relocating to Kota, Patna, Delhi, Sikar, Nawada, and education hubs.',
      alertTitle: 'STOP! Never Pay Online Token / Advance Without Physical Inspection',
      alertDesc: 'Legitimate PG and hostel owners will ALWAYS show you the room in daylight first. Any demand for "QR code scanning", "gate pass fee", or "advance token transfer" prior to physical key handover is 100% a cyber fraud.',
      goldenRulesTitle: 'The 4 Golden Rules of Student Room Hunting',
      rules: [
        {
          title: 'Rule 1: Never Pay Advance Online',
          desc: 'Never transfer token or gate pass fees via UPI or QR codes before inspecting the room in daylight. Meet the property owner physically.'
        },
        {
          title: 'Rule 2: Inspect During Daytime',
          desc: 'Check natural sunlight, cross-ventilation, washroom water pressure, and summer inverter/generator backup during peak coaching hours.'
        },
        {
          title: 'Rule 3: Get Written Rent Receipts & Sub-Meter Rate',
          desc: 'Ensure the electricity sub-meter unit rate (should be standard ₹7–₹10/unit) is clearly written in the rent agreement to avoid arbitrary ₹15/unit billing.'
        },
        {
          title: 'Rule 4: Test Mess Food & Drinking Water',
          desc: 'Request a 1-day or 2-day paid trial meal before committing to a 6-month mess contract. Verify RO drinking water purifiers.'
        }
      ],
      antiFraudTitle: 'Recognizing Common Scams in Student Hubs',
      antiFraudPoints: [
        'Fake Armed Forces / Police Army Landlord Scam: Fraudsters posing as transferred army personnel asking for advance deposit via military QR codes.',
        'Urgent Booking Pressure: "5 students are waiting, transfer ₹2,000 right now to hold the room." Always reject such pressure.',
        'Gate Pass / Gate Entry Pass Fee: Scammers claiming security gate requires ₹500 entry slip before showing the room.',
        'Sub-Meter Manipulation: Unregistered meters running twice as fast. Check the meter zero reading on moving day.'
      ],
      helplineTitle: 'Student Mental Health & Emergency Helplines (24x7)',
      helplineSubtitle: 'Free, confidential, round-the-clock support for academic stress, homesickness, depression, and emergencies.',
      teleManasDesc: 'Govt. of India Tele-MANAS toll-free mental health counseling for students.',
      emergencyDesc: 'National Emergency Number (Police, Medical, Fire).',
      womenHelplineDesc: 'Dedicated Women in Distress & Safety Helpline.',
      checklistTitle: 'Pre-Move Inspection Checklist',
      checklistItems: [
        'Mobile Network Reception: Check 4G/5G signal inside the room for online lectures.',
        'Study Environment: Check proximity to loud main roads, baratis, or noisy commercial shops.',
        'Security & Curfew: Confirm biometric entry, CCTV in corridors, and warden availability for girls hostels.',
        'Security Deposit Refund Terms: Obtain in writing that the security deposit will be refunded on the day of departure upon 30-day notice.'
      ]
    },
    privacy: {
      title: 'Privacy Policy & Data Protection',
      subtitle: 'Compliant with the Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) Act, 2023.',
      introTitle: 'Introduction & Commitment to Aspirants',
      introText: 'Studolink operates as a zero-brokerage digital intermediary connecting students with verified accommodation and educational resources. We respect your digital privacy and do not sell student data.',
      dataCollectTitle: 'Information We Collect',
      dataCollectIntro: 'We only collect data strictly necessary to facilitate student accommodation and educational connectivity:',
      studentDataTitle: 'Student & User Information',
      studentDataItems: [
        'Name and Email address via secure Google OAuth / Firebase Authentication',
        'Optional city preference or auto-detected study hub (e.g. Kota, Patna, Delhi)',
        'Saved / Bookmarked PG, hostel, and library listings',
        'Direct chat messages exchanged with property owners on our platform'
      ],
      ownerDataTitle: 'Property Owner & Contributor Information',
      ownerDataItems: [
        'PG/Hostel business name and verified phone/WhatsApp number',
        'Physical property address, monthly rent tariff, and security deposit details',
        'Real room photographs, mess meal photos, and amenity descriptions'
      ],
      geoTitle: 'Geolocation & Device Permissions',
      geoText: 'Geolocation is strictly optional and used only to auto-suggest nearby coaching hubs and student libraries. We never track continuous background movement or monitor private location.',
      dataUsageTitle: 'How Your Information is Used',
      dataUsageItems: [
        'Displaying direct room and library contacts without middleman commission.',
        'Securing your account against unauthorized access via Firebase Auth.',
        'Preventing spam, fake listings, and duplicate property submissions.',
        'Broadcasting urgent weather, exam schedule, or student safety advisories.'
      ],
      dataSharingTitle: 'Zero Commercial Data Selling',
      dataSharingHighlight: 'We NEVER sell, rent, or lease your phone number or email to private coaching sales agents, telemarketers, or loan companies.',
      rightsTitle: 'Your Data Privacy Rights',
      rightsItems: [
        'You can edit your profile details and saved listings anytime.',
        'Property owners can delete or deactivate their listings instantly.',
        'You can request complete permanent account deletion by contacting support@imprince.me.'
      ]
    },
    terms: {
      title: 'Terms of Service & Platform Rules',
      subtitle: 'Legally binding framework for Students, Property Providers, and Studolink.',
      acceptTitle: '1. Acceptance of Terms',
      acceptText: 'By accessing or registering on Studolink, you agree to comply with and be bound by these Terms of Service. If you disagree, please discontinue using the platform.',
      intermediaryTitle: '2. Intermediary Status (Section 79 IT Act)',
      intermediaryText: 'Studolink is an electronic intermediary and discovery platform. We do NOT own, operate, or lease properties directly, nor do we act as a broker or charge commissions.',
      zeroBrokerageTitle: '3. Zero Brokerage Guarantee',
      zeroBrokerageText: 'Studolink will never charge students brokerage or commission fees for discovering or contacting property owners. Communication between students and owners is 100% direct.',
      conductTitle: '4. Student & User Code of Conduct',
      conductItems: [
        'Do not post false, misleading, abusive, or defamatory content.',
        'Do not attempt to scrape, DDoS, or reverse-engineer the platform API.',
        'Respect property rules, fellow students, and local community laws.'
      ],
      ownerObligationsTitle: '5. Property Owner Obligations',
      ownerObligationsItems: [
        'Provide accurate monthly rent without hidden broker additions.',
        'Upload genuine, recent photographs of the actual rooms and facilities.',
        'Abide by all local student accommodation safety norms and fire safety guidelines.'
      ],
      liabilityTitle: '6. Limitation of Liability',
      liabilityText: 'Studolink facilitates direct connections but is not liable for private financial transactions or off-platform disputes between landlords and tenants. Always insist on written rent receipts.'
    },
    listingPolicy: {
      title: 'Listing & Owner Verification Policy',
      subtitle: 'Standards and norms required for PGs, Hostels, Libraries, and Mess facilities.',
      standardsTitle: 'Quality & Verification Standards',
      standardsItems: [
        'Only verified owners and designated property caretakers can list accommodation.',
        'Exact location with street name, coaching landmark, and city must be specified.',
        'Rent quoted must be total monthly cost; extra electricity unit charges must be noted.'
      ],
      bannedPracticesTitle: 'Strictly Prohibited Listing Practices',
      bannedPracticesItems: [
        'Charging brokerage or middleman fees to students.',
        'Using stock/internet photos instead of actual property pictures.',
        'Demanding non-refundable advance booking before daylight physical inspection.',
        'Discriminatory refusal of admission on arbitrary grounds.'
      ],
      photoStandardsTitle: 'Authentic Photo Guidelines',
      photoStandardsText: 'Upload clear photographs of the bedroom, study table, attached or common washroom, and dining mess. Misleading or digitally altered photos are rejected during review.'
    },
    grievance: {
      title: 'Grievance Redressal & Legal Officer',
      subtitle: 'Official escalation cell and contact channel under IT Rules 2021.',
      officerTitle: 'Designated Grievance Officer',
      officerName: 'Prince Kumar / Compliance Team',
      officerRole: 'Grievance Officer under Information Technology (Intermediary Guidelines) Rules, 2021',
      slaTitle: 'Response & Resolution Timelines',
      slaText: 'Grievance emails are acknowledged within 24 hours and fully investigated within 15 days as required by law.',
      cyberCoopTitle: 'Cyber Crime & Law Enforcement Cooperation',
      cyberCoopText: 'Studolink provides swift assistance to Indian Police and Cyber Crime cells in cases of reported fraud, providing verified owner records and digital logs under lawful notices.'
    }
  },

  hi: {
    title: 'कानूनी, गोपनीयता और छात्र सुरक्षा केंद्र',
    subtitle: 'जीरो-ब्रोकरेज नियम, छात्र आचार संहिता, डेटा सुरक्षा और स्कैम से बचाव दिशानिर्देश',
    badge: 'सुरक्षा और नियम',
    heroIntro: 'स्टुडोलिंक (Studolink) भारत के प्रतियोगी परीक्षा की तैयारी कर रहे विद्यार्थियों के लिए समर्पित 100% जीरो-ब्रोकरेज प्लेटफॉर्म है। हमारे कानूनी नियम, एंटी-फ्रॉड सुरक्षा और गोपनीयता नीतियां पढ़ें।',
    lastUpdated: 'अंतिम अपडेट: सितंबर 2026',
    jurisdiction: 'अधिकार क्षेत्र: भारत (आईटी एक्ट व DPDP अधिनियम 2023)',
    zeroBrokerageBadge: '100% जीरो-दलाली (Zero Brokerage) प्लेटफॉर्म',
    tabs: {
      privacy: 'गोपनीयता नीति (Privacy)',
      terms: 'सेवा की शर्तें (Terms)',
      safety: 'छात्र सुरक्षा व फ्रॉड से बचाव',
      listingPolicy: 'कमरा लिस्टिंग नियम',
      grievance: 'शिकायत निवारण अधिकारी',
    },
    safety: {
      title: 'छात्र सुरक्षा, स्कैम प्रोटेक्शन व एंटी-फ्रॉड एडवाइजरी',
      subtitle: 'कोटा, पटना, दिल्ली, सीकर, नवादा या अन्य कोचिंग शहरों में कमरा लेते समय जरूरी सुरक्षा जांच सूची।',
      alertTitle: 'रुकें! बिना दिन में कमरा देखे कभी भी ऑनलाइन एडवांस टोकन न भेजें',
      alertDesc: 'असली मकान मालिक या पीजी संचालक हमेशा आपको पहले दिन के उजाले में कमरा दिखाते हैं। अगर कोई फोन पर "QR कोड स्कैन करो", "गेट पास फीस दो", या "एडवांस भेजो तब कमरा दिखाएंगे" कहे — तो वह 100% साइबर फ्रॉड (धोखाधड़ी) है!',
      goldenRulesTitle: 'स्टूडेंट रूम बुकिंग के 4 स्वर्णिम नियम',
      rules: [
        {
          title: 'नियम 1: ऑनलाइन एडवांस टोकन कभी न दें',
          desc: 'कमरा अपनी आंखों से देखे बिना किसी अनजान व्यक्ति को UPI या QR कोड से 1 रुपया भी एडवांस न भेजें। हमेशा मकान मालिक से व्यक्तिगत रूप से मिलें।'
        },
        {
          title: 'नियम 2: दिन के उजाले में जांच करें',
          desc: 'कमरे में धूप, हवा, मोबाइल नेटवर्क 4G/5G सिग्नल, बाथरूम में पानी का प्रेशर और गर्मियों में इन्वर्टर/पावर बैकअप जरूर चेक करें।'
        },
        {
          title: 'नियम 3: लिखित किराया रसीद व बिजली यूनिट दर तय करें',
          desc: 'बिजली सब-मीटर की यूनिट दर (सामान्यतः ₹7–₹10 प्रति यूनिट) किरायेनामे पर लिखवाएं ताकि बाद में ₹15-16 का मनमाना बिल न लगाया जाए।'
        },
        {
          title: 'नियम 4: मेस का खाना और आरओ पानी टेस्ट करें',
          desc: 'महीनों का मेस चार्ज एक साथ देने से पहले 1 या 2 दिन का ट्रायल मील लेकर देखें। पीने के आरओ पानी की शुद्धता सुनिश्चित करें।'
        }
      ],
      antiFraudTitle: 'कोचिंग शहरों में होने वाले सामान्य स्कैम',
      antiFraudPoints: [
        'फर्जी आर्मी/पुलिस ऑफिसर स्कैम: ठग खुद को आर्मी जवान बताकर ट्रांसफर का बहाना बनाते हैं और मिलिट्री QR कोड भेजकर पैसे कटवा लेते हैं।',
        'अर्जेंट बुकिंग का दबाव: "5 बच्चे लाइन में हैं, अभी 2000 रुपये भेजो वरना कमरा किसी और को दे देंगे।" ऐसे दबाव में कभी न आएं।',
        'गेट पास / एंट्री पास शुल्क: "हॉस्टल गेट पर एंट्री के लिए 500 रुपये का पर्ची कटेगा" — यह पूरी तरह फर्जी है।',
        'मीटर से छेड़छाड़: मीटर तेज चलने की शिकायतें होती हैं, इसलिए शिफ्ट होने के पहले दिन की मीटर रीडिंग फोटो खींचकर रिकॉर्ड में रखें।'
      ],
      helplineTitle: 'छात्र मानसिक स्वास्थ्य व आपातकालीन हेल्पलाइन (24x7)',
      helplineSubtitle: 'परीक्षा के तनाव, अकेलापन, घबराहट या किसी भी समस्या में 24 घंटे मुफ्त और गोपनीय सहायता।',
      teleManasDesc: 'भारत सरकार की टेली-मानस टोल-फ्री मानसिक स्वास्थ्य काउंसलिंग हेल्पलाइन।',
      emergencyDesc: 'राष्ट्रीय आपातकालीन नंबर (पुलिस, एम्बुलेंस, फायर ब्रिगेड)।',
      womenHelplineDesc: 'महिला व छात्राओं की सुरक्षा हेतु समर्पित हेल्पलाइन।',
      checklistTitle: 'कमरे में शिफ्ट होने से पहले की चेकलिस्ट',
      checklistItems: [
        'कमरे के अंदर मोबाइल नेटवर्क: ऑनलाइन क्लास व वीडियो लेक्चर चलने लायक सिग्नल है या नहीं।',
        'शांतिपूर्ण माहौल: क्या कमरा शोर-शराबे वाली मुख्य सड़क या डीजे/बाजार से दूर है?',
        'सुरक्षा व्यवस्था: बायोमेट्रिक एंट्री, कॉरिडोर में सीसीटीवी और वार्डन की उपलब्धता।',
        'सिक्योरिटी डिपॉजिट वापसी की शर्त: लिखित में लें कि 1 महीने पहले नोटिस देने पर खाली करते दिन पूरा डिपॉजिट लौटा दिया जाएगा।'
      ]
    },
    privacy: {
      title: 'गोपनीयता नीति और डेटा सुरक्षा (Privacy Policy)',
      subtitle: 'सूचना प्रौद्योगिकी अधिनियम 2000 और डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) अधिनियम 2023 के अनुरूप।',
      introTitle: 'हमारा संकल्प: छात्रों की पूर्ण सुरक्षा',
      introText: 'स्टुडोलिंक (Studolink) विद्यार्थियों को सीधे बिना दलाली के रहने की जगह और शैक्षणिक संसाधन खोजने में मदद करता है। हम आपके डेटा की पूर्ण सुरक्षा करते हैं और छात्रों का डेटा कभी किसी को नहीं बेचते।',
      dataCollectTitle: 'हम कौन-सी जानकारी एकत्र करते हैं',
      dataCollectIntro: 'हम केवल वही जानकारी लेते हैं जो रूम सर्च और सुविधा देने के लिए आवश्यक है:',
      studentDataTitle: 'छात्रों की जानकारी',
      studentDataItems: [
        'गूगल लॉगिन या ईमेल द्वारा सुरक्षित नाम और ईमेल पता',
        'आपकी चुनी हुई कोचिंग सिटी (जैसे कोटा, पटना, दिल्ली, नवादा)',
        'आपके द्वारा सेव की गई पसंदीदा पीजी और लाइब्रेरी लिस्टिंग',
        'मकान मालिक से की गई डायरेक्ट इन-ऐप चैट'
      ],
      ownerDataTitle: 'मकान मालिक व पीजी संचालकों की जानकारी',
      ownerDataItems: [
        'हॉस्टल/पीजी का नाम और डायरेक्ट मोबाइल/व्हाट्सएप नंबर',
        'कमरे का पता, मासिक किराया और सिक्योरिटी डिपॉजिट की जानकारी',
        'कमरे, मेस और स्टडी एरिया की वास्तविक तस्वीरें'
      ],
      geoTitle: 'लोकेशन (GPS) की अनुमति',
      geoText: 'लोकेशन पूरी तरह वैकल्पिक (Optional) है। इसका उपयोग केवल आपके पास के कोचिंग हब और लाइब्रेरी दिखाने के लिए होता है। हम बैकग्राउंड में आपकी लोकेशन ट्रैक नहीं करते।',
      dataUsageTitle: 'डेटा का उपयोग कैसे होता है',
      dataUsageItems: [
        'छात्रों को सीधे रूम ओनर से बिना किसी कमीशन के जोड़ना।',
        'फर्जी लिस्टिंग और स्पैम खातों को ब्लॉक करना।',
        'आपातकालीन टेली-मानस व सुरक्षा हेल्पलाइन उपलब्ध कराना।'
      ],
      dataSharingTitle: 'डेटा बेचने पर सख्त रोक (Zero Selling)',
      dataSharingHighlight: 'हम कभी भी आपका मोबाइल नंबर या ईमेल किसी प्राइवेट कोचिंग, टेलीकॉलर या लोन कंपनियों को नहीं बेचते हैं।',
      rightsTitle: 'आपके अधिकार',
      rightsItems: [
        'आप कभी भी अपनी प्रोफाइल और डिटेल्स अपडेट कर सकते हैं।',
        'मकान मालिक अपनी लिस्टिंग तुरंत डिलीट या एडिट कर सकते हैं।',
        'support@imprince.me पर ईमेल करके आप अपना अकाउंट हमेशा के लिए डिलीट करवा सकते हैं।'
      ]
    },
    terms: {
      title: 'सेवा की शर्तें और प्लेटफॉर्म नियम (Terms of Service)',
      subtitle: 'विद्यार्थियों, मकान मालिकों और स्टुडोलिंक के बीच कानूनी समझौता।',
      acceptTitle: '1. शर्तों की स्वीकृति',
      acceptText: 'स्टुडोलिंक का उपयोग करने का अर्थ है कि आप इन सभी नियमों से सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया प्लेटफॉर्म का उपयोग न करें।',
      intermediaryTitle: '2. मध्यस्थ प्लेटफॉर्म (Intermediary Status)',
      intermediaryText: 'स्टुडोलिंक आईटी एक्ट की धारा 79 के तहत एक सूचना मध्यस्थ है। हम स्वयं किसी भी कमरे, पीजी या मेस के मालिक नहीं हैं। हम केवल छात्रों को सीधे मालिकों से जोड़ते हैं।',
      zeroBrokerageTitle: '3. 100% जीरो ब्रोकरेज गारंटी',
      zeroBrokerageText: 'स्टुडोलिंक छात्रों से कमरा खोजने या मालिक से बात करने का ₹1 भी ब्रोकरेज या दलाली शुल्क नहीं लेता है।',
      conductTitle: '4. छात्र आचार संहिता',
      conductItems: [
        'गलत, अश्लील या भ्रामक जानकारी पोस्ट न करें।',
        'हॉस्टल नियमों और साथी छात्रों के अध्ययन के माहौल का सम्मान करें।'
      ],
      ownerObligationsTitle: '5. मकान मालिकों के कर्तव्य',
      ownerObligationsItems: [
        'सही किराया बताएं, बिना किसी छुपे हुए चार्ज के।',
        'कमरे की असली और हाल की तस्वीरें ही अपलोड करें।',
        'सुरक्षा, पानी और बिजली की समुचित व्यवस्था बनाए रखें।'
      ],
      liabilityTitle: '6. कानूनी दायरा',
      liabilityText: 'मकान मालिक और किरायेदार के बीच हुए निजी लेन-देन की रसीद हमेशा लिखित में लें। स्टुडोलिंक दोनों पक्षों को सीधे जोड़ने का माध्यम है।'
    },
    listingPolicy: {
      title: 'कमरा लिस्टिंग और वेरिफिकेशन नीति',
      subtitle: 'पीजी, हॉस्टल, लाइब्रेरी और मेस संचालकों के लिए आवश्यक मानक।',
      standardsTitle: 'गुणवत्ता और प्रमाणीकरण',
      standardsItems: [
        'केवल वास्तविक मकान मालिक या केयरटेकर ही लिस्टिंग डाल सकते हैं।',
        'सटीक पता और निकटतम कोचिंग लैंडमार्क लिखना अनिवार्य है।',
        'किराया बिल्कुल साफ-साफ लिखा होना चाहिए।'
      ],
      bannedPracticesTitle: 'प्रतिबंधित गतिविधियां',
      bannedPracticesItems: [
        'छात्रों से किसी भी तरह की दलाली या कमीशन मांगना।',
        'इंटरनेट से चुराई हुई नकली तस्वीरें लगाना।',
        'कमरा दिखाए बिना ऑनलाइन एडवांस पैसे की मांग करना।'
      ],
      photoStandardsTitle: 'तस्वीर दिशानिर्देश',
      photoStandardsText: 'कमरे, स्टडी टेबल, बाथरूम और मेस की साफ और असली तस्वीरें अपलोड करें।'
    },
    grievance: {
      title: 'शिकायत निवारण और नोडल कानूनी अधिकारी',
      subtitle: 'आईटी नियम 2021 के तहत आधिकारिक शिकायत सेल।',
      officerTitle: 'नामित शिकायत अधिकारी (Grievance Officer)',
      officerName: 'Prince Kumar / कंप्लायंस टीम',
      officerRole: 'आईटी रूल्स 2021 के अंतर्गत नामित नोडल अधिकारी',
      slaTitle: 'शिकायत निवारण समय सीमा',
      slaText: 'ईमेल मिलने के 24 घंटे में पावती दी जाती है और 15 दिनों के अंदर पूरी जांच कर समाधान किया जाता है।',
      cyberCoopTitle: 'साइबर क्राइम और पुलिस सहयोग',
      cyberCoopText: 'किसी भी फर्जीवाड़े या अपराध की स्थिति में स्टुडोलिंक भारतीय पुलिस और साइबर सेल को त्वरित डिजिटल साक्ष्य और सहयोग प्रदान करता है।'
    }
  },

  hinglish: {
    title: 'Legal, Privacy aur Student Safety Hub',
    subtitle: 'Zero-brokerage terms, user conduct, privacy rights aur student fraud protection guidelines',
    badge: 'Legal & Safety',
    heroIntro: 'Studolink India ke sabhi competitive exam aspirants ke liye dedicated zero-brokerage housing aur study resource platform hai. Hamare legally binding terms, anti-scam rules aur privacy policy aasaani se samjhein.',
    lastUpdated: 'Updated: September 2026',
    jurisdiction: 'Jurisdiction: India (IT Act aur DPDP 2023 Compliant)',
    zeroBrokerageBadge: '100% Zero Brokerage (Bina Dalali) Platform',
    tabs: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      safety: 'Student Safety & Anti-Fraud',
      listingPolicy: 'Room Listing Rules',
      grievance: 'Grievance Redressal Officer',
    },
    safety: {
      title: 'Student Safety, Scam Protection & Anti-Fraud Advisory',
      subtitle: 'Kota, Patna, Delhi, Sikar, Nawada ya kisi bhi coaching town me room lene se pehle zaroori checklist.',
      alertTitle: 'RUKO! Bina Din Me Room Dekhe Kabhi Online Advance Token Mat Bhejo',
      alertDesc: 'Asli PG aur hostel owners HAMESHA pehle room daylight me dikhate hain. Agar koi phone par "QR code scan karo", "gate pass fee do", ya "token advance transfer karo tab room dikhayenge" bole — toh wo 100% cyber scam hai!',
      goldenRulesTitle: 'Student Room Hunting Ke 4 Golden Rules',
      rules: [
        {
          title: 'Rule 1: Online Advance Token Kabhi Na Dein',
          desc: 'Physical room visit se pehle UPI ya QR code par ₹1 bhi advance na transfer karein. Hamesha owner se aamne-saamne milkar deal karein.'
        },
        {
          title: 'Rule 2: Daylight Me Room Inspect Karein',
          desc: 'Din ke ujale me natural hawa, dhoop, mobile 4G/5G network, bathroom water pressure aur summer inverter backup zaroor test karein.'
        },
        {
          title: 'Rule 3: Written Rent Receipt Aur Sub-Meter Rate Likhein',
          desc: 'Electricity sub-meter rate (standard ₹7–₹10/unit hona chahiye) written agreement par confirm karein taaki baad me ₹15/unit ka arbitrary bill na aaye.'
        },
        {
          title: 'Rule 4: Mess Food Aur RO Water Test Karein',
          desc: 'Mahine ka mess bandhwane se pehle 1-2 din ka paid trial meal lein aur drinking RO water ki hygiene check karein.'
        }
      ],
      antiFraudTitle: 'Coaching Hubs Ke Common Scams Se Bacho',
      antiFraudPoints: [
        'Fake Army / Police Landlord Scam: Fraudsters khud ko fauji/army man bata kar transfer ka bahana karte hain aur QR code se account khaali kar dete hain.',
        'Urgent Booking Ka Pressure: "5 students wait kar rahe hain, abhi ₹2,000 transfer karo warna room kisi aur ko mil jayega." Aise pressure me bilkul na aayein.',
        'Gate Pass / Entry Slip Fee: Fraudster bolta hai "Hostel gate par security pass banwane ke liye ₹500 bhejo tab entry milegi" — yeh 100% fraud hai.',
        'Sub-Meter Manipulation: Meter fast chalne ki complaints hoti hain, isliye move-in day par meter reading ka photo kheench kar owner ko WhatsApp karein.'
      ],
      helplineTitle: 'Student Mental Health & Emergency Helplines (24x7 Free)',
      helplineSubtitle: 'Exam stress, anxiety, akelapan ya emergency ke waqt 24 ghante toll-free confidential support.',
      teleManasDesc: 'Govt. of India Tele-MANAS toll-free mental health helpline for students.',
      emergencyDesc: 'National Emergency Support (Police, Ambulance, Fire).',
      womenHelplineDesc: 'Women in Distress & Safety Helpline.',
      checklistTitle: 'Room Shifting Pre-Inspection Checklist',
      checklistItems: [
        'Mobile Signal: Room ke andar 4G/5G lecture download speed theek hai ya nahi.',
        'Silent Study Zone: Room ke paas koi loud factory, baraat ghar ya noisy market toh nahi hai.',
        'Security & Curfew: Biometric machine, CCTV camera aur warden support girls/boys hostel me available hai ya nahi.',
        'Security Deposit Refund Rule: Written me likhein ki 1 mahine pehle notice dene par departure date par pura deposit wapas milega.'
      ]
    },
    privacy: {
      title: 'Privacy Policy & Data Protection',
      subtitle: 'Information Technology Act, 2000 aur DPDP Act 2023 ke mutabiq.',
      introTitle: 'Introduction & Students Ko Hamara Vaada',
      introText: 'Studolink ek zero-brokerage student community platform hai. Hum aapke personal data ki complete security karte hain aur kisi student ka data commercial brokers ko nahi bechte.',
      dataCollectTitle: 'Hum Kaunsa Data Lete Hain',
      dataCollectIntro: 'Hum sirf wahi data lete hain jo room search aur safety ke liye zaroori hai:',
      studentDataTitle: 'Students Ka Data',
      studentDataItems: [
        'Google Auth ya email dwara Name aur Email address',
        'Student ki preferred coaching city (jaise Kota, Patna, Delhi, Nawada)',
        'Saved / Bookmarked PG aur hostel listings',
        'Direct chat messages jo aap owners se karte hain'
      ],
      ownerDataTitle: 'Property Owners Ka Data',
      ownerDataItems: [
        'PG/Hostel ka naam aur direct WhatsApp/phone contact',
        'Property ka exact address, rent aur security deposit details',
        'Rooms, study desk aur mess food ki real photographs'
      ],
      geoTitle: 'Geolocation & GPS Permissions',
      geoText: 'Geolocation bilkul optional hai. Iska use sirf paas ke coaching hub aur library dikhane ke liye hota hai. Hum aapki background movement track nahi karte.',
      dataUsageTitle: 'Data Ka Kaise Use Hota Hai',
      dataUsageItems: [
        'Students ko direct verified owners se bina dalali jodna.',
        'Spam, fake listings aur duplicate entries ko block karna.',
        'Emergency tele-manas aur exam updates broadcast karna.'
      ],
      dataSharingTitle: 'Data Bechne Par 100% Rok (Zero Selling)',
      dataSharingHighlight: 'Hum KABHI BHI aapka mobile number ya email coaching sales agents, telemarketers ya loan companies ko NAHI bechte hain.',
      rightsTitle: 'Aapke Rights',
      rightsItems: [
        'Aap apni profile details kabhi bhi update kar sakte hain.',
        'Owners apni listing ko instant delete ya pause kar sakte hain.',
        'support@imprince.me par email bhejkar apna account permanent delete karwa sakte hain.'
      ]
    },
    terms: {
      title: 'Terms of Service & Platform Rules',
      subtitle: 'Users, Room Providers aur Studolink ke beech binding agreement.',
      acceptTitle: '1. Terms Ki Acceptance',
      acceptText: 'Studolink use karne ka matlab hai ki aap in platform rules ko agree karte hain.',
      intermediaryTitle: '2. Intermediary Status (Section 79 IT Act)',
      intermediaryText: 'Studolink ek information platform hai. Hum kisi bhi room ya hostel ke direct owner ya broker nahi hain. Hum direct communication provide karte hain.',
      zeroBrokerageTitle: '3. Zero Brokerage Guarantee',
      zeroBrokerageText: 'Studolink kisi bhi student se kamra khojne ka ₹1 bhi brokerage ya middleman commission nahi leta hai.',
      conductTitle: '4. Student Code of Conduct',
      conductItems: [
        'Koi bhi fake, abusive ya misleading listing/message na karein.',
        'Hostel rules aur fellow student aspirants ke shaanti-purna mahaul ka aadar karein.'
      ],
      ownerObligationsTitle: '5. Property Owners Ki Zimmedari',
      ownerObligationsItems: [
        'Real monthly rent batayein bina kisi hidden broker charges ke.',
        'Sirf actual room aur mess ki real photos hi post karein.',
        'Student safety, RO drinking water aur hygiene ensure karein.'
      ],
      liabilityTitle: '6. Limitation of Liability',
      liabilityText: 'Landlord aur student ke beech financial transactions ki written receipt zaroor lein. Studolink direct verified connectivity provide karta hai.'
    },
    listingPolicy: {
      title: 'Listing & Owner Verification Policy',
      subtitle: 'PG, Hostel, Library aur Mess providers ke liye zaroori guidelines.',
      standardsTitle: 'Quality & Verification Norms',
      standardsItems: [
        'Sirf direct owners ya authorized caretakers hi room list kar sakte hain.',
        'Exact address aur landmark coaching ka naam dena compulsory hai.',
        'Per month rent transparently disclose karna zaroori hai.'
      ],
      bannedPracticesTitle: 'Strictly Banned Activities',
      bannedPracticesItems: [
        'Students se dalali ya commission maangna.',
        'Internet se download ki hui fake photos lagana.',
        'Bina room visit karwaye online token advance maangna.'
      ],
      photoStandardsTitle: 'Authentic Photo Guidelines',
      photoStandardsText: 'Room, study desk, bathroom aur dining area ki saaf real pictures upload karein.'
    },
    grievance: {
      title: 'Grievance Redressal & Legal Officer',
      subtitle: 'IT Rules 2021 ke mutabiq official complaint redressal cell.',
      officerTitle: 'Designated Grievance Officer',
      officerName: 'Prince Kumar / Legal & Compliance Team',
      officerRole: 'Grievance Officer under Information Technology Rules, 2021',
      slaTitle: 'Response Timeline',
      slaText: 'Grievance email milte hi 24 hours me acknowledgment aur 15 days ke andar investigation poori ki jaati hai.',
      cyberCoopTitle: 'Cyber Crime & Police Assistance',
      cyberCoopText: 'Kisi bhi fraud ya complaint aane par Studolink Indian Police aur Cyber Crime cell ko direct digital evidence provide karti hai.'
    }
  }
};
