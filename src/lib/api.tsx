const BACKEND_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export const API_URLS = {
  base: BACKEND_URL,
  auth: `${BACKEND_URL}/auth`,
  courses: `${BACKEND_URL}/courses`,
  sessions: `${BACKEND_URL}/sessions`,
  leaderboard: `${BACKEND_URL}/leaderboard`,
  admin: `${BACKEND_URL}/admin`,
  settings: `${BACKEND_URL}/settings`,
};

export default BACKEND_URL;