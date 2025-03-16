'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function TweetCard({ tweet, onDelete }) {
  const { content, author, createdAt, _id } = tweet;
  const { data: session } = useSession();
  const router = useRouter();
  
  const date = new Date(createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este tweet?')) {
      try {
        const response = await fetch(`/api/tweets/${_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Notificar al componente padre que el tweet fue eliminado
          if (onDelete) {
            onDelete(_id);
          }
        } else {
          const data = await response.json();
          alert(data.error || 'Error al eliminar el tweet');
        }
      } catch (error) {
        console.error('Error al eliminar el tweet:', error);
        alert('Error al eliminar el tweet');
      }
    }
  };

  // Verificar si el usuario actual es el autor del tweet
  const isAuthor = session?.user?.id && author?._id && 
    session.user.id.toString() === author._id.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      className="p-4 hover:bg-gray-900/5 select-none"
    >
      <div className="flex space-x-3">
        <img
          src={author?.image}
          alt={author?.name}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-white truncate">
                {author?.name}
              </p>
              <span className="text-sm text-gray-500">· {date}</span>
            </div>
            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Eliminar tweet"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            )}
          </div>
          <p className="text-white mt-1 whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}
