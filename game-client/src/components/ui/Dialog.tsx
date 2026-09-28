import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdropClick?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus the dialog content when it opens for accessibility
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-0 h-full rounded-none",
  };

  return (
    // Overlay / Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop with blur and fade */}
      <div
        className={cn(
          "absolute inset-0 bg-color-overlay backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className={cn(
          "relative z-50 w-full rounded-xl border border-border-primary bg-background-secondary shadow-lg",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
          sizeClasses[size],
          // Simple slide-up + fade-in animation
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-primary px-6 py-4">
          <h2 
            id="dialog-title" 
            className="text-lg font-semibold text-foreground-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-foreground-tertiary transition-colors hover:bg-background-tertiary hover:text-foreground-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-foreground-secondary leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border-primary bg-background-tertiary/50 px-6 py-4 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};