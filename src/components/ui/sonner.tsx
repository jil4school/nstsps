"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      style={
        {
          /* remove all borders */
          "--normal-border": "transparent",
          "--success-border": "transparent",
          "--error-border": "transparent",

          /* normal */
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",

          /* success */
          "--success-bg": "rgb(16 185 129)", // green-500
          "--success-text": "white",

          /* error */
          "--error-bg": "rgb(239, 68, 68)", // red-400
          "--error-text": "white",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
