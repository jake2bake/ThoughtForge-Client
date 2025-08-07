"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Helper to highlight active link
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          ⚔️ ThoughtForge
        </Link>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-start" style={{ marginLeft: "2rem" }}>
          <Link 
            href="/entries" 
            className={`navbar-item ${isActive("/entries") ? "is-active" : ""}`}
          >
            📜 All Entries
          </Link>

          <Link 
            href="/entries/myentries" 
            className={`navbar-item ${isActive("/entries/myentries") ? "is-active" : ""}`}
          >
            ✍️ My Journal
          </Link>

          <Link 
            href="/readings" 
            className={`navbar-item ${isActive("/readings") ? "is-active" : ""}`}
          >
            📚 Readings
          </Link>

          <Link 
            href="/courses" 
            className={`navbar-item ${isActive("/courses") ? "is-active" : ""}`}
          >
            🏛️ Courses
          </Link>

          <Link 
            href="/profile" 
            className={`navbar-item ${isActive("/profile") ? "is-active" : ""}`}
          >
            👤 Profile
          </Link>
        </div>

        <div className="navbar-end" style={{ marginRight: "1rem" }}>
          <div className="navbar-item">
            <button className="button is-primary" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}