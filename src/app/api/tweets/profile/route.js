import { connectDB } from '@/app/lib/mongodb';
import Tweet from '@/app/models/Tweet';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const tweets = await Tweet.find({ author: session.user.id })
      .populate('author', 'name image _id')
      .sort({ createdAt: -1 })
      .lean();

    // Serializar los tweets para evitar el error de recursión
    const serializedTweets = tweets.map(tweet => ({
      ...tweet,
      _id: tweet._id.toString(),
      author: tweet.author ? {
        ...tweet.author,
        _id: tweet.author._id.toString()
      } : null,
      createdAt: tweet.createdAt.toISOString()
    }));

    return NextResponse.json(serializedTweets);
  } catch (error) {
    console.error('Error loading profile tweets:', error);
    return NextResponse.json(
      { error: 'Error al cargar los tweets del perfil' },
      { status: 500 }
    );
  }
} 