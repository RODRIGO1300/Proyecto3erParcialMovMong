import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { CLUB_THEME } from "../theme/clubTheme";

export default function ProfileScreen() {
  const { currentUser, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPassword("");
    }
  }, [currentUser]);

  const handleLogout = () => {
    Alert.alert("Cerrar sesion", "Deseas salir de la cuenta actual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Campos incompletos", "Nombre y correo son obligatorios.");
      return;
    }

    const result = await updateUser({
      userId: currentUser.id,
      name,
      email,
      password,
    });

    if (!result.ok) {
      Alert.alert("No se pudo guardar", result.message);
      return;
    }

    setPassword("");
    setIsEditing(false);
    Alert.alert("Perfil actualizado", "Tus datos se guardaron correctamente.");
  };

  const handleCancelEdit = () => {
    setName(currentUser?.name ?? "");
    setEmail(currentUser?.email ?? "");
    setPassword("");
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <EmptyState
        title="Sin sesion activa"
        message="Inicia sesion para ver tu informacion."
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.badge}>Cuenta activa</Text>
        <Image
          source={require("../images/Icono.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.sectionTitle}>Usuario actual</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nombre</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre completo"
              placeholderTextColor="#6b7280"
            />
          ) : (
            <Text style={styles.value}>{currentUser.name}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Correo</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electronico"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{currentUser.email}</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.row}>
            <Text style={styles.label}>Nueva contrasena</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Deja vacio para conservar la actual"
              placeholderTextColor="#6b7280"
              secureTextEntry
            />
          </View>
        )}

        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelEdit}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Editar datos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  card: {
    padding: 18,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#cfdaf0",
  },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: CLUB_THEME.brandPrimary.softGarnet,
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sectionTitle: {
    alignSelf: "center",
    marginBottom: 16,
    color: CLUB_THEME.brandSecondary.royalBlue,
    fontSize: 18,
    fontWeight: "800",
  },
  logo: {
    width: 96,
    height: 96,
    alignSelf: "center",
    marginBottom: 12,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 4,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#f8fafc",
    color: CLUB_THEME.neutral.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CLUB_THEME.neutral.border,
    fontSize: 15,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.softBlue,
  },
  secondaryButtonText: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 14,
    fontWeight: "800",
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  editButton: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  logoutButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
