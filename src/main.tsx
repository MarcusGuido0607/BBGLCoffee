import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ImageAssetsProvider } from './context/ImageAssetsContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ImageAssetsProvider>
    <App />
  </ImageAssetsProvider>
);
