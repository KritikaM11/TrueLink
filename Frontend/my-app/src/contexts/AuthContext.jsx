import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi } from "../api/index.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user,        setUser]        = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [error,       setError]       = useState(null);

    const login = useCallback(async ({ username, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login({ username, password });
            const loggedUser = { username, name: data.name || username, token: data.token };
            setUser(loggedUser);
            localStorage.setItem("tl_user", JSON.stringify(loggedUser));
            return { success: true };
        } catch (err) {
            const msg =
                err.status === 404 ? "No account found with that username." :
                err.status === 401 ? "Incorrect password. Please try again." :
                err.message || "Login failed. Please try again.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async ({ fullName, username, password }) => {
        setLoading(true);
        setError(null);
        try {
            await authApi.register({ name: fullName, username, password });
            return await login({ username, password });
        } catch (err) {
            const msg =
                err.status === 302 ? "Username is already taken. Please choose another." :
                err.message || "Registration failed. Please try again.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, [login]);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        localStorage.removeItem("tl_user");
    }, []);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const saved = localStorage.getItem("tl_user");
                if (!saved) return;

                const parsed = JSON.parse(saved);
                if (!parsed?.token) { localStorage.removeItem("tl_user"); return; }

                const data = await authApi.verify();
                setUser({ username: data.username, name: data.name, token: parsed.token });
            } catch {
                localStorage.removeItem("tl_user");
            } finally {
                setAuthLoading(false);
            }
        };
        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, authLoading, error, signup, login, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};