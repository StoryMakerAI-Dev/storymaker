// Shared Clerk JWT verification for edge functions.
// Verifies session tokens via Clerk's public JWKS (no Clerk secret key required).
// The verified `sub` claim is the authoritative user id — never trust `x-user-id`
// from the client.
import { createRemoteJWKSet, jwtVerify } from "https://esm.sh/jose@5.9.6";

const DEFAULT_CLERK_ISSUER = "https://sterling-seahorse-51.clerk.accounts.dev";
const CLERK_ISSUER = Deno.env.get("CLERK_ISSUER") || DEFAULT_CLERK_ISSUER;
const JWKS = createRemoteJWKSet(new URL(`${CLERK_ISSUER}/.well-known/jwks.json`));

export interface VerifiedUser {
  userId: string;
  claims: Record<string, unknown>;
}

/**
 * Verify a Clerk session JWT sent by the client in the `x-clerk-token` header.
 * Returns the verified user id (from `sub`) or null when no valid token is present.
 * Never falls back to `x-user-id` — that header is untrusted.
 */
export async function verifyClerkUser(req: Request): Promise<VerifiedUser | null> {
  const token = req.headers.get("x-clerk-token");
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: CLERK_ISSUER,
    });
    if (!payload.sub) return null;
    return { userId: String(payload.sub), claims: payload as Record<string, unknown> };
  } catch (err) {
    console.warn("Clerk token verification failed:", (err as Error).message);
    return null;
  }
}

/** Same as verifyClerkUser but returns a 401 Response when the token is missing/invalid. */
export async function requireClerkUser(
  req: Request,
  corsHeaders: Record<string, string>,
): Promise<VerifiedUser | Response> {
  const user = await verifyClerkUser(req);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: missing or invalid Clerk session token" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return user;
}
