
const Button = ({ title, onClick, disabled = false, loading = false, className = "", type = "button", children, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-md text-sm font-medium transition-all h-auto px-4 py-2 ${className}`}
      {...props}
    >
      {loading ? "Loading..." : title || children}
    </button>
  );
};

export default Button;