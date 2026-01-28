import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterCard() {
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
        <form className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Họ và tên
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nguyễn An"
              className="h-12 rounded-2xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus-visible:ring-slate-200/60"
            />
          </div>

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
              className="h-12 rounded-2xl border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus-visible:ring-slate-200/60"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="terms" className="mt-0.5 h-4 w-4 rounded border-slate-300" />
            <Label htmlFor="terms" className="text-xs leading-relaxed text-slate-500">
              Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của Wavefy.
            </Label>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
          >
            Tạo tài khoản
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
