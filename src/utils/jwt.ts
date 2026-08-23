import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

function getSecret(name: string): string {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is not configured`);
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
