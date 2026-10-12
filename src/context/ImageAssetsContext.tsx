import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ImageAssetMap {
  logo?: string;
  chocolate_coffee?: string;
  signature_latte?: string;
  matcha_milktea?: string;
  caramel_macchiato?: string;
  brown_sugar_milktea?: string;
  bbgl_spaghetti?: string;
  chocolate_croissant?: string;
  glazed_cinnamon?: string;
}

export interface AssetMetaInfo {
  key: keyof ImageAssetMap;
  title: string;
  category: 'logo' | 'coffee' | 'milktea' | 'pastries_meals';
  expectedFilename: string;
  alternativeFilenames: string[];
}

export const ASSET_CATALOG: AssetMetaInfo[] = [
  {
    key: 'logo',
    title: 'BBGL Brand Mascot Seal',
    category: 'logo',
    expectedFilename: 'Logo.jpg',
    alternativeFilenames: ['logo.jpg', 'bbgl-logo.png', 'bear.jpg'],
  },
  {
    key: 'chocolate_coffee',
    title: 'Chocolate Coffee',
    category: 'coffee',
    expectedFilename: '1.1 Chocolate Coffee.jpg',
    alternativeFilenames: ['Chocolate Coffee.jpg', 'chocolate_coffee.jpg', 'choc_coffee.jpg'],
  },
  {
    key: 'signature_latte',
    title: 'Signature Latte',
    category: 'coffee',
    expectedFilename: '1.2 Signature Coffee Latte.jpg',
    alternativeFilenames: ['Signature Coffee Latte.jpg', 'Signature Latte.jpg', 'latte.jpg'],
  },
  {
    key: 'matcha_milktea',
    title: 'Matcha Milktea',
    category: 'milktea',
    expectedFilename: '1.3 Matcha Milktea.jpg',
    alternativeFilenames: ['Matcha Milktea.jpg', 'matcha_milktea.jpg', 'matcha.jpg'],
  },
  {
    key: 'caramel_macchiato',
    title: 'Caramel Macchiato',
    category: 'coffee',
    expectedFilename: '1.4 Caramel Machiato.jpg',
    alternativeFilenames: ['Caramel Macchiato.jpg', 'Caramel Machiato.jpg', 'caramel_macchiato.jpg'],
  },
  {
    key: 'brown_sugar_milktea',
    title: 'Brown Sugar Milk Tea',
    category: 'milktea',
    expectedFilename: '1.5 Brown Sugar Milktea.jpg',
    alternativeFilenames: ['Brown Sugar Milktea.jpg', 'brown_sugar_milktea.jpg', 'brown_sugar.jpg'],
  },
  {
    key: 'glazed_cinnamon',
    title: 'Glazed Cinnamon Roll',
    category: 'pastries_meals',
    expectedFilename: '2.1 Glazed Cinnamon.jpg',
    alternativeFilenames: ['Glazed Cinnamon.jpg', 'cinnamon_roll.jpg', 'glazed_cinnamon.jpg'],
  },
  {
    key: 'chocolate_croissant',
    title: 'Chocolate Croissant',
    category: 'pastries_meals',
    expectedFilename: '2.2 Chocolate Croissant.jpg',
    alternativeFilenames: ['Chocolate Croissant.jpg', 'chocolate_croissant.jpg', 'croissant.jpg'],
  },
  {
    key: 'bbgl_spaghetti',
    title: 'BBGL Spaghetti (Filipino-style)',
    category: 'pastries_meals',
    expectedFilename: '2.3 BBGL Signature Spaghetti.jpg',
    alternativeFilenames: ['BBGL Signature Spaghetti.jpg', 'BBGL Spaghetti.jpg', 'spaghetti.jpg'],
  },
];

export const DEFAULT_STATIC_PATHS: Record<keyof ImageAssetMap, string[]> = {
  logo: ['/images/Logo.jpg', '/images/logo.jpg', '/Logo.jpg'],
  chocolate_coffee: ['/images/1.1 Chocolate Coffee.jpg', '/images/chocolate_coffee.jpg', '/1.1 Chocolate Coffee.jpg'],
  signature_latte: ['/images/1.2 Signature Coffee Latte.jpg', '/images/signature_latte.jpg', '/1.2 Signature Coffee Latte.jpg'],
  matcha_milktea: ['/images/1.3 Matcha Milktea.jpg', '/images/matcha_milktea.jpg', '/1.3 Matcha Milktea.jpg'],
  caramel_macchiato: ['/images/1.4 Caramel Machiato.jpg', '/images/caramel_macchiato.jpg', '/1.4 Caramel Machiato.jpg'],
  brown_sugar_milktea: ['/images/1.5 Brown Sugar Milktea.jpg', '/images/brown_sugar_milktea.jpg', '/1.5 Brown Sugar Milktea.jpg'],
  glazed_cinnamon: ['/images/2.1 Glazed Cinnamon.jpg', '/images/glazed_cinnamon.jpg', '/2.1 Glazed Cinnamon.jpg'],
  chocolate_croissant: ['/images/2.2 Chocolate Croissant.jpg', '/images/chocolate_croissant.jpg', '/2.2 Chocolate Croissant.jpg'],
  bbgl_spaghetti: ['/images/2.3 BBGL Signature Spaghetti.jpg', '/images/bbgl_spaghetti.jpg', '/2.3 BBGL Signature Spaghetti.jpg'],
};

