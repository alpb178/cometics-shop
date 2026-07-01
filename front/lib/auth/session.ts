export const SESSION_COOKIE = "iris_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  };
}
