// src/app/api/blog/[id]/comments/add/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { id } = params;
  const { content, userId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        blogPostId: id,
        userId,
      },
    });

    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}
