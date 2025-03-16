'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCard from '@/components/TweetCard';
import SearchBar from '@/components/SearchBar';

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

export default function ExplorePage() {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    if (query.trim().length < 2) {
      setError('El término de búsqueda debe tener al menos 2 caracteres');
      setHasSearched(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setTweets([]); // Limpiamos los tweets anteriores inmediatamente

    try {
      const response = await fetch(`/api/tweets/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar tweets');
      }
      
      // Pequeño retraso para evitar el doble scroll
      setTimeout(() => {
        setTweets(data);
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error searching tweets:', error);
      setError(error.message || 'Error al buscar tweets');
      setIsLoading(false);
    }
  };

  const handleDeleteTweet = (deletedTweetId) => {
    setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== deletedTweetId));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Explorar Tweets</h1>
      <SearchBar onSearch={handleSearch} />
      
      <div className="relative overflow-hidden">
        <motion.div 
          className="divide-y divide-gray-800"
          initial={false}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center p-4 text-red-500">
              {error}
            </div>
          ) : hasSearched ? (
            tweets.length > 0 ? (
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
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 text-gray-500"
              >
                No se encontraron tweets
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 text-gray-500"
            >
              Ingresa un término para buscar tweets
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 