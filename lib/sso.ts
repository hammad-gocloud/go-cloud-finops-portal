interface SSOTokenClaims {
  sub: string; // user ID
  email: string;
  name: string;
  role: "Platform Admin" | "Organization Admin" | "Team Member";
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

interface CreateMockSSOTokenOptions {
  userId?: string;
  email?: string;
  name?: string;
  role?: "Platform Admin" | "Organization Admin" | "Team Member";
  expiresInMinutes?: number;
}

/**
 * Decodes an SSO token and returns the claims
 * In a real implementation, this would verify the JWT signature
 */
export function decodeSSOToken(token: string): SSOTokenClaims | null {
  try {
    // In a real implementation, you would use a JWT library like jsonwebtoken
    // For now, we'll assume the token is a base64 encoded JSON object
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    const decoded = JSON.parse(atob(payload));
    return decoded as SSOTokenClaims;
  } catch (error) {
    console.error('Failed to decode SSO token:', error);
    return null;
  }
}

/**
 * Checks if an SSO token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const claims = decodeSSOToken(token);
    if (!claims) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return claims.exp < now;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
}

/**
 * Creates a mock SSO token for development/testing purposes
 * In production, this would be handled by your SSO provider
 */
export function createMockSSOToken(options: CreateMockSSOTokenOptions = {}): string {
  const {
    userId = "1",
    email = "admin@example.com",
    name = "Admin User",
    role = "Platform Admin",
    expiresInMinutes = 60
  } = options;

  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresInMinutes * 60);

  const claims: SSOTokenClaims = {
    sub: userId,
    email,
    name,
    role,
    exp,
    iat: now
  };

  // Create a mock JWT structure (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify(claims));
  const signature = btoa("mock-signature"); // In real implementation, this would be a proper signature

  return `${header}.${payload}.${signature}`;
}

export type { SSOTokenClaims, CreateMockSSOTokenOptions };