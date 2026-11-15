export interface AvatarItem {
  id: string;
  name: string;
  category: 'Cute Characters' | 'Animals' | 'Fantasy' | 'Nature' | 'Minimalist';
  svgDataUri: string;
}

// Helper to convert clean SVG string into data URI
function svgToUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// =========================================================================
// 1. CUTE CHARACTERS (5)
// =========================================================================

const starBuddySvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FEF3C7" stroke="#FDE68A" stroke-width="2"/>
  <!-- Star Shape -->
  <polygon points="60,20 72,45 100,48 78,68 85,96 60,81 35,96 42,68 20,48 48,45" fill="#FBBF24" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round"/>
  <!-- Cheeks -->
  <circle cx="48" cy="64" r="5" fill="#F43F5E" opacity="0.35"/>
  <circle cx="72" cy="64" r="5" fill="#F43F5E" opacity="0.35"/>
  <!-- Eyes -->
  <circle cx="52" cy="58" r="3.5" fill="#1E293B"/>
  <circle cx="53" cy="56.5" r="1.2" fill="#FFFFFF"/>
  <circle cx="68" cy="58" r="3.5" fill="#1E293B"/>
  <circle cx="69" cy="56.5" r="1.2" fill="#FFFFFF"/>
  <!-- Smile -->
  <path d="M55,65 Q60,71 65,65" stroke="#1E293B" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Sparkles -->
  <circle cx="92" cy="30" r="2.5" fill="#F59E0B"/>
  <circle cx="28" cy="36" r="2" fill="#F59E0B"/>
</svg>
`;

const cloudDreamerSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="2"/>
  <!-- Cloud Body -->
  <path d="M38,72 C32,72 26,67 26,60 C26,53 31,48 37,48 C39,39 47,33 57,33 C67,33 76,40 78,50 C83,49 89,53 90,58 C94,62 93,69 88,72 Z" fill="#FFFFFF" stroke="#38BDF8" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Blush -->
  <circle cx="46" cy="62" r="4.5" fill="#FB7185" opacity="0.4"/>
  <circle cx="70" cy="62" r="4.5" fill="#FB7185" opacity="0.4"/>
  <!-- Eyes -->
  <path d="M48,56 Q51,53 54,56" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M64,56 Q67,53 70,56" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Smile -->
  <path d="M56,62 Q59,66 62,62" stroke="#0F172A" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <!-- Cute Rain Drops -->
  <ellipse cx="44" cy="84" rx="2" ry="4" fill="#38BDF8"/>
  <ellipse cx="60" cy="88" rx="2" ry="4" fill="#38BDF8"/>
  <ellipse cx="76" cy="84" rx="2" ry="4" fill="#38BDF8"/>
</svg>
`;

const bobaHeroSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#DCFCE7" stroke="#BBF7D0" stroke-width="2"/>
  <!-- Boba Cup -->
  <path d="M40,42 L45,86 C45.5,91 49,94 54,94 L66,94 C71,94 74.5,91 75,86 L80,42 Z" fill="#FEF3C7" stroke="#166534" stroke-width="2.5"/>
  <!-- Cup Lid & Straw -->
  <rect x="36" y="38" width="48" height="6" rx="3" fill="#86EFAC" stroke="#166534" stroke-width="2"/>
  <path d="M62,18 L58,40" stroke="#F43F5E" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Boba Pearls -->
  <circle cx="50" cy="84" r="3.5" fill="#362208"/>
  <circle cx="60" cy="86" r="3.5" fill="#362208"/>
  <circle cx="70" cy="84" r="3.5" fill="#362208"/>
  <circle cx="55" cy="77" r="3" fill="#362208"/>
  <circle cx="65" cy="77" r="3" fill="#362208"/>
  <!-- Face on Cup -->
  <circle cx="52" cy="58" r="2.5" fill="#14532D"/>
  <circle cx="68" cy="58" r="2.5" fill="#14532D"/>
  <path d="M57,63 Q60,67 63,63" stroke="#14532D" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <circle cx="47" cy="62" r="3" fill="#F43F5E" opacity="0.3"/>
  <circle cx="73" cy="62" r="3" fill="#F43F5E" opacity="0.3"/>
