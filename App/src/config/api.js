import { Platform } from "react-native";

const LOCAL_API_HOST = Platform.select({
  android: "10.86.77.96",
  default: "localhost",
});

export const API_BASE_URL = `http://${LOCAL_API_HOST}:4000/api`;