interface ImageAssetsContextType {
  customImages: ImageAssetMap;
  useRealPhotos: boolean;
  setUseRealPhotos: (val: boolean) => void;
  updateCustomImage: (key: keyof ImageAssetMap, dataUrl: string) => void;
  removeCustomImage: (key: keyof ImageAssetMap) => void;
  bulkUploadImages: (files: FileList | File[]) => Promise<{ matched: number; total: number; matchedKeys: string[] }>;
  clearCustomImages: () => void;
  getImageSrc: (key: keyof ImageAssetMap) => string | undefined;
  activePhotoCount: number;
}

const STORAGE_KEY = 'bbgl_custom_images';
const PREF_KEY = 'bbgl_use_real_photos';

const ImageAssetsContext = createContext<ImageAssetsContextType | undefined>(undefined);

export const ImageAssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customImages, setCustomImages] = useState<ImageAssetMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [useRealPhotos, setUseRealPhotos] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customImages));
    } catch (e) {
      console.warn('Unable to persist custom images to localStorage', e);
    }
  }, [customImages]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(useRealPhotos));
    } catch (e) {
      console.warn('Unable to persist photo preference', e);
    }
  }, [useRealPhotos]);

  const updateCustomImage = (key: keyof ImageAssetMap, dataUrl: string) => {
    setCustomImages((prev) => ({
      ...prev,
      [key]: dataUrl,
    }));
  };

  const removeCustomImage = (key: keyof ImageAssetMap) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearCustomImages = () => {
    setCustomImages({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const getImageSrc = (key: keyof ImageAssetMap): string | undefined => {
    if (customImages[key]) {
      return customImages[key];
    }
    // Static fallback path if deployed in /public/images/
    const staticCandidates = DEFAULT_STATIC_PATHS[key];
    return staticCandidates ? staticCandidates[0] : undefined;
  };

  const activePhotoCount = Object.keys(customImages).filter((k) => !!customImages[k as keyof ImageAssetMap]).length;

  // Auto-match uploaded files to the 9 menu asset keys based on filenames
  const bulkUploadImages = async (files: FileList | File[]): Promise<{ matched: number; total: number; matchedKeys: string[] }> => {
    const fileArray = Array.from(files);
    let matchedCount = 0;
    const newMap: Partial<ImageAssetMap> = {};
    const matchedKeys: string[] = [];

    for (const file of fileArray) {
      const name = file.name.toLowerCase();
      let matchedKey: keyof ImageAssetMap | null = null;

      if (name.includes('logo')) {
        matchedKey = 'logo';
      } else if (name.includes('chocolate') && (name.includes('coffee') || name.includes('1.1'))) {
        matchedKey = 'chocolate_coffee';
      } else if (name.includes('latte') || name.includes('1.2')) {
        matchedKey = 'signature_latte';
      } else if (name.includes('matcha') || name.includes('1.3')) {
        matchedKey = 'matcha_milktea';
      } else if (name.includes('caramel') || name.includes('machiato') || name.includes('macchiato') || name.includes('1.4')) {
        matchedKey = 'caramel_macchiato';
      } else if (name.includes('brown sugar') || name.includes('brown_sugar') || name.includes('1.5')) {
        matchedKey = 'brown_sugar_milktea';
      } else if (name.includes('spaghetti') || name.includes('2.3')) {
        matchedKey = 'bbgl_spaghetti';
      } else if (name.includes('croissant') || name.includes('2.2')) {
        matchedKey = 'chocolate_croissant';
      } else if (name.includes('cinnamon') || name.includes('glazed') || name.includes('2.1')) {
        matchedKey = 'glazed_cinnamon';
      }

      if (matchedKey) {
        matchedCount++;
        matchedKeys.push(matchedKey);
        const dataUrl = await readFileAsDataUrl(file);
        newMap[matchedKey] = dataUrl;
      }
    }

    setCustomImages((prev) => ({
      ...prev,
      ...newMap,
    }));
    setUseRealPhotos(true);

    return { matched: matchedCount, total: fileArray.length, matchedKeys };
  };

  return (
    <ImageAssetsContext.Provider
      value={{
        customImages,
        useRealPhotos,
        setUseRealPhotos,
        updateCustomImage,
        removeCustomImage,
        bulkUploadImages,
        clearCustomImages,
        getImageSrc,
        activePhotoCount,
      }}
    >
      {children}
    </ImageAssetsContext.Provider>
  );
};

export const useImageAssets = () => {
  const context = useContext(ImageAssetsContext);
  if (!context) {
    throw new Error('useImageAssets must be used within an ImageAssetsProvider');
  }
  return context;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
