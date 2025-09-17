import * as React from "react";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  rows?: number;
};

const baseStyle: React.CSSProperties = {
  background: "var(--vscode-input-background)",
  color: "var(--vscode-input-foreground)",
  border: "1px solid var(--vscode-input-border)",
  borderRadius: 4,
  outline: "none",
  transition: "box-shadow 0.2s, border-color 0.2s",
};

const focusStyle: React.CSSProperties = {
  border: "#0078d4 1px solid",
};

export function TextField(props: TextFieldProps) {
  const { rows, className, style, ...rest } = props;
  const [focused, setFocused] = React.useState(false);
  const combinedStyle = {
    padding: '8px',
    ...baseStyle,
    ...(focused ? focusStyle : {}),
    ...style,
  };
  if (rows) {
    return (
      <textarea
        rows={rows}
        {...rest}
        className={`input ${className ?? ""}`}
        style={combinedStyle}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      />
    );
  }
  return (
    <input
      {...rest}
      className={`input ${className ?? ""}`}
      style={combinedStyle}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}
