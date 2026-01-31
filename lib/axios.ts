import axios from "axios";
import type {
  AxiosError,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "./types/api";

type AxiosRequestConfigWithRetry = AxiosRequestConfig & { _retry?: boolean };

let accessToken: string | null = null;
let isRefreshing = false;
const requestQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfigWithRetry;
}> = [];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const rawApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const getAccessToken = () => accessToken;

const enqueueRequest = (config: AxiosRequestConfigWithRetry) =>
  new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, config });
  });

const flushQueue = (error?: unknown) => {
  const queue = [...requestQueue];
  requestQueue.length = 0;
  queue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(api(config));
  });
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const onResponseFulfilled = (
  response: { data: ApiResponse<unknown> }
): unknown => {
  const payload = response.data as ApiResponse<unknown>;

  if (payload && payload.status === "ok") {
    const maybeToken = (payload.data as { access_token?: string } | null)
      ?.access_token;
    if (typeof maybeToken === "string" && maybeToken.length > 0) {
      setAccessToken(maybeToken);
    }
    return payload.data;
  }

  return Promise.reject(new Error(payload?.error ?? "Unknown API error"));
};

const responseInterceptors =
  api.interceptors.response as AxiosInterceptorManager<unknown>;

responseInterceptors.use(
  onResponseFulfilled,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const response = error.response;
    const originalRequest = error.config as
      | AxiosRequestConfigWithRetry
      | undefined;

    if (!response || !originalRequest) {
      return Promise.reject(error);
    }

    const payload = response.data;
    const errorMessage = payload?.error;
    const isRefreshEndpoint =
      typeof originalRequest.url === "string" &&
      originalRequest.url.includes("/auth/refresh");
    const shouldRefresh =
      response.status === 401 && errorMessage === "invalid token";

    if (!shouldRefresh || isRefreshEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return enqueueRequest(originalRequest);
    }

    isRefreshing = true;

    try {
      const refreshResponse =
        await rawApi.post<ApiResponse<unknown>>("/auth/refresh");
      const refreshPayload = refreshResponse.data;

      if (!refreshPayload || refreshPayload.status !== "ok") {
        throw new Error(refreshPayload?.error ?? "Refresh failed");
      }

      const newToken = (refreshPayload.data as { access_token?: string } | null)
        ?.access_token;

      if (typeof newToken === "string" && newToken.length > 0) {
        setAccessToken(newToken);
      }

      isRefreshing = false;
      flushQueue();
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      setAccessToken(null);
      flushQueue(refreshError);
      return Promise.reject(refreshError);
    }
  }
);

export default api;
export { api, getAccessToken, setAccessToken };
