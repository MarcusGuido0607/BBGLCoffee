import React, { useState } from 'react';
import { useImageAssets } from '../../context/ImageAssetsContext';

interface BbglLogoProps {
  size?: number | string;
  className?: string;
  animatedSteam?: boolean;
  monochrome?: boolean;
}

export const BbglLogo: React.FC<BbglLogoProps> = ({
  size = 64,
  className = '',
  animatedSteam = false,
  monochrome = false,
}) => {
  const { customImages, useRealPhotos, getImageSrc } = useImageAssets();
  const [logoError, setLogoError] = useState(false);
  const primaryColor = monochrome ? 'currentColor' : '#3E2723';
  const bearColor = monochrome ? 'currentColor' : '#795548';
  const bearSnout = monochrome ? '#FDFBF7' : '#D7CCC8';
  const creamBg = monochrome ? 'transparent' : '#FDFBF7';
  const coffeeCupColor = monochrome ? 'currentColor' : '#3E2723';

  const logoSrc = customImages.logo || (getImageSrc ? getImageSrc('logo') : undefined);

  if (useRealPhotos && logoSrc && !logoError && !monochrome) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center relative select-none rounded-full overflow-hidden shadow-xs border border-[#3E2723]/20 shrink-0 ${className}`}
      >
        <img
          src={logoSrc}
          alt="BBGL Coffee Logo"
          onError={() => setLogoError(true)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center relative select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="textPathTop"
            d="M 32,100 A 68,68 0 0,1 168,100"
            fill="none"
          />
          <path
            id="textPathBottom"
            d="M 168,100 A 68,68 0 0,1 32,100"
            fill="none"
          />
          {animatedSteam && (
            <style>{`
              @keyframes steamRise {
                0% { opacity: 0.3; transform: translateY(0) scaleY(0.9); }
                50% { opacity: 0.8; transform: translateY(-4px) scaleY(1.05); }
                100% { opacity: 0.3; transform: translateY(0) scaleY(0.9); }
              }
              .steam-anim-1 { animation: steamRise 3s ease-in-out infinite; }
              .steam-anim-2 { animation: steamRise 3.5s ease-in-out infinite 0.7s; }
            `}</style>
          )}
        </defs>

        {/* Outer Circle Background */}
        <circle cx="100" cy="100" r="96" fill={creamBg} stroke={primaryColor} strokeWidth="6" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke={primaryColor} strokeWidth="4" />

        {/* Brand Text Arcs */}
        <text
          fill={primaryColor}
          fontSize="22"
          fontWeight="900"
          fontFamily="'Fredoka', sans-serif"
          letterSpacing="0.12em"
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            BBGL
          </textPath>
        </text>

        <text
          fill={primaryColor}
          fontSize="17"
          fontWeight="800"
          fontFamily="'Fredoka', sans-serif"
          letterSpacing="0.2em"
        >
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            COFFEE
          </textPath>
        </text>

        {/* Left Coffee Bean */}
        <g transform="translate(24, 94) rotate(-20) scale(0.65)">
          <ellipse cx="10" cy="10" rx="9" ry="6" fill={primaryColor} />
          <path d="M 4,10 Q 10,7 16,10" stroke={creamBg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Right Coffee Bean */}
        <g transform="translate(160, 94) rotate(20) scale(0.65)">
          <ellipse cx="10" cy="10" rx="9" ry="6" fill={primaryColor} />
          <path d="M 4,10 Q 10,13 16,10" stroke={creamBg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Inner Center Circle with Bear */}
        <circle cx="100" cy="104" r="50" fill={monochrome ? 'none' : '#F7F0E4'} stroke={primaryColor} strokeWidth="3" />

        {/* Rising Steam Swirls from Mug */}
        <g className={animatedSteam ? 'steam-anim-1' : ''}>
          <path
            d="M 124,84 C 127,78 123,73 126,67 C 128,63 133,63 131,58"
            stroke={primaryColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className={animatedSteam ? 'steam-anim-2' : ''}>
          <path
            d="M 132,82 C 135,76 133,72 136,66"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Friendly Bear Mascot Head & Ears */}
        {/* Left Ear */}
        <circle cx="80" cy="80" r="11" fill={bearColor} stroke={primaryColor} strokeWidth="3" />
        <circle cx="80" cy="80" r="6" fill={monochrome ? creamBg : '#A1887F'} />

        {/* Right Ear */}
        <circle cx="120" cy="80" r="11" fill={bearColor} stroke={primaryColor} strokeWidth="3" />
        <circle cx="120" cy="80" r="6" fill={monochrome ? creamBg : '#A1887F'} />

        {/* Bear Head */}
        <ellipse cx="100" cy="95" rx="27" ry="24" fill={bearColor} stroke={primaryColor} strokeWidth="3" />

        {/* Bear Snout / Muzzle */}
        <ellipse cx="100" cy="101" rx="14" ry="10" fill={bearSnout} stroke={primaryColor} strokeWidth="2.2" />

        {/* Bear Nose */}
        <ellipse cx="100" cy="97" rx="4" ry="2.8" fill={primaryColor} />

        {/* Smiling Bear Mouth */}
        <path
          d="M 96,102 Q 100,105 104,102"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Happy Smiling Eyes */}
        <path
          d="M 87,92 Q 92,88 96,92"
          stroke={primaryColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 104,92 Q 108,88 113,92"
          stroke={primaryColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy Cheeks */}
        {!monochrome && (
          <>
            <ellipse cx="86" cy="97" rx="3.5" ry="2" fill="#FF8A80" opacity="0.6" />
            <ellipse cx="114" cy="97" rx="3.5" ry="2" fill="#FF8A80" opacity="0.6" />
          </>
        )}

        {/* Bear Paws on rim */}
        <ellipse cx="86" cy="118" rx="6" ry="7" fill={bearColor} stroke={primaryColor} strokeWidth="2.5" />
        <ellipse cx="114" cy="118" rx="6" ry="7" fill={bearColor} stroke={primaryColor} strokeWidth="2.5" />

        {/* Coffee Cup / Mug Foreground */}
        <path
          d="M 74,116 C 74,116 78,142 100,142 C 122,142 126,116 126,116 Z"
          fill={coffeeCupColor}
          stroke={primaryColor}
          strokeWidth="3.2"
        />

        {/* Cup Handle */}
        <path
          d="M 124,120 C 133,121 135,133 123,136"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cup Rim Highlight */}
        <ellipse cx="100" cy="116" rx="26" ry="3.5" fill="none" stroke={monochrome ? creamBg : '#6D4C41'} strokeWidth="2" />
      </svg>
    </div>
  );
};
