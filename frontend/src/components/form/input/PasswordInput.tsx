import { useState } from "react";

type PasswordStatus = "default" | "error" | "warning" | "success";

interface PasswordInputProps {
  placeholder?: string;
  id: string;
  value: string;
  status?: PasswordStatus;
  onChange: (value: string) => void;
}

const PasswordInput = ({
  placeholder = "비밀번호를 입력하세요",
  id,
  value,
  status = "default",
  onChange,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (isFocused) {
      return "border-primary-500 ring-1 ring-primary-500";
    }
    switch (status) {
      case "error":
        return "border-status-error";
      case "warning":
        return "border-status-warning";
      case "success":
        return "border-status-success";
      default:
        return "border-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return "/icons/errorIcon.svg";
      case "warning":
        return "/icons/warningIcon.svg";
      case "success":
        return "/icons/successIcon.svg";
      default:
        return null;
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <div
      className={`flex items-center w-full h-10 bg-white border rounded-md overflow-hidden transition-all duration-200 ${getBorderColor()}`}
    >
      <div className="flex-1 flex items-center relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="current-password"
          className="w-full h-full px-4 text-gray-900 placeholder-gray-400 outline-none bg-transparent text-sm"
        />
      </div>

      <div className="flex items-center gap-2 pr-3">
        {/* Status Icon */}
        {statusIcon && <img src={statusIcon} className="size-4" alt="status" />}

        {/* View Toggle Icon */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPassword(!showPassword)}
          className="flex justify-center items-center size-6 rounded-full hover:bg-gray-100 transition-colors"
        >
          <img
            src={
              showPassword
                ? "/icons/viewOkIcon.svg"
                : "/icons/viewNotOkIcon.svg"
            }
            className="size-4 opacity-60 hover:opacity-100 transition-opacity"
            alt={showPassword ? "hide password" : "show password"}
          />
        </button>

        {/* Clear Icon */}
        {value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange("")}
            className="flex justify-center items-center size-6 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img
              src="/icons/clearIconDark.svg"
              className="size-4 opacity-60 hover:opacity-100 transition-opacity"
              alt="clear"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
