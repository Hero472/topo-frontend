import React, { useId } from 'react';
import styles from './Switch.module.css';

/**
 * Props for the Switch component.
 * Extends standard HTML button attributes for full compatibility (e.g., aria-label, className).
 */
export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the switch is currently turned on or off */
  checked: boolean;
  /** Callback function triggered when the switch is toggled */
  onCheckedChange: (checked: boolean) => void;
  /** Disables the switch and prevents interaction */
  disabled?: boolean;
  /** Optional text label displayed next to the switch */
  label?: string;
}

/**
 * An accessible, theme-aware toggle switch component.
 * 
 * @example
 * // Basic usage
 * <Switch checked={isDark} onCheckedChange={setIsDark} label="Dark Mode" />
 * 
 * @example
 * // Without a label (e.g., in a data table)
 * <Switch checked={isActive} onCheckedChange={handleToggle} aria-label="Toggle active status" />
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className = '', checked, onCheckedChange, disabled, label, id, ...props }, ref) => {
    // React 18 useId is SSR-safe and stable across renders
    const autoId = useId();
    const switchId = id || autoId;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          id={switchId}
          disabled={disabled}
          className={`${styles.switch} ${checked ? styles.checked : ''}`}
          onClick={() => !disabled && onCheckedChange(!checked)}
          {...props}
        >
          {/* aria-hidden="true" because the parent button already announces the state to screen readers */}
          <span className={styles.thumb} aria-hidden="true" />
        </button>
        
        {label && (
          <label htmlFor={switchId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';