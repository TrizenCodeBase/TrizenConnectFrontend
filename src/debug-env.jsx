// Temporary debug component - remove after fixing
export const DebugEnv = () => {
  const envVars = {
    VITE_SERVER_DOMAIN: import.meta.env.VITE_SERVER_DOMAIN,
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? "Present" : "Missing",
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Environment Variables Debug</h3>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
    </div>
  );
};
