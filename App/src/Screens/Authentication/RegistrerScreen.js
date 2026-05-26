import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { CLUB_THEME } from "../../theme/clubTheme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Campos incompletos", "Completa todos los campos");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Contrasena invalida", "La contrasena debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contrasenas no coinciden");
      return;
    }

    const result = await register({ name, email, password });
    if (!result.ok) {
      Alert.alert("Correo ya registrado", result.message);
      return;
    }

    Alert.alert(
      "Registro exitoso",
      `Usuario ${result.user.name} registrado correctamente`,
      [
        {
          text: "Ir al login",
          onPress: () => navigation.goBack(),
        },
      ]
    );

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.background}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.badge}>Cuenta Nueva</Text>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Registrate para comenzar a comprar</Text>

          <Image
            source={require("../../images/Icono.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Correo electronico"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Contrasena"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirmar contrasena"
            placeholderTextColor="#6f7fae"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>
              Ya tienes cuenta? Inicia sesion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: CLUB_THEME.brandPrimary.blue,
  },
  decorTop: {
    position: "absolute",
    top: -120,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
    opacity: 0.4,
  },
  decorBottom: {
    position: "absolute",
    bottom: -160,
    right: -90,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: CLUB_THEME.brandPrimary.gold,
    opacity: 0.2,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  container: {
    marginHorizontal: 30,
    padding: 22,
    backgroundColor: CLUB_THEME.neutral.card,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: CLUB_THEME.brandPrimary.garnet,
  },
  badge: {
    alignSelf: "center",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
    color: CLUB_THEME.neutral.card,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 31,
    color: CLUB_THEME.brandPrimary.blue,
    textAlign: "center",
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    color: "#44507a",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f6f8ff",
    color: CLUB_THEME.neutral.textPrimary,
    padding: 14,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d6dbee",
  },
  button: {
    backgroundColor: CLUB_THEME.brandPrimary.garnet,
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
  },
  buttonText: {
    textAlign: "center",
    color: CLUB_THEME.neutral.card,
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 18,
  },
  secondaryButtonText: {
    textAlign: "center",
    color: CLUB_THEME.brandPrimary.blue,
    fontSize: 14,
    fontWeight: "700",
  },
});
