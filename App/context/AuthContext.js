import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_STORAGE_KEY = "@shop_app_users";
const SESSION_STORAGE_KEY = "@shop_app_session";

const DEFAULT_USERS = [
  { id: "1", name: "Alan Castillo", email: "alan@gmail.com", password: "1234" },
  { id: "2", name: "Rodrigo Hernandez", email: "rodrigo@gmail.com", password: "5678" },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [storedUsers, storedSession] = await Promise.all([
          AsyncStorage.getItem(USERS_STORAGE_KEY),
          AsyncStorage.getItem(SESSION_STORAGE_KEY),
        ]);

        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
        setUsers(parsedUsers);

        if (!storedUsers) {
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsedUsers));
        }

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          const matchedUser = parsedUsers.find((user) => user.id === parsedSession.id);
          setCurrentUser(matchedUser ?? null);
        }
      } catch (error) {
        setUsers(DEFAULT_USERS);
      } finally {
        setIsReady(true);
      }
    };

    loadAuthState();
  }, []);

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const userFound = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
    );

    if (!userFound) {
      return { ok: false, message: "Correo o contrasena incorrectos" };
    }

    setCurrentUser(userFound);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userFound));

    return { ok: true, user: userFound };
  };

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (emailExists) {
      return { ok: false, message: "Ese correo ya esta en uso" };
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));

    return { ok: true, user: newUser };
  };

  const updateUser = async ({ userId, name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some(
      (user) =>
        user.id !== userId && user.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return { ok: false, message: "Ese correo ya esta en uso" };
    }

    const updatedUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            name: name.trim(),
            email: normalizedEmail,
            password: password?.trim() ? password : user.password,
          }
        : user
    );

    const updatedUser = updatedUsers.find((user) => user.id === userId) ?? null;

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    if (updatedUser) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
    }

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
