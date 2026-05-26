import { Platform } from "react-native";

const LOCAL_API_HOST = Platform.select({
  android: "172.23.90.96", // Cambia esto por la IP de tu máquina en la red local
  default: "localhost",
});

export const API_BASE_URL = `http://${LOCAL_API_HOST}:4000/api`;
