"use client";
import { useEffect } from "react";

export default function ViewportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height;
      if (vh) {
        document.documentElement.style.setProperty("--app-height", `${vh}px`);
      }
    };

    updateHeight();
    window.visualViewport?.addEventListener("resize", updateHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, []);

  return <>{children}</>;
}