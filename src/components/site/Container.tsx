import clsx from "clsx";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main";
}) {
  return (
    <Tag
      className={clsx(
        "mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
