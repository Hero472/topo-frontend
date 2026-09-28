import React, { useId } from "react";
import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** 
   * Can be a string, JSX, or any React node. 
   * Allows for rich labels like: label={<span className="...">Dark Mode 🌙</span>}
   */
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, label, disabled, className }, ref) => {
    const id = useId();

    return (
      <div className={cn("flex items-center gap-3", className)}>
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onCheckedChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-brand-primary" : "bg-background-tertiary"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        
        {label && (
          <label 
            htmlFor={id} 
            className={cn(
              "text-sm font-medium text-foreground-secondary cursor-pointer select-none",
              "transition-colors duration-200 hover:text-foreground-primary",
              disabled && "opacity-50 cursor-not-allowed hover:text-foreground-secondary"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";