'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/tweets/profile');
      if (!response.ok) throw new Error('Error al cargar tweets');
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error('Error loading profile tweets:', error);
      setError('Error al cargar los tweets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTweets();
    }
  }, [session]);

  const handleDeleteTweet = (deletedTweetId) => {
    setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== deletedTweetId));
  };

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  // Generar el username de forma segura
  const username = session.user.name ? 
    session.user.name.toLowerCase().replace(/\s+/g, '') : 
    'usuario';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Tu Perfil</h1>
        <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
          <img 
            src={session.user.image} 
            alt={session.user.name}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{session.user.name}</h2>
            <p className="text-gray-400">@{username}</p>
            <div className="mt-2 text-sm text-gray-400">
              <span className="font-bold text-white">{tweets.length}</span> tweets publicados
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div className="divide-y divide-gray-800">
          <AnimatePresence mode="popLayout">
            {tweets.map((tweet) => (
              <TweetCard 
                key={tweet._id} 
                tweet={tweet} 
                onDelete={handleDeleteTweet}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}