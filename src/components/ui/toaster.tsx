
import { useToast as useToastHook } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// Export the toast function for other components to use
export const toast = {
  success: (message: string) => {
    // Implementation of toast.success
    const { toast } = useToastHook();
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  error: (message: string) => {
    // Implementation of toast.error
    const { toast } = useToastHook();
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
  info: (message: string) => {
    // Implementation of toast.info
    const { toast } = useToastHook();
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  },
  warning: (message: string) => {
    // Implementation of toast.warning
    const { toast } = useToastHook();
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    });
  },
  // Export the useToast hook's toast function directly
  show: (props: any) => {
    const { toast } = useToastHook();
    toast(props);
  }
};

export function Toaster() {
  const { toasts } = useToastHook()

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

export { useToastHook as useToast }
