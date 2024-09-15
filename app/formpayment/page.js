"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaymentForm() {
  const [fileId, setFileId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [period, setPeriod] = useState('JANUARY'); // Valeur par défaut
  const [status, setStatus] = useState('PAID'); // Valeur par défaut
  const [reference, setReference] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);

  useEffect(() => {
    axios.get('/api/getpicture')
      .then(response => {
        // Assurez-vous que la réponse est une liste d'inscriptions
        if (Array.isArray(response.data)) {
          setInscriptions(response.data);
        } else {
          throw new Error('Données d\'inscription invalides');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des inscriptions :', error);
        setError('Erreur lors de la récupération des inscriptions');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des données avant l'envoi
    if (!fileId || isNaN(parseFloat(amount)) || !paymentDate || !reference) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    try {
      // Envoyer les données au serveur
      const response = await axios.post('/api/payment/postPayments', {
        fileId: parseInt(fileId, 10),
        amount: parseFloat(amount),
        paymentDate,
        period,
        status,
        reference,
      });

      // Gérer la réponse
      setSuccess('Payment created successfully');
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la création du paiement :', err);
      setError('Erreur lors de la création du paiement');
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Payment Form</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="fileId" className="mb-1 font-semibold">Inscription</label>
          <select
            id="fileId"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            className="border rounded p-2"
            required
          >
            <option value="">Select an inscription</option>
            {inscriptions.map(inscription => (
              <option key={inscription.id} value={inscription.id}>
                {inscription.nom} {inscription.prenom} - {inscription.inscription}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount" className="mb-1 font-semibold">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="paymentDate" className="mb-1 font-semibold">Payment Date</label>
          <input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="period" className="mb-1 font-semibold">Period</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded p-2"
            required
          >
            <option value="JANUARY">January</option>
            <option value="FEBRUARY">February</option>
            <option value="MARCH">March</option>
            <option value="APRIL">April</option>
            <option value="MAY">May</option>
            <option value="JUNE">June</option>
            <option value="JULY">July</option>
            <option value="AUGUST">August</option>
            <option value="SEPTEMBER">September</option>
            <option value="OCTOBER">October</option>
            <option value="NOVEMBER">November</option>
            <option value="DECEMBER">December</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="status" className="mb-1 font-semibold">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2"
            required
          >
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="reference" className="mb-1 font-semibold">Reference</label>
          <input
            id="reference"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="border rounded p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
      </form>
    </div>
  );
}
