// app/affiche/page.js

"use client";

import { useState, useEffect } from 'react';

export default function AffichePage() {
  const [classes, setClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fonction pour récupérer les classes
  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes/getclasses');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
    }
  };

  // Fonction pour récupérer les fichiers associés à une classe
  const fetchFiles = async (classId) => {
    try {
      const response = await fetch(`/api/files/getfiles?classId=${classId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fichiers');
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
    }
  };

  // Récupérer les classes au chargement du composant
  useEffect(() => {
    fetchClasses();
  }, []);

  // Gérer le clic sur le bouton pour afficher les fichiers
  const handleShowFiles = async (classId) => {
    setSelectedClassId(classId);
    await fetchFiles(classId);
    setShowPopup(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Affichage des Classes et Eleve</h1>

      <div className="w-full overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Classe</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Liste des eleves</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="py-2 px-4 border-b border-gray-300">{cls.niveau}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleShowFiles(cls.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Liste des Fichiers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-2xl font-bold mb-4">Liste des eleves</h2>
            <ul>
              {files.map((file) => (
                <li key={file.id} className="py-2">
                  {file.nom} {file.prenom}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
