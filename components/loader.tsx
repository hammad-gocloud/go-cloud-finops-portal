// Loader.jsx
import React from "react";

const Loader = ({
  size = "h-16 w-16",
  color = "border-blue-500",
  title = "Loading...",
  subtitle = "Please wait while we fetch your data",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Spinner */}
      <div
        className={`border-4 border-t-transparent border-solid rounded-full animate-spin ${size} ${color}`}
      ></div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

      {/* Subtitle */}
      <p className="text-gray-500 text-center max-w-xs">{subtitle}</p>
    </div>
  );
};

export default Loader;
