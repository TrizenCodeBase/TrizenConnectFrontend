// Environment configuration with fallbacks
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

export const config = {
  // Server configuration
  serverDomain: import.meta.env.VITE_SERVER_DOMAIN || 'https://connectbackend.llp.trizenventures.com',
  
  // Firebase configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAyUdst9s9HUcKLpGMNG9NjGPCMyhymUeA",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "connect-trizen.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "connect-trizen",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "connect-trizen.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "910313173978",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:910313173978:web:ad9c16346dbfc1bbed86e3",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HJ5DCBY76K"
  },

  // Debug info
  isDevelopment,
  isProduction,
  buildMode: import.meta.env.MODE
};

// Debug logging
console.log('🔧 Environment Configuration:');
console.log('Mode:', config.buildMode);
console.log('Server Domain:', config.serverDomain);
console.log('Firebase Project:', config.firebase.projectId);
console.log('Environment variables loaded:', {
  SERVER_DOMAIN: import.meta.env.VITE_SERVER_DOMAIN ? '✅' : '❌',
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌',
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅' : '❌'
});

export default config;
