"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { verifyEmailRequestSchema, useAuth } from "@/features/auth";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function VerifyEmailCard() {
  const { verifyEmailMutation } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const hasTriggered = useRef(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tokenError = token ? null : "Token xác minh không hợp lệ hoặc đã hết hạn.";

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const validation = verifyEmailRequestSchema.safeParse({ token });
    if (!validation.success) return;

    verifyEmailMutation.mutate(validation.data, {
      onSuccess: () => {
        setMessage("Email của bạn đã được xác minh.");
        router.replace("/");
      },
      onError: (err) =>
        setError(err instanceof Error ? err.message : "Xác minh thất bại."),
    });
  }, [router, token, verifyEmailMutation]);

  const handleRetry = () => {
    router.replace("/login");
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
      <CardHeader className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Xác minh email
        </p>
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-900">
            Hoàn tất đăng ký
          </h2>
          <p className="text-sm text-slate-500">
            Chúng tôi đang xác minh email của bạn.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {message ? (
          <Alert className="border-emerald-200/80 bg-emerald-50/80 text-emerald-700 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.35)]">
            <CheckCircle2 />
            <AlertTitle>Thành công</AlertTitle>
            <AlertDescription className="text-emerald-600">
              {message}
            </AlertDescription>
          </Alert>
        ) : null}
        {tokenError ? (
          <Alert
            variant="destructive"
            className="border-rose-200/80 bg-rose-50/80 text-rose-700 shadow-[0_10px_30px_-20px_rgba(244,63,94,0.45)]"
          >
            <AlertCircle />
            <AlertTitle>Xác minh thất bại</AlertTitle>
            <AlertDescription className="text-rose-600">
              {tokenError}
            </AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert
            variant="destructive"
            className="border-rose-200/80 bg-rose-50/80 text-rose-700 shadow-[0_10px_30px_-20px_rgba(244,63,94,0.45)]"
          >
            <AlertCircle />
            <AlertTitle>Xác minh thất bại</AlertTitle>
            <AlertDescription className="text-rose-600">
              {error}
            </AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="button"
          onClick={handleRetry}
          className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
        >
          {verifyEmailMutation.isPending ? "Đang xác minh..." : "Xác minh lại"}
        </Button>
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
