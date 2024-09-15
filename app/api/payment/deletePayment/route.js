// Importation de Prisma
import { PrismaClient } from '@prisma/client';

// Création d'une instance de PrismaClient
const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // Extraire l'ID du paiement à supprimer depuis la requête
    const { paymentId } = await req.json();

    // Validation de l'ID du paiement
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'L\'ID du paiement est obligatoire' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Suppression du paiement de la base de données
    const deletedPayment = await prisma.payment.delete({
      where: {
        id: parseInt(paymentId), // Assurez-vous que l'ID est converti en entier
      },
    });

    // Retourner une réponse confirmant la suppression
    return new Response(JSON.stringify(deletedPayment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);

    // Retourner une réponse d'erreur
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression du paiement' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
