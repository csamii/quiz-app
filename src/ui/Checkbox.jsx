
function Checkbox({ id, label, checked = false, onChange, disabled = false, className = "", ...props }) {
    return (
        <label
            htmlFor={id}
            className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold"
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={`h-3 w-3 appearance-none border-2 border-slate-500 rounded-sm checked:bg-black ${className}`}
                {...props}
            />
            {label && <span>{label}</span>}
        </label>
    );
}

export { Checkbox };