"use client";
import { useEffect, useState } from "react";
import { getOpenStatus } from "@/lib/hours";
export function OpenStatus() {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    label: string;
  } | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setStatus(getOpenStatus()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <span className="status" data-open={status?.isOpen}>
      {status?.label ?? "Hours shown below"}
    </span>
  );
}
