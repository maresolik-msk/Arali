import * as React from "react";
import { Calendar } from "lucide-react";
import { Input } from "./input";
import { cn } from "./utils";

const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          type="date"
          className={cn("pl-10 text-gray-900 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500", className)}
          ref={ref}
          {...props}
        />
        <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
