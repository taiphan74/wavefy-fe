"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerRequestSchema, useAuth } from "@/features/auth";

export function RegisterCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { registerMutation } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (registerMutation.isPending) return;

    const validation = registerRequestSchema.safeParse({ email, password });
    if (!validation.success) {
      setError("Vui lòng nhập email hợp lệ và mật khẩu.");
      return;
    }

    registerMutation.mutate(validation.data, {
      onSuccess: () => setError(null),
      onError: (err) =>
        setError(err instanceof Error ? err.message : "Đăng ký thất bại."),
    });
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Tham gia Wavefy
        </p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-900">Đăng ký</h2>
          <p className="text-sm text-slate-500">
            Tạo tài khoản để lưu playlist và nhận gợi ý phù hợp.
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

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            {registerMutation.isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <div className="text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
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
