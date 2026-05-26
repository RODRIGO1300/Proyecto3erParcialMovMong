import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import EmptyState from "../../components/EmptyState";
import { API_BASE_URL } from "../../config/api";
import { CLUB_THEME } from "../../theme/clubTheme";

const getItemId = (item) => item?._id ?? item?.id;

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

export default function ResourceCrudScreen({ config }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(config.emptyValues);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const endpoint = `${API_BASE_URL}/${config.resource}`;
  const isEditing = Boolean(editingItem);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) =>
        config.getTitle(a).localeCompare(config.getTitle(b), "es")
      ),
    [config, items]
  );

  const loadItems = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        setErrorMessage("");

        const data = await requestJson(endpoint);
        if (!Array.isArray(data)) {
          throw new Error("La API no regreso una lista valida.");
        }

        setItems(data);
      } catch (error) {
        setErrorMessage(error.message || "No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const updateFormValue = (key, value) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const resetForm = () => {
    setEditingItem(null);
    setForm(config.emptyValues);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems(false);
    setRefreshing(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm(config.toFormValues(item));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = config.toPayload(form);
      const itemId = getItemId(editingItem);
      const url = isEditing ? `${endpoint}/${itemId}` : endpoint;
      const method = isEditing ? "PATCH" : "POST";

      await requestJson(url, {
        method,
        body: JSON.stringify(payload),
      });

      Alert.alert(
        config.title,
        isEditing ? "Registro actualizado correctamente." : "Registro creado correctamente."
      );
      resetForm();
      await loadItems(false);
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message || "Revisa los datos capturados.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item) => {
    const itemId = getItemId(item);

    Alert.alert(config.title, `Deseas eliminar "${config.getTitle(item)}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await requestJson(`${endpoint}/${itemId}`, { method: "DELETE" });
            if (getItemId(editingItem) === itemId) {
              resetForm();
            }
            await loadItems(false);
          } catch (error) {
            Alert.alert("No se pudo eliminar", error.message || "Intentalo de nuevo.");
          }
        },
      },
    ]);
  };

  const renderField = (field) => {
    if (field.type === "boolean") {
      return (
        <View key={field.key} style={styles.switchRow}>
          <Text style={styles.label}>{field.label}</Text>
          <Switch
            value={Boolean(form[field.key])}
            onValueChange={(value) => updateFormValue(field.key, value)}
            trackColor={{ false: "#cbd5e1", true: CLUB_THEME.brandPrimary.softBlue }}
            thumbColor={
              form[field.key] ? CLUB_THEME.brandPrimary.blue : CLUB_THEME.neutral.card
            }
          />
        </View>
      );
    }

    return (
      <View key={field.key} style={styles.fieldGroup}>
        <Text style={styles.label}>{field.label}</Text>
        <TextInput
          value={String(form[field.key] ?? "")}
          onChangeText={(value) => updateFormValue(field.key, value)}
          placeholder={field.placeholder}
          placeholderTextColor="#7c879f"
          style={[styles.input, field.multiline && styles.multilineInput]}
          multiline={field.multiline}
          keyboardType={field.type === "number" ? "decimal-pad" : "default"}
          autoCapitalize={field.autoCapitalize ?? "sentences"}
          secureTextEntry={field.secureTextEntry}
        />
      </View>
    );
  };

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formEyebrow}>{isEditing ? "Editando" : "Nuevo registro"}</Text>
      <Text style={styles.formTitle}>{config.title}</Text>

      {config.fields.map(renderField)}

      <View style={styles.formActions}>
        {isEditing && (
          <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const image = config.getImage?.(item);

    return (
      <View style={styles.itemCard}>
        {!!image && <Image source={{ uri: image }} style={styles.itemImage} />}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{config.getTitle(item)}</Text>
          <Text style={styles.itemSubtitle}>{config.getSubtitle(item)}</Text>

          <View style={styles.itemActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={CLUB_THEME.brandPrimary.blue} />
        <Text style={styles.loaderText}>Cargando {config.title.toLowerCase()}...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <ScrollView
        contentContainerStyle={styles.errorContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[CLUB_THEME.brandPrimary.blue, CLUB_THEME.brandPrimary.garnet]}
          />
        }
      >
        {renderForm()}
        <EmptyState
          title="No se pudo cargar"
          message={errorMessage}
          actionLabel="Reintentar"
          onAction={() => loadItems()}
        />
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={sortedItems}
      keyExtractor={(item) => String(getItemId(item))}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <>
          {renderForm()}
          <Text style={styles.listTitle}>Registros guardados</Text>
        </>
      }
      ListEmptyComponent={
        <EmptyState
          title={`Sin ${config.title.toLowerCase()}`}
          message="Crea el primer registro desde el formulario superior."
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[CLUB_THEME.brandPrimary.blue, CLUB_THEME.brandPrimary.garnet]}
          tintColor={CLUB_THEME.brandPrimary.blue}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CLUB_THEME.neutral.page,
  },
  loaderText: {
    marginTop: 10,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  errorContent: {
    padding: 14,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  listContent: {
    padding: 14,
    paddingBottom: 28,
    backgroundColor: CLUB_THEME.neutral.page,
  },
  formCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#c9d6ee",
    backgroundColor: CLUB_THEME.neutral.card,
  },
  formEyebrow: {
    color: CLUB_THEME.brandPrimary.garnet,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  formTitle: {
    marginTop: 4,
    marginBottom: 12,
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 19,
    fontWeight: "900",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 5,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CLUB_THEME.neutral.border,
    backgroundColor: "#f8fafc",
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 4,
  },
  formActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.electricBlue,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: CLUB_THEME.brandSecondary.softBlue,
  },
  secondaryButtonText: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 14,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.65,
  },
  listTitle: {
    marginBottom: 10,
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  itemCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: CLUB_THEME.neutral.border,
    backgroundColor: CLUB_THEME.neutral.card,
  },
  itemImage: {
    width: 72,
    height: 72,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: CLUB_THEME.neutral.textPrimary,
    fontSize: 15,
    fontWeight: "900",
  },
  itemSubtitle: {
    marginTop: 5,
    color: CLUB_THEME.neutral.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: CLUB_THEME.brandPrimary.softBlue,
  },
  editButtonText: {
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 12,
    fontWeight: "900",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "900",
  },
});
