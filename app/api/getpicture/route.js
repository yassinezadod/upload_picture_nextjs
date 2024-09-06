import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import mime from 'mime-types'; // Importer la bibliothèque mime-types

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les fichiers uploadés de la base de données
    const files = await prisma.file.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    if (files.length === 0) {
      return NextResponse.json({ message: 'Aucune image trouvée' }, { status: 404 });
    }

    // Construction des chemins complets et lecture des fichiers
    const imagesData = files.map(file => {
      const filePath = path.join(process.cwd(), 'app/uploads', path.basename(file.picture));
      
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(path.extname(file.picture)) || 'application/octet-stream';

        return {
          id: file.id,  // Ajout de l'ID pour une meilleure gestion
          nom: file.nom,  // Nom de la personne
          prenom: file.prenom,  // Prénom de la personne
          birthDate: file.birthDate,  // Récupération du champ birthDate
          ecoleOrigine: file.ecoleOrigine,  // Récupération du champ ecoleOrigine
          genre: file.genre,  // Récupération du champ genre
          inscription: file.inscription,  // Récupération du champ inscription
          telephone: file.telephone,  // Récupération du champ telephone
          fileName: path.basename(file.picture),  // Nom du fichier
          fileData: fileBuffer.toString('base64'),  // Conversion en base64
          mimeType: mimeType,  // Type MIME
        };
      }
      return null;
    }).filter(image => image !== null);

    if (imagesData.length === 0) {
      return NextResponse.json({ message: 'Aucune image valide trouvée' }, { status: 404 });
    }

    // Retourner les données d'images en JSON
    return NextResponse.json(imagesData);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des images' }, { status: 500 });
  }
}
