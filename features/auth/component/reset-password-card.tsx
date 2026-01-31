"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordCard() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ mật khẩu mới.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu nhập lại không khớp.");
      return;
    }

    setMessage("Mật khẩu mới đã được cập nhật.");
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Đặt lại mật khẩu
        </p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-900">
            Tạo mật khẩu mới
          </h2>
          <p className="text-sm text-slate-500">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Mật khẩu mới
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

          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Nhập lại mật khẩu
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 rounded-2xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus-visible:ring-slate-200/60"
            />
          </div>

          {message ? (
            <p className="text-xs text-slate-500">{message}</p>
          ) : null}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            Cập nhật mật khẩu
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-center text-sm text-slate-500">
          Quay lại{" "}
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
