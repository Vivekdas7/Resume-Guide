import * as React from "react"

import { cn } from "@/lib/utils"
import { Spinner, ExclamationCircle } from "@/components/icons"

const Input = React.forwardRef<
  HTMLInputElement, 
  React.ComponentProps<"input"> & {
    error?: boolean
    loading?: boolean
  }
>(({ className, type, error, loading, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-base",
          "transition-all duration-200",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          error && "border-destructive focus:ring-destructive",
          loading && "bg-muted cursor-wait",
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      />
      {loading && (
        <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />
      )}
      {error && (
        <ExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
