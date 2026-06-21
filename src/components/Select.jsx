import { forwardRef, useId } from "react";

const Select = forwardRef(
  ({ label, className = "", options = [], ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full text-left flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="inline-block mb-2 pl-1 font-semibold text-gray-300"
          >
            {label}
          </label>
        )}

        <select
          id={id}
          className={`${className} cursor-pointer border py-3 px-2 border-[#3a3a3a] rounded-lg focus:border-blue-500`}
          ref={ref}
          {...props}
        >
          {options?.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#2a2a2a] border-none outline-0"
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default Select;
