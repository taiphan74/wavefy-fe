export type ApiResponse<T> = {
  status: "ok" | "error";
  code: number;
  time: string;
  data?: T;
  error?: string;
};
