'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AjouterProjet() {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [objectifs, setObjectifs] = useState('');
  const [langages, setLangages] = useState('');
  const [lienGithub, setLienGithub] = useState('');
  const [lienProjet, setLienProjet] = useState('');
  const [collaborateurs, setCollaborateurs] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    // Upload de l'image si elle existe
    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projets')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Erreur upload image:', uploadError);
        alert('Erreur lors de l\'upload de l\'image');
        return;
      }

      // Récupère l'URL publique de l'image
      const { data: urlData } = supabase.storage
        .from('projets')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    // Insertion dans la base de données
    const { error } = await supabase.from('projet').insert({
      nom,
      description,
      objectifs,
      langages: langages.split(',').map(lang => lang.trim()),
      lien_github: lienGithub,
      lien_projet: lienProjet,
      collaborateurs: collaborateurs.split(',').map(collab => collab.trim()),
      image_url: imageUrl,
    });

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du projet');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ajouter un projet</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du projet</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Objectifs</label>
          <textarea
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Langages utilisés (séparés par des virgules)</label>
          <input
            type="text"
            value={langages}
            onChange={(e) => setLangages(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lien GitHub</label>
          <input
            type="url"
            value={lienGithub}
            onChange={(e) => setLienGithub(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lien vers le projet</label>
          <input
            type="url"
            value={lienProjet}
            onChange={(e) => setLienProjet(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Collaborateurs (séparés par des virgules)</label>
          <input
            type="text"
            value={collaborateurs}
            onChange={(e) => setCollaborateurs(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image du projet</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {preview && <img src={preview} alt="Preview" className="mt-2 h-40 object-cover" />}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter le projet
        </button>
      </form>
    </div>
  );
}
