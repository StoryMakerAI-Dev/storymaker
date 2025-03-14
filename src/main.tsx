
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx';
import './index.css';

// Replace with the user's publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Authentication will not work properly.");
}

// Create a function to safely render the app
const renderApp = () => {
  try {
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
  } catch (error) {
    console.error("Failed to render app:", error);
    
    // Create fallback UI if rendering fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
          <h1 style="color: #5c2d91;">StoryMaker AI</h1>
          <p style="color: #666;">There was a problem loading the application. Please try refreshing the page.</p>
          <button style="margin-top: 20px; padding: 8px 16px; background: #5c2d91; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="window.location.reload()">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Add event listener for when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Add global error handling for unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // We don't need to add UI here as the renderApp function already handles that
});
