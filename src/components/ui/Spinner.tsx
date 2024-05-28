import React from "react";

// Define an interface for the component's props
interface SpinnerProps {
  size?: "s" | "m" | "l" | "xl" | "xxl";
  color?: "accent" | "neutral";
}

const Spinner = ({ size = "m", color = "accent" }: SpinnerProps) => {
  // Define size classes based on prop
  const sizeClasses = {
    s: "w-4 h-4 border-2",
    m: "w-6 h-6 border-2",
    l: "w-8 h-8 border-4",
    xl: "w-12 h-12 border-4",
    xxl: "w-16 h-16 border-4",
  };
  // Define color classes based on prop
  const colorClasses = {
    accent: "border-accent",
    neutral: "border-neutral-900",
  };

  const spinnerSize = sizeClasses[size];
  const spinnerColor = colorClasses[color];

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${spinnerSize} ${spinnerColor}`}
    ></div>
  );
};

export default Spinner;
