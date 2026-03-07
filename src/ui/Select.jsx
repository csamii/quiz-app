import { ChevronDownIcon } from "lucide-react";

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative w-full">
      <select
        className={`
          flex w-full items-center justify-between gap-2
          rounded-md border border-input bg-input-background px-3 py-2
          text-sm whitespace-nowrap outline-none appearance-none
          focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring
          disabled:cursor-not-allowed disabled:opacity-50
          data-[placeholder]:text-muted-foreground
          h-9
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {/* Dropdown chevron */}
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50"
      />
    </div>
  );
}

export { Select };