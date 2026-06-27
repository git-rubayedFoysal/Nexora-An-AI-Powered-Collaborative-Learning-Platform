import { forwardRef, useId } from "react";

const Radio = forwardRef(({ label, value, ...props }, ref) => {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="
      flex items-center gap-3
      px-2 py-2.5 border-2 border-violet-light
      rounded-lg cursor-pointer justify-center
      transition-all font-bold
      hover:border-violet-500
      peer-checked:border-violet-500
    "
    >
      <input
        id={id}
        ref={ref}
        type="radio"
        value={value}
        className="peer hidden"
        {...props}
      />

      {/* circle */}
      <div
        className="
        h-5 w-5 rounded-full
        border-2 border-violet-light
        transition-all
        peer-checked:border-violet-500
        peer-checked:bg-violet-500
      "
      />

      <span className="text-sm peer-checked:text-violet-400">{label}</span>
    </label>
  );
});

export default Radio;
