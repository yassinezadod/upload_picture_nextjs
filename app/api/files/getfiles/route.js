// app/api/files/getfiles/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const url = new URL(request.url);
  const classId = parseInt(url.searchParams.get('classId'));

  if (isNaN(classId)) {
    return new Response('ID de classe invalide', { status: 400 });
  }

  try {
    const files = await prisma.file.findMany({
      where: {
        classId: classId
      },
    });

    return new Response(JSON.stringify(files), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return new Response('Erreur lors de la récupération des fichiers', { status: 500 });
  }
}
