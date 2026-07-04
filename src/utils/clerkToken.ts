// Helper that safely retrieves the current Clerk session JWT from the browser.
// Returns null when the Clerk client isn't loaded or the user is signed out.
// Prefer passing this token as the `x-clerk-token` header on edge function calls
// so the server can verify identity independently of the untrusted x-user-id header.
export async function getClerkSessionToken(): Promise<string | null> {
  try {
    // Clerk exposes its client instance on window.Clerk once loaded.
    const clerk = (window as unknown as { Clerk?: { session?: { getToken: () => Promise<string | null> } } }).Clerk;
    const token = await clerk?.session?.getToken();
    return token ?? null;
  } catch (err) {
    console.warn('Failed to retrieve Clerk session token:', err);
    return null;
  }
}
