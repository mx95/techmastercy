import clsx from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-accent text-[#041018] font-semibold hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-[0_0_0_1px_rgba(34,211,238,0.4)]",
  secondary:
    "bg-white/5 text-foreground border border-white/25 hover:border-accent/60 hover:bg-accent-dim hover:text-white",
  ghost: "bg-transparent text-foreground-muted hover:text-foreground hover:bg-white/5",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
} as const;

const sizes = {
  sm: "min-h-10 h-10 px-3 text-sm",
  md: "min-h-11 h-11 px-5 text-sm",
  lg: "min-h-12 h-12 px-5 text-base sm:px-6",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    props.className,
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    );
  }

  const {
    children,
    className: _className,
    variant: _variant,
    size: _size,
    href: _href,
    ...rest
  } = props as ButtonAsButton & { href?: undefined };

  void _className;
  void _variant;
  void _size;
  void _href;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
