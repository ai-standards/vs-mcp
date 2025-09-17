import * as React from "react";

export function Radio(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="radio"
      {...props}
      style={{
        accentColor: "var(--vscode-radio-background, var(--vscode-editorWidget-background))",
        ...props.style,
      }}
    />
  );
}
