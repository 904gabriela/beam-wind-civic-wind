import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Library, MessageCircle, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: {
  to: "/" | "/chats" | "/create" | "/library" | "/me";
  label: string;
  icon: typeof Compass;
  exact: boolean;
  accent?: boolean;
}[] = [
  { to: "/", label: "Discover", icon: Compass, exact: true },
  { to: "/chats", label: "Chats", icon: MessageCircle, exact: false },
  { to: "/create", label: "Create", icon: Plus, exact: false, accent: true },
  { to: "/library", label: "Library", icon: Library, exact: false },
  { to: "/me", label: "Me", icon: User, exact: false },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = pathname.startsWith("/play/");

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-6xl bg-bg">
      <div className={cn("min-h-dvh", hideNav ? "pb-0" : "pb-20 lg:pb-0 lg:pl-24")}>
        {children}
      </div>
      {!hideNav && (
        <>
          <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pt-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink item={item} pathname={pathname} />
                </li>
              ))}
            </ul>
          </nav>
          <nav
            aria-label="Primary"
            className="fixed top-0 left-0 z-40 hidden h-dvh w-24 flex-col items-center border-r border-border bg-bg py-8 lg:flex"
          >
            <Link
              to="/"
              aria-label="Nexus home"
              className="mb-10 flex size-11 items-center justify-center rounded-full text-fg"
            >
              <span className="font-display text-xl tracking-tight">N</span>
            </Link>
            <ul className="flex flex-1 flex-col items-center gap-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink item={item} pathname={pathname} vertical />
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

function NavLink({
  item,
  pathname,
  vertical,
}: {
  item: (typeof NAV)[number];
  pathname: string;
  vertical?: boolean;
}) {
  const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl text-subtle transition-colors duration-150",
        vertical ? "h-16 w-16" : "h-14 w-full",
        active && "text-fg",
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full transition-colors duration-150",
          item.accent && "bg-fg text-bg",
          !item.accent && active && "text-fg",
        )}
      >
        <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
      </span>
      <span className="text-xs font-medium tracking-wide">{item.label}</span>
    </Link>
  );
}
