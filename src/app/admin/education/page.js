'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AjouterEducation() {
  const [intitule, setIntitule] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [lieu, setLieu] = useState('');
  const [competences, setCompetences] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nettoie les dates pour s'assurer qu'elles sont au format MM/YYYY
    const formattedDateDebut = dateDebut.trim();
    const formattedDateFin = dateFin.trim() || null; // Si vide, on envoie null

    const { error } = await supabase.from('education').insert({
      intitule,
      date_debut: formattedDateDebut,
      date_fin: formattedDateFin,
      lieu,
      competences: competences.split(',').map(c => c.trim()),
    });

    if (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'ajout de la formation");
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ajouter une formation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Intitulé de la formation</label>
          <input
            type="text"
            value={intitule}
            onChange={(e) => setIntitule(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de début (MM/YYYY)</label>
            <input
              type="text"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: 09/2020"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de fin (MM/YYYY, laisser vide si en cours)</label>
            <input
              type="text"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: 06/2023"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lieu</label>
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Compétences acquises (séparées par des virgules)</label>
          <input
            type="text"
            value={competences}
            onChange={(e) => setCompetences(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Ajouter la formation
        </button>
      </form>
    </div>
  );
}
