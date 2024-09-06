"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ecoleOrigine, setEcoleOrigine] = useState('');
  const [genre, setGenre] = useState('');
  const [inscription, setInscription] = useState('');
  const [telephone, setTelephone] = useState('');
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Fonction pour récupérer les images existantes
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/getpicture');
      if (!response.ok) {
        alert('Erreur lors de la récupération des images');
        return;
      }
      const data = await response.json();
      const imagesUrls = data.map(image => ({
        url: `data:${image.mimeType};base64,${image.fileData}`,
        name: image.fileName,
        nom: image.nom,
        prenom: image.prenom,
        birthDate: image.birthDate,
        ecoleOrigine: image.ecoleOrigine,
        genre: image.genre,
        inscription: image.inscription,
        telephone: image.telephone
      }));
      setImages(imagesUrls);
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !nom || !prenom || !birthDate || !ecoleOrigine || !genre || !inscription || !telephone) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('birthDate', birthDate);
      formData.append('ecoleOrigine', ecoleOrigine);
      formData.append('genre', genre);
      formData.append('inscription', inscription);
      formData.append('telephone', telephone);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { url } = await response.json();

      if (response.ok) {
        alert(`Image uploadée avec succès ! URL: ${url}`);
        // Récupérer les images après avoir téléchargé une nouvelle image
        fetchImages();
        setShowForm(false); // Fermer le formulaire après téléchargement
      } else {
        alert('Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer les Images</h1>

      {/* Bouton pour ouvrir le formulaire en popup */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 mb-6"
      >
        Ajouter une Image
      </button>

      {/* Formulaire de téléversement dans une popup */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-2xl font-bold mb-4">Télécharger une Image</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="École d'origine"
                  value={ecoleOrigine}
                  onChange={(e) => setEcoleOrigine(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
              <select
    id="genre"
    value={genre}
    onChange={(e) => setGenre(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-lg"
    required
  >
    <option value="" disabled>Sélectionnez le genre</option>
    <option value="Masculin">Masculin</option>
    <option value="Féminin">Féminin</option>
  </select>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Numéro d'inscription"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
  
              <div className="mb-4">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Fermer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tableau pour afficher les images */}
      {images.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École d'origine</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro d'inscription</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {images.map((image, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.nom}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.prenom}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(image.birthDate).toLocaleDateString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.ecoleOrigine}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.genre}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.inscription}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{image.telephone}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <img
            src={image.url}
            alt={image.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

      ) : (
        <p>Aucune image disponible.</p>
      )}
    </div>
  );
}
