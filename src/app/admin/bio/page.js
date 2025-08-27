'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function BioAdmin() {
  const [titre, setTitre] = useState('');
  const [sousTitre, setSousTitre] = useState('');
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState('');
  const [reseauxSociaux, setReseauxSociaux] = useState([{ nom: '', lien: '', icone: '' }]);
  const [techStack, setTechStack] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBio = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('bio')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setTitre(data.titre);
        setSousTitre(data.sous_titre);
        setDescription(data.description);
        setCompetences(data.competences?.join(', '));
        setReseauxSociaux(data.reseaux_sociaux || [{ nom: '', lien: '', icone: '' }]);
        setTechStack(data.tech_stack?.join(', '));
      }
    };
    fetchBio();
  }, [router]);

  const handleReseauChange = (index, field, value) => {
    const newReseaux = [...reseauxSociaux];
    newReseaux[index][field] = value;
    setReseauxSociaux(newReseaux);
  };

  const addReseau = () => {
    setReseauxSociaux([...reseauxSociaux, { nom: '', lien: '', icone: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('bio').upsert({
      titre,
      sous_titre: sousTitre,
      description,
      competences: competences.split(',').map(c => c.trim()),
      reseaux_sociaux: reseauxSociaux,
      tech_stack: techStack.split(',').map(t => t.trim()),
      user_id: user.id,
    });

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde de la bio');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Rédiger ma bio</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Hi, I'm Jessica!"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
          <textarea
            value={sousTitre}
            onChange={(e) => setSousTitre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Computer engineering student at Polytech Lyon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="5"
            placeholder="Ex: Passionate about art and exploring new cultures..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Compétences (séparées par des virgules)</label>
          <input
            type="text"
            value={competences}
            onChange={(e) => setCompetences(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Layout Design, Branding, UI Design"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Réseaux sociaux</label>
          {reseauxSociaux.map((reseau, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={reseau.nom}
                onChange={(e) => handleReseauChange(index, 'nom', e.target.value)}
                className="p-2 border rounded flex-1"
                placeholder="Nom (ex: LinkedIn)"
              />
              <input
                type="text"
                value={reseau.lien}
                onChange={(e) => handleReseauChange(index, 'lien', e.target.value)}
                className="p-2 border rounded flex-1"
                placeholder="Lien (ex: https://linkedin.com/in/...)"
              />
              <input
                type="text"
                value={reseau.icone}
                onChange={(e) => handleReseauChange(index, 'icone', e.target.value)}
                className="p-2 border rounded flex-1"
                placeholder="Nom de l'icône (ex: linkedin)"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addReseau}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
          >
            Ajouter un réseau
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tech Stack (séparées par des virgules)</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: HTML5, JavaScript, React, Python"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
