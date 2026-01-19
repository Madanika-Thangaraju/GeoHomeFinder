import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "authToken";

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem("user_details");
};

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem("user_details", JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user_details");
  return user ? JSON.parse(user) : null;
};

// Base64Url decoder for JWT
const base64UrlDecode = (str: string) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const list = base64.padEnd(base64.length + padLen, '=');

  // Minimal polyfill for atob if needed, or assume environment supports it (Expo usually does via TextDecoder or similar, but let's be safe with manual char code ops or just use JSON.parse if payload is simple enough, but better to use a proper decode)
  // For RN without atob, we need a helper.
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  for (let bc = 0, bs = 0, buffer, i = 0;
    (buffer = list.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer),
      bc++ % 4) ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

export const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Token decoding failed", e);
    return null;
  }
};
