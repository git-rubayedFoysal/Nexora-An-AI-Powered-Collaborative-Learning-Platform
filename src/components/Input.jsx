import { forwardRef, useId } from "react";

const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full flex flex-col text-left">
        {label && (
          <label
            className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={`${className} nx-input w-full px-3.5 py-3 rounded-lg text-sm bg-white/5 border-2 border-[#3e3e3e] text-white placeholder-slate-dark transition-all`}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

export default Input;
