"use client";

import Header from "@/components/ui/header/Header";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import { getUser } from "@/lib/getUser";
import React, { useState } from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contentCollapsed, setContentCollapsed] = useState(true);

  const user = getUser();

  const handleSidebarCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setContentCollapsed(!contentCollapsed);
  };

  const handleForceSidebarCollapsed = () => {
    setSidebarCollapsed(true);
    setContentCollapsed(false);
  };

  return (
    <main className="bg-zinc-200 min-h-screen">
      <div
        className={`sidebar ${sidebarCollapsed && "collapsed"}`}
        id="sidebar"
      >
        <Sidebar
          handleSidebarCollapsed={handleSidebarCollapsed}
          handleForceSidebarCollapsed={handleForceSidebarCollapsed}
          user={user}
        />
      </div>
      <div className={`content-wrapper ${contentCollapsed && "collapsed"}`}>
        <Header
          handleSidebarCollapsed={handleSidebarCollapsed}
          handleForceSidebarCollapsed={handleForceSidebarCollapsed}
        />
        <div className="p-4">{children}</div>
      </div>
    </main>
  );
}
