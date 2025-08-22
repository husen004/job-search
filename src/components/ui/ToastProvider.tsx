import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "../../hooks/useToast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextValue {
  showToast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useAppToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useAppToast must be used within ToastProvider");
  return ctx.showToast;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast, ToastList } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList />
    </ToastContext.Provider>
  );
};