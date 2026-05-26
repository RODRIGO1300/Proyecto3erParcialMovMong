import { Platform } from "react-native";

const LOCAL_API_HOST = Platform.select({
  android: "192.168.1.86",
  default: "localhost",
});

export const API_BASE_URL = `http://${LOCAL_API_HOST}:4000/api`;
