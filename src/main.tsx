import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Intercept and swallow third-party browser extension errors (e.g., MetaMask, crypto wallets, adblockers)
// to prevent external extension exceptions from bubbling up as false positive application failures.
if (typeof window !== 'undefined') {
  const isExtensionError = (errorOrMessage: unknown): boolean => {
    if (!errorOrMessage) return false;
    const str = String(
      (typeof errorOrMessage === 'object' && errorOrMessage !== null && 'message' in errorOrMessage)
        ? (errorOrMessage as { message: unknown }).message
        : (typeof errorOrMessage === 'object' && errorOrMessage !== null && 'stack' in errorOrMessage)
        ? (errorOrMessage as { stack: unknown }).stack
        : errorOrMessage
    );

    return (
      str.includes('MetaMask') ||
      str.includes('Failed to connect to MetaMask') ||
      str.includes('chrome-extension://') ||
      str.includes('moz-extension://') ||
      str.includes('safari-extension://') ||
      str.includes('inpage.js') ||
      str.includes('ethereum')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isExtensionError(event.error) || isExtensionError(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
