
// This file acts as an interface to the toast functionality
// No circular imports here - it just re-exports from components/ui/use-toast.ts
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

export const useToast = useToastOriginal;
