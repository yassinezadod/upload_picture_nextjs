// /api/payment/getPayments/route.js

import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        file: true, // Inclut les informations sur le fichier (étudiant)
      },
    });

    // Chemin de base pour les images
    const basePath = '/uploads/';

    const updatedPayments = payments.map(payment => ({
      ...payment,
      file: {
        ...payment.file,
        picture: payment.file.picture ? basePath + path.basename(payment.file.picture) : null,
      }
    }));

    return new Response(JSON.stringify(updatedPayments), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements : ", error);
    return new Response('Erreur lors de la récupération des paiements', { status: 500 });
  }
}
