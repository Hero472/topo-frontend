import React, { useId } from "react";
import "./Select.css";

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  size = "md",
  className = "",
  id,
  disabled,
  children,
  ...rest
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const hasError = !!error;
  const descriptionId = hasError ? errorId : helperText ? helperId : undefined;

  const containerClasses = [
    "select-container",
    `select-container--${size}`,
    hasError && "select-container--error",
    disabled && "select-container--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`select-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}

      <div className={containerClasses}>
        <select
          id={selectId}
          className="select-field"
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={descriptionId}
          {...rest}
        >
          {children}
        </select>

        {/* Custom chevron for consistent cross-browser styling */}
        <span className="select-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {(helperText || error) && (
        <p
          className={`select-message ${hasError ? "select-message--error" : "select-message--helper"}`}
          id={descriptionId}
        >
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
};
