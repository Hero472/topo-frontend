// src/components/ui/Tabs.tsx
import React from "react";
import { cn } from "../../lib/utils";

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md bg-background-tertiary p-1 text-foreground-tertiary",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
            "disabled:pointer-events-none disabled:opacity-50",
            activeTab === tab.value
              ? "bg-background-secondary text-foreground-primary shadow-sm"
              : "hover:bg-background-secondary/50 hover:text-foreground-primary"
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};