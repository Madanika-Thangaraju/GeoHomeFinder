import { RegisterUserPayload } from "../../src/types/tenant.types";
import { getToken, removeToken, saveToken, saveUser } from "../utils/auth";

const BASE_URL = "http://192.168.29.39:3000";

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};
export const registerUser = async (data: RegisterUserPayload) => {
  console.log('Registering user...');
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/users/register`, {
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

    // ✅ AUTO LOGIN: SAVE TOKEN AND USER
    if (result.token) {
      await saveToken(result.token);
    }
    if (result.user) {
      await saveUser(result.user);
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
  if (!data.identifier) throw new Error("Email or Phone is required");

  const response = await fetchWithTimeout(`${BASE_URL}/users/login`, {
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
    const response = await fetchWithTimeout(`${BASE_URL}/users/me`, {
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

  const response = await fetchWithTimeout(`${BASE_URL}/properties/add`, {
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

  const response = await fetchWithTimeout(`${BASE_URL}/properties/${id}`, {
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

  const response = await fetchWithTimeout(`${BASE_URL}/properties/${id}`, {
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
    if (filters.category) params.append("category", filters.category);
    if (filters.furnishing) params.append("furnishing", filters.furnishing);
    if (filters.floorNo) params.append("floorNo", filters.floorNo);
    if (filters.parking) params.append("parking", filters.parking);
    if (filters.mainRoadFacing !== undefined) params.append("mainRoadFacing", filters.mainRoadFacing.toString());
    if (filters.washrooms) params.append("washrooms", filters.washrooms);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetchWithTimeout(url, {
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
  const response = await fetchWithTimeout(`${BASE_URL}/owners/listings/${userId}`, {
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

export const getStagnantPropertiesApi = async () => {
  const token = await getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetchWithTimeout(`${BASE_URL}/owners/stagnant`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch stagnant properties");
  return result.data;
};

export const getVisitedPropertiesApi = async () => {
  const token = await getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetchWithTimeout(`${BASE_URL}/owners/visited`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch visited properties");
  return result.data;
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
  const res = await fetchWithTimeout(`${BASE_URL}/owners/profile`, {
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
  const res = await fetchWithTimeout(`${BASE_URL}/owners/profile`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const togglePushNotification = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/owners/notifications`, {
    method: "PATCH",
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to update notifications");
  return res.json();
};

// ==================== CHAT SERVICES ====================
export const getConversation = async (otherUserId: number | string, propertyId?: number | string) => {
  let url = `${BASE_URL}/chat/messages/${otherUserId}`;
  if (propertyId) url += `?propertyId=${propertyId}`;

  console.log(`[Chat] Fetching from: ${url}`);
  const res = await fetchWithTimeout(url, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to fetch messages: ${res.status} ${errorBody}`);
  }
  return res.json();
};

export const getConversationsList = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/chat/conversations`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};

export const sendMessageToApi = async (receiverId: number | string, content: string, type: string = 'text', propertyId?: number | string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/chat/send`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ receiver_id: receiverId, content, type, property_id: propertyId }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

// ==================== LIKES & SAVED ====================
export const likePropertyApi = async (propertyId: number | string, status: boolean) => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/like`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ propertyId, status }),
  });
  if (!res.ok) throw new Error("Failed to update like status");
  return res.json();
};

export const getLikedPropertiesApi = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/liked`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch liked properties");
  const result = await res.json();
  return result.data;
};

export const savePropertyApi = async (propertyId: number | string, status: boolean, notes: string = "") => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/save`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ propertyId, status, notes }),
  });
  if (!res.ok) throw new Error("Failed to update save status");
  return res.json();
};

export const getSavedPropertiesApi = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/saved`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch saved properties");
  const result = await res.json();
  return result.data;
};

export const trackPropertyViewApi = async (propertyId: number | string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/view`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ propertyId }),
  });
  if (!res.ok) throw new Error("Failed to track view");
  return res.json();
};

export const getRecentlyViewedApi = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/tenants/viewed`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch recently viewed properties");
  const result = await res.json();
  return result.data;
};

// ==================== NOTIFICATION SERVICES ====================
export const getNotificationsApi = async (role?: 'tenant' | 'owner') => {
  let url = `${BASE_URL}/notifications`;
  if (role) url += `?role=${role}`;

  const res = await fetchWithTimeout(url, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationReadApi = async (id: number | string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
};

// ==================== INTERACTION SERVICES ====================

export const createTourRequestApi = async (data: {
  owner_id: number;
  property_id: number;
  tour_date: string;
  tour_time: string;
  message?: string;
}) => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/tour`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to send tour request");
  }
  return res.json();
};

export const getTourRequestsApi = async (role: 'owner' | 'tenant') => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/tours?role=${role}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tour requests");
  return res.json();
};

export const updateTourStatusApi = async (id: number | string, status: 'accepted' | 'rejected') => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/tour/${id}/status`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update tour status");
  return res.json();
};

export const createCallRequestApi = async (owner_id: number) => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/call`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ owner_id }),
  });
  if (!res.ok) throw new Error("Failed to send call request");
  return res.json();
};

export const getCallRequestsApi = async (role: 'owner' | 'tenant') => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/calls?role=${role}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch call requests");
  return res.json();
};

export const updateCallStatusApi = async (id: number | string, status: 'accepted' | 'rejected') => {
  const res = await fetchWithTimeout(`${BASE_URL}/interactions/call/${id}/status`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update call status");
  return res.json();
};
