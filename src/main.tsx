
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx';
import './index.css';

// Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Authentication will not work properly.");
}

// Create a function to safely render the app
const renderApp = () => {
  try {
    console.log("Attempting to render app...");
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    createRoot(rootElement).render(
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY || "placeholder_key"}
        clerkJSVersion="5.56.0-snapshot.v20250312225817"
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/"
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/"
        afterSignOutUrl="/"
      >
        <App />
      </ClerkProvider>
    );
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Failed to render app:", error);
    
    // Display a meaningful error message to the user
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; padding: 0 20px; text-align: center;">
          <h1 style="color: #5c2d91; margin-bottom: 16px;">StoryMaker AI</h1>
          <p style="color: #666; margin-bottom: 20px; max-width: 500px;">There was a problem loading the application. Please check your internet connection and try refreshing the page.</p>
          <button style="margin-top: 20px; padding: 8px 16px; background: #5c2d91; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="window.location.reload()">
            Refresh Page
          </button>
          <p style="font-size: 12px; margin-top: 20px; color: #999;">Error details: ${error?.message || 'Unknown error'}</p>
        </div>
      `;
    }
  }
};

// Ensure the DOM is ready before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM is already ready, render immediately
  renderApp();
}

// Add global error handling for unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Error UI is already handled in renderApp
});
