import { connectDB } from '@/app/lib/mongodb';
import Tweet from '@/app/models/Tweet';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const checkLimit = searchParams.get('checkLimit') === 'true';

    // Si estamos verificando el límite
    if (checkLimit) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTweetsCount = await Tweet.countDocuments({
        author: session.user.id,
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      });

      return NextResponse.json({
        remainingTweets: Math.max(0, 10 - todayTweetsCount),
        hasReachedLimit: todayTweetsCount >= 10
      });
    }

    // Código existente para obtener tweets
    const limit = 20;
    const skip = (page - 1) * limit;

    await connectDB();
    
    // Obtener el total de tweets para la paginación
    const total = await Tweet.countDocuments();
    
    const tweets = await Tweet.find()
      .populate('author', 'name image _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Convertir los ObjectId a strings
    const serializedTweets = tweets.map(tweet => ({
      ...tweet,
      _id: tweet._id.toString(),
      author: tweet.author ? {
        ...tweet.author,
        _id: tweet.author._id.toString()
      } : null,
      createdAt: tweet.createdAt.toISOString()
    }));

    return NextResponse.json({
      tweets: serializedTweets,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: skip + tweets.length < total
      }
    });
  } catch (error) {
    console.error('Error loading tweets:', error);
    return NextResponse.json({ error: 'Error al cargar tweets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();

    // Obtener la fecha de inicio y fin del día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Contar tweets del usuario para hoy
    const todayTweetsCount = await Tweet.countDocuments({
      author: session.user.id,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Verificar si el usuario ha alcanzado el límite
    if (todayTweetsCount >= 10) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de 10 tweets por día. Intenta de nuevo mañana.' },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    const tweet = await Tweet.create({
      content: data.content,
      author: session.user.id,
      image: data.image
    });

    // Poblar el autor y formatear la respuesta
    const populatedTweet = await Tweet.findById(tweet._id)
      .populate('author', 'name image _id')
      .lean();

    // Serializar el tweet para la respuesta
    const serializedTweet = {
      ...populatedTweet,
      _id: populatedTweet._id.toString(),
      author: {
        ...populatedTweet.author,
        _id: populatedTweet.author._id.toString()
      },
      createdAt: populatedTweet.createdAt.toISOString()
    };

    return NextResponse.json(serializedTweet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}