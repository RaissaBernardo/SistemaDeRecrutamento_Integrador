import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);
  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
