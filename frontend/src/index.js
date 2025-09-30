import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// 👇️ ADD THIS IMPORT LINE
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* Ensure you have successfully set your Client ID in .env */}
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);