</svg>
`;

const mochiBakerSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FCE7F3" stroke="#FBCFE8" stroke-width="2"/>
  <!-- Mochi Body -->
  <ellipse cx="60" cy="68" rx="34" ry="24" fill="#FDF2F8" stroke="#DB2777" stroke-width="2"/>
  <!-- Chef Hat -->
  <path d="M48,46 C44,38 52,32 58,35 C62,30 70,32 72,37 C78,38 78,44 72,46 Z" fill="#FFFFFF" stroke="#DB2777" stroke-width="1.8"/>
  <rect x="50" y="44" width="20" height="5" rx="1.5" fill="#FFFFFF" stroke="#DB2777" stroke-width="1.5"/>
  <!-- Eyes -->
  <ellipse cx="50" cy="66" rx="2.5" ry="3.5" fill="#471430"/>
  <ellipse cx="70" cy="66" rx="2.5" ry="3.5" fill="#471430"/>
  <!-- Cheeks -->
  <circle cx="43" cy="72" r="4.5" fill="#F472B6" opacity="0.5"/>
  <circle cx="77" cy="72" r="4.5" fill="#F472B6" opacity="0.5"/>
  <!-- Smile -->
  <path d="M57,71 Q60,75 63,71" stroke="#471430" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <!-- Strawberry Decor -->
  <polygon points="60,49 57,55 63,55" fill="#EF4444"/>
  <circle cx="58.5" cy="52" r="0.6" fill="#FEF08A"/>
  <circle cx="61.5" cy="53" r="0.6" fill="#FEF08A"/>
</svg>
`;

const coffeeSparkSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FFEDD5" stroke="#FED7AA" stroke-width="2"/>
  <!-- Mug Body -->
  <path d="M38,44 L42,82 C42.5,88 47,92 53,92 L67,92 C73,92 77.5,88 78,82 L82,44 Z" fill="#FFFFFF" stroke="#C2410C" stroke-width="2.5"/>
  <!-- Handle -->
  <path d="M80,50 C90,50 92,72 80,74" stroke="#C2410C" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Steam Hearts -->
  <path d="M52,32 C50,28 54,24 56,28 C58,24 62,28 60,32 Z" fill="#FB923C"/>
  <path d="M64,24 C62,20 66,16 68,20 C70,16 74,20 72,24 Z" fill="#FDBA74"/>
  <!-- Face -->
  <circle cx="52" cy="62" r="2.8" fill="#431407"/>
  <circle cx="68" cy="62" r="2.8" fill="#431407"/>
  <path d="M57,68 Q60,72 63,68" stroke="#431407" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="46" cy="67" rx="3.5" ry="2" fill="#FB923C" opacity="0.4"/>
  <ellipse cx="74" cy="67" rx="3.5" ry="2" fill="#FB923C" opacity="0.4"/>
</svg>
`;

// =========================================================================
// 2. ANIMALS (5)
// =========================================================================

const playfulShibaSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FEF3C7" stroke="#FDE68A" stroke-width="2"/>
  <!-- Shiba Ears -->
  <polygon points="34,48 42,24 58,40" fill="#D97706" stroke="#92400E" stroke-width="2"/>
  <polygon points="38,44 44,28 54,40" fill="#FDE68A"/>
  <polygon points="86,48 78,24 62,40" fill="#D97706" stroke="#92400E" stroke-width="2"/>
  <polygon points="82,44 76,28 66,40" fill="#FDE68A"/>
  <!-- Head -->
  <ellipse cx="60" cy="62" rx="30" ry="26" fill="#F59E0B" stroke="#92400E" stroke-width="2"/>
  <!-- White Muzzle -->
  <ellipse cx="60" cy="70" rx="16" ry="14" fill="#FFFFFF"/>
  <!-- Eyes -->
  <ellipse cx="48" cy="56" rx="3.5" ry="4" fill="#291404"/>
  <circle cx="49" cy="54.5" r="1.3" fill="#FFFFFF"/>
  <ellipse cx="72" cy="56" rx="3.5" ry="4" fill="#291404"/>
  <circle cx="73" cy="54.5" r="1.3" fill="#FFFFFF"/>
  <!-- Eyebrows -->
  <circle cx="47" cy="48" r="2.8" fill="#FFFFFF"/>
  <circle cx="73" cy="48" r="2.8" fill="#FFFFFF"/>
  <!-- Nose & Tongue -->
  <ellipse cx="60" cy="65" rx="3" ry="2" fill="#180A02"/>
  <path d="M57,71 Q60,76 63,71" stroke="#180A02" stroke-width="1.8" fill="none"/>
  <path d="M58,73 C58,78 62,78 62,73 Z" fill="#F43F5E"/>
</svg>
`;

const sleepyPandaSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Panda Ears -->
  <circle cx="36" cy="38" r="11" fill="#1E293B"/>
  <circle cx="84" cy="38" r="11" fill="#1E293B"/>
  <!-- Head -->
  <ellipse cx="60" cy="64" rx="32" ry="28" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <!-- Eye Patches -->
  <ellipse cx="46" cy="62" rx="9" ry="11" fill="#1E293B" transform="rotate(-15 46 62)"/>
  <ellipse cx="74" cy="62" rx="9" ry="11" fill="#1E293B" transform="rotate(15 74 62)"/>
  <!-- Eyes -->
  <circle cx="47" cy="63" r="2.5" fill="#FFFFFF"/>
  <circle cx="73" cy="63" r="2.5" fill="#FFFFFF"/>
  <!-- Nose -->
  <ellipse cx="60" cy="71" rx="3.5" ry="2.5" fill="#0F172A"/>
  <!-- Mouth -->
  <path d="M56,76 Q60,80 64,76" stroke="#0F172A" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <!-- Cheeks -->
  <circle cx="37" cy="72" r="3.5" fill="#FB7185" opacity="0.3"/>
  <circle cx="83" cy="72" r="3.5" fill="#FB7185" opacity="0.3"/>
</svg>
`;

const cosmicBunnySvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#F3E8FF" stroke="#E9D5FF" stroke-width="2"/>
  <!-- Bunny Ears -->
  <ellipse cx="46" cy="30" rx="7" ry="20" fill="#FFFFFF" stroke="#7E22CE" stroke-width="2" transform="rotate(-10 46 30)"/>
  <ellipse cx="46" cy="30" rx="3.5" ry="14" fill="#F472B6" opacity="0.4" transform="rotate(-10 46 30)"/>
  <ellipse cx="74" cy="30" rx="7" ry="20" fill="#FFFFFF" stroke="#7E22CE" stroke-width="2" transform="rotate(10 74 30)"/>
  <ellipse cx="74" cy="30" rx="3.5" ry="14" fill="#F472B6" opacity="0.4" transform="rotate(10 74 30)"/>
  <!-- Head -->
  <ellipse cx="60" cy="68" rx="28" ry="24" fill="#FFFFFF" stroke="#7E22CE" stroke-width="2"/>
  <!-- Crescent Moon on Forehead -->
  <path d="M60,50 A4,4 0 0,0 60,58 A3,3 0 0,1 60,50 Z" fill="#FBBF24"/>
  <!-- Eyes -->
  <circle cx="48" cy="68" r="3" fill="#581C87"/>
  <circle cx="49" cy="66.5" r="1" fill="#FFFFFF"/>
  <circle cx="72" cy="68" r="3" fill="#581C87"/>
  <circle cx="73" cy="66.5" r="1" fill="#FFFFFF"/>
  <!-- Nose & Whiskers -->
  <polygon points="60,73 58,75 62,75" fill="#EC4899"/>
  <path d="M58,77 Q60,79 62,77" stroke="#581C87" stroke-width="1.5" fill="none"/>
  <line x1="36" y1="70" x2="42" y2="72" stroke="#A855F7" stroke-width="1.2"/>
  <line x1="84" y1="70" x2="78" y2="72" stroke="#A855F7" stroke-width="1.2"/>
</svg>
`;

const wiseOwlSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#EDE9FE" stroke="#DDD6FE" stroke-width="2"/>
  <!-- Owl Body -->
  <ellipse cx="60" cy="66" rx="28" ry="30" fill="#8B5CF6" stroke="#5B21B6" stroke-width="2"/>
  <!-- Ear Tufts -->
  <polygon points="40,38 34,22 48,34" fill="#7C3AED" stroke="#5B21B6" stroke-width="1.8"/>
  <polygon points="80,38 86,22 72,34" fill="#7C3AED" stroke="#5B21B6" stroke-width="1.8"/>
  <!-- Belly -->
  <ellipse cx="60" cy="74" rx="16" ry="18" fill="#DDD6FE"/>
  <!-- Big Eyes -->
  <circle cx="46" cy="56" r="10" fill="#FFFFFF" stroke="#5B21B6" stroke-width="1.8"/>
  <circle cx="46" cy="56" r="5" fill="#1E1B4B"/>
  <circle cx="48" cy="54" r="1.5" fill="#FFFFFF"/>
  <circle cx="74" cy="56" r="10" fill="#FFFFFF" stroke="#5B21B6" stroke-width="1.8"/>
  <circle cx="74" cy="56" r="5" fill="#1E1B4B"/>
  <circle cx="76" cy="54" r="1.5" fill="#FFFFFF"/>
  <!-- Beak -->
  <polygon points="60,63 56,69 64,69" fill="#F59E0B"/>
</svg>
`;

const littleFoxSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FFEDD5" stroke="#FED7AA" stroke-width="2"/>
  <!-- Ears -->
  <polygon points="32,46 36,18 56,38" fill="#EA580C" stroke="#9A3412" stroke-width="2"/>
  <polygon points="36,40 40,24 50,38" fill="#FFFFFF"/>
  <polygon points="88,46 84,18 64,38" fill="#EA580C" stroke="#9A3412" stroke-width="2"/>
  <polygon points="84,40 80,24 70,38" fill="#FFFFFF"/>
  <!-- Face Shape -->
  <polygon points="30,52 90,52 60,88" fill="#EA580C" stroke="#9A3412" stroke-width="2" stroke-linejoin="round"/>
  <!-- White Cheeks -->
  <polygon points="30,52 60,88 44,52" fill="#FFFFFF"/>
  <polygon points="90,52 60,88 76,52" fill="#FFFFFF"/>
  <!-- Eyes -->
  <path d="M42,54 Q46,50 50,54" stroke="#431407" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M70,54 Q74,50 78,54" stroke="#431407" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <!-- Nose -->
  <circle cx="60" cy="85" r="3" fill="#1F2937"/>
</svg>
`;

// =========================================================================
// 3. FANTASY (5)
// =========================================================================

const babyDragonSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#D1FAE5" stroke="#A7F3D0" stroke-width="2"/>
  <!-- Little Horns -->
  <path d="M42,42 C38,30 46,24 48,34" stroke="#F59E0B" stroke-width="3" fill="#FCD34D" stroke-linecap="round"/>
  <path d="M78,42 C82,30 74,24 72,34" stroke="#F59E0B" stroke-width="3" fill="#FCD34D" stroke-linecap="round"/>
  <!-- Dragon Head -->
  <ellipse cx="60" cy="64" rx="28" ry="24" fill="#10B981" stroke="#047857" stroke-width="2"/>
  <!-- Snout -->
  <ellipse cx="60" cy="74" rx="16" ry="11" fill="#34D399"/>
  <!-- Nostrils -->
  <ellipse cx="56" cy="72" rx="1.5" ry="1" fill="#047857"/>
  <ellipse cx="64" cy="72" rx="1.5" ry="1" fill="#047857"/>
  <!-- Cute Eyes -->
  <circle cx="48" cy="58" r="4.5" fill="#064E3B"/>
  <circle cx="49.5" cy="56.5" r="1.5" fill="#FFFFFF"/>
  <circle cx="72" cy="58" r="4.5" fill="#064E3B"/>
  <circle cx="73.5" cy="56.5" r="1.5" fill="#FFFFFF"/>
  <!-- Cheek Sparks -->
  <circle cx="40" cy="68" r="3" fill="#FBBF24" opacity="0.6"/>
  <circle cx="80" cy="68" r="3" fill="#FBBF24" opacity="0.6"/>
