import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE = "kaizen_landing_admin";

function hashToken() {
  return crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD || "")
    .digest("hex");
}

export function setAdminSession() {
  cookies().set(ADMIN_COOKIE, hashToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam
  });
}

export function isAdminSession() {
  const cookieValue = cookies().get(ADMIN_COOKIE)?.value;
  if (!cookieValue) return false;
  return cookieValue === hashToken();
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE);
}

export function verifyAdminPassword(password) {
  if (!process.env.ADMIN_PASSWORD) return false;
  return password === process.env.ADMIN_PASSWORD;
}
