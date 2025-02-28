
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
    variant?: "default" | "ghost";
    isActive?: boolean;
  }[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({
  isOpen = true,
  onOpenChange,
  items,
  header,
  footer,
  className,
  ...props
}: SidebarProps) {
  const isMobile = useMobile();

  return (
    <aside
      className={cn(
        "group flex h-screen flex-col border-r transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          isOpen ? "justify-between" : "justify-center"
        )}
      >
        {isOpen && header}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            onClick={() => onOpenChange?.(!isOpen)}
          >
            <ToggleIcon isOpen={isOpen} />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {items.map((item, index) => (
            <Button
              key={index}
              asChild
              size="sm"
              variant={item.variant || (item.isActive ? "default" : "ghost")}
              className={cn(
                "justify-start",
                !isOpen && "justify-center px-0"
              )}
            >
              <a href={item.href}>
                {item.icon}
                {isOpen && <span className="ml-2">{item.title}</span>}
              </a>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      {footer && (
        <>
          <Separator />
          <div
            className={cn(
              "flex h-14 items-center px-4",
              isOpen ? "justify-between" : "justify-center"
            )}
          >
            {footer}
          </div>
        </>
      )}
    </aside>
  );
}

function ToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      {isOpen ? (
        <>
          <path d="m15 4-8 8 8 8" />
        </>
      ) : (
        <>
          <path d="m9 4 8 8-8 8" />
        </>
      )}
    </svg>
  );
}
