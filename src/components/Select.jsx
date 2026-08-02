import { useId, forwardRef } from "react";

// A dropdown select with an optional label above it
function Select({ options, label, className = "", ...props }, ref) {
  const id = useId();

  return (
    <div className="w-full text-left">
      {label && (
        <label
          className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${className} nx-input w-full px-3.5 py-3 rounded-lg text-sm bg-white/5 border-2 border-[#3e3e3e] text-white placeholder-slate-dark transition-all`}
        ref={ref}
        {...props}
      >
        {options?.map((option) => (
          <option
            style={{
              backgroundColor: "var(--color-navy-3)",
              color: "#e8eaf6",
            }}
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default forwardRef(Select);
