import { createContext } from "react";

export const ToastContext = createContext<{
  showSuccessToast: (summary: string, detail?: string) => unknown,
  showWarningToast: (summary: string, detail?: string) => unknown,
  showErrorToast: (summary: string, detail?: string) => unknown
} | null>(null);


