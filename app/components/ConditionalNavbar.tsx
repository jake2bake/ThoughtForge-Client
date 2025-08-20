// app/components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  
  const hideNavbar = pathname === '/login';
  
  if (hideNavbar) {
    return null;
  }
  
  return <Navbar />;
}