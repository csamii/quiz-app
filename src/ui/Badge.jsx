const badgeVariants = {
    default: "border-transparent bg-green-900 text-white [a&]:hover:bg-green/90",
    secondary: "border-transparent bg-green-400 text-white [a&]:hover:bg-green/90",
    mid: "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow/90",
    primary: "border-transparent bg-orange-500 text-white [a&]:hover:bg-orange/90",
    destructive: "border-transparent bg-red-500 text-white [a&]:hover:bg-red/90 focus-visible:ring-red/20 dark:focus-visible:ring-red/40 dark:bg-red/60",
    outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
};

function Badge({ className = "", variant = "default", children, ...props }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden 
        ${badgeVariants[variant] || badgeVariants.default} ${className}`}
        {...props}
    >
      {children}
    </span>
  );
}

export { Badge };