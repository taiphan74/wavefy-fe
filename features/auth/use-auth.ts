"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from "./auth-api";
import { setAccessToken } from "@/lib/axios";
import type {
  AuthResponseData,
  ForgotPasswordRequest,
  ForgotPasswordResponseData,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponseData,
} from "./auth-api";

export const authTokenKey = ["auth", "token"] as const;
export const authUserKey = ["auth", "user"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AuthResponseData, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      queryClient.setQueryData(authTokenKey, data.access_token);
      queryClient.setQueryData(authUserKey, data.user);
    },
  });

  const registerMutation = useMutation<
    AuthResponseData,
    Error,
    RegisterRequest
  >({
    mutationFn: register,
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      queryClient.setQueryData(authTokenKey, data.access_token);
      queryClient.setQueryData(authUserKey, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: authTokenKey });
      queryClient.removeQueries({ queryKey: authUserKey });
    },
  });

  const forgotPasswordMutation = useMutation<
    ForgotPasswordResponseData,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,
  });

  const resetPasswordMutation = useMutation<
    ResetPasswordResponseData,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: resetPassword,
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
