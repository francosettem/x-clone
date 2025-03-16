import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Tweet from '@/app/models/Tweet';

// Función para escapar caracteres especiales de regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Se requiere un término de búsqueda' }, { status: 400 });
    }

    // Validar longitud mínima de búsqueda (2 caracteres)
    if (query.trim().length < 2) {
      return NextResponse.json({ error: 'El término de búsqueda debe tener al menos 2 caracteres' }, { status: 400 });
    }

    await connectDB();

    const tweets = await Tweet.find({
      content: { 
        $regex: escapeRegExp(query.trim()), 
        $options: 'i' 
      }
    })
    .populate('author')
    .sort({ createdAt: -1 })
    .limit(50);

    // Serializar los tweets para evitar errores con ObjectId
    const serializedTweets = tweets.map(tweet => ({
      _id: tweet._id.toString(),
      content: tweet.content,
      createdAt: tweet.createdAt,
      author: tweet.author ? {
        _id: tweet.author._id.toString(),
        name: tweet.author.name,
        image: tweet.author.image,
      } : null
    }));

    return NextResponse.json(serializedTweets);
  } catch (error) {
    console.error('Error searching tweets:', error);
    return NextResponse.json(
      { error: 'Error al buscar tweets' },
      { status: 500 }
    );
  }
} 