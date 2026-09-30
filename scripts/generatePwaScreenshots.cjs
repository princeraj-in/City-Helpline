const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Desktop Home (1280x720)
const desktopHomeSvg = `
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#07090E"/>
  <circle cx="640" cy="150" r="300" fill="#00E5FF" fill-opacity="0.12" filter="blur(80px)"/>
  <circle cx="1100" cy="400" r="250" fill="#8A2BE2" fill-opacity="0.12" filter="blur(80px)"/>
  
  <!-- Navbar -->
  <rect x="80" y="24" width="1120" height="64" rx="20" fill="#0E131F" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
  <circle cx="120" cy="56" r="16" fill="#00E5FF"/>
  <text x="148" y="62" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="900" letter-spacing="0.5">Studolink</text>
  <text x="600" y="61" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Home    Explore PGs    Roommates    Marketplace    Budget</text>
  <rect x="1060" y="40" width="110" height="32" rx="10" fill="#00E5FF"/>
  <text x="1090" y="61" fill="#000000" font-family="system-ui, sans-serif" font-size="13" font-weight="800">Sign In</text>

  <!-- Hero Banner -->
  <rect x="490" y="140" width="300" height="32" rx="16" fill="#00E5FF" fill-opacity="0.15" stroke="#00E5FF" stroke-opacity="0.3"/>
  <text x="520" y="161" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="12" font-weight="700" letter-spacing="1">VERIFIED STUDENT HABITAT • 0% BROKERAGE</text>

  <text x="640" y="230" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="44" font-weight="900">Your City. Your Student Ecosystem.</text>
  <text x="640" y="270" text-anchor="middle" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="16">Verified PGs, 24/7 quiet libraries, healthy mess, roommate matching and campus marketplace in Kota, Patna, Pune and Delhi.</text>

  <!-- Search Card -->
  <rect x="240" y="320" width="800" height="72" rx="24" fill="#0E131F" fill-opacity="0.9" stroke="#00E5FF" stroke-opacity="0.3"/>
  <text x="280" y="362" fill="#6B7280" font-family="system-ui, sans-serif" font-size="16">Search by locality (e.g. Landmark City, Boring Road, ORN)...</text>
  <rect x="910" y="332" width="110" height="48" rx="16" fill="#00E5FF"/>
  <text x="940" y="362" fill="#000000" font-family="system-ui, sans-serif" font-size="15" font-weight="800">Search</text>

  <!-- 3 Feature Cards -->
  <rect x="180" y="440" width="280" height="220" rx="20" fill="#0E131F" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="204" y="464" width="44" height="44" rx="12" fill="#00E5FF" fill-opacity="0.15"/>
  <text x="204" y="540" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Hostels and PGs</text>
  <text x="204" y="570" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">Physically verified rooms with CCTV, food safety and 0% broker fee.</text>

  <rect x="500" y="440" width="280" height="220" rx="20" fill="#0E131F" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="524" y="464" width="44" height="44" rx="12" fill="#A855F7" fill-opacity="0.15"/>
  <text x="524" y="540" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Roommate Match</text>
  <text x="524" y="570" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">Connect with focused NEET/JEE students with zero phone leakage.</text>

  <rect x="820" y="440" width="280" height="220" rx="20" fill="#0E131F" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="844" y="464" width="44" height="44" rx="12" fill="#10B981" fill-opacity="0.15"/>
  <text x="844" y="540" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Marketplace</text>
  <text x="844" y="570" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">Buy and sell used books, coolers, study tables at 50%-70% discount.</text>
</svg>
`;

// 2. Desktop Search (1280x720)
const desktopSearchSvg = `
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#07090E"/>
  <circle cx="300" cy="200" r="250" fill="#00E5FF" fill-opacity="0.08" filter="blur(80px)"/>

  <!-- Top Filters -->
  <rect x="80" y="40" width="1120" height="80" rx="20" fill="#0E131F" fill-opacity="0.8" stroke="#00E5FF" stroke-opacity="0.2"/>
  <text x="110" y="85" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="900">Explore Verified Habitats</text>
  <rect x="750" y="60" width="120" height="40" rx="10" fill="#ffffff" fill-opacity="0.08"/>
  <text x="770" y="85" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13">Kota (All Hubs)</text>
  <rect x="890" y="60" width="130" height="40" rx="10" fill="#ffffff" fill-opacity="0.08"/>
  <text x="910" y="85" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13">Hostel / PG</text>
  <rect x="1040" y="60" width="130" height="40" rx="10" fill="#00E5FF"/>
  <text x="1070" y="85" fill="#000000" font-family="system-ui, sans-serif" font-size="13" font-weight="800">Filters</text>

  <!-- Listing Cards -->
  <rect x="80" y="160" width="340" height="480" rx="20" fill="#0E131F" fill-opacity="0.9" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="80" y="160" width="340" height="220" rx="20" fill="#1E293B"/>
  <text x="100" y="420" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Radha Krishna Residency</text>
  <text x="100" y="450" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="14">Landmark City, Kunhari • Kota</text>
  <text x="100" y="490" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="900">₹7,500 <tspan fill="#9CA3AF" font-size="13">/month</tspan></text>
  <rect x="100" y="540" width="300" height="44" rx="12" fill="#00E5FF"/>
  <text x="210" y="567" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="800">View Details</text>

  <rect x="470" y="160" width="340" height="480" rx="20" fill="#0E131F" fill-opacity="0.9" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="470" y="160" width="340" height="220" rx="20" fill="#1E293B"/>
  <text x="490" y="420" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Aura Elite Luxury Girls PG</text>
  <text x="490" y="450" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="14">Talwandi • Kota</text>
  <text x="490" y="490" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="900">₹9,000 <tspan fill="#9CA3AF" font-size="13">/month</tspan></text>
  <rect x="490" y="540" width="300" height="44" rx="12" fill="#00E5FF"/>
  <text x="600" y="567" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="800">View Details</text>

  <rect x="860" y="160" width="340" height="480" rx="20" fill="#0E131F" fill-opacity="0.9" stroke="#ffffff" stroke-opacity="0.1"/>
  <rect x="860" y="160" width="340" height="220" rx="20" fill="#1E293B"/>
  <text x="880" y="420" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="800">Sankalp Boys Hostel</text>
  <text x="880" y="450" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="14">Boring Road • Patna</text>
  <text x="880" y="490" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="900">₹6,200 <tspan fill="#9CA3AF" font-size="13">/month</tspan></text>
  <rect x="880" y="540" width="300" height="44" rx="12" fill="#00E5FF"/>
  <text x="990" y="567" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="800">View Details</text>
</svg>
`;

