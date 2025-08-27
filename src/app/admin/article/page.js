'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';

export default function AjouterArticle() {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [projetId, setProjetId] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [projets, setProjets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjets = async () => {
      const { data, error } = await supabase.from('projet').select('id, nom');
      if (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      } else if (data) {
        setProjets(data);
      }
    };
    fetchProjets();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrls = [];

      // Upload des images si elles existent
      if (images.length > 0) {
        const uploadPromises = images.map(async (image) => {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `articles/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('articles')
            .upload(filePath, image);

          if (uploadError) {
            console.error('Erreur upload image:', uploadError);
            return null;
          }

          // Récupère l'URL publique de l'image
          const { data: urlData } = supabase.storage
            .from('articles')
            .getPublicUrl(filePath);

          return urlData.publicUrl;
        });

        const urls = await Promise.all(uploadPromises);
        imageUrls = urls.filter(url => url !== null);
      }

      // Insertion dans la base de données
      const { error } = await supabase.from('article').insert({
        titre,
        contenu,
        projet_id: projetId,
        images: imageUrls,
      });

      if (error) {
        console.error('Erreur:', error);
        alert("Erreur lors de l'ajout de l'article");
      } else {
        router.push('/admin');
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      alert("Une erreur inattendue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ajouter un article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre de l&apos;article</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Projet associé</label>
          <select
            value={projetId}
            onChange={(e) => setProjetId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Sélectionnez un projet</option>
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>{projet.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contenu</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full p-2 border rounded"
            rows="10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images (plusieurs possibles)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            multiple
          />
          {previews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <Image
                  key={index}
                  src={preview}
                  alt={`Aperçu ${index + 1}`}
                  width={128}
                  height={128}
                  className="h-32 w-full object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Publication en cours...' : 'Publier l\'article'}
        </button>
      </form>
    </div>
  );
}
