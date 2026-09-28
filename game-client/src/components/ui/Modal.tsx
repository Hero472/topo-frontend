import { useEffect, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  ariaLabel?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  ariaLabel,
}: Readonly<ModalProps>) {
  
  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!open) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose && closeOnBackdrop) onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose, closeOnBackdrop]);

  if (!open) return null;

  return (
    // Overlay / Backdrop
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm"
      )}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
    >
      {/* Modal Content Container */}
      <div 
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] flex flex-col",
          "bg-background-secondary border border-border-primary rounded-xl shadow-lg",
          "animate-in fade-in zoom-in-95 duration-200" // Simple mount animation if you have it, otherwise it just pops in cleanly
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          {title && (
            <h2 className="text-lg font-semibold text-foreground-primary m-0">
              {title}
            </h2>
          )}
          
          {onClose && (
            <button 
              type="button"
              className={cn(
                "p-2 rounded-md text-foreground-tertiary transition-colors",
                "hover:bg-background-tertiary hover:text-foreground-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              )} 
              onClick={onClose} 
              aria-label="Close modal"
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
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-foreground-secondary leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-primary bg-background-tertiary/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}