import React, { useState } from 'react';
import { useImageAssets, ImageAssetMap } from '../../context/ImageAssetsContext';

interface ProductArtProps {
  artKey: string;
  name: string;
  className?: string;
  aspectRatio?: '4/3' | '1/1' | '16/9';
}

export const ProductArt: React.FC<ProductArtProps> = ({
  artKey,
  name,
  className = '',
  aspectRatio = '4/3',
}) => {
  const { customImages, useRealPhotos, getImageSrc } = useImageAssets();
  const [imgError, setImgError] = useState(false);
  const aspectClass = aspectRatio === '1/1' ? 'aspect-square' : aspectRatio === '16/9' ? 'aspect-video' : 'aspect-[4/3]';
  const realPhotoSrc = customImages[artKey as keyof ImageAssetMap] || (getImageSrc ? getImageSrc(artKey as keyof ImageAssetMap) : undefined);

  const renderIllustration = () => {
    switch (artKey) {
      case 'chocolate_coffee':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgChoc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ECE0D1" />
                <stop offset="100%" stopColor="#DFD3C3" />
              </linearGradient>
              <linearGradient id="chocLiquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5D4037" />
                <stop offset="50%" stopColor="#3E2723" />
                <stop offset="100%" stopColor="#2E1C18" />
              </linearGradient>
              <linearGradient id="chocWhip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="100%" stopColor="#F5EBE1" />
              </linearGradient>
            </defs>
            {/* Cafe Table Surface */}
            <rect width="320" height="240" fill="url(#bgChoc)" />
            <path d="M 0,180 L 320,180 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />
            <line x1="0" y1="180" x2="320" y2="180" stroke="#795548" strokeWidth="2" opacity="0.4" />

            {/* Cup Shadow */}
            <ellipse cx="140" cy="205" rx="46" ry="12" fill="#2E1C18" opacity="0.25" />

            {/* Plastic Cup Body */}
            <path d="M 105,75 L 116,198 C 117,204 122,207 140,207 C 158,207 163,204 164,198 L 175,75 Z" fill="url(#chocLiquid)" />
            {/* Choc Drizzle Swirls Inside Cup */}
            <path d="M 112,95 Q 140,110 130,135 Q 120,160 145,185" stroke="#251613" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 168,90 Q 145,120 155,150 Q 165,175 140,200" stroke="#251613" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.75" />

            {/* Ice Cubes Visible */}
            <rect x="122" y="105" width="22" height="22" rx="4" fill="#FFFFFF" opacity="0.18" transform="rotate(15 133 116)" />
            <rect x="135" y="140" width="20" height="20" rx="4" fill="#FFFFFF" opacity="0.15" transform="rotate(-10 145 150)" />

            {/* Cup Highlights */}
            <path d="M 112,80 L 120,195" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <path d="M 168,80 L 161,195" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />

            {/* Whipped Cream Mountain */}
            <path d="M 103,76 C 100,55 120,40 140,32 C 160,40 180,55 177,76 Z" fill="url(#chocWhip)" />
            <path d="M 110,65 C 125,52 135,42 140,30 C 145,45 155,55 170,68" stroke="#EFEBE9" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Chocolate Syrup Drizzle on Whip */}
            <path d="M 120,50 Q 135,62 140,75 M 135,40 Q 145,55 152,72 M 145,35 Q 158,48 162,65" stroke="#3E2723" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Chocolate Flakes */}
            <circle cx="132" cy="48" r="2" fill="#2E1C18" />
            <circle cx="148" cy="52" r="2.5" fill="#2E1C18" />
            <circle cx="140" cy="62" r="2" fill="#2E1C18" />
            <circle cx="125" cy="60" r="1.8" fill="#2E1C18" />

            {/* Cup Rim */}
            <ellipse cx="140" cy="75" rx="36" ry="6" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" opacity="0.8" />
            {/* Straw */}
            <path d="M 152,80 L 175,20" stroke="#424242" strokeWidth="6" strokeLinecap="round" />

            {/* Cup Logo Stamp */}
            <circle cx="140" cy="140" r="18" fill="#FDFBF7" opacity="0.9" stroke="#3E2723" strokeWidth="1.5" />
            <text x="140" y="143" fill="#3E2723" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>

            {/* Mini Bear Companion Mascot */}
            <g transform="translate(210, 140) scale(0.65)">
              <ellipse cx="40" cy="85" rx="32" ry="10" fill="#2E1C18" opacity="0.2" />
              {/* Ears */}
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              {/* Head */}
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              {/* Snout */}
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Eyes */}
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Body in Apron */}
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              {/* Waving Paw */}
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'signature_latte':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgLatte" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5EDE4" />
                <stop offset="100%" stopColor="#E2D4C3" />
              </linearGradient>
              <linearGradient id="crema" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A16207" />
                <stop offset="25%" stopColor="#CA8A04" />
                <stop offset="75%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgLatte)" />
            {/* Table Wood Horizon */}
            <path d="M 0,170 L 320,170 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.25" />

            {/* Saucer Shadow */}
            <ellipse cx="140" cy="205" rx="72" ry="18" fill="#3E2723" opacity="0.2" />
            {/* Saucer */}
            <ellipse cx="140" cy="195" rx="68" ry="16" fill="#FDFBF7" stroke="#D7CCC8" strokeWidth="2.5" />
            <ellipse cx="140" cy="195" rx="46" ry="10" fill="#EFEBE9" stroke="#BCAAA4" strokeWidth="1" />

            {/* Ceramic Cup Shadow */}
            <ellipse cx="140" cy="175" rx="52" ry="12" fill="#3E2723" opacity="0.15" />

            {/* Cup Handle */}
            <path d="M 188,125 C 215,128 215,160 185,165" stroke="#FDFBF7" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 188,125 C 215,128 215,160 185,165" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Ceramic Cup Body */}
            <path d="M 88,120 C 88,185 192,185 192,120 Z" fill="#FDFBF7" stroke="#D7CCC8" strokeWidth="3" />
            {/* Cup Rim */}
            <ellipse cx="140" cy="120" rx="52" ry="18" fill="#FDFBF7" stroke="#D7CCC8" strokeWidth="3" />

            {/* Coffee Crema Surface */}
            <ellipse cx="140" cy="120" rx="47" ry="15" fill="url(#crema)" />

            {/* Heart Rosette Latte Art */}
            <g transform="translate(140, 118)">
              {/* Base Leaf Layers */}
              <path d="M 0,-6 C -18,-2 -15,4 0,8 C 15,4 18,-2 0,-6 Z" fill="#FFFDF9" opacity="0.95" />
              <path d="M 0,-2 C -24,4 -18,9 0,11 C 18,9 24,4 0,-2 Z" fill="#FFFDF9" opacity="0.95" />
              <path d="M 0,3 C -20,8 -14,12 0,13 C 14,12 20,8 0,3 Z" fill="#FFFDF9" opacity="0.95" />
              {/* Top Heart */}
              <path d="M 0,-12 C -6,-15 -12,-11 -8,-6 C -4,-1 0,2 0,2 C 0,2 4,-1 8,-6 C 12,-11 6,-15 0,-12 Z" fill="#FFFDF9" />
              {/* Stem Cut through */}
              <line x1="0" y1="-12" x2="0" y2="13" stroke="#CA8A04" strokeWidth="1.5" />
            </g>

            {/* Spoon & Coffee Beans on Saucer */}
            <ellipse cx="88" cy="196" rx="4" ry="2.5" fill="#4E342E" transform="rotate(-15 88 196)" />
            <ellipse cx="96" cy="198" rx="4.5" ry="3" fill="#3E2723" transform="rotate(25 96 198)" />

            {/* Bear Mascot Companion */}
            <g transform="translate(225, 145) scale(0.6)">
              <ellipse cx="40" cy="85" rx="30" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'matcha_milktea':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgMatcha" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8F0E6" />
                <stop offset="100%" stopColor="#D5E4D2" />
              </linearGradient>
              <linearGradient id="matchaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4D7C0F" />
                <stop offset="45%" stopColor="#65A30D" />
                <stop offset="55%" stopColor="#F7FEE7" />
                <stop offset="75%" stopColor="#FEFCE8" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgMatcha)" />
            <path d="M 0,180 L 320,180 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />

            <ellipse cx="140" cy="206" rx="46" ry="12" fill="#2E1C18" opacity="0.25" />

            {/* Cup Body */}
            <path d="M 105,65 L 116,198 C 117,204 122,207 140,207 C 158,207 163,204 164,198 L 175,65 Z" fill="url(#matchaGrad)" />

            {/* Bottom Boba Pearls */}
            <g fill="#1F1511">
              <circle cx="123" cy="195" r="7.5" />
              <circle cx="138" cy="196" r="8" />
              <circle cx="154" cy="195" r="7.5" />
              <circle cx="130" cy="184" r="8" />
              <circle cx="146" cy="183" r="8.5" />
              <circle cx="124" cy="175" r="7" />
              <circle cx="138" cy="172" r="7.5" />
              <circle cx="154" cy="174" r="7" />
              {/* Pearl gloss */}
              <circle cx="122" cy="193" r="1.5" fill="#FFFFFF" opacity="0.5" />
              <circle cx="137" cy="194" r="1.5" fill="#FFFFFF" opacity="0.5" />
              <circle cx="145" cy="181" r="1.5" fill="#FFFFFF" opacity="0.5" />
            </g>

            {/* Ice and Swirls */}
            <rect x="120" y="95" width="22" height="22" rx="4" fill="#FFFFFF" opacity="0.25" transform="rotate(20 131 106)" />
            <rect x="138" y="125" width="20" height="20" rx="4" fill="#FFFFFF" opacity="0.2" transform="rotate(-15 148 135)" />

            {/* Cup Highlights */}
            <path d="M 112,70 L 120,195" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
            <path d="M 168,70 L 161,195" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

            {/* Cup Lid & Straw */}
            <ellipse cx="140" cy="65" rx="36" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" opacity="0.9" />
            {/* Green Straw */}
            <path d="M 148,70 L 165,15" stroke="#65A30D" strokeWidth="7" strokeLinecap="round" />

            {/* Logo Badge */}
            <circle cx="140" cy="125" r="18" fill="#FDFBF7" opacity="0.95" stroke="#3E2723" strokeWidth="1.5" />
            <text x="140" y="128" fill="#3E2723" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>

            {/* Bear Mascot */}
            <g transform="translate(210, 140) scale(0.65)">
              <ellipse cx="40" cy="85" rx="32" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'caramel_macchiato':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgCaramel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAF1E6" />
                <stop offset="100%" stopColor="#EDE0D0" />
              </linearGradient>
              <linearGradient id="caramelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="35%" stopColor="#D97706" />
                <stop offset="55%" stopColor="#FFFBEB" />
                <stop offset="85%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgCaramel)" />
            <path d="M 0,180 L 320,180 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />
            <ellipse cx="140" cy="206" rx="46" ry="12" fill="#2E1C18" opacity="0.25" />

            {/* Cup Body */}
            <path d="M 105,65 L 116,198 C 117,204 122,207 140,207 C 158,207 163,204 164,198 L 175,65 Z" fill="url(#caramelGrad)" />

            {/* Caramel Crosshatch Dripping Walls */}
            <path d="M 115,80 Q 135,110 125,140 Q 120,170 135,190" stroke="#92400E" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 165,80 Q 145,115 155,145 Q 160,175 145,200" stroke="#92400E" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 135,70 L 140,110" stroke="#B45309" strokeWidth="5" strokeLinecap="round" opacity="0.75" />

            {/* Cup Highlights */}
            <path d="M 112,70 L 120,195" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
            <path d="M 168,70 L 161,195" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

            <ellipse cx="140" cy="65" rx="36" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" opacity="0.9" />
            <path d="M 150,70 L 168,15" stroke="#424242" strokeWidth="6" strokeLinecap="round" />

            <circle cx="140" cy="130" r="18" fill="#FDFBF7" opacity="0.95" stroke="#3E2723" strokeWidth="1.5" />
            <text x="140" y="133" fill="#3E2723" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>

            <g transform="translate(210, 140) scale(0.65)">
              <ellipse cx="40" cy="85" rx="32" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'brown_sugar_milktea':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgBrownSugar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5EDE4" />
                <stop offset="100%" stopColor="#DFCEBC" />
              </linearGradient>
              <linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="40%" stopColor="#FEF3C7" />
                <stop offset="80%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#1E0E04" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgBrownSugar)" />
            <path d="M 0,180 L 320,180 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />
            <ellipse cx="140" cy="206" rx="46" ry="12" fill="#2E1C18" opacity="0.25" />

            <path d="M 105,65 L 116,198 C 117,204 122,207 140,207 C 158,207 163,204 164,198 L 175,65 Z" fill="url(#teaGrad)" />

            {/* Tiger Stripes Falling Down Cup */}
            <path d="M 112,85 Q 128,120 118,150 Q 112,170 128,195" stroke="#451A03" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M 132,75 Q 140,110 135,140 Q 130,165 142,195" stroke="#451A03" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 168,85 Q 150,115 160,145 Q 165,170 152,195" stroke="#451A03" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />

            {/* Bottom Boba Tapioca Pearls */}
            <g fill="#120A06">
              <circle cx="122" cy="195" r="8" />
              <circle cx="137" cy="196" r="8.5" />
              <circle cx="155" cy="195" r="8" />
              <circle cx="128" cy="184" r="8.5" />
              <circle cx="145" cy="183" r="9" />
              <circle cx="123" cy="173" r="7.5" />
              <circle cx="138" cy="172" r="8" />
              <circle cx="155" cy="174" r="7.5" />
              <circle cx="121" cy="193" r="1.5" fill="#FFFFFF" opacity="0.5" />
              <circle cx="136" cy="194" r="1.5" fill="#FFFFFF" opacity="0.5" />
            </g>

            <path d="M 112,70 L 120,195" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
            <ellipse cx="140" cy="65" rx="36" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" opacity="0.9" />
            <path d="M 148,70 L 165,15" stroke="#27272A" strokeWidth="7" strokeLinecap="round" />

            <circle cx="140" cy="120" r="18" fill="#FDFBF7" opacity="0.95" stroke="#3E2723" strokeWidth="1.5" />
            <text x="140" y="123" fill="#3E2723" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>

            <g transform="translate(210, 140) scale(0.65)">
              <ellipse cx="40" cy="85" rx="32" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'bbgl_spaghetti':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgSpag" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9F3EA" />
                <stop offset="100%" stopColor="#EADDCB" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgSpag)" />
            <path d="M 0,165 L 320,165 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />

            {/* Plate Shadow */}
            <ellipse cx="140" cy="195" rx="85" ry="24" fill="#2E1C18" opacity="0.22" />
            {/* White Ceramic Plate */}
            <ellipse cx="140" cy="185" rx="80" ry="22" fill="#FDFBF7" stroke="#E0E0E0" strokeWidth="2" />
            <ellipse cx="140" cy="183" rx="66" ry="17" fill="#F5F5F5" />

            {/* Golden Garlic Bread with BBGL flag */}
            <g transform="translate(62, 140) rotate(-18)">
              <path d="M 0,15 C 0,5 15,0 35,0 C 50,0 60,8 60,20 C 60,30 45,35 25,35 C 10,35 0,28 0,15 Z" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="30" cy="16" rx="24" ry="11" fill="#FDE68A" />
              {/* Herb specks */}
              <circle cx="22" cy="14" r="1" fill="#15803D" />
              <circle cx="35" cy="18" r="1.2" fill="#15803D" />
              <circle cx="42" cy="12" r="1" fill="#15803D" />
              {/* Mini Flag */}
              <line x1="45" y1="12" x2="45" y2="-18" stroke="#78716C" strokeWidth="1.5" />
              <path d="M 45,-18 L 65,-14 L 45,-10 Z" fill="#FDFBF7" stroke="#3E2723" strokeWidth="1" />
              <text x="47" y="-13" fill="#3E2723" fontSize="4.5" fontWeight="bold">BBGL</text>
            </g>

            {/* Spaghetti Pasta Mound */}
            <ellipse cx="145" cy="172" rx="52" ry="16" fill="#FDE047" />
            {/* Swirl lines */}
            <path d="M 105,170 Q 125,160 145,172 Q 165,180 185,170" stroke="#EAB308" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 115,176 Q 135,168 155,175 Q 175,182 188,174" stroke="#EAB308" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Filipino Sweet Red Sauce with Ground Meat */}
            <path d="M 112,168 C 112,150 140,140 165,145 C 185,150 185,165 175,175 C 160,185 125,185 112,168 Z" fill="#DC2626" />
            <ellipse cx="146" cy="158" rx="28" ry="11" fill="#B91C1C" />
            {/* Ground meat texture */}
            <circle cx="132" cy="156" r="2" fill="#7F1D1D" />
            <circle cx="142" cy="162" r="2.2" fill="#7F1D1D" />
            <circle cx="155" cy="155" r="2.5" fill="#7F1D1D" />
            <circle cx="162" cy="164" r="2" fill="#7F1D1D" />

            {/* Classic Red Hotdog Slices */}
            <ellipse cx="130" cy="166" rx="7" ry="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" transform="rotate(-15 130 166)" />
            <circle cx="130" cy="166" r="2.5" fill="#F87171" />

            <ellipse cx="152" cy="160" rx="7" ry="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" transform="rotate(20 152 160)" />
            <circle cx="152" cy="160" r="2.5" fill="#F87171" />

            <ellipse cx="168" cy="170" rx="7" ry="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" transform="rotate(-10 168 170)" />
            <circle cx="168" cy="170" r="2.5" fill="#F87171" />

            {/* Shredded Sharp Cheddar Cheese Mountain on Top */}
            <g stroke="#FEF08A" strokeWidth="2.2" strokeLinecap="round">
              <line x1="135" y1="148" x2="148" y2="152" />
              <line x1="142" y1="144" x2="155" y2="149" />
              <line x1="138" y1="154" x2="152" y2="157" />
              <line x1="146" y1="142" x2="152" y2="156" />
              <line x1="130" y1="152" x2="144" y2="155" stroke="#FDE047" />
              <line x1="148" y1="150" x2="162" y2="153" stroke="#FDE047" />
            </g>

            {/* Bear Mascot Companion */}
            <g transform="translate(225, 145) scale(0.6)">
              <ellipse cx="40" cy="85" rx="30" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'chocolate_croissant':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgCroissant" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9F5EE" />
                <stop offset="100%" stopColor="#E9DEC8" />
              </linearGradient>
              <linearGradient id="croissantGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgCroissant)" />
            <path d="M 0,170 L 320,170 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />

            {/* Ceramic Plate */}
            <ellipse cx="140" cy="195" rx="78" ry="22" fill="#FDFBF7" stroke="#E0E0E0" strokeWidth="2" />
            <ellipse cx="140" cy="193" rx="64" ry="17" fill="#F5F5F5" />

            {/* Croissant Shadow */}
            <ellipse cx="140" cy="182" rx="55" ry="14" fill="#3E2723" opacity="0.25" />

            {/* Flaky Golden Croissant Body Layers */}
            <path d="M 90,175 C 95,145 115,130 140,130 C 165,130 185,145 190,175 C 175,186 105,186 90,175 Z" fill="url(#croissantGold)" />

            {/* Crescent Ridges */}
            <path d="M 105,178 C 110,148 125,135 140,135" stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.8" />
            <path d="M 130,180 C 135,146 150,135 165,135" stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.8" />
            <path d="M 155,180 C 160,152 172,142 180,145" stroke="#FDE68A" strokeWidth="2.5" fill="none" opacity="0.8" />

            {/* Chocolate Drizzle Striping across Croissant */}
            <path d="M 112,145 Q 120,165 116,182" stroke="#3E2723" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 128,138 Q 138,160 134,184" stroke="#3E2723" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 145,136 Q 155,158 152,183" stroke="#3E2723" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 162,142 Q 170,162 168,180" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Chocolate Chips on Plate */}
            <path d="M 88,192 L 94,188 L 92,196 Z" fill="#2E1C18" />
            <path d="M 188,190 L 194,186 L 192,194 Z" fill="#2E1C18" />

            {/* Bear Mascot */}
            <g transform="translate(225, 145) scale(0.6)">
              <ellipse cx="40" cy="85" rx="30" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'glazed_cinnamon':
        return (
          <svg viewBox="0 0 320 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgCin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9F3EA" />
                <stop offset="100%" stopColor="#EBDEC9" />
              </linearGradient>
              <linearGradient id="cinnamonDough" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            <rect width="320" height="240" fill="url(#bgCin)" />
            <path d="M 0,170 L 320,170 L 320,240 L 0,240 Z" fill="#8D6E63" opacity="0.3" />

            <ellipse cx="140" cy="195" rx="78" ry="22" fill="#FDFBF7" stroke="#E0E0E0" strokeWidth="2" />
            <ellipse cx="140" cy="193" rx="64" ry="17" fill="#F5F5F5" />

            {/* Cinnamon Roll Shadow */}
            <ellipse cx="140" cy="180" rx="48" ry="14" fill="#3E2723" opacity="0.25" />

            {/* Golden Cinnamon Swirl Bun */}
            <ellipse cx="140" cy="165" rx="44" ry="22" fill="url(#cinnamonDough)" />
            {/* Cinnamon Brown Spiral line */}
            <path d="M 140,165 M 140,154 C 158,154 168,162 168,168 C 168,176 150,182 140,182 C 124,182 116,174 116,166 C 116,152 145,148 155,148" stroke="#451A03" strokeWidth="5.5" strokeLinecap="round" fill="none" />

            {/* Rich Vanilla Cream Cheese Glaze Dripping Down Sides */}
            <path d="M 118,154 C 122,142 158,142 162,154 C 166,162 168,172 164,182 C 160,184 158,180 155,182 C 152,185 146,183 140,183 C 134,183 128,185 125,181 C 122,176 116,168 118,154 Z" fill="#FFFDF9" opacity="0.95" />
            {/* Dripping Glaze Drops */}
            <path d="M 124,175 C 124,185 126,188 128,188 C 130,188 130,182 130,175" fill="#FFFDF9" />
            <path d="M 148,178 C 148,188 150,192 152,192 C 154,192 154,184 154,178" fill="#FFFDF9" />
            <path d="M 160,172 C 160,184 162,186 164,186 C 166,186 166,178 166,172" fill="#FFFDF9" />

            {/* Bear Mascot */}
            <g transform="translate(225, 145) scale(0.6)">
              <ellipse cx="40" cy="85" rx="30" ry="10" fill="#2E1C18" opacity="0.2" />
              <circle cx="22" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <circle cx="58" cy="30" r="11" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="46" rx="26" ry="23" fill="#795548" stroke="#3E2723" strokeWidth="3" />
              <ellipse cx="40" cy="52" rx="14" ry="10" fill="#D7CCC8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="40" cy="49" rx="4" ry="3" fill="#3E2723" />
              <path d="M 37,54 Q 40,57 43,54" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 28,43 Q 32,39 36,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 44,43 Q 48,39 52,43" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 22,66 C 18,80 25,86 40,86 C 55,86 62,80 58,66 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="3" />
              <text x="40" y="78" fill="#FDFBF7" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="'Fredoka', sans-serif">BBGL</text>
              <circle cx="68" cy="56" r="7" fill="#795548" stroke="#3E2723" strokeWidth="2" />
            </g>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center">
            <span className="font-display text-lg text-[#3E2723]">{name}</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden w-full ${aspectClass} ${className} bg-[#F3EDE2]`}>
      {useRealPhotos && realPhotoSrc && !imgError ? (
        <img
          src={realPhotoSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        renderIllustration()
      )}
    </div>
  );
};
