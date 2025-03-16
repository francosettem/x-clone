// components/AuthButton.js
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-full h-12 bg-gray-800 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      {session ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <img 
              src={session.user.image} 
              alt={session.user.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="text-center">
              <div className="font-bold text-white">{session.user.name}</div>
              <div className="text-sm text-gray-400">@{session.user.name.toLowerCase().replace(/\s+/g, '')}</div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn('github')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold transition-colors"
        >
          Iniciar Sesión con GitHub
        </button>
      )}
    </div>
  );
}