</svg>
`;

const magicMushroomSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FEE2E2" stroke="#FECDD3" stroke-width="2"/>
  <!-- Mushroom Stem -->
  <path d="M48,64 L50,92 C50,95 70,95 70,92 L72,64 Z" fill="#FFF7ED" stroke="#EA580C" stroke-width="2"/>
  <!-- Mushroom Cap -->
  <path d="M30,64 C30,40 42,28 60,28 C78,28 90,40 90,64 C90,66 30,66 30,64 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="2.5"/>
  <!-- White Cap Dots -->
  <circle cx="46" cy="46" r="4.5" fill="#FFFFFF"/>
  <circle cx="62" cy="38" r="5" fill="#FFFFFF"/>
  <circle cx="76" cy="48" r="4" fill="#FFFFFF"/>
  <!-- Face on Stem -->
  <circle cx="55" cy="74" r="2.2" fill="#7C2D12"/>
  <circle cx="65" cy="74" r="2.2" fill="#7C2D12"/>
  <path d="M57,80 Q60,83 63,80" stroke="#7C2D12" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <circle cx="50" cy="78" r="2.5" fill="#F43F5E" opacity="0.4"/>
  <circle cx="70" cy="78" r="2.5" fill="#F43F5E" opacity="0.4"/>
</svg>
`;

const crystalCatSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#E0E7FF" stroke="#C7D2FE" stroke-width="2"/>
  <!-- Crystal Ears -->
  <polygon points="34,44 42,18 56,36" fill="#818CF8" stroke="#4338CA" stroke-width="1.8"/>
  <polygon points="86,44 78,18 64,36" fill="#818CF8" stroke="#4338CA" stroke-width="1.8"/>
  <!-- Cat Face -->
  <circle cx="60" cy="64" r="28" fill="#EEF2FF" stroke="#4338CA" stroke-width="2"/>
  <!-- Diamond Jewel on Forehead -->
  <polygon points="60,44 64,50 60,56 56,50" fill="#06B6D4"/>
  <!-- Ethereal Eyes -->
  <ellipse cx="48" cy="64" rx="4" ry="5" fill="#4338CA"/>
  <circle cx="49" cy="62" r="1.5" fill="#67E8F9"/>
  <ellipse cx="72" cy="64" rx="4" ry="5" fill="#4338CA"/>
  <circle cx="73" cy="62" r="1.5" fill="#67E8F9"/>
  <!-- Nose & Whiskers -->
  <polygon points="60,71 58,73 62,73" fill="#818CF8"/>
  <path d="M58,75 Q60,77 62,75" stroke="#4338CA" stroke-width="1.2" fill="none"/>
</svg>
`;

const tinyWizardSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#F3E8FF" stroke="#D8B4FE" stroke-width="2"/>
  <!-- Face -->
  <circle cx="60" cy="70" r="22" fill="#FEF3C7" stroke="#7E22CE" stroke-width="1.8"/>
  <!-- Wizard Hat -->
  <path d="M26,60 L94,60 C86,58 78,54 70,22 L60,14 L50,22 C42,54 34,58 26,60 Z" fill="#6B21A8" stroke="#4C1D95" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- Hat Ribbon & Star -->
  <path d="M38,58 Q60,62 82,58" stroke="#FBBF24" stroke-width="3" fill="none"/>
  <polygon points="60,34 62,39 67,39 63,42 65,47 60,44 55,47 57,42 53,39 58,39" fill="#FDE047"/>
  <!-- Eyes -->
  <circle cx="52" cy="70" r="2.8" fill="#3B0764"/>
  <circle cx="68" cy="70" r="2.8" fill="#3B0764"/>
  <!-- Smile -->
  <path d="M57,77 Q60,80 63,77" stroke="#3B0764" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <!-- Blush -->
  <circle cx="45" cy="74" r="3" fill="#F472B6" opacity="0.4"/>
  <circle cx="75" cy="74" r="3" fill="#F472B6" opacity="0.4"/>
</svg>
`;

const sunSpriteSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FFFBEB" stroke="#FDE68A" stroke-width="2"/>
  <!-- Sun Rays -->
  <g stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round">
    <line x1="60" y1="18" x2="60" y2="25"/>
    <line x1="60" y1="95" x2="60" y2="102"/>
    <line x1="18" y1="60" x2="25" y2="60"/>
    <line x1="95" y1="60" x2="102" y2="60"/>
    <line x1="30" y1="30" x2="36" y2="36"/>
    <line x1="84" y1="84" x2="90" y2="90"/>
    <line x1="90" y1="30" x2="84" y2="36"/>
    <line x1="30" y1="90" x2="36" y2="84"/>
  </g>
  <!-- Sun Face Circle -->
  <circle cx="60" cy="60" r="26" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
  <!-- Eyes -->
  <circle cx="51" cy="58" r="3" fill="#451A03"/>
  <circle cx="52" cy="56.5" r="1" fill="#FFFFFF"/>
  <circle cx="69" cy="58" r="3" fill="#451A03"/>
  <circle cx="70" cy="56.5" r="1" fill="#FFFFFF"/>
  <!-- Smile -->
  <path d="M55,66 Q60,72 65,66" stroke="#451A03" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Cheeks -->
  <circle cx="45" cy="65" r="3.5" fill="#EF4444" opacity="0.4"/>
  <circle cx="75" cy="65" r="3.5" fill="#EF4444" opacity="0.4"/>
