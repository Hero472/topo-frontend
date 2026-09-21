import React, { useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      className = '', 
      label, 
      error, 
      helperText, 
      leftIcon, 
      rightIcon, 
      size = 'md', 
      id, 
      disabled,
      placeholder, 
      ...props 
    }, 
    ref
  ) => {
    const autoId = useId();
    const inputId = id || autoId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined;

    // UX BEST PRACTICE: If a label exists, force a blank placeholder. 
    // This prevents overlap. Use `helperText` for format hints instead.
    const effectivePlaceholder = label ? " " : placeholder;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        <div className={`
          ${styles.inputContainer} 
          ${styles[size]} 
          ${hasError ? styles.hasError : ''} 
          ${disabled ? styles.disabled : ''}
          ${leftIcon ? styles.hasLeftIcon : ''}
          ${rightIcon ? styles.hasRightIcon : ''}
        `}>
          {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
          
          <input 
            ref={ref} 
            id={inputId} 
            className={styles.input} 
            disabled={disabled}
            placeholder={effectivePlaceholder}
            aria-invalid={hasError}
            aria-describedby={descriptionId}
            {...props} 
          />
          
          {/* Floating Label: Only renders if 'label' prop is passed */}
          {label && (
            <label htmlFor={inputId} className={styles.floatingLabel}>
              {label}
            </label>
          )}
          
          {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </div>

        {hasError && (
          <span id={errorId} className={styles.errorText}>
            {error}
          </span>
        )}
        
        {!hasError && helperText && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';