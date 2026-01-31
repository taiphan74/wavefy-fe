"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginRequestSchema, useAuth } from "@/features/auth";

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loginMutation } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (loginMutation.isPending) return;

    const validation = loginRequestSchema.safeParse({ email, password });
    if (!validation.success) {
      setError("Vui lòng nhập email hợp lệ và mật khẩu.");
      return;
    }

    loginMutation.mutate(validation.data, {
      onSuccess: () => setError(null),
      onError: (err) =>
        setError(err instanceof Error ? err.message : "Đăng nhập thất bại."),
    });
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Chào mừng trở lại
        </p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-900">Đăng nhập</h2>
          <p className="text-sm text-slate-500">
            Tiếp tục hành trình âm nhạc của bạn cùng Wavefy.
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

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus-visible:ring-slate-200/60"
            />
          </div>

          {error ? (
            <p className="text-xs text-rose-500">{error}</p>
          ) : null}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="h-4 w-4 rounded border-slate-300" />
              <Label htmlFor="remember" className="text-xs text-slate-600">
                Ghi nhớ tôi
              </Label>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-auto px-0 text-xs font-semibold text-slate-700 hover:bg-transparent hover:text-slate-900"
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
