"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login, register } from "./auth-api";
import { setAccessToken } from "@/lib/axios";
import type {
  AuthResponseData,
  LoginRequest,
  RegisterRequest,
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

  return {
    loginMutation,
    registerMutation,
  };
};
