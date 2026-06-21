function Button({
  type = "button",
  children,
  bgColor = "bg-blur-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className} ${bgColor} ${textColor} py-2 px-6 rounded-lg cursor-pointer font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${bgColor === "bg-blur-600" ? "hover:bg-blur-500 active:bg-blur-700" : ""} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
