"use client";
import { useEffect } from "react";

export default function ViewportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const setHeight = () => {
      // ✅ ALWAYS use innerHeight (stable)
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setHeight();

    // Only update on orientation change (not keyboard)
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);

  return <>{children}</>;
}