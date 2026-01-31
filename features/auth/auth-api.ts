import { z } from "zod";

import api from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshRequestSchema = z.object({});

export const authUserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const authResponseDataSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal("Bearer"),
  expires_at: z.string(),
  user: authUserSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponseData = z.infer<typeof authResponseDataSchema>;
export type AuthApiResponse = ApiResponse<AuthResponseData>;

export const register = async (
  payload: RegisterRequest
): Promise<AuthResponseData> => {
  const data = await api.post("/auth/register", payload);
  return authResponseDataSchema.parse(data);
};

export const login = async (
  payload: LoginRequest
): Promise<AuthResponseData> => {
  const data = await api.post("/auth/login", payload);
  return authResponseDataSchema.parse(data);
};
