import * as React from "react";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Menu({ open, onClose, anchorEl, children, style }: MenuProps) {
  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (anchorEl && anchorEl.contains(e.target as Node)) return;
      onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorEl]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        minWidth: 160,
        background: "var(--vscode-menu-background, var(--vscode-editorWidget-background))",
        color: "var(--vscode-menu-foreground, var(--vscode-editorWidget-foreground))",
        border: "1px solid var(--vscode-menu-border, var(--vscode-editorWidget-border))",
        borderRadius: "var(--radius-1)",
        boxShadow: "var(--shadow-1)",
        zIndex: 1000,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface MenuItemProps {
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function MenuItem({ icon, onClick, children, style }: MenuItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onClick) onClick(e);
    // Dismiss menu by bubbling up
    const menu = e.currentTarget.closest('[role="menu"]');
    if (menu) {
      (menu as any).dispatchEvent(new CustomEvent('menu-close', { bubbles: true }));
    }
  };
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-1) var(--space-2)",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}
