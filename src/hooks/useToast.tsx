import { useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type?: ToastType;
  duration?: number; // ms
}

export function useToast() {
  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.className = `fixed bottom-8 right-8 px-4 py-2 rounded shadow-lg z-[9999] text-white transition-all ${
        options?.type === "error"
          ? "bg-red-600"
          : options?.type === "success"
          ? "bg-green-600"
          : options?.type === "warning"
          ? "bg-yellow-600"
          : "bg-blue-600"
      }`;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, options?.duration ?? 2500);
    },
    []
  );

  return showToast;
}