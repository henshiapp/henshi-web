import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ToastContext } from "../contexts/ToastContext";


export const ToastProvider = ({ children }: { children: React.ReactNode; }) => {
  const toast = useRef<Toast>(null);

  function showSuccessToast(summary: string, detail?: string) {
    toast.current?.show({ severity: 'success', summary, detail, life: 4000 })
  }

  function showWarningToast(summary: string, detail?: string) {
    toast.current?.show({ severity: 'warn', summary, detail, life: 4000 })
  }

  function showErrorToast(summary: string, detail?: string) {
    toast.current?.show({ severity: 'error', summary, detail, life: 4000 })
  }

  return (
    <ToastContext.Provider value={{ showSuccessToast, showWarningToast, showErrorToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};
