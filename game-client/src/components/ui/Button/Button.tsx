import React from 'react';
import styles from './Button.module.css';

/**
 * Props for the Button component.
 * Extends standard HTML button attributes for full compatibility.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 
   * The visual style of the button. 
   * - `primary`: Main call-to-action (brand color).
   * - `secondary`: Secondary actions (subtle background).
   * - `outline`: Transparent background with a visible border.
   * - `ghost`: No background or border, text only.
   * - `destructive`: For dangerous actions like delete (red).
   * - `link`: Looks like a text link, but acts as a button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  
  /** 
   * The physical size of the button. 
   * Automatically adjusts padding, height, and font size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /** 
   * When true, disables the button, prevents clicks, and displays a loading spinner.
   * @default false
   */
  isLoading?: boolean;
  
  /** 
   * When true, removes horizontal padding and forces a square aspect ratio. 
   * Use this when the button contains *only* an icon (e.g., a close 'X' button).
   * @default false
   */
  isIconOnly?: boolean;
  
  /** 
   * When true, the button stretches to fill 100% of its container's width.
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * A versatile, accessible, and theme-aware Button component.
 * 
 * @example
 * // Primary action
 * <Button variant="primary" size="md" onClick={handleSave}>Save Changes</Button>
 * 
 * @example
 * // Icon-only button (e.g., for a toolbar)
 * <Button variant="ghost" size="sm" isIconOnly aria-label="Close">
 *   <CloseIcon />
 * </Button>
 * 
 * @example
 * // Loading state
 * <Button variant="primary" isLoading>Submitting...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className = '', 
      variant = 'primary', 
      size = 'md', 
      isLoading = false, 
      isIconOnly = false,
      fullWidth = false,
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type="button"
        className={`
          ${styles.button} 
          ${styles[variant]} 
          ${styles[size]} 
          ${isIconOnly ? styles.iconOnly : ''}
          ${fullWidth ? styles.fullWidth : ''}
          ${isLoading ? styles.loading : ''}
          ${className}
        `.trim()}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className={styles.loadingText}>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';