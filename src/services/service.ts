import { RegisterUserPayload } from "../../src/types/tenant.types";
import { getToken, removeToken, saveToken, saveUser } from "../utils/auth";

const BASE_URL = "http://192.168.29.40:3000";

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
  // Save user details
  if (result.user) {
    await saveUser(result.user);
  }

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

export const updateProperty = async (id: number | string, data: any) => {
  const token = await getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update property");
  }

  return result;
};

export const deleteProperty = async (id: number | string) => {
  const token = await getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete property");
  }

  return result;
};



export const tenantProperties = async (lat?: number, lng?: number, radius?: number, filters?: any) => {
  const token = await getToken();

  let url = `${BASE_URL}/tenants/all/properties`;
  const params = new URLSearchParams();

  if (lat) params.append("lat", lat.toString());
  if (lng) params.append("lng", lng.toString());
  if (radius) params.append("radius", radius.toString());

  if (filters) {
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.propertyType) params.append("propertyType", filters.propertyType);
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
    if (filters.listingType) params.append("listingType", filters.listingType);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
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

export const getProperty = async (id: number | string) => {
  const token = await getToken();

  try {
    const allProperties = await tenantProperties();
    if (allProperties && Array.isArray(allProperties)) {
      const property = allProperties.find((p: any) => p.id.toString() === id.toString());
      if (property) return property;
    }

    return null;
  } catch (error) {
    console.log("Error fetching property, using local data:", error);
    return null;
  }
};

// ==================== OWNER LISTINGS ====================
export const getOwnerProperties = async (userId: number | string) => {
  const token = await getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  // Matching API route as requested: pass logged in user id
  const response = await fetch(`${BASE_URL}/owners/listings/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch owner properties");
  }

  return result.data; // Assuming backend returns { data: [...] } like tenantProperties
};


// ---------- Helper ----------
const authHeaders = async () => {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ---------- Profile ----------
export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/owners/profile`, {
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const updateProfile = async (payload: {
  name: string;
  phone: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}) => {
  const res = await fetch(`${BASE_URL}/owners/profile`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const togglePushNotification = async () => {
  const res = await fetch(`${BASE_URL}/owners/notifications`, {
    method: "PATCH",
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to update notifications");
  return res.json();
};

// ==================== CHAT SERVICES ====================
export const getConversation = async (otherUserId: number | string) => {
  const res = await fetch(`${BASE_URL}/chat/messages/${otherUserId}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch messages: ${res.status} ${errorBody}`);
  }
  return res.json();
};

export const getConversationsList = async () => {
  const res = await fetch(`${BASE_URL}/chat/conversations`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};

export const sendMessageToApi = async (receiverId: number | string, content: string, type: string = 'text', propertyId?: number | string) => {
  const res = await fetch(`${BASE_URL}/chat/send`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ receiver_id: receiverId, content, type, property_id: propertyId }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

