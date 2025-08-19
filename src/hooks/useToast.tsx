import { useCallback, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, options?: { type: ToastType; duration?: number }) => {
      const id = Date.now() + Math.random();
      const toast: Toast = {
        id,
        message,
        type: options?.type || "info",
        duration: options?.duration ?? 2500,
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    },
    []
  );

  // ToastList компонент для вывода тостов
  const ToastList = () => (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-[9999]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow-lg text-white transition-all
            ${toast.type === "error"
              ? "bg-red-600"
              : toast.type === "success"
              ? "bg-green-600"
              : toast.type === "warning"
              ? "bg-yellow-600 text-black"
              : "bg-blue-600"}
          `}
          style={{ minWidth: 200, opacity: 0.95 }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );

  return { showToast, ToastList };
}