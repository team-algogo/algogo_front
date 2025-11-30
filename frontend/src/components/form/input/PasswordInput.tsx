import { useState } from "react";

type PasswordStatus = "default" | "error" | "warning" | "success";

interface PasswordInputProps {
  formId: string;
  placeholder?: string;
  value?: string;
  status?: PasswordStatus;
  onChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PasswordInput = ({
  formId,
  placeholder = "비밀번호를 입력하세요",
  value: externalValue,
  status = "default",
  onChange,
  onSubmit,
}: PasswordInputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const getBorderColor = () => {
    if (isFocused) {
      return "border-primary-main";
    }
    switch (status) {
      case "error":
        return "border-alert-error";
      case "warning":
        return "border-alert-warning";
      case "success":
        return "border-alert-success";
      default:
        return "border-grayscale-warm-gray";
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
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
      className={`flex items-center w-[660px] h-12 bg-grayscale-default border rounded-md overflow-hidden ${getBorderColor()}`}
    >
      <div className="flex-1 flex items-center relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full h-full px-4 text-grayscale-dark-gray placeholder-grayscale-warm-gray outline-none bg-transparent"
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
          className="flex justify-center items-center size-6 rounded-full transition-colors"
        >
          <img
            src={
              showPassword
                ? "/icons/viewOkIcon.svg"
                : "/icons/viewNotOkIcon.svg"
            }
            className="size-4"
            alt={showPassword ? "hide password" : "show password"}
          />
        </button>

        {/* Clear Icon */}
        {value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleChange("")}
            className="flex justify-center items-center size-6 rounded-full transition-colors"
          >
            <img
              src="/icons/clearIconDark.svg"
              className="size-4"
              alt="clear"
            />
          </button>
        )}
      </div>
    </form>
  );
};

export default PasswordInput;
