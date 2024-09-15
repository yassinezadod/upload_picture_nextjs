// app/api/payment/postPayments/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json(); // Assurez-vous que vous parsez les données JSON

    // Convertir les données aux types corrects
    const fileId = parseInt(data.fileId, 10); // Convertir en entier
    const amount = parseFloat(data.amount); // Convertir en float
    const paymentDate = new Date(data.paymentDate);
    const period = data.period; // Assurez-vous que c'est une valeur valide pour l'enum PaymentPeriod
    const status = data.status; // Assurez-vous que c'est une valeur valide pour l'enum PaymentStatus
    const reference = data.reference;

    if (isNaN(fileId) || isNaN(amount) || !paymentDate || !period || !status || !reference) {
      return NextResponse.json({ message: 'Invalid or missing fields' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        fileId: fileId,
        amount: amount,
        paymentDate: paymentDate,
        period: period, // Assurez-vous que la valeur correspond à l'enum PaymentPeriod
        status: status, // Assurez-vous que la valeur correspond à l'enum PaymentStatus
        reference: reference,
      },
    });

    return NextResponse.json({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ message: 'Error creating payment' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true, // Assurez-vous que le bodyParser est configuré
  },
};
