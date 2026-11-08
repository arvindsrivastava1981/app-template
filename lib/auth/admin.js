import { db } from "../core/db";
import { hashPassword } from "./password";

export async function isAdmin(userId) {
  if (!userId) return false;
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === "admin";
  } catch (err) {
    console.error("[auth] isAdmin check failed:", err.message);
    return false;
  }
}

export async function getAdminUser(userId) {
  if (!userId) return null;
  try {
    const user = await db.user.findUnique({
      where: { id: userId, role: "admin" },
      select: { id: true, email: true, full_name: true, role: true, created_at: true },
    });
    return user || null;
  } catch (err) {
    console.error("[auth] getAdminUser failed:", err.message);
    return null;
  }
}

export async function grantAdmin(userId) {
  if (!userId) return false;
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: "admin" },
    });
    return true;
  } catch (err) {
    console.error("[auth] grantAdmin failed:", err.message);
    return false;
  }
}

export async function revokeAdmin(userId) {
  if (!userId) return false;
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: null },
    });
    return true;
  } catch (err) {
    console.error("[auth] revokeAdmin failed:", err.message);
    return false;
  }
}

export async function listUsers() {
  try {
    const rows = await db.user.findMany({
      select: { id: true, email: true, full_name: true, role: true, created_at: true, updated_at: true },
      orderBy: { created_at: "desc" },
    });
    return rows;
  } catch (err) {
    console.error("[auth] listUsers failed:", err.message);
    return [];
  }
}

export async function createUser({ email, password, fullName, role = "user" }) {
  if (!email || !password || !fullName) return { ok: false, error: "Missing required fields." };
  try {
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return { ok: false, error: "An account with that email already exists." };
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    await db.user.create({
      data: {
        id: userId,
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role,
      },
    });

    return { ok: true, userId };
  } catch (err) {
    console.error("[auth] createUser failed:", err.message);
    return { ok: false, error: "Could not create user." };
  }
}

export async function updateUser(userId, { email, fullName, role }) {
  if (!userId) return { ok: false, error: "Missing user ID." };
  try {
    const data = {};
    if (email !== undefined) data.email = email;
    if (fullName !== undefined) data.full_name = fullName;
    if (role !== undefined) data.role = role;

    if (Object.keys(data).length === 0) {
      return { ok: false, error: "No fields to update." };
    }

    await db.user.update({
      where: { id: userId },
      data,
    });
    return { ok: true };
  } catch (err) {
    console.error("[auth] updateUser failed:", err.message);
    return { ok: false, error: "Could not update user." };
  }
}

export async function deleteUser(userId) {
  if (!userId) return { ok: false, error: "Missing user ID." };
  try {
    await db.user.delete({
      where: { id: userId },
    });
    return { ok: true };
  } catch (err) {
    console.error("[auth] deleteUser failed:", err.message);
    return { ok: false, error: "Could not delete user." };
  }
}