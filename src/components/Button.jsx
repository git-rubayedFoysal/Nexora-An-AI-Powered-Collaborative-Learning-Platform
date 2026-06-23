function Button({ type = "button", children, className = "", ...props }) {
  return (
    <button
      type={type}
      className={`${className} py-3 rounded-lg cursor-pointer font-bold text-sm ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
