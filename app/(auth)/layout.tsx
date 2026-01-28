export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_circle_at_10%_-10%,#dbeafe,transparent_55%),radial-gradient(1000px_circle_at_90%_10%,#ffe4e6,transparent_55%),linear-gradient(180deg,#f8fafc,transparent_60%)]">
      <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-center gap-6 text-slate-700 lg:flex">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Wavefy
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Nâng trải nghiệm âm thanh của bạn lên tầm cao mới.
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Đăng nhập để đồng bộ playlist, lưu lịch sử nghe nhạc và khám phá
              những giai điệu phù hợp với tâm trạng của bạn.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-slate-900/90" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Trải nghiệm mượt mà
                </p>
                <p className="text-xs text-slate-500">
                  Thiết kế tối giản, tập trung vào cảm xúc.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
