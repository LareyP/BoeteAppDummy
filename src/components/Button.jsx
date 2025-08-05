import React from "react";

export function Button({ children, className = "", ...props }) {
  const baseStyles = "rounded px-4 py-2 font-medium transition-colors duration-200";
  const defaultStyles =
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";

  return (
    <button
    className="bg-iosBlue text-white hover:bg-blue-700 dark:hover:bg-blue-600 p-1 mt-2 rounded-md shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;