import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { CLUB_THEME } from "../../Theme/ClubTheme";

const ADMIN_ROLE = "administrator";

const MODULES = [
  {
    title: "Productos",
    description: "Crear, consultar, editar y eliminar productos de MongoDB.",
    icon: "cube",
    route: "AdminProducts",
  },
  {
    title: "Categorias",
    description: "Administrar categorias para organizar el catalogo.",
    icon: "pricetags",
    route: "AdminCategories",
  },
  {
    title: "Usuarios",
    description: "Gestionar cuentas registradas y roles basicos.",
    icon: "people",
    route: "AdminUsers",
  },
];

export default function AdminHomeScreen({ navigation }) {
  const { currentUser } = useAuth();

  if (currentUser?.role !== ADMIN_ROLE) {
    return (
      <EmptyState
        title="Acceso restringido"
        message="Solo los usuarios con rol administrator pueden administrar los CRUD."
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.badge}>CRUD MongoDB</Text>
        <Text style={styles.title}>Administracion</Text>
        <Text style={styles.subtitle}>Gestiona los modulos requeridos del proyecto.</Text>
      </View>

      {MODULES.map((module) => (
        <TouchableOpacity
          key={module.route}
          style={styles.moduleCard}
          onPress={() => navigation.navigate(module.route)}
        >
          <View style={styles.iconBox}>
            <Ionicons name={module.icon} size={24} color={CLUB_THEME.brandPrimary.blue} />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#64748b" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  header: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: CLUB_THEME.brandPrimary.blue,
  },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    color: "#dbeafe",
    fontSize: 14,
    fontWeight: "600",
  },
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: CLUB_THEME.neutral.border,
    backgroundColor: CLUB_THEME.neutral.card,
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: CLUB_THEME.brandPrimary.softBlue,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  moduleDescription: {
    marginTop: 4,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
});
