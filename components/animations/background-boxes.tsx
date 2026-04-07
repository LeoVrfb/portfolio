"use client";
import React from "react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#93c5fd",
  "#f9a8d4",
  "#86efac",
  "#fde047",
  "#fca5a5",
  "#d8b4fe",
  "#93c5fd",
  "#a5b4fc",
  "#c4b5fd",
];

export const BoxesCore = ({
  className,
  colors = DEFAULT_COLORS,
  ...rest
}: {
  className?: string
  colors?: string[]
}) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-white/[0.04]"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-white/[0.04]"
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
