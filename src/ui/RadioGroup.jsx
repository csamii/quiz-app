import * as React from "react";

function RadioGroup({ className = "", name, value,  onValueChange, children, ...props }) {
  return (
    <div className={`grid gap-3 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name,
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

function RadioGroupItem({ className = "", id, label, name, value,  checked,  onChange, disabled = false,  ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id || value}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`appearance-none forced-colors:appearance-auto rounded-full border-2 border-slate-500 checked:bg-black size-3 border-2 ${className}`}
        {...props}
      />
      <label htmlFor={id || value} className="cursor-pointer text-xs font-bold">
        {label}
      </label>
    </div>
  );
}

export { RadioGroup, RadioGroupItem };