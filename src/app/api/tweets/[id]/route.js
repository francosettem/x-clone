import { connectDB } from '@/app/lib/mongodb';
import Tweet from '@/models/Tweet';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'ID de tweet inválido' }, { status: 400 });
    }

    const tweet = await Tweet.findById(params.id);

    if (!tweet) {
      return NextResponse.json({ error: 'Tweet no encontrado' }, { status: 404 });
    }

    // Verificar si el usuario es el autor del tweet
    if (tweet.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado para eliminar este tweet' }, { status: 403 });
    }

    await Tweet.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Tweet eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tweet:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 