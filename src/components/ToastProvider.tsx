import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { useToast } from "../hooks/useToast";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useAppToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useAppToast must be used within ToastProvider");
  return ctx.showToast;
};

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useToast();

  const removeToast = (id: number) => setToasts((toasts) => toasts.filter((t) => t.id !== id));

  const showToast = useCallback(
    (message: string, options?: { type?: ToastType; duration?: number }) => {
      const id = ++toastId;
      setToasts((toasts) => [
        ...toasts,
        {
          id,
          message,
          type: options?.type || "info",
          duration: options?.duration ?? 2500,
        },
      ]);
      setTimeout(() => removeToast(id), options?.duration ?? 2500);
    },
    []
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <toast.ToastList />
    </ToastContext.Provider>
  );
};