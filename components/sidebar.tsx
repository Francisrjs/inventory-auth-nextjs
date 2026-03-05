"use client";

import {
  BarChart3,
  Package,
  Plus,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth-actions";
import { useState } from "react";

interface UserInfo {
  name?: string;
  email?: string;
  image?: string | null;
}

export default function Sidebar({
  currentPath = "/dashboard",
  user,
}: {
  currentPath: string;
  user?: UserInfo;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-7 h-7 text-indigo-500" />
          <span className="text-lg font-semibold">Inventory</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <div className="text-sm font-semibold text-gray-400 uppercase mb-4">
          Menu
        </div>
        {navigation.map((item, key) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-700 pt-4 space-y-3">
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                    {getInitials(user.name, user.email)}
                  </div>
                )}
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* Remplazo de Neon a BetterAuth ya que no tiene UserButton en UI */}
            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sign Out Button (fallback if no user) */}
        {!user && (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
