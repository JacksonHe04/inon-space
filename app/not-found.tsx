import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-muted-foreground text-[0.72rem] tracking-[0.14em] uppercase">404</p>
      <h1 className="mt-3 text-xl font-semibold">这一页不存在</h1>
      <p className="text-muted-foreground mt-3 text-[0.95rem] leading-relaxed">
        地址可能写错了，或者内容已经搬走。
      </p>
      <p lang="en" className="text-muted-foreground mt-1 text-[0.85rem] leading-relaxed">
        This page does not exist.
      </p>
      <Link
        href="/"
        className="border-border hover:border-foreground/40 rounded-xs mt-6 w-fit border px-4 py-2 text-sm no-underline transition-colors"
      >
        回到首页
      </Link>
    </div>
  );
}
