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
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);

  const [searchInscription, setSearchInscription] = useState('');
  const [searchNomPrenom, setSearchNomPrenom] = useState('');
  const [searchGenre, setSearchGenre] = useState('');

  // Fonction pour récupérer les images existantes
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/getpicture');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des images');
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
        throw new Error('Erreur lors de la récupération des classes');
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

      const url = isEditing ? `/api/update/${currentImageId}` : '/api/upload';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        alert(`${isEditing ? 'Modification' : 'Ajout'} réussie ! URL: ${url}`);
        fetchImages();
        setShowForm(false);
        setIsEditing(false);
        setCurrentImageId(null);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de l${isEditing ? 'a modification' : 'ajout de l\'image'}: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l${isEditing ? 'a modification' : 'ajout de l\'image'}`, error);
      alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        const response = await fetch(`/api/deletefile/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setImages(images.filter(img => img.id !== id));
          alert('Image supprimée avec succès');
        } else {
          const errorData = await response.json();
          console.error(errorData.message);
          alert('Erreur lors de la suppression de l\'image.');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  };

  // Fonction pour ouvrir le formulaire d'édition avec les informations de l'élève
  const handleEdit = (img) => {
    setNom(img.nom);
    setPrenom(img.prenom);
    setBirthDate(img.birthDate);
    setEcoleOrigine(img.ecoleOrigine);
    setGenre(img.genre);
    setInscription(img.inscription);
    setTelephone(img.telephone);
    setSelectedClass(img.classId);
    setImage(null); // Ne pas préremplir l'image
    setCurrentImageId(img.id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Filtrage des images en fonction des critères de recherche
  const filteredImages = images.filter((img) => {
    const matchesInscription = img.inscription.toLowerCase().includes(searchInscription.toLowerCase());
    const matchesNomPrenom = (img.nom + ' ' + img.prenom).toLowerCase().includes(searchNomPrenom.toLowerCase());
    const matchesGenre = searchGenre ? img.genre === searchGenre : true;

    return matchesInscription && matchesNomPrenom && matchesGenre;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Gestion des éléves</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 mb-8"
      >
        {isEditing ? 'Modifier un élève' : 'Ajouter un élève'}
      </button>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-3xl font-semibold mb-6">{isEditing ? 'Modifier un élève' : 'Ajouter un élève'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Date de Naissance</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">École d'origine</label>
                <input
                  type="text"
                  placeholder="École d'origine"
                  value={ecoleOrigine}
                  onChange={(e) => setEcoleOrigine(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Numéro d'inscription</label>
                <input
                  type="text"
                  placeholder="Numéro d'inscription"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Classe</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.niveau}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setCurrentImageId(null);
                }}
                className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par inscription"
          value={searchInscription}
          onChange={(e) => setSearchInscription(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <input
          type="text"
          placeholder="Rechercher par nom et prénom"
          value={searchNomPrenom}
          onChange={(e) => setSearchNomPrenom(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <select
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">Tous les genres</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
        </select>
      </div>

      <div className="w-full">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-6 text-left">N°inscription</th>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Prénom</th>
              <th className="py-3 px-6 text-left">Date de Naissance</th>
              <th className="py-3 px-6 text-left">École d'origine</th>
              <th className="py-3 px-6 text-left">Genre</th>
              <th className="py-3 px-6 text-left">Téléphone</th>
              <th className="py-3 px-6 text-left">Classe</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.map(img => (
              <tr key={img.id}>
                <td className="py-3 px-6">{img.inscription}</td>
                <td className="py-3 px-6">{img.nom}</td>
                <td className="py-3 px-6">{img.prenom}</td>
                <td className="py-3 px-6">{img.birthDate}</td>
                <td className="py-3 px-6">{img.ecoleOrigine}</td>
                <td className="py-3 px-6">{img.genre}</td>
                <td className="py-3 px-6">{img.telephone}</td>
                <td className="py-3 px-6">{getClassName(img.classId)}</td>
                <td className="py-3 px-6">
                  <img
                    src={img.url}
                    alt={`Image ${img.id}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleEdit(img)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    U
                  </button>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                  >
                    D
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
