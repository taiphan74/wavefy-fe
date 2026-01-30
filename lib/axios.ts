import axios from "axios";
import type { ApiResponse } from "./types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>;

    if (payload && payload.status === "ok") {
      return payload.data;
    }

    return Promise.reject(
      new Error(payload?.error ?? "Unknown API error")
    );
  },
  (error) => Promise.reject(error)
);

export default api;
export { api };
