"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, label, id, disabled }: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn("inline-flex cursor-pointer items-center gap-3 select-none", disabled && "cursor-not-allowed opacity-60")}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
          checked ? "border-gold-400/60 bg-gold-400/80" : "border-white/15 bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-all duration-300",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
      {label && <span className="text-sm text-cream/80">{label}</span>}
    </label>
  );
}
