function Progress({ value = 0, className = "", ...props }) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-300 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-black transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export { Progress };