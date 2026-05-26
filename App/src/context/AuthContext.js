import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "../config/api";

const SESSION_STORAGE_KEY = "@shop_app_session";

const AuthContext = createContext(null);

const normalizeUser = (user) => ({
  ...user,
  id: user.id ?? user._id,
});

const getUserId = (user) => user?.id ?? user?._id;

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los usuarios del servidor");
    }

    const data = await response.json();
    const normalizedUsers = data.map(normalizeUser);
    setUsers(normalizedUsers);
    return normalizedUsers;
  };

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [apiUsers, storedSession] = await Promise.all([
          fetchUsers(),
          AsyncStorage.getItem(SESSION_STORAGE_KEY),
        ]);

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          const sessionId = getUserId(parsedSession);
          const matchedUser = apiUsers.find((user) => getUserId(user) === sessionId);
          setCurrentUser(matchedUser ?? null);
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
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      if (response.status === 401) {
        return { ok: false, message: "Correo o contrasena incorrectos" };
      }

      if (!response.ok) {
        return { ok: false, message: "No se pudo iniciar sesion" };
      }

      const userFound = normalizeUser(await response.json());

      setCurrentUser(userFound);
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userFound));

      return { ok: true, user: userFound };
    } catch (error) {
      return {
        ok: false,
        message: `No se pudo conectar con ${API_BASE_URL}. Detalle: ${error.message}`,
      };
    }
  };

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    let apiUsers = users;

    try {
      apiUsers = await fetchUsers();
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }

    const emailExists = apiUsers.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (emailExists) {
      return { ok: false, message: "Ese correo ya esta en uso" };
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "customer",
      }),
    });

    if (!response.ok) {
      return { ok: false, message: "No se pudo registrar el usuario" };
    }

    const newUser = normalizeUser(await response.json());
    setUsers((currentUsers) => [...currentUsers, newUser]);

    return { ok: true, user: newUser };
  };

  const updateUser = async ({ userId, name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    let apiUsers = users;

    try {
      apiUsers = await fetchUsers();
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }

    const emailExists = apiUsers.some(
      (user) =>
        getUserId(user) !== userId && user.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return { ok: false, message: "Ese correo ya esta en uso" };
    }

    const currentPassword = currentUser?.password ?? "";
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: normalizedEmail,
        password: password?.trim() ? password : currentPassword,
        role: currentUser?.role ?? "customer",
      }),
    });

    if (!response.ok) {
      return { ok: false, message: "No se pudo actualizar el usuario" };
    }

    const updatedUser = {
      ...currentUser,
      id: userId,
      _id: currentUser?._id ?? userId,
      name: name.trim(),
      email: normalizedEmail,
      password: password?.trim() ? password : currentPassword,
      role: currentUser?.role ?? "customer",
    };

    setUsers((currentUsers) =>
      currentUsers.map((user) => (getUserId(user) === userId ? updatedUser : user))
    );
    setCurrentUser(updatedUser);

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

    return { ok: true, user: updatedUser };
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
