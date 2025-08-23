import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectToasts, removeToast } from "../store/slices/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  // Automatically remove toasts after their duration
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded shadow-lg text-white
            transform transition-all duration-500 ease-in-out
            animate-slide-in hover:translate-x-[-8px]
            ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <h5 className="font-semibold">
              {toast.type === "success"
                ? "Успех"
                : toast.type === "error"
                ? "Ошибка"
                : toast.type === "warning"
                ? "Внимание"
                : "Информация"}
            </h5>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>

          <hr className="my-2 border-white/20" />

          <p className="p-2 text-xl">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Toast;
