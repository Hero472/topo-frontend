import React, { useId } from "react";
import "./Input.css";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = "md",
  className = "",
  id,
  disabled,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = !!error;
  const descriptionId = hasError ? errorId : helperText ? helperId : undefined;

  const containerClasses = [
    "input-container",
    `input-container--${size}`,
    hasError && "input-container--error",
    disabled && "input-container--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    "input-field",
    leftIcon && "input-field--has-left-icon",
    rightIcon && "input-field--has-right-icon",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}

      <div className={containerClasses}>
        {leftIcon && (
          <span className="input-icon input-icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={descriptionId}
          {...rest}
        />

        {rightIcon && (
          <span className="input-icon input-icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>

      {(helperText || error) && (
        <p
          className={`input-message ${hasError ? "input-message--error" : "input-message--helper"}`}
          id={descriptionId}
        >
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
};
