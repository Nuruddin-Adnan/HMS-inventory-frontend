"use client";

import Header from "@/components/ui/header/Header";
import SidebarAdmin from "@/components/ui/sidebar/SidebarAdmin";
import React, { useState } from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contentCollapsed, setContentCollapsed] = useState(true);

  const handleSidebarCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setContentCollapsed(!contentCollapsed);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <div
        className={`sidebar ${sidebarCollapsed && "collapsed"}`}
        id="sidebar"
      >
        <SidebarAdmin handleSidebarCollapsed={handleSidebarCollapsed} />
      </div>
      <div className={`content-wrapper ${contentCollapsed && "collapsed"}`}>
        <Header handleSidebarCollapsed={handleSidebarCollapsed} />
        <div className="p-4">{children}</div>
      </div>
    </main>
  );
}
