import crypto from "crypto";
import config from "../configs/config";

const ALG = "HS256";
const TYP = "JWT";
const DEFAULT_EXPIRY_MS = 3600 * 1000; // 1 hour

/**
 * Base64url encode (JWT standard: no padding, - and _)
 */
export function base64urlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64url decode
 */
function base64urlDecode(str: string): Buffer {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  return Buffer.from(b64, "base64");
}

/**
 * Constant-time comparison to prevent timing attacks
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  if (a.length === 0) return true;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export interface JwtPayload {
  userId: string;
  expireAt: number;
}

/**
 * Sign a JWT with userId and optional custom expiry.
 */
export function signJwt(userId: string, expiryMs: number = DEFAULT_EXPIRY_MS): string {
  const header = base64urlEncode(JSON.stringify({ alg: ALG, typ: TYP }));
  const payload: JwtPayload = {
    userId,
    expireAt: Date.now() + expiryMs,
  };
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const tokenData = `${header}.${encodedPayload}`;
  const hmac = crypto.createHmac("sha256", config.secretKey);
  const signature = hmac.update(tokenData).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${tokenData}.${signature}`;
}

/**
 * Verify JWT and return payload or null. Uses constant-time signature comparison.
 */
export function verifyJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const encodedHeader = parts[0];
  const encodedPayload = parts[1];
  const tokenSignature = parts[2];
  if (!encodedHeader || !encodedPayload || !tokenSignature) return null;

  const tokenData = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac("sha256", config.secretKey);
  const expectedSig = hmac.update(tokenData).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const sigBuf = Buffer.from(tokenSignature, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  let payload: JwtPayload;
  try {
    const decoded = base64urlDecode(encodedPayload).toString("utf8");
    payload = JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }

  if (!payload.userId || !payload.expireAt || Date.now() > payload.expireAt) {
    return null;
  }
  return payload;
}

/** @deprecated Use base64urlEncode for new code; kept for backward compatibility */
export function base64url(str: string): string {
  return base64urlEncode(str);
}
