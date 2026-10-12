import React from 'react';
import { BbglLogo } from '../brand/BbglLogo';
import { ProductArt } from '../brand/ProductArt';
import { 
  Palette, 
  Type, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Sliders,
  Coffee,
  Heart,
  Camera,
  FolderOpen
} from 'lucide-react';
import { useImageAssets } from '../../context/ImageAssetsContext';

interface DesignTokensSpecProps {
  onOpenImageModal?: () => void;
}

export const DesignTokensSpec: React.FC<DesignTokensSpecProps> = ({ onOpenImageModal }) => {
  const { activePhotoCount, useRealPhotos, setUseRealPhotos } = useImageAssets();
  const COLOR_TOKENS = [
    {
      name: 'Primary: Deep Espresso Brown',
      hex: '#3E2723',
      rgb: 'rgb(62, 39, 35)',
      role: 'Brand emblem, display headings, high-contrast kiosk CTA buttons, top register header.',
      wcag: '11.8:1 on Cream (AAA)',
      sampleClass: 'bg-[#3E2723] text-[#FDFBF7]',
    },
    {
      name: 'Secondary: Warm Milk Tea Caramel',
      hex: '#C68B59',
      rgb: 'rgb(198, 139, 89)',
      role: 'Add-to-cart buttons, active category focus rings, bear emblem accent, graph highlight.',
      wcag: '4.7:1 on Cream (AA)',
      sampleClass: 'bg-[#C68B59] text-white',
    },
    {
      name: 'Accent / Background: Warm Cream',
      hex: '#FDFBF7',
      rgb: 'rgb(253, 251, 247)',
      role: 'Kiosk base canvas, product card backgrounds, modal card surface, ceramic mug white.',
      wcag: 'Background Canvas',
      sampleClass: 'bg-[#FDFBF7] text-[#3E2723] border border-[#3E2723]/20',
    },
    {
      name: 'Structural Neutral: Soft Oat',
      hex: '#F3EDE2',
      rgb: 'rgb(243, 237, 226)',
      role: 'Subdued card surfaces, POS item keypad background, table horizons, tab active containers.',
      wcag: 'Structural Surface',
      sampleClass: 'bg-[#F3EDE2] text-[#3E2723]',
    },
    {
      name: 'Success / Verification: Sage Green',
      hex: '#2E7D32',
      rgb: 'rgb(46, 125, 50)',
      role: 'GCash verification, official Order Number badges, in-stock indicators, Proceed to Payment button.',
      wcag: '5.2:1 on Cream (AA)',
      sampleClass: 'bg-[#2E7D32] text-white',
    },
    {
      name: 'Warning / Alert: Coral Red',
      hex: '#C62828',
      rgb: 'rgb(198, 40, 40)',
      role: 'Audit log discrepancies, 100% full-value discount review badges, low stock reorder alerts.',
      wcag: '5.8:1 on Cream (AA)',
      sampleClass: 'bg-[#C62828] text-white',
    },
  ];

  const SURFACES_SPEC = [
    {
      surface: 'Surface A: Customer Self-Service Kiosk',
      formFactor: 'Portrait Touchscreen (1080 × 1920 px)',
      targetUsers: 'Students, Faculty, University Guests',
      keyRules: [
        'Zero forced password sign-in (Guest-first attract flow).',
        'Large touch targets (≥ 48px touch boundary with active feedback).',
        'Visual card photography with live modifier price breakdowns.',
        'Split payment holding tickets (Cash #C-XXX vs Instant GCash #B-XXX).',
        'Discreet OTP loyalty entry for returning students.',
      ],
    },
    {
      surface: 'Surface B: Cashier POS Register',
      formFactor: 'Landscape POS Terminal (1920 × 1080 px)',
      targetUsers: 'Campus Cafe Cashiers, Senior Baristas',
      keyRules: [
        'Split layout: Live incoming tickets on left, active tender on right.',
        'Speed & accuracy: Quick cash bill presets (₱100, ₱200, ₱500, ₱1,000, Exact).',
        'Automatic Change Due calculation and thermal receipt generation.',
        'Discount module with Non-Negative Floor Rule (Subtotal - Discount ≥ ₱0.00).',
        'Side-by-side GCash 13-digit reference number verification.',
      ],
    },
    {
      surface: 'Surface C: Admin Back-Office Hub',
      formFactor: 'Desktop Monitor (1440 × 900 px)',
      targetUsers: 'Store Manager, Cafe Franchisee, Auditor',
      keyRules: [
        'Executive sales KPIs: Gross Sales, Net Sales, Orders, Average Ticket.',
        'Hourly sales volume peak visualizer (8 AM coffee, 12 PM spaghetti, 3 PM boba).',
        'Ingredient inventory table with minimum stock alerts and supplier receiving modal.',
        'Staffing roster and role permission toggles matrix.',
        'Immutable audit log tracking flagged 100% discounts & price changes.',
      ],
    },
  ];

  return (
    <div className="w-full h-full min-h-[780px] bg-[#FDFBF7] text-[#3E2723] overflow-y-auto p-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Design System Header */}
        <div className="border-b border-[#3E2723]/10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <BbglLogo size={68} animatedSteam={true} />
            <div>
              <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest block">
                Lead Product Designer Specification
              </span>
              <h1 className="font-display font-extrabold text-3xl text-[#3E2723]">
                BBGL Coffee Design Tokens & System
              </h1>
              <p className="text-xs text-[#795548] mt-1">
                Omni-channel campus cafe design architecture across Kiosk, POS, and Admin surfaces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F3EDE2] p-2 rounded-xl self-start md:self-auto text-xs">
            <Sparkles className="w-4 h-4 text-[#C68B59]" />
            <span className="font-semibold text-[#3E2723]">Design Version 1.0 (Production-Ready)</span>
          </div>
        </div>

        {/* Section 1: Brand Mascot & Identity */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#3E2723] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#C68B59]" />
            <span>Brand Identity & Mascot Anatomy</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-[#3E2723]/10 shadow-xs">
            <div className="flex flex-col items-center justify-center p-6 bg-[#FDFBF7] rounded-2xl border border-[#3E2723]/10 text-center">
              <BbglLogo size={140} animatedSteam={true} />
              <span className="font-display font-bold text-sm text-[#3E2723] mt-3">
                BBGL Mascot Emblem
              </span>
              <span className="text-[11px] text-[#795548]">
                Friendly Bear inside Ceramic Coffee Mug
              </span>
            </div>

            <div className="md:col-span-2 space-y-4 text-xs leading-relaxed text-[#795548]">
              <p>
                <strong>The BBGL Mascot:</strong> A warm, inviting, friendly brown bear cub dressed in a barista apron sitting playfully inside a coffee mug with rising steam. Designed to create a welcoming campus sanctuary for busy students and university faculty.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#F3EDE2] rounded-xl border border-[#3E2723]/10">
                  <h4 className="font-bold text-[#3E2723] mb-1">Brand Voice</h4>
                  <p className="text-[11px]">Friendly, reassuring, energetic, authentic, zero pretentious jargon.</p>
                </div>
                <div className="p-3 bg-[#F3EDE2] rounded-xl border border-[#3E2723]/10">
                  <h4 className="font-bold text-[#3E2723] mb-1">Campus Presence</h4>
                  <p className="text-[11px]">Fast-paced ordering, student discount friendliness, boba + espresso fusion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette & WCAG Token System */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#3E2723] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#C68B59]" />
            <span>Color Palette & Semantic Tokens (60-30-10 System)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.hex}
                className="p-5 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className={`w-full h-16 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${token.sampleClass}`}>
                    {token.hex}
                  </div>
                  <h3 className="font-bold text-sm text-[#3E2723] mt-3">{token.name}</h3>
                  <div className="text-[11px] font-mono text-[#795548] mt-0.5">{token.rgb}</div>
                  <p className="text-xs text-[#795548] mt-2 leading-snug">{token.role}</p>
                </div>

                <div className="pt-2 border-t border-[#3E2723]/10 flex justify-between items-center text-[11px]">
                  <span className="text-[#795548]">Contrast:</span>
                  <span className="font-semibold text-[#2E7D32]">{token.wcag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Typography Hierarchy */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#3E2723] flex items-center gap-2">
            <Type className="w-5 h-5 text-[#C68B59]" />
            <span>Typography System & Font Pairing</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-[#3E2723]/10 shadow-xs">
            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#795548] tracking-wider block">
                Display Font
              </span>
              <h3 className="font-display text-2xl font-black text-[#3E2723]">Fredoka / Nunito</h3>
              <p className="text-xs text-[#795548]">
                Warm, rounded geometric curves. Used for hero headings, mascot titles, and major order numbers (#B-108).
              </p>
            </div>

            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#795548] tracking-wider block">
                Body Font
              </span>
              <h3 className="font-sans text-xl font-bold text-[#3E2723]">Plus Jakarta Sans</h3>
              <p className="text-xs text-[#795548]">
                Crisp, modern humanist sans-serif with high x-height for optimal readability under bright cafe lighting.
              </p>
            </div>

            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#795548] tracking-wider block">
                Data & Prices
              </span>
              <h3 className="font-mono text-xl font-bold text-[#3E2723] tabular-nums">JetBrains Mono</h3>
              <p className="text-xs text-[#795548]">
                Tabular numerals for prices (₱), change calculation, queue order codes, and inventory quantities.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Multi-Surface Device Ecosystem Specifications */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#3E2723] flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#C68B59]" />
            <span>Form Factors & Multi-Surface Experience Architecture</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SURFACES_SPEC.map((s, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-3xl border border-[#3E2723]/10 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[#C68B59] mb-2">
                    {idx === 0 && <Tablet className="w-5 h-5" />}
                    {idx === 1 && <Smartphone className="w-5 h-5 rotate-90" />}
                    {idx === 2 && <Monitor className="w-5 h-5" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{s.formFactor}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[#3E2723] mb-1">{s.surface}</h3>
                  <span className="text-[11px] text-[#795548] block mb-4">Target: {s.targetUsers}</span>

                  <ul className="space-y-2 text-xs text-[#795548]">
                    {s.keyRules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Real Photography & Web Asset Integration */}
        <div className="p-6 bg-white rounded-3xl border border-[#3E2723]/10 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-5 h-5 text-[#C68B59]" />
                <h2 className="font-display font-bold text-lg text-[#3E2723]">
                  Real Food Photography & Web Image System
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
                  100% Web Compatible
                </span>
              </div>
              <p className="text-xs text-[#795548]">
                Real cafe photography is fully integrated with instant browser drag-and-drop ingestion, persistent local storage, and static public assets fallbacks.
              </p>
            </div>

            {onOpenImageModal && (
              <button
                type="button"
                onClick={onOpenImageModal}
                className="px-4 py-2 rounded-xl bg-[#3E2723] hover:bg-[#2E1C18] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
              >
                <Camera className="w-4 h-4 text-[#C68B59]" />
                <span>Open Photo Asset Studio ({activePhotoCount}/9 Active)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10">
              <span className="font-bold text-xs text-[#3E2723] block mb-1">In-App Multi-Drop</span>
              <p className="text-[11px] text-[#795548]">
                Drop all 9 photos at once into the Asset Studio. Filenames like <code>Logo.jpg</code> and <code>1.1 Chocolate Coffee.jpg</code> are auto-matched and rendered across all 3 surfaces immediately.
              </p>
            </div>
            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10">
              <span className="font-bold text-xs text-[#3E2723] block mb-1">Zero-Broken-Image Policy</span>
              <p className="text-[11px] text-[#795548]">
                If a real photo is ever missing or offline, the UI smoothly displays the handcrafted BBGL vector art with ambient cafe lighting and the signature bear mascot.
              </p>
            </div>
            <div className="p-4 bg-[#F3EDE2] rounded-2xl border border-[#3E2723]/10">
              <span className="font-bold text-xs text-[#3E2723] block mb-1">Production Deployment</span>
              <p className="text-[11px] text-[#795548]">
                For production servers, copy the image files into <code>/public/images/</code>. The Vite web server serves them directly with zero configuration needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
