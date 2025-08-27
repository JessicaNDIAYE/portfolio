'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AjouterExperience() {
  const [intitule, setIntitule] = useState('');
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [compagnie, setCompagnie] = useState('');
  const [lieu, setLieu] = useState('');
  const [missions, setMissions] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nettoie les dates pour s'assurer qu'elles sont au format MM/YYYY
    const formattedDateDebut = dateDebut.trim();
    const formattedDateFin = dateFin.trim() || null; // Si vide, on envoie null

    const { error } = await supabase.from('exppro').insert({
      intitule,
      description,
      date_debut: formattedDateDebut,
      date_fin: formattedDateFin,
      compagnie,
      lieu,
      missions: missions.split('\n').filter(m => m.trim() !== ''),
    });

    if (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'ajout de l'expérience");
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ajouter une expérience professionnelle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Intitulé du poste</label>
          <input
            type="text"
            value={intitule}
            onChange={(e) => setIntitule(e.target.value)}
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
            rows="3"
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
              placeholder="Ex: 06/2025"
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
              placeholder="Ex: 08/2025"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Compagnie</label>
          <input
            type="text"
            value={compagnie}
            onChange={(e) => setCompagnie(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
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
          <label className="block text-sm font-medium text-gray-700">Missions (une par ligne)</label>
          <textarea
            value={missions}
            onChange={(e) => setMissions(e.target.value)}
            className="w-full p-2 border rounded"
            rows="5"
            placeholder="Mission 1&#10;Mission 2&#10;Mission 3"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ajouter l'expérience
        </button>
      </form>
    </div>
  );
}
