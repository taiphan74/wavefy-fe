export type ApiResponse<T> = {
  status: "ok" | "error";
  code: number;
  time: string;
  data?: T;
  error?: string;
};

export type ApiErrorPayload = {
  status: "error";
  code: number;
  time: string;
  error?: string;
};
