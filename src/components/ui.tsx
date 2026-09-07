import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-border-strong",
        className,
      )}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-border-strong",
        className,
      )}
    />
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "quiet";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-transform duration-150 enabled:active:scale-[0.98] disabled:opacity-40",
        variant === "primary" && "bg-fg text-bg",
        variant === "ghost" && "border border-border bg-transparent text-fg",
        variant === "quiet" && "bg-elevated text-fg",
        variant === "danger" && "bg-danger text-fg",
        className,
      )}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-full items-center justify-between gap-4"
    >
      <span className="text-sm text-fg">{label}</span>
      <span
        className={cn(
          "relative h-6 w-10 rounded-full transition-colors duration-150",
          checked ? "bg-fg" : "bg-elevated",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full transition-transform duration-150",
            checked ? "translate-x-4 bg-bg" : "bg-muted",
          )}
        />
      </span>
    </button>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors duration-150",
        active ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      {children}
    </div>
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-colors duration-150 focus:border-border-strong",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-display text-2xl text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p>
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-4 px-4 pt-6 pb-4 pr-36 lg:pl-8 lg:pr-40">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-fg">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
