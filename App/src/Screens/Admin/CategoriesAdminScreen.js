import React from "react";

import ResourceCrudScreen from "./ResourceCrudScreen";

const emptyValues = {
  name: "",
  description: "",
  image: "",
};

const config = {
  title: "Categorias",
  resource: "categories",
  emptyValues,
  fields: [
    { key: "name", label: "Nombre", placeholder: "Accesorios" },
    { key: "description", label: "Descripcion", placeholder: "Descripcion de la categoria", multiline: true },
    { key: "image", label: "Imagen URL", placeholder: "https://..." },
  ],
  toFormValues: (item) => ({
    name: item.name ?? "",
    description: item.description ?? "",
    image: item.image ?? "",
  }),
  toPayload: (form) => ({
    name: form.name.trim(),
    description: form.description.trim(),
    image: form.image.trim(),
  }),
  getTitle: (item) => item.name ?? "Categoria sin nombre",
  getSubtitle: (item) => item.description ?? "Sin descripcion",
  getImage: (item) => item.image,
};

export default function CategoriesAdminScreen() {
  return <ResourceCrudScreen config={config} />;
}
