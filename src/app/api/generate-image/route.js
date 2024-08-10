import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebaseabc'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
 // Replace with your Hugging Face token

async function query(data) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error generating image');
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToFirebase(imageBuffer) {
  const fileName = `images/${Date.now()}.png`;
  const storageRef = ref(storage, fileName);

  // Convert the buffer to a Blob
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  await uploadBytes(storageRef, blob);

  const url = await getDownloadURL(storageRef);
  return url;
}

export async function POST(request) {
  try {
    // Extract the user ID from the request headers
    const userId = request.headers.get('user-id');

    if (!userId) {
      console.error('User ID is undefined');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json(); // No need to extract isPublic

    const imageBuffer = await query({ inputs: text });
    const imageUrl = await uploadToFirebase(imageBuffer);

    // Store image information in the database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        prompt: text, // Store the prompt used to generate the image
        userId: userId,
        // isPublic defaults to false
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
