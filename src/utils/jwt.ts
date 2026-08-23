import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

function getSecret(name: string): string {
  const secret = process.env[name];

  if (!secret) {
    // Provide a fallback secret if they forgot to set it on Railway
    return name === "JWT_REFRESH_SECRET" 
      ? "fallback_refresh_secret_for_railway" 
      : "fallback_jwt_secret_for_railway";
  }

  return secret;
}

export function signToken(
  payload: object,
  expiresIn?: SignOptions["expiresIn"],
): string {
  const secret = getSecret("JWT_SECRET");
  return jwt.sign(payload, secret, expiresIn === undefined ? {} : { expiresIn });
}

export function verifyToken<T extends JwtPayload = JwtPayload>(token: string): T {
  return jwt.verify(token, getSecret("JWT_SECRET")) as T;
}

export function signRefreshToken(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string {
  return jwt.sign(payload, getSecret("JWT_REFRESH_SECRET"), { expiresIn });
}

export function verifyRefreshToken<T extends JwtPayload = JwtPayload>(token: string): T {
  return jwt.verify(token, getSecret("JWT_REFRESH_SECRET")) as T;
}
