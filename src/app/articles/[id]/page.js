'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function Article() {
  const [article, setArticle] = useState(null);
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data: articleData, error: articleError } = await supabase
          .from("article")
          .select("*, projet(*)")
          .eq("projet_id", id)
          .maybeSingle();
        if (articleError) throw articleError;
        if (!articleData) throw new Error('Aucun article trouvé.');

        setArticle(articleData);
        setProjet(articleData.projet);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Erreur: {error}</div>;
  if (!article || !projet) return <div className="min-h-screen flex items-center justify-center">Article non trouvé.</div>;

  return (
    <div className="min-h-screen flex flex-col cahier-bg">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row gap-6">
        {/* Marge gauche */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 mb-6 bg-black text-white font-medium rounded-lg shadow hover:bg-gray-800 hover:scale-105 transition-transform duration-200"
          >
            ← Retour
          </button>

          {/* Nom du projet */}
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-300 rounded-sm shadow-md transform -rotate-1 hover:scale-105 transition-transform">
            <h3 className="font-bold text-lg">📁 {projet.nom}</h3>
          </div>

          {/* Langages */}
          {projet.langages && projet.langages.length > 0 && (
            <div className="p-4 bg-blue-100 border-l-4 border-blue-300 rounded-sm shadow-md transform rotate-1 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg">💻 Langages</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {projet.langages.map((lang, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 text-xs rounded">{lang}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contributeurs */}
          {article.contributeurs && article.contributeurs.length > 0 && (
            <div className="p-4 bg-green-100 border-l-4 border-green-300 rounded-sm shadow-md transform -rotate-2 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg">👥 Contributeurs</h3>
              <div className="space-y-2 mt-2">
                {article.contributeurs.map((contrib, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <a href={contrib.github} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline flex items-center">
                      <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                      {contrib.nom}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Partie droite */}
        <div className="flex-1 bg-cahier-paper shadow-lg rounded-lg border-2 border-black p-6">
          <h1 className="text-3xl font-bold mb-6">{article.titre}</h1>

          {/* Image projet */}
          {projet.image_url && (
            <div className="mb-6">
              <img
                src={projet.image_url}
                alt={projet.nom}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Contenu */}
          <div className="max-w-none mb-6 whitespace-pre-line">
            {article.contenu}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
