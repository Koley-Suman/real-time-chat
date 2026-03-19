import React from "react";

interface ProgressCircleProps {
  progress: number;
}

const ProgressCircle = ({ progress }: ProgressCircleProps) => {
  console.log("progress:", progress);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="50" height="50" className="rotate-[-90deg]">
      {/* background circle */}
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="3"
        fill="transparent"
      />

      {/* progress circle */}
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="#8b5cf6"
        strokeWidth="3"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.2s ease" }}
      />
    </svg>
  );
};

export default ProgressCircle;