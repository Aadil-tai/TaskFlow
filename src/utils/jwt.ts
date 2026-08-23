import type { JwtPayload } from "jsonwebtoken";

export function signToken(payload: object, expiresIn?: string | number): string {
  // TODO
  throw new Error("Not implemented");
}

export function verifyToken<T extends JwtPayload = JwtPayload>(token: string): T {
  // TODO
  throw new Error("Not implemented");
}
