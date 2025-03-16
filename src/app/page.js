'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import TweetForm from '@/components/TweetForm';
import TweetCard from '@/components/TweetCard';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      />
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTweets = async (page = 1, isLoadMore = false) => {
    try {
      const response = await fetch(`/api/tweets?page=${page}`);
      if (!response.ok) throw new Error('Error al cargar tweets');
      const data = await response.json();
      
      if (isLoadMore) {
        setTweets(prev => [...prev, ...data.tweets]);
      } else {
        setTweets(data.tweets);
      }
      
      setHasMore(data.pagination.hasMore);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error('Error loading tweets:', error);
      setError('Error cargando tweets');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Escuchar el evento de nuevo tweet
  useEffect(() => {
    const handleNewTweetEvent = () => {
      fetchTweets(1);
    };

    // Suscribirse al evento
    window.addEventListener('newTweet', handleNewTweetEvent);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('newTweet', handleNewTweetEvent);
    };
  }, []);

  // Cargar tweets iniciales
  useEffect(() => {
    fetchTweets(1);
  }, []);

  const handleNewTweet = async (newTweet) => {
    // Agregar el nuevo tweet al inicio de la lista y recargar
    setTweets(prevTweets => [newTweet, ...prevTweets]);
  };

  const handleDeleteTweet = (deletedTweetId) => {
    setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== deletedTweetId));
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await fetchTweets(currentPage + 1, true);
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TweetForm onTweetPosted={handleNewTweet} />
      <div className="relative overflow-hidden">
        <motion.div 
          className="divide-y divide-gray-800"
          initial={false}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : tweets.length > 0 ? (
            <>
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  {tweets.map((tweet) => (
                    <TweetCard 
                      key={tweet._id} 
                      tweet={tweet} 
                      onDelete={handleDeleteTweet}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              {hasMore && (
                <motion.div 
                  className="py-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <LoadingSpinner />
                    ) : (
                      'Cargar más tweets'
                    )}
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 text-gray-500"
            >
              No hay tweets para mostrar
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}