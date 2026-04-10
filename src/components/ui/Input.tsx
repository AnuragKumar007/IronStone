// ============================================
// Input — Form input with label, icon & error
// ============================================
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string; // Remix Icon class, e.g. "ri-mail-line"
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <i
              className={`${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-500`}
            />
          )}
          <input
            ref={ref}
            className={`auth-input ${icon ? "pl-11" : ""} ${error ? "!border-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
