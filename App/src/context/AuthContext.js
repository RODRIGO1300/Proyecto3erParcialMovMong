import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "../config/api";

const SESSION_STORAGE_KEY = "@shop_app_session";
const USERS_URL = `${API_BASE_URL}/users`;

const AuthContext = createContext(null);

const normalizeUser = (user) => ({
  ...user,
  id: user.id ?? user._id,
  role: user.role ?? "cliente",
});

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message;
    throw new Error(message || "La operacion no se pudo completar.");
  }

  return data;
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const loadUsers = async () => {
    const data = await requestJson(USERS_URL);
    const normalizedUsers = Array.isArray(data) ? data.map(normalizeUser) : [];
    setUsers(normalizedUsers);
    return normalizedUsers;
  };

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [loadedUsers, storedSession] = await Promise.all([
          loadUsers(),
          AsyncStorage.getItem(SESSION_STORAGE_KEY),
        ]);

        if (storedSession) {
          const parsedSession = normalizeUser(JSON.parse(storedSession));
          const matchedUser = loadedUsers.find((user) => user.id === parsedSession.id);
          setCurrentUser(matchedUser ?? parsedSession);
        }
      } catch (error) {
        setUsers([]);
        setCurrentUser(null);
      } finally {
        setIsReady(true);
      }
    };

    loadAuthState();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const user = normalizeUser(
        await requestJson(`${USERS_URL}/login`, {
          method: "POST",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password.trim(),
          }),
        })
      );

      setCurrentUser(user);
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      await loadUsers();

      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: error.message || "Correo o contrasena incorrectos" };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const user = normalizeUser(
        await requestJson(USERS_URL, {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: "cliente",
          }),
        })
      );

      await loadUsers();
      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: error.message || "No se pudo registrar el usuario" };
    }
  };

  const updateUser = async ({ userId, name, email, password }) => {
    try {
      const currentRole = currentUser?.role ?? "cliente";
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: currentRole,
      };

      if (password?.trim()) {
        payload.password = password.trim();
      }

      const updatedUser = normalizeUser(
        await requestJson(`${USERS_URL}/${userId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      );

      setCurrentUser(updatedUser);
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
      await loadUsers();

      return { ok: true, user: updatedUser };
    } catch (error) {
      return { ok: false, message: error.message || "No se pudo actualizar el usuario" };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isReady,
      login,
      register,
      updateUser,
      logout,
      refreshUsers: loadUsers,
    }),
    [users, currentUser, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
