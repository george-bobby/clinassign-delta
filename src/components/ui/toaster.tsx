
// Import from the radix UI toast primitives directly
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import {
  useToast as useToastPrimitive,
} from "@/hooks/use-toast-primitive"

// Export the toast function for other components to use
export const toast = {
  success: (message: string) => {
    // Implementation of toast.success
    const { toast } = useToastPrimitive();
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  error: (message: string) => {
    // Implementation of toast.error
    const { toast } = useToastPrimitive();
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
  info: (message: string) => {
    // Implementation of toast.info
    const { toast } = useToastPrimitive();
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  },
  warning: (message: string) => {
    // Implementation of toast.warning
    const { toast } = useToastPrimitive();
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    });
  },
  // Export the useToast hook's toast function directly
  show: (props: any) => {
    const { toast } = useToastPrimitive();
    toast(props);
  }
};

export function Toaster() {
  const { toasts } = useToastPrimitive()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export { useToastPrimitive as useToast }
