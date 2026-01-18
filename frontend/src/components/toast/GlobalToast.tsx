import { useEffect } from "react";
import Toast from "./Toast";
import useToastStore from "@store/useToastStore";

const GlobalToast = () => {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  return (
    <Toast
      message={message}
      type={type}
      onClose={hideToast}
    />
  );
};

export default GlobalToast;
