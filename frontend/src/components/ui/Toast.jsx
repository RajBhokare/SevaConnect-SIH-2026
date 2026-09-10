import { Toaster, toast } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '16px',
          fontFamily: 'Inter, sans-serif'
        }
      }}
    />
  );
};

export { toast };
