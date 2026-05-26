import React from "react";

import ResourceCrudScreen from "./ResourceCrudScreen";

const emptyValues = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  ratingRate: "0",
  ratingCount: "0",
  seller: "",
  isLocal: true,
};

const config = {
  title: "Productos",
  resource: "products",
  emptyValues,
  fields: [
    { key: "title", label: "Titulo", placeholder: "Nombre del producto" },
    { key: "price", label: "Precio", placeholder: "129.99", type: "number" },
    { key: "description", label: "Descripcion", placeholder: "Detalles del producto", multiline: true },
    { key: "category", label: "Categoria", placeholder: "coleccion local" },
    { key: "image", label: "Imagen URL", placeholder: "https://..." },
    { key: "ratingRate", label: "Calificacion", placeholder: "4.8", type: "number" },
    { key: "ratingCount", label: "Opiniones", placeholder: "24", type: "number" },
    { key: "seller", label: "Vendedor", placeholder: "Tienda Universitaria" },
    { key: "isLocal", label: "Producto local", type: "boolean" },
  ],
  toFormValues: (item) => ({
    title: item.title ?? "",
    price: String(item.price ?? ""),
    description: item.description ?? "",
    category: item.category ?? "",
    image: item.image ?? "",
    ratingRate: String(item.rating?.rate ?? ""),
    ratingCount: String(item.rating?.count ?? ""),
    seller: item.seller ?? "",
    isLocal: Boolean(item.isLocal),
  }),
  toPayload: (form) => ({
    title: form.title.trim(),
    price: Number(form.price),
    description: form.description.trim(),
    category: form.category.trim(),
    image: form.image.trim(),
    rating: {
      rate: Number(form.ratingRate),
      count: Number(form.ratingCount),
    },
    seller: form.seller.trim(),
    isLocal: Boolean(form.isLocal),
  }),
  getTitle: (item) => item.title ?? "Producto sin titulo",
  getSubtitle: (item) => `${item.category ?? "Sin categoria"} - $${Number(item.price ?? 0).toFixed(2)}`,
  getImage: (item) => item.image,
};

export default function ProductsAdminScreen() {
  return <ResourceCrudScreen config={config} />;
}
