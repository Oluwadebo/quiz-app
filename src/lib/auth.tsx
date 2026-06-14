const TOKEN_KEY = "quiz_token";
const USER_KEY = "quiz_user";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") return localStorage.getItem(TOKEN_KEY);
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const setUser = (user: unknown) => {
  if (typeof window !== "undefined")
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  }
  return null;
};

export const isLoggedIn = (): boolean => !!getToken();

export const isAdmin = (): boolean => getUser()?.role === "admin";

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});