// 3. Mobile Home (750x1334)
const mobileHomeSvg = `
<svg width="750" height="1334" viewBox="0 0 750 1334" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="750" height="1334" fill="#07090E"/>
  <circle cx="375" cy="200" r="250" fill="#00E5FF" fill-opacity="0.12" filter="blur(70px)"/>

  <!-- Mobile Header -->
  <rect x="30" y="40" width="690" height="70" rx="20" fill="#0E131F" stroke="#ffffff" stroke-opacity="0.1"/>
  <circle cx="70" cy="75" r="16" fill="#00E5FF"/>
  <text x="100" y="82" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="900">Studolink</text>

  <!-- Hero Content -->
  <rect x="180" y="160" width="390" height="36" rx="18" fill="#00E5FF" fill-opacity="0.15" stroke="#00E5FF" stroke-opacity="0.3"/>
  <text x="375" y="184" text-anchor="middle" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="13" font-weight="700">VERIFIED HABITAT • 0% BROKERAGE</text>

  <text x="375" y="270" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="36" font-weight="900">Your Student Habitat</text>
  <text x="375" y="320" text-anchor="middle" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="15">Hostels, silent study libraries, mess and roommate finder</text>

  <!-- Search -->
  <rect x="40" y="380" width="670" height="64" rx="20" fill="#0E131F" stroke="#00E5FF" stroke-opacity="0.4"/>
  <text x="70" y="420" fill="#6B7280" font-family="system-ui, sans-serif" font-size="16">Search PGs near Allen, Boring Rd, ORN...</text>

  <!-- Categories -->
  <rect x="40" y="480" width="315" height="180" rx="20" fill="#0E131F" stroke="#ffffff" stroke-opacity="0.1"/>
  <text x="70" y="550" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800">Verified PGs</text>
  <text x="70" y="585" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">CCTV, meals, 0% brokerage</text>

  <rect x="395" y="480" width="315" height="180" rx="20" fill="#0E131F" stroke="#ffffff" stroke-opacity="0.1"/>
  <text x="425" y="550" fill="#ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="800">Roommates</text>
  <text x="425" y="585" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">NEET and JEE study partners</text>

  <rect x="40" y="690" width="670" height="280" rx="24" fill="#0E131F" stroke="#ffffff" stroke-opacity="0.1"/>
  <text x="70" y="740" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="900">Featured Student Hubs</text>
  <text x="70" y="770" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="14">Kota • Patna • Delhi NCR • Sikar • Pune</text>
  <rect x="70" y="840" width="610" height="54" rx="16" fill="#00E5FF"/>
  <text x="375" y="874" text-anchor="middle" fill="#000000" font-family="system-ui, sans-serif" font-size="16" font-weight="800">Explore 500+ Hostels</text>

  <!-- Bottom Nav -->
  <rect x="0" y="1234" width="750" height="100" fill="#07090E" stroke="#ffffff" stroke-opacity="0.1"/>
  <text x="100" y="1290" fill="#00E5FF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Home</text>
  <text x="250" y="1290" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="14">Search</text>
  <text x="400" y="1290" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="14">Market</text>
  <text x="550" y="1290" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="14">Profile</text>
</svg>
`;

async function generateAll() {
  await sharp(Buffer.from(desktopHomeSvg)).png().toFile(path.join(outDir, 'desktop-home.png'));
  await sharp(Buffer.from(desktopSearchSvg)).png().toFile(path.join(outDir, 'desktop-search.png'));
  await sharp(Buffer.from(mobileHomeSvg)).png().toFile(path.join(outDir, 'mobile-home.png'));
  console.log('PWA screenshots generated successfully.');
}

generateAll().catch(console.error);
