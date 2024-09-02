import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import mime from 'mime-types'; // Importez la bibliothèque mime-types

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les fichiers uploadés
    const files = await prisma.file.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    if (files.length === 0) {
      return NextResponse.json({ message: 'No images found' }, { status: 404 });
    }

    // Construire les chemins complets et lire les fichiers
    const imagesData = files.map(file => {
      const filePath = path.join(process.cwd(), 'app/uploads', path.basename(file.picture));
      
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(path.extname(file.picture)) || 'application/octet-stream';
        return {
          fileName: file.picture,
          fileData: fileBuffer.toString('base64'),
          mimeType: mimeType,
        };
      }
      return null;
    }).filter(image => image !== null);

    if (imagesData.length === 0) {
      return NextResponse.json({ message: 'No valid images found' }, { status: 404 });
    }

    // Retourner les images en JSON
    return NextResponse.json(imagesData);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}
