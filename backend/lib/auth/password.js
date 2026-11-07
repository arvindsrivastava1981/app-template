import { hash, compare } from "bcryptjs";

const ROUNDS = 10;

export function hashPassword(plain) {
  return hash(plain, ROUNDS);
}

export function verifyPassword(plain, hashed) {
  if (!hashed) return Promise.resolve(false);
  return compare(plain, hashed);
}