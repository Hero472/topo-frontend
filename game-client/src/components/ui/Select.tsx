// src/components/ui/Select.tsx
import React, { useId } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../lib/utils";

// ==========================================
// MAIN SELECT COMPONENT
// ==========================================
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      size = "md",
      value,
      onValueChange,
      disabled,
      children,
      className,
      placeholder = "Select an option...",
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = `select-${generatedId}`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    const hasError = !!error;
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined;

    const sizeClasses = {
      sm: "h-9 text-sm",
      md: "h-11 text-base",
      lg: "h-[52px] text-lg",
    };

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-foreground-tertiary">
            {label}
          </label>
        )}

        <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={descriptionId}
            className={cn(
              "relative flex w-full items-center justify-between rounded-md border bg-background-secondary px-3 py-2 text-foreground-secondary shadow-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              "hover:bg-background-tertiary hover:border-border-secondary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              hasError ? "border-state-error focus:ring-state-error/20 focus:border-state-error" : "border-border-primary",
              sizeClasses[size],
              leftIcon && "pl-10"
            )}
          >
            {leftIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground-tertiary pointer-events-none">
                {leftIcon}
              </span>
            )}
            
            <SelectPrimitive.Value placeholder={placeholder} className="text-left truncate" />
            
            <SelectPrimitive.Icon asChild>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground-tertiary shrink-0 ml-2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border-primary bg-background-secondary shadow-md animate-in fade-in-80 zoom-in-95",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
            >
              <SelectPrimitive.Viewport className="p-1">
                {children}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {(helperText || error) && (
          <p
            className={cn("text-xs mt-0.5", hasError ? "text-state-error font-medium" : "text-foreground-tertiary")}
            id={descriptionId}
          >
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

// ==========================================
// SELECT ITEM (Replaces <option>)
// ==========================================
export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-foreground-secondary outline-none",
        "hover:bg-background-tertiary hover:text-foreground-primary",
        "focus:bg-background-tertiary focus:text-foreground-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = "SelectItem";