</svg>
`;

// =========================================================================
// 4. NATURE (5)
// =========================================================================

const happySproutSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="2"/>
  <!-- Terracotta Pot -->
  <polygon points="42,66 78,66 74,94 46,94" fill="#FB923C" stroke="#C2410C" stroke-width="2" stroke-linejoin="round"/>
  <rect x="38" y="60" width="44" height="8" rx="2" fill="#F97316" stroke="#C2410C" stroke-width="1.8"/>
  <!-- Plant Stem -->
  <path d="M60,60 L60,42" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <!-- Left Leaf -->
  <path d="M60,48 C50,44 42,34 50,30 C58,34 60,44 60,48 Z" fill="#22C55E" stroke="#15803D" stroke-width="1.5"/>
  <!-- Right Leaf -->
  <path d="M60,44 C70,40 78,30 70,26 C62,30 60,40 60,44 Z" fill="#4ADE80" stroke="#15803D" stroke-width="1.5"/>
  <!-- Pot Face -->
  <circle cx="53" cy="78" r="2.2" fill="#431407"/>
  <circle cx="67" cy="78" r="2.2" fill="#431407"/>
  <path d="M57,84 Q60,87 63,84" stroke="#431407" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <circle cx="48" cy="81" r="2" fill="#F43F5E" opacity="0.4"/>
  <circle cx="72" cy="81" r="2" fill="#F43F5E" opacity="0.4"/>
</svg>
`;

const sunnyBloomSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FEFCE8" stroke="#FEF08A" stroke-width="2"/>
  <!-- Petals -->
  <g fill="#FBBF24" stroke="#D97706" stroke-width="1.5">
    <circle cx="60" cy="32" r="10"/>
    <circle cx="60" cy="88" r="10"/>
    <circle cx="32" cy="60" r="10"/>
    <circle cx="88" cy="60" r="10"/>
    <circle cx="40" cy="40" r="10"/>
    <circle cx="80" cy="40" r="10"/>
    <circle cx="40" cy="80" r="10"/>
    <circle cx="80" cy="80" r="10"/>
  </g>
  <!-- Center Flower Disc -->
  <circle cx="60" cy="60" r="22" fill="#78350F" stroke="#451A03" stroke-width="2"/>
  <!-- Face -->
  <circle cx="52" cy="58" r="2.8" fill="#FEF3C7"/>
  <circle cx="68" cy="58" r="2.8" fill="#FEF3C7"/>
  <path d="M56,66 Q60,71 64,66" stroke="#FEF3C7" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <circle cx="47" cy="64" r="3" fill="#F87171" opacity="0.6"/>
  <circle cx="73" cy="64" r="3" fill="#F87171" opacity="0.6"/>
</svg>
`;

const zenBonsaiSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#F0FDF4" stroke="#DCFCE7" stroke-width="2"/>
  <!-- Ceramic Pot -->
  <path d="M36,82 L84,82 L80,94 L40,94 Z" fill="#334155" stroke="#1E293B" stroke-width="2"/>
  <line x1="32" y1="82" x2="88" y2="82" stroke="#1E293B" stroke-width="2.5"/>
  <!-- Trunk -->
  <path d="M60,82 C58,70 68,60 56,48 C54,44 58,40 60,38" stroke="#78350F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Foliage Clouds -->
  <ellipse cx="48" cy="42" rx="14" ry="9" fill="#15803D"/>
  <ellipse cx="68" cy="36" rx="16" ry="11" fill="#16A34A"/>
  <ellipse cx="74" cy="52" rx="12" ry="8" fill="#22C55E"/>
</svg>
`;

const lotusBlossomSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FDF2F8" stroke="#FCE7F3" stroke-width="2"/>
  <!-- Water Waves -->
  <path d="M26,86 Q60,94 94,86" stroke="#38BDF8" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Outer Petals -->
  <path d="M60,78 C36,74 28,52 38,40 C48,56 56,70 60,78 Z" fill="#F472B6" stroke="#BE185D" stroke-width="1.5"/>
  <path d="M60,78 C84,74 92,52 82,40 C72,56 64,70 60,78 Z" fill="#F472B6" stroke="#BE185D" stroke-width="1.5"/>
  <!-- Inner Petals -->
  <path d="M60,78 C44,66 40,42 60,26 C80,42 76,66 60,78 Z" fill="#FBCFE8" stroke="#BE185D" stroke-width="1.8"/>
  <!-- Center Dewdrop -->
  <circle cx="60" cy="54" r="3.5" fill="#FBBF24"/>
</svg>
`;

const succulentFriendSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#F0FDFA" stroke="#CCFBF1" stroke-width="2"/>
  <!-- Pot -->
  <polygon points="40,68 80,68 74,94 46,94" fill="#FDBA74" stroke="#EA580C" stroke-width="2"/>
  <rect x="36" y="62" width="48" height="7" rx="2" fill="#FED7AA" stroke="#EA580C" stroke-width="1.8"/>
  <!-- Rosette Leaves -->
  <ellipse cx="60" cy="46" rx="8" ry="14" fill="#14B8A6" stroke="#0F766E" stroke-width="1.5"/>
  <ellipse cx="48" cy="50" rx="7" ry="13" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5" transform="rotate(-30 48 50)"/>
  <ellipse cx="72" cy="50" rx="7" ry="13" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5" transform="rotate(30 72 50)"/>
  <!-- Center Heart Leaf -->
  <circle cx="60" cy="52" r="5" fill="#5EEAD4" stroke="#0F766E" stroke-width="1.5"/>
  <!-- Cute Eyes on Pot -->
  <circle cx="53" cy="78" r="2.2" fill="#431407"/>
  <circle cx="67" cy="78" r="2.2" fill="#431407"/>
  <path d="M57,84 Q60,87 63,84" stroke="#431407" stroke-width="1.5" stroke-linecap="round" fill="none"/>
</svg>
`;

// =========================================================================
// 5. MINIMALIST (4)
// =========================================================================

const geometricSolSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <!-- Golden Sun -->
  <circle cx="60" cy="46" r="18" fill="#F59E0B"/>
  <!-- Geometry Waves -->
  <path d="M24,78 Q60,62 96,78" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M30,88 Q60,74 90,88" stroke="#818CF8" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`;

const neonPulseSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#18181B" stroke="#27272A" stroke-width="2"/>
  <!-- Gradient Prism Triangle -->
  <polygon points="60,28 88,82 32,82" stroke="#EC4899" stroke-width="3" fill="none" stroke-linejoin="round"/>
  <!-- Inner Glowing Center -->
  <polygon points="60,44 76,74 44,74" fill="#06B6D4" opacity="0.6"/>
  <!-- Pulse Line -->
  <path d="M22,64 L48,64 L54,54 L62,76 L70,60 L76,64 L98,64" stroke="#F43F5E" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const monochromeZenSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#FAFAFA" stroke="#E5E5E5" stroke-width="2"/>
  <!-- Yin Yang Circular Balance -->
  <circle cx="60" cy="60" r="32" fill="#18181B"/>
  <path d="M60,28 A32,32 0 0,1 60,92 A16,16 0 0,1 60,60 A16,16 0 0,0 60,28 Z" fill="#FAFAFA"/>
  <circle cx="60" cy="44" r="5" fill="#18181B"/>
  <circle cx="60" cy="76" r="5" fill="#FAFAFA"/>
</svg>
`;

const auroraHorizonSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" fill="#0C1427" stroke="#1E293B" stroke-width="2"/>
  <!-- Aurora Waves -->
  <path d="M24,44 Q60,28 96,44" stroke="#2DD4BF" stroke-width="4" fill="none" opacity="0.75" stroke-linecap="round"/>
  <path d="M24,52 Q60,36 96,52" stroke="#A855F7" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
  <!-- Mountain Silhouettes -->
  <polygon points="18,94 48,62 74,94" fill="#1E293B"/>
  <polygon points="52,94 76,68 102,94" fill="#334155"/>
  <!-- Crescent Moon -->
  <path d="M84,30 A7,7 0 0,0 84,42 A5,5 0 0,1 84,30 Z" fill="#FDE047"/>
</svg>
`;

