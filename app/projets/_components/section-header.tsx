import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  number: string;
  accentVar: "--accent" | "--mauve" | "--gold" | "--lavender";
  children: ReactNode;
}

export function SectionHeader({
  eyebrow,
  number,
  accentVar,
  children,
}: SectionHeaderProps) {
  const color = `var(${accentVar})`;
  return (
    <header className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12 items-baseline">
      <div className="flex items-center gap-3 lg:block lg:pt-1">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color }}
        >
          {eyebrow}
        </span>
        <span
          className="font-black leading-none lg:block lg:mt-2"
          style={{
            fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
            color,
            opacity: 0.95,
          }}
        >
          {number}
        </span>
      </div>
      <div className="max-w-2xl">{children}</div>
    </header>
  );
}

interface SectionOffsetProps {
  children: ReactNode;
  className?: string;
}

export function SectionOffset({ children, className }: SectionOffsetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-12">
      <div aria-hidden className="hidden lg:block" />
      <div className={className ?? "max-w-2xl"}>{children}</div>
    </div>
  );
}
