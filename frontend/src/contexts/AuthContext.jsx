import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchMe, login as apiLogin, signup as apiSignup } from "../api/auth";
import { TOKEN_KEY, UNAUTHORIZED_EVENT, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session: a stored 7-day JWT is validated against /auth/me.
  useEffect(() => {
    localStorage.removeItem("hobby-hub-user"); // legacy mock key
    let cancelled = false;
    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        // 401 auto-clears the token in the API client; just drop the session.
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Backend 401 (expired/invalid token) -> auto-logout everywhere.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async ({ username, name, email, password }) => {
    const data = await apiSignup({ username, name, email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await fetchMe();
    setUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: getToken(),
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { TOKEN_KEY };
