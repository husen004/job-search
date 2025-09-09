import { useDispatch, useSelector } from 'react-redux';
import { addToast, removeToast, selectToasts } from '../store/slices/toastSlice';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToastManager = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const showToast = (message: string, options?: { type?: ToastType; duration?: number }) => {
    const toast = {
      message,
      type: options?.type || 'info',
      duration: options?.duration || 3000,
    };

    dispatch(addToast(toast));
    
    setTimeout(() => {
      dispatch(removeToast(Date.now()));
    }, toast.duration);
  };

  return {
    toasts,
    showToast
  };
};