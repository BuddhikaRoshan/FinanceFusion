import { User } from "@prisma/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Register a new user
export const registerUser = async (userData: {
  name: string;
  email: string;
  username: string;
  password: string;
  contactNumber?: string;
  position: string;
  incomeSources: string[];
  financialGoals: string[];
}) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return response.json();
};

// Login a user
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
};
export const updateUser = async (
  userId: string,
  userData: {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
    contactNumber?: string;
    position?: string;
    incomeSources?: string[];
    financialGoals?: string[];
  }
) => {
  const response = await fetch(`${API_URL}/users?userId=${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

// Delete user
export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};
export const getUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};
