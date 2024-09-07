"use client";

import { useState, useEffect } from 'react';

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
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [showForm, setShowForm] = useState(false);

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
        id: image.id,
        nom: image.nom,
        prenom: image.prenom,
        birthDate: new Date(image.birthDate).toLocaleDateString(),
        ecoleOrigine: image.ecoleOrigine,
        genre: image.genre,
        inscription: image.inscription,
        telephone: image.telephone,
        classId: image.classId,
        url: `data:${image.mimeType};base64,${image.fileData}`
      }));
      setImages(imagesUrls);
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
    }
  };

  // Fonction pour récupérer les classes disponibles
  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes/getclasses');
      if (!response.ok) {
        alert('Erreur lors de la récupération des classes');
        return;
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchClasses();
  }, []);

  // Trouver le niveau de classe basé sur l'id
  const getClassName = (classId) => {
    const cls = classes.find(cls => cls.id === classId);
    return cls ? cls.niveau : 'Non spécifiée';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !nom || !prenom || !birthDate || !ecoleOrigine || !genre || !inscription || !telephone || !selectedClass) {
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
      formData.append('classId', selectedClass);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { url } = await response.json();

      if (response.ok) {
        alert(`Image uploadée avec succès ! URL: ${url}`);
        fetchImages();
        setShowForm(false);
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
      <h1 className="text-3xl font-bold mb-6">Gérer les Images et Classes</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 mb-6"
      >
        Ajouter une Image
      </button>

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
                <select
                  id="classId"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>Sélectionnez une classe</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.niveau}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Télécharger
              </button>
            </form>
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Images et Classes</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Nom</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Prénom</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Date de naissance</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">École d'origine</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Genre</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Numéro d'inscription</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Téléphone</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Classe</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id}>
                <td className="py-2 px-4 border-b border-gray-300">{img.id}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.nom}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.prenom}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.birthDate}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.ecoleOrigine}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.genre}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.inscription}</td>
                <td className="py-2 px-4 border-b border-gray-300">{img.telephone}</td>
                <td className="py-2 px-4 border-b border-gray-300">{getClassName(img.classId)}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <img src={img.url} alt={img.nom} className="w-16 h-16 object-cover rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
