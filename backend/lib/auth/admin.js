import { db } from "../core/db";

export async function isAdmin(userId) {
  if (!userId) return false;
  try {
    const [user] = await db()`
      SELECT is_admin, role FROM users WHERE id = ${userId} LIMIT 1
    `;
    return Boolean(user?.is_admin || user?.role === "admin");
  } catch (err) {
    console.error("[auth] isAdmin check failed:", err.message);
    return false;
  }
}

export async function getAdminUser(userId) {
  if (!userId) return null;
  try {
    const [user] = await db()`
      SELECT id, email, full_name, is_admin, role, created_at
      FROM users
      WHERE id = ${userId} AND (is_admin = true OR role = 'admin')
      LIMIT 1
    `;
    return user || null;
  } catch (err) {
    console.error("[auth] getAdminUser failed:", err.message);
    return null;
  }
}

export async function grantAdmin(userId, role = "admin") {
  if (!userId) return false;
  try {
    await db()`
      UPDATE users
      SET is_admin = true, role = ${role}, updated_at = NOW()
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
      SET is_admin = false, role = NULL, updated_at = NOW()
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
      SELECT id, email, full_name, is_admin, role, is_email_verified, last_login_at, created_at, updated_at
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
      INSERT INTO users (id, email, password_hash, full_name, role, is_admin, is_email_verified, created_at, updated_at)
      VALUES (${userId}, ${email}, ${passwordHash}, ${fullName}, ${role}, ${role === "admin"}, true, NOW(), NOW())
    `;

    return { ok: true, userId };
  } catch (err) {
    console.error("[auth] createUser failed:", err.message);
    return { ok: false, error: "Could not create user." };
  }
}

export async function updateUser(userId, { email, fullName, role, isAdmin }) {
  if (!userId) return { ok: false, error: "Missing user ID." };
  try {
    const updates = [];
    if (email !== undefined) updates.push(`email = ${email}`);
    if (fullName !== undefined) updates.push(`full_name = ${fullName}`);
    if (role !== undefined) {
      updates.push(`role = ${role}`);
      updates.push(`is_admin = ${role === "admin"}`);
    }
    if (isAdmin !== undefined) {
      updates.push(`is_admin = ${isAdmin}`);
      if (isAdmin && !role) updates.push(`role = 'admin'`);
      if (!isAdmin) updates.push(`role = NULL`);
    }
    updates.push(`updated_at = NOW()`);

    if (updates.length === 0) {
      return { ok: false, error: "No fields to update." };
    }

    await db()`
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = ${userId}
    `;
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