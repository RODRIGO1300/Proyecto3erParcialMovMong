import React from "react";

import ResourceCrudScreen from "./ResourceCrudScreen";

const emptyValues = {
  name: "",
  email: "",
  password: "",
  role: "cliente",
};

const config = {
  title: "Usuarios",
  resource: "users",
  emptyValues,
  fields: [
    { key: "name", label: "Nombre", placeholder: "Nombre completo" },
    { key: "email", label: "Correo", placeholder: "correo@dominio.com", autoCapitalize: "none" },
    { key: "password", label: "Contrasena", placeholder: "Minimo 4 caracteres", secureTextEntry: true },
    { key: "role", label: "Rol", placeholder: "cliente" },
  ],
  toFormValues: (item) => ({
    name: item.name ?? "",
    email: item.email ?? "",
    password: item.password ?? "",
    role: item.role ?? "cliente",
  }),
  toPayload: (form) => ({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password.trim(),
    role: form.role.trim() || "cliente",
  }),
  getTitle: (item) => item.name ?? "Usuario sin nombre",
  getSubtitle: (item) => `${item.email ?? "Sin correo"} - ${item.role ?? "sin rol"}`,
};

export default function UsersAdminScreen() {
  return <ResourceCrudScreen config={config} />;
}
