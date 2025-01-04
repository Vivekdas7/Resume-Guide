import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2 
      className={cn("h-4 w-4 animate-spin", className)} 
      {...props} 
    />
  )
}

export function ExclamationCircle({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <AlertCircle 
      className={cn("h-4 w-4", className)} 
      {...props}
    />
  )
} 