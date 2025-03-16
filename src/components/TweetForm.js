'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function TweetForm({ onClose, onTweetPosted }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [remainingTweets, setRemainingTweets] = useState(10);
  
  const { data: session } = useSession();
  const router = useRouter();
  const maxLength = 280;
  
  const checkTweetLimit = async () => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/tweets?checkLimit=true');
      const data = await response.json();
      
      setRemainingTweets(data.remainingTweets);
      if (data.hasReachedLimit) {
        setError('Has alcanzado el límite de 10 tweets por día. Intenta de nuevo mañana.');
        setHasReachedLimit(true);
      }
    } catch (err) {
      console.error('Error al verificar el límite de tweets:', err);
    }
  };
  
  // Verificar el límite de tweets al cargar el componente
  useEffect(() => {
    checkTweetLimit();
  }, [session]);
  
  if (!session) {
    return (
      <div className="text-center p-4 bg-gray-800 text-white rounded-lg m-4">
        <span>🔒 Debes{' '}</span>
        <button 
          onClick={() => signIn('github')} 
          className="text-blue-400 hover:underline"
        >
          iniciar sesión
        </button>
        <span>{' '}para publicar</span>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!content.trim() || isSubmitting || hasReachedLimit) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          author: session.user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al publicar el tweet');
      }

      // Limpiar el formulario
      setContent('');
      setIsExpanded(false);
      
      // Actualizar el límite
      await checkTweetLimit();
      
      // Notificar al componente padre con el nuevo tweet
      if (onTweetPosted) {
        onTweetPosted(data);
      }
      
      // Disparar evento global de nuevo tweet
      window.dispatchEvent(new Event('newTweet'));
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('límite')) {
        setHasReachedLimit(true);
      }
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-b border-gray-800 p-4 select-none">
      <form onSubmit={handleSubmit} className="pointer-events-none">
        <div className="flex gap-4">
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-12 w-12 rounded-full pointer-events-none"
          />
          <div className="flex-1 relative">
            <div className="pointer-events-auto">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="¿Qué está pasando?"
                className="w-full bg-transparent text-white text-lg placeholder-gray-500 outline-none resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                style={{
                  height: isExpanded ? '120px' : '50px',
                  transition: 'height 0.2s ease'
                }}
                maxLength={maxLength}
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                key="error"  // Clave única para el primer bloque
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mt-2"
                >
                  {error}
                </motion.div>
              )}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between mt-2 pointer-events-auto"
                >
                  <span className="text-sm text-gray-500">
                    {content.length}/{maxLength}
                    {!hasReachedLimit && remainingTweets < 5 && (
                      <span className="ml-2 text-yellow-500">
                        ({remainingTweets} tweets restantes)
                      </span>
                    )}
                  </span>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting || hasReachedLimit}
                    className={`px-4 py-2 rounded-full font-bold text-white ${
                      !content.trim() || isSubmitting || hasReachedLimit
                        ? 'bg-blue-500/50 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                    }`}
                  >
                    {isSubmitting ? 'Publicando...' : hasReachedLimit ? 'Límite alcanzado' : 'Publicar'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </div>
  );
}