"use client";

import { useState, useEffect } from 'react';

export default function VoirPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/getpicture');

        if (!response.ok) {
          alert('Erreur lors de la récupération des images');
          return;
        }

        const data = await response.json();
        const imagesData = data.map(image => {
          return {
            url: `data:${image.mimeType};base64,${image.fileData}`,
            name: image.fileName,
            nom: image.nom,  // Nom de la personne
            prenom: image.prenom,  // Prénom de la personne
          };
        });
        setImages(imagesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Voir Images</h1>
      {images.length > 0 ? (
        <table className="table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr><th className="px-4 py-2">Nom</th><th className="px-4 py-2">Prénom</th><th className="px-4 py-2">Image</th></tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index}><td className="border px-4 py-2">{image.nom}</td><td className="border px-4 py-2">{image.prenom}</td><td className="border px-4 py-2"><img src={image.url} alt={image.name} style={{width: '30%', height: '30%'}} className="w-20 h-20 rounded-full object-cover shadow-md" /></td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune image disponible</p>
      )}
    </div>
  );
}
