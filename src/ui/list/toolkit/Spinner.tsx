import * as React from "react";

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "inline-block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        stroke="var(--vscode-progressBar-background, var(--vscode-statusBarItem-background))"
        strokeWidth="3"
        fill="none"
        strokeDasharray={Math.PI * (size - 4)}
        strokeDashoffset={Math.PI * (size - 4) * 0.25}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
