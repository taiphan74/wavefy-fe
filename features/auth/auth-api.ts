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
export const googleAuthRequestSchema = z.object({
  credential: z.string().min(1),
});

export const refreshRequestSchema = z.object({
  refresh_token: z.string().min(1),
});
export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(1),
});
export const verifyEmailRequestSchema = z.object({
  token: z.string().min(1),
});

export const authUserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const authResponseDataSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal("Bearer"),
  expires_at: z.string(),
  user: authUserSchema,
});

export const logoutResponseDataSchema = z.object({
  logged_out: z.literal(true),
});
export const forgotPasswordResponseDataSchema = z.object({
  sent: z.literal(true),
});
export const resetPasswordResponseDataSchema = z.object({
  reset: z.literal(true),
});
export const verifyEmailResponseDataSchema = z.object({
  verified: z.literal(true),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type GoogleAuthRequest = z.infer<typeof googleAuthRequestSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponseData = z.infer<typeof authResponseDataSchema>;
export type LogoutResponseData = z.infer<typeof logoutResponseDataSchema>;
export type ForgotPasswordResponseData = z.infer<
  typeof forgotPasswordResponseDataSchema
>;
export type ResetPasswordResponseData = z.infer<
  typeof resetPasswordResponseDataSchema
>;
export type VerifyEmailResponseData = z.infer<
  typeof verifyEmailResponseDataSchema
>;
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

export const googleAuth = async (
  payload: GoogleAuthRequest
): Promise<AuthResponseData> => {
  const endpoint = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT ?? "/auth/google";
  const data = await api.post(endpoint, payload);
  return authResponseDataSchema.parse(data);
};

export const logout = async (): Promise<LogoutResponseData> => {
  const data = await api.post("/auth/logout");
  return logoutResponseDataSchema.parse(data);
};

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponseData> => {
  const data = await api.post("/auth/forgot-password", payload);
  return forgotPasswordResponseDataSchema.parse(data);
};

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponseData> => {
  const data = await api.post("/auth/reset-password", payload);
  return resetPasswordResponseDataSchema.parse(data);
};

export const verifyEmail = async (
  payload: VerifyEmailRequest
): Promise<VerifyEmailResponseData> => {
  const data = await api.post("/auth/verify-email", payload);
  return verifyEmailResponseDataSchema.parse(data);
};
