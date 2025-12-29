import { RegisterTenantPayload } from "../../src/types/tenant.types";

const BASE_URL = "http://192.168.7.11:3000";

export const registerTenant = async (data: RegisterTenantPayload) => {
  try {
    const response = await fetch(`${BASE_URL}/tenants/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("API RESULT:", result);

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error: any) {
    console.log("NETWORK ERROR:", error);
    throw error;
  }
};
