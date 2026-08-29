import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-20 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <nav className="container flex w-full items-center justify-between gap-4 text-sm font-medium">
          <Link href="/">
            <h1 className="text-base font-semibold">
              Browser Extension Starter
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <SplashPageNav />
          </div>
        </nav>
      </header>
      <main className="flex grow flex-col">{children}</main>
      <footer className="border-t">
        <div className="container py-4 text-sm leading-loose">
          Built with ❤️ at{" "}
          <FooterLink href="https://www.convex.dev/">Convex</FooterLink>.
          Powered by Convex,{" "}
          <FooterLink href="https://nextjs.org/">Next.js</FooterLink> and{" "}
          <FooterLink href="https://ui.shadcn.com/">shadcn/ui</FooterLink>.
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 hover:no-underline"
      target="_blank"
    >
      {children}
    </Link>
  );
}

function SplashPageNav() {
  return (
    <>
      <div className="hidden items-center gap-4 md:flex">
        <Link
          href="https://docs.convex.dev"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Docs
        </Link>
        <Link
          href="https://stack.convex.dev"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Stack
        </Link>
        <Link
          href="https://www.convex.dev/community"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Discord
        </Link>
      </div>
      <Link href="/product">
        <Button>Get Started</Button>
      </Link>
    </>
  );
}
