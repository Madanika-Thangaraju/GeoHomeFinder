import { RegisterUserPayload } from "../../src/types/tenant.types";

const BASE_URL = "http://192.168.7.12:3000";

// ==================== REGISTER USER ====================
export const registerUser = async (data: RegisterUserPayload) => {
  console.log('Registering user...');
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("REGISTER API RESULT:", result);

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error: any) {
    console.log("REGISTER NETWORK ERROR:", error);
    throw error;
  }
};

// ==================== LOGIN USER ====================
interface LoginPayload {
  identifier: string; // Can be email or phone
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
}

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  console.log('Logging in user...');
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("LOGIN API RESULT:", result);

    if (!response.ok) {
      // Handle specific error messages from backend
      if (response.status === 401) {
        throw new Error("Invalid credentials. Please check your email/phone and password.");
      }
      throw new Error(result.message || "Login failed");
    }

    // Store token in AsyncStorage or SecureStore if needed
    if (result.token) {
      // Example: await AsyncStorage.setItem('authToken', result.token);
      console.log("Token received:", result.token);
    }

    return result;
  } catch (error: any) {
    console.log("LOGIN NETWORK ERROR:", error);
    
    // Handle network errors
    if (error.message === "Network request failed") {
      throw new Error("Unable to connect to server. Please check your internet connection.");
    }
    
    throw error;
  }
};

// ==================== OPTIONAL: LOGOUT ====================
export const logoutUser = async () => {
  try {
    // Clear stored token
    // await AsyncStorage.removeItem('authToken');
    console.log("User logged out");
    return { success: true };
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    throw error;
  }
};

// ==================== OPTIONAL: GET CURRENT USER ====================
export const getCurrentUser = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get user data");
    }

    return result;
  } catch (error: any) {
    console.log("GET USER ERROR:", error);
    throw error;
  }
};