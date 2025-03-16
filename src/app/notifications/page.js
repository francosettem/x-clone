'use client';

import { motion } from 'framer-motion';

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Notificaciones</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/50 rounded-xl p-8 text-center"
      >
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          No tienes notificaciones
        </h2>
        <p className="text-gray-400">
          Las notificaciones aparecerán aquí cuando haya actividad en tu cuenta
        </p>
      </motion.div>
    </div>
  );
} 