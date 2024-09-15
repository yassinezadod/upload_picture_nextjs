"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';


const months = [
  "septembre", "octobre", "novembre", "décembre", 
  "janvier", "février", "mars", "avril", "mai", "juin"
];

const statuses = {
  PENDING: "En attente",
  UNPAID: "Non payé",
  PAID: "Payé"
};

const getMonthStatus = (month, currentMonthIndex, status) => {
  const monthIndex = months.indexOf(month);
  if (monthIndex > currentMonthIndex) {
    return statuses.PENDING;
  }
  return statuses[status] || statuses.PENDING;
};

const PaiementTable = () => {
  const [paiementData, setPaiementData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [fileId, setFileId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [period, setPeriod] = useState('JANUARY'); // Valeur par défaut
  const [status, setStatus] = useState('PAID'); // Valeur par défaut
  const [reference, setReference] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [inscriptions, setInscriptions] = useState([]); // État pour les inscriptions
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch payment data from the API
    axios.get('/api/payment/getPayments')
      .then(response => {
        setPaiementData(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de paiement :', error);
      });

    // Fetch inscriptions from the API
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

  const handleCellClick = (paiementId, month) => {
    setSelectedCell({ paiementId, month });
    const paiement = paiementData.find(p => p.id === paiementId);
    const currentStatus = paiement?.status[month] || "PENDING";
    setSelectedStatus(currentStatus);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const saveStatus = () => {
    if (selectedCell) {
      const { paiementId, month } = selectedCell;
      const updatedPaiementData = paiementData.map(paiement => {
        if (paiement.id === paiementId) {
          return {
            ...paiement,
            status: {
              ...paiement.status,
              [month]: selectedStatus
            }
          };
        }
        return paiement;
      });
      setPaiementData(updatedPaiementData);
      setSelectedCell(null); // Close the select box after saving
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

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


  


  const currentMonthIndex = new Date().getMonth();

  const filteredPaiementData = paiementData.filter(paiement => {
    const status = paiement.status[selectedMonth];
    return filterStatus === "Tous" || statuses[status] === filterStatus;
  });

  return (
    <div className="p-6">
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
        <center><button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit</button></center>
      </form>

      <br />  <br />  <br />
      <h2 className="text-2xl font-bold mb-4">Tableau des Paiements</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Choisir le mois:</label>
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange} 
          className="border border-gray-300 p-1 rounded"
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filtrer par statut:</label>
        <select 
          value={filterStatus} 
          onChange={handleFilterStatusChange} 
          className="border border-gray-300 p-1 rounded"
        >
          <option value="Tous">Tous</option>
          {Object.values(statuses).map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Inscription</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Paiement</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
            {months.map(month => (
              <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPaiementData.map((paiement) => (
            <tr key={paiement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paiement.file.inscription}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paiement.file.nom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.file.prenom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(paiement.paymentDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.amount} DH</td>
              {months.map(month => (
                <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {selectedCell && selectedCell.paiementId === paiement.id && selectedCell.month === month ? (
                    <div className="relative">
                      <select 
                        value={selectedStatus} 
                        onChange={handleStatusChange} 
                        onBlur={saveStatus}
                        className="border border-gray-300 p-1 rounded"
                      >
                        {Object.entries(statuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleCellClick(paiement.id, month)}
                      className={clsx(
                        "cursor-pointer",
                        {
                          "text-green-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === statuses.PAID,
                          "text-red-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === statuses.UNPAID,
                          "text-gray-500": getMonthStatus(month, currentMonthIndex, paiement.status[month]) === statuses.PENDING,
                        }
                      )}
                    >
                      {getMonthStatus(month, currentMonthIndex, paiement.status[month])}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaiementTable;
