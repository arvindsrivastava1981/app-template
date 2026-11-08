import { db } from "../core/db";
import { hashPassword } from "./password";

export async function isAdmin(userId) {
  if (!userId) return false;
  try {
    const [user] = await db()`
      SELECT role FROM users WHERE id = ${userId} LIMIT 1
    `;
    return user?.role === "admin";
  } catch (err) {
    console.error("[auth] isAdmin check failed:", err.message);
    return false;
  }
}

export async function getAdminUser(userId) {
  if (!userId) return null;
  try {
    const [user] = await db()`
      SELECT id, email, full_name, role, created_at
      FROM users
      WHERE id = ${userId} AND role = 'admin'
      LIMIT 1
    `;
    return user || null;
  } catch (err) {
    console.error("[auth] getAdminUser failed:", err.message);
    return null;
  }
}

export async function grantAdmin(userId) {
  if (!userId) return false;
  try {
    await db()`
      UPDATE users
      SET role = 'admin', updated_at = NOW()
      WHERE id = ${userId}
    `;
    return true;
  } catch (err) {
    console.error("[auth] grantAdmin failed:", err.message);
    return false;
  }
}

export async function revokeAdmin(userId) {
  if (!userId) return false;
  try {
    await db()`
      UPDATE users
      SET role = NULL, updated_at = NOW()
      WHERE id = ${userId}
    `;
    return true;
  } catch (err) {
    console.error("[auth] revokeAdmin failed:", err.message);
    return false;
  }
}

export async function listUsers() {
  try {
    const rows = await db()`
      SELECT id, email, full_name, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (err) {
    console.error("[auth] listUsers failed:", err.message);
    return [];
  }
}

export async function createUser({ email, password, fullName, role = "user" }) {
  if (!email || !password || !fullName) return { ok: false, error: "Missing required fields." };
  try {
    const existing = await db()`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existing.length) {
      return { ok: false, error: "An account with that email already exists." };
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    await db()`
      INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
      VALUES (${userId}, ${email}, ${passwordHash}, ${fullName}, ${role}, NOW(), NOW())
    `;

    return { ok: true, userId };
  } catch (err) {
    console.error("[auth] createUser failed:", err.message);
    return { ok: false, error: "Could not create user." };
  }
}

export async function updateUser(userId, { email, fullName, role }) {
  if (!userId) return { ok: false, error: "Missing user ID." };
  try {
    if (email !== undefined && fullName !== undefined && role !== undefined) {
      await db()`UPDATE users SET email = ${email}, full_name = ${fullName}, role = ${role}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (email !== undefined && fullName !== undefined) {
      await db()`UPDATE users SET email = ${email}, full_name = ${fullName}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (email !== undefined && role !== undefined) {
      await db()`UPDATE users SET email = ${email}, role = ${role}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (fullName !== undefined && role !== undefined) {
      await db()`UPDATE users SET full_name = ${fullName}, role = ${role}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (email !== undefined) {
      await db()`UPDATE users SET email = ${email}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (fullName !== undefined) {
      await db()`UPDATE users SET full_name = ${fullName}, updated_at = NOW() WHERE id = ${userId}`;
    } else if (role !== undefined) {
      await db()`UPDATE users SET role = ${role}, updated_at = NOW() WHERE id = ${userId}`;
    } else {
      return { ok: false, error: "No fields to update." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[auth] updateUser failed:", err.message);
    return { ok: false, error: "Could not update user." };
  }
}

export async function deleteUser(userId) {
  if (!userId) return { ok: false, error: "Missing user ID." };
  try {
    await db()`
      DELETE FROM users WHERE id = ${userId}
    `;
    return { ok: true };
  } catch (err) {
    console.error("[auth] deleteUser failed:", err.message);
    return { ok: false, error: "Could not delete user." };
  }
}