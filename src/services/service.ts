import { RegisterUserPayload } from "../../src/types/tenant.types";
import { getToken, removeToken, saveToken } from "../utils/auth";

const BASE_URL = "http://192.168.29.39:3000";

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
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  // ✅ SAVE TOKEN USING HELPER
  await saveToken(result.token);

  return result;
};


// ==================== OPTIONAL: LOGOUT ====================
export const logoutUser = async () => {
  try {
    // 🔥 Remove JWT token
    await removeToken();

    console.log("User logged out successfully");
    return { success: true };
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    throw new Error("Failed to logout user");
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


export const addProperty = async (data: any) => {
  const token = await getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${BASE_URL}/properties/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add property");
  }

  return result;
};



export const tenantProperties = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/tenants/all/properties`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch properties");
  }

  return result.data; 
};
