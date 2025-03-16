"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AuthButton from '@/components/AuthButton';
import { useSession } from 'next-auth/react';
import TweetForm from './TweetForm';

const TwitterNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTweetModal, setShowTweetModal] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    {
      name: "Inicio",
      href: "/",
      icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
      inactiveColor: "white",
      activeColor: "#1D9BF0",
    },
    {
      name: "Explorar",
      href: "/explore",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      inactiveColor: "white",
      activeColor: "#1D9BF0",
    },
    {
      name: "Notificaciones",
      href: "/notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      inactiveColor: "white",
      activeColor: "#1D9BF0",
    },
    {
      name: "Mensajes",
      href: "/messages",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      inactiveColor: "white",
      activeColor: "#1D9BF0",
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      inactiveColor: "white",
      activeColor: "#1D9BF0",
    },
  ];

  return (
    <>
      {/* Versión Desktop - Oculta en mobile */}
      <nav className="hidden md:flex fixed h-screen flex-col justify-between px-4 py-2 border-r border-gray-800 w-[250px] bg-black">
        {/* Logo y navegación */}
        <div className="space-y-4">
          <div className="px-3 py-1">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          <div className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-4 px-4 py-3 rounded-full hover:bg-gray-900 transition-colors ${
                  pathname === item.href ? "font-bold" : "font-normal"
                }`}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke={pathname === item.href ? item.activeColor : item.inactiveColor}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={pathname === item.href ? "2.5" : "2"}
                    d={item.icon}
                  />
                </svg>
                <span className="text-xl text-white">{item.name}</span>
              </Link>
            ))}
          </div>

          {session && (
            <button 
              onClick={() => setShowTweetModal(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 text-xl font-bold transition-colors"
            >
              Tweet
            </button>
          )}
        </div>

        {/* AuthButton en la parte inferior */}
        <div className="mt-auto border-t border-gray-800 pt-2">
          <AuthButton />
        </div>
      </nav>

      {/* Modal de Tweet */}
      {showTweetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Crear Tweet</h2>
              <button 
                onClick={() => setShowTweetModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <TweetForm onClose={() => setShowTweetModal(false)} />
          </div>
        </div>
      )}

      {/* Versión Mobile - Solo se muestra en mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="p-3 rounded-full hover:bg-gray-900 relative group"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke={pathname === item.href ? item.activeColor : item.inactiveColor}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={pathname === item.href ? "2.5" : "2"}
                  d={item.icon}
                />
              </svg>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default TwitterNavbar;
