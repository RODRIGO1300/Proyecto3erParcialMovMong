import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

const USERS_URL = `${API_BASE_URL}/users`;

const AuthContext = createContext(null);

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    id: String(user.id ?? user._id ?? ""),
  };
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(true);

  const refreshUsers = async () => {
    try {
      const response = await fetch(USERS_URL);
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const normalizedUsers = Array.isArray(data) ? data.map(normalizeUser) : [];
      setUsers(normalizedUsers);
      return normalizedUsers;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${USERS_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { ok: false, message: data?.message ?? "Correo o contrasena incorrectos" };
      }

      const normalizedUser = normalizeUser(data);
      setCurrentUser(normalizedUser);
      return { ok: true, user: normalizedUser };
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await fetch(USERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role: "customer",
        }),
      });

      const data = await response.json();
      if (!response.ok || data?.message) {
        return { ok: false, message: data?.message ?? "No se pudo registrar el usuario" };
      }

      const normalizedUser = normalizeUser(data);
      setUsers((currentUsers) => [normalizedUser, ...currentUsers]);
      return { ok: true, user: normalizedUser };
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }
  };

  const updateUser = async ({ userId, name, email, password }) => {
    try {
      const userToUpdate = users.find((user) => user.id === userId) ?? currentUser;

      const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password?.trim() ? password.trim() : userToUpdate?.password ?? "",
          role: userToUpdate?.role ?? "customer",
        }),
      });

      const data = await response.json();
      if (!response.ok || data?.message) {
        return { ok: false, message: data?.message ?? "No se pudo actualizar el perfil" };
      }

      const refreshedUsers = await refreshUsers();
      const updatedUser =
        refreshedUsers.find((user) => user.id === userId) ??
        normalizeUser({
          ...userToUpdate,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password?.trim() ? password.trim() : userToUpdate?.password,
        });

      setCurrentUser(updatedUser);
      return { ok: true, user: updatedUser };
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
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
      refreshUsers,
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