// =========================================================================
// DEFAULT POLISHED ILLUSTRATION
// =========================================================================
export const DEFAULT_AVATAR = svgToUri(starBuddySvg);

// Export full collection of 24 original illustrated avatars
export const BUILTIN_AVATARS: AvatarItem[] = [
  // Cute Characters (5)
  { id: 'star-buddy', name: 'Star Buddy', category: 'Cute Characters', svgDataUri: svgToUri(starBuddySvg) },
  { id: 'cloud-dreamer', name: 'Cloud Dreamer', category: 'Cute Characters', svgDataUri: svgToUri(cloudDreamerSvg) },
  { id: 'boba-hero', name: 'Boba Hero', category: 'Cute Characters', svgDataUri: svgToUri(bobaHeroSvg) },
  { id: 'mochi-baker', name: 'Mochi Baker', category: 'Cute Characters', svgDataUri: svgToUri(mochiBakerSvg) },
  { id: 'coffee-spark', name: 'Coffee Spark', category: 'Cute Characters', svgDataUri: svgToUri(coffeeSparkSvg) },

  // Animals (5)
  { id: 'playful-shiba', name: 'Playful Shiba', category: 'Animals', svgDataUri: svgToUri(playfulShibaSvg) },
  { id: 'sleepy-panda', name: 'Sleepy Panda', category: 'Animals', svgDataUri: svgToUri(sleepyPandaSvg) },
  { id: 'cosmic-bunny', name: 'Cosmic Bunny', category: 'Animals', svgDataUri: svgToUri(cosmicBunnySvg) },
  { id: 'wise-owl', name: 'Wise Owl', category: 'Animals', svgDataUri: svgToUri(wiseOwlSvg) },
  { id: 'little-fox', name: 'Little Fox', category: 'Animals', svgDataUri: svgToUri(littleFoxSvg) },

  // Fantasy (5)
  { id: 'baby-dragon', name: 'Baby Dragon', category: 'Fantasy', svgDataUri: svgToUri(babyDragonSvg) },
  { id: 'magic-mushroom', name: 'Magic Mushroom', category: 'Fantasy', svgDataUri: svgToUri(magicMushroomSvg) },
  { id: 'crystal-cat', name: 'Crystal Cat', category: 'Fantasy', svgDataUri: svgToUri(crystalCatSvg) },
  { id: 'tiny-wizard', name: 'Tiny Wizard', category: 'Fantasy', svgDataUri: svgToUri(tinyWizardSvg) },
  { id: 'sun-sprite', name: 'Sun Sprite', category: 'Fantasy', svgDataUri: svgToUri(sunSpriteSvg) },

  // Nature (5)
  { id: 'happy-sprout', name: 'Happy Sprout', category: 'Nature', svgDataUri: svgToUri(happySproutSvg) },
  { id: 'sunny-bloom', name: 'Sunny Bloom', category: 'Nature', svgDataUri: svgToUri(sunnyBloomSvg) },
  { id: 'zen-bonsai', name: 'Zen Bonsai', category: 'Nature', svgDataUri: svgToUri(zenBonsaiSvg) },
  { id: 'lotus-blossom', name: 'Lotus Blossom', category: 'Nature', svgDataUri: svgToUri(lotusBlossomSvg) },
  { id: 'succulent-friend', name: 'Succulent Friend', category: 'Nature', svgDataUri: svgToUri(succulentFriendSvg) },

  // Minimalist (4)
  { id: 'geometric-sol', name: 'Geometric Sol', category: 'Minimalist', svgDataUri: svgToUri(geometricSolSvg) },
  { id: 'neon-pulse', name: 'Neon Pulse', category: 'Minimalist', svgDataUri: svgToUri(neonPulseSvg) },
  { id: 'monochrome-zen', name: 'Monochrome Zen', category: 'Minimalist', svgDataUri: svgToUri(monochromeZenSvg) },
  { id: 'aurora-horizon', name: 'Aurora Horizon', category: 'Minimalist', svgDataUri: svgToUri(auroraHorizonSvg) }
];
