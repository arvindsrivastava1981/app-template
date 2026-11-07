import { readSession } from "./session";
import { db } from "../core/db";
import { requestCache } from "../core/request-cache";

export async function getCurrentUser() {
  return requestCache("currentUser", async () => {
    const session = await readSession();
    if (!session) return null;

    try {
      const [user] = await db()`
        SELECT id, email, full_name, role
        FROM users WHERE id = ${session.userId} LIMIT 1
      `;
      if (!user) return null;

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role || "user",
          is_admin: Boolean(user.role === "admin"),
        },
        session,
      };
    } catch (err) {
      console.error("[auth] getCurrentUser failed:", err.message);
      return null;
    }
  });
}