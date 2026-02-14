"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  forgotPassword,
  googleAuth,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "./auth-api";
import { setAccessToken } from "@/lib/axios";
import type {
  AuthResponseData,
  ForgotPasswordRequest,
  ForgotPasswordResponseData,
  GoogleAuthRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponseData,
  VerifyEmailRequest,
  VerifyEmailResponseData,
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
  const googleAuthMutation = useMutation<
    AuthResponseData,
    Error,
    GoogleAuthRequest
  >({
    mutationFn: googleAuth,
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

  const verifyEmailMutation = useMutation<
    VerifyEmailResponseData,
    Error,
    VerifyEmailRequest
  >({
    mutationFn: verifyEmail,
  });

  return {
    loginMutation,
    googleAuthMutation,
    registerMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    verifyEmailMutation,
  };
};
