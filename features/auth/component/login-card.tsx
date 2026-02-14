"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginRequestSchema, useAuth } from "@/features/auth";
import { ApiError } from "@/lib/axios";
import { AlertCircle } from "lucide-react";
import { GoogleSignInButton } from "./google-sign-in-button";

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loginMutation, googleAuthMutation } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (loginMutation.isPending || googleAuthMutation.isPending) return;

    const validation = loginRequestSchema.safeParse({ email, password });
    if (!validation.success) {
      setError("Vui lòng nhập email hợp lệ và mật khẩu.");
      return;
    }

    loginMutation.mutate(validation.data, {
      onSuccess: () => setError(null),
      onError: (err) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          setError(
            "Email chưa được xác minh. Vui lòng kiểm tra hộp thư để xác minh."
          );
          return;
        }
        setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
      },
    });
  };
  const handleGoogleCredential = useCallback(
    (credential: string) => {
      setError(null);
      if (loginMutation.isPending || googleAuthMutation.isPending) return;

      googleAuthMutation.mutate(
        { credential },
        {
          onSuccess: () => setError(null),
          onError: (err) =>
            setError(
              err instanceof Error ? err.message : "Đăng nhập Google thất bại."
            ),
        }
      );
    },
    [googleAuthMutation, loginMutation.isPending]
  );

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
            <Alert
              variant="destructive"
              className="border-rose-200/80 bg-rose-50/80 text-rose-700 shadow-[0_10px_30px_-20px_rgba(244,63,94,0.45)]"
            >
              <AlertCircle />
              <AlertTitle>Không thể đăng nhập</AlertTitle>
              <AlertDescription className="text-rose-600">
                {error}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="h-4 w-4 rounded border-slate-300" />
              <Label htmlFor="remember" className="text-xs text-slate-600">
                Ghi nhớ tôi
              </Label>
            </div>
            <Button
              asChild
              variant="ghost"
              className="h-auto px-0 text-xs font-semibold text-slate-700 hover:bg-transparent hover:text-slate-900"
            >
              <Link href="/forgot-password">Quên mật khẩu?</Link>
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending || googleAuthMutation.isPending}
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            {loginMutation.isPending || googleAuthMutation.isPending
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </Button>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span className="bg-white px-3">Hoặc đăng nhập bằng Google</span>
              </div>
            </div>
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={loginMutation.isPending || googleAuthMutation.isPending}
            />
          </div>
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
