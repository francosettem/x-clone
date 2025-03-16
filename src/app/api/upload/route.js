import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export async function POST(req) {
  const { image } = await req.json();
  
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'twitter-clone'
    });
    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
}