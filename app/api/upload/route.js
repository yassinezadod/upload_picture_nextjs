import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Assurez-vous d'utiliser un parser de données approprié pour récupérer le fichier
    const data = await req.formData();
    const image = data.get('image');

    if (!image) {
      return NextResponse.json({ message: 'No image uploaded' }, { status: 400 });
    }

    // Créer un chemin pour sauvegarder l'image dans le dossier app
    const uploadDir = path.join(process.cwd(), 'app/uploads');
    const filePath = path.join(uploadDir, image.name);

    // Créer le dossier s'il n'existe pas déjà
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Écrire l'image sur le disque
    fs.writeFileSync(filePath, Buffer.from(await image.arrayBuffer()));

    // Sauvegarder l'URL relative de l'image dans la base de données
    const file = await prisma.file.create({
      data: {
        picture: `/app/uploads/${image.name}`,
      },
    });

    return NextResponse.json({ message: 'Image uploaded successfully', url: file.picture });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Désactiver le body parser pour gérer les fichiers
  },
};
