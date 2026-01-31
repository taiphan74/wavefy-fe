"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordRequestSchema, useAuth } from "@/features/auth";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { forgotPasswordMutation } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (forgotPasswordMutation.isPending) return;

    const validation = forgotPasswordRequestSchema.safeParse({ email });
    if (!validation.success) {
      setError("Vui lòng nhập email hợp lệ.");
      return;
    }

    forgotPasswordMutation.mutate(validation.data, {
      onSuccess: () => {
        setMessage(
          "Nếu email tồn tại, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu."
        );
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Gửi email thất bại.");
      },
    });
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Khôi phục tài khoản
        </p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-900">
            Quên mật khẩu
          </h2>
          <p className="text-sm text-slate-500">
            Nhập email để nhận hướng dẫn đặt lại mật khẩu.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus-visible:ring-slate-200/60"
            />
          </div>

          {message ? (
            <p className="text-xs text-slate-500">{message}</p>
          ) : null}
          {error ? <p className="text-xs text-rose-500">{error}</p> : null}

          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            {forgotPasswordMutation.isPending
              ? "Đang gửi..."
              : "Gửi hướng dẫn"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm text-slate-500">
          Đã nhớ mật khẩu?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
