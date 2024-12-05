import { User, PageConfig } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const authenticateUser = async (
  data: Partial<User>
): Promise<{ token: string; step: number; user: User }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed.");
  }
  return response.json();
};

export const updateUser = async (
  id: string,
  updatedData: Partial<User>
): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  return response.json();
};

export const fetchPageConfig = async (): Promise<PageConfig> => {
  const res = await fetch(`${BASE_URL}/admin`);
  if (!res.ok) throw new Error("Failed to fetch page configuration");
  return res.json();
};

export const updatePageConfig = async (config: PageConfig): Promise<void> => {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    throw new Error("Failed to update page configuration");
  }
};

export const validateToken = async (token: string) => {
  const response = await fetch(`${BASE_URL}/auth/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error("Invalid or expired token.");
  }

  return response.json(); 
};
