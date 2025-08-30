"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Archive,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

// Background Component
const MovingTextBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ x: ["-10%", "10%", "-10%"], y: ["5%", "-5%", "5%"] }}
      transition={{ duration: 40, ease: "linear", repeat: Infinity }}
    >
      <h1 className="text-[20vw] font-black text-white/5 whitespace-nowrap">
        Judge Authority
      </h1>
    </motion.div>
  </div>
);

// Sidebar Component
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/authority" },
    { name: "Case Archive", icon: Archive, href: "/authority/archive" },
    { name: "Analytics", icon: BarChart2, href: "/authority/analytics" },
    { name: "Settings", icon: Settings, href: "/authority/settings" },
  ];

  // Logic to adjust main content margin based on sidebar state
  if (typeof window !== 'undefined') {
    const mainContent = document.getElementById('main-content-wrapper');
    if (mainContent) {
      mainContent.style.marginLeft = isOpen ? '16rem' : '4rem';
    }
  }

  return (
    <motion.aside
      animate={isOpen ? { width: "16rem" } : { width: "4rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-50 h-screen flex flex-col bg-slate-900/50 border-r border-white/10 backdrop-blur-lg text-white"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-[69px]">
        {isOpen && (
           <motion.h1 initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.2}} className="text-xl font-bold">Bail Reckoner</motion.h1>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-white/10">
          {isOpen ? <ChevronLeft /> : <Menu />}
        </button>
      </div>
      <nav className="flex-grow p-2">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <motion.div
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                pathname === item.href ? 'bg-white/10' : ''
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </motion.div>
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-white/10">
        <motion.a href="#" whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} className="flex items-center gap-4 p-3 rounded-lg">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium">Logout</span>}
        </motion.a>
      </div>
    </motion.aside>
  );
};

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white selection:bg-blue-500/30">
      <MovingTextBackground />
      <Sidebar />
      <div id="main-content-wrapper" className="relative z-10 flex min-h-screen flex-col justify-between transition-all duration-300">
        <div>
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-lg border-b border-white/10"
          >
            <div className="container mx-auto flex items-center justify-end px-4 py-4 h-[69px]">
              <motion.div whileHover={{ scale: 1.05 }} className="font-medium text-gray-300">
                Judicial Authority Portal
              </motion.div>
            </div>
          </motion.header>
          {children}
        </div>
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full border-t border-white/10 bg-slate-900/30 py-6 text-center"
        >
          <div className="container mx-auto px-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Bail Reckoner. All Rights Reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}