'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Article() {
  const [article, setArticle] = useState(null);
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const params = useParams();
  const id = params?.id; // 🔑 mémorise la valeur primitive

  const nextImage = () => {
    if (!article?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % article.images.length);
  };

  const prevImage = () => {
    if (!article?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + article.images.length) % article.images.length);
  };

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
  }, [id]); // ✅ dépend uniquement du string id

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Erreur: {error}</div>;
  if (!article || !projet) return <div className="min-h-screen flex items-center justify-center">Article non trouvé.</div>;

  return (
    <div className="min-h-screen flex flex-col cahier-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row gap-6">
        {/* Bouton retour */}
        
        {/* Marge gauche : Post-its avec infos du projet */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
        >
          ← Retour
        </button>
          {/* Post-it : Nom du projet */}
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-300 rounded-sm shadow-md transform -rotate-1 hover:scale-105 transition-transform">
            <h3 className="font-bold text-lg handwritten-text">📁 {projet.nom}</h3>
            <p className="text-xs mt-1">
              <strong>Créé en :</strong> {article.created_at ? new Date(article.created_at).getFullYear() : 'N/A'}
            </p>
          </div>

          {/* Post-it : Langages (si disponibles) */}
          {projet.langages && projet.langages.length > 0 && (
            <div className="p-4 bg-blue-100 border-l-4 border-blue-300 rounded-sm shadow-md transform rotate-1 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg handwritten-text">💻 Langages</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {projet.langages.map((lang, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 text-xs rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Post-it : Contributeurs (si disponibles) */}
          {article.contributeurs && article.contributeurs.length > 0 && (
            <div className="p-4 bg-green-100 border-l-4 border-green-300 rounded-sm shadow-md transform -rotate-2 hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg handwritten-text">👥 Contributeurs</h3>
              <div className="space-y-2 mt-2">
                {article.contributeurs.map((contrib, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <a
                      href={contrib.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline flex items-center"
                    >
                      <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
                      {contrib.nom}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Partie droite : Contenu de l'article */}
        <div className="flex-1 bg-cahier-paper shadow-lg rounded-lg border-2 border-black p-6 cahier-section">
          <h1 className="text-3xl font-bold mb-6 handwritten-title">{article.titre}</h1>

          {/* Caroussel d'images (si disponibles) */}
          {article.images && article.images.length > 0 && (
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={article.images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={prevImage}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  ←
                </button>
                <span className="self-center">
                  {currentImageIndex + 1} / {article.images.length}
                </span>
                <button
                  onClick={nextImage}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  →
                </button>
              </div>
            </div>
          )}

          {/* Contenu de l'article */}
          <div className="prose max-w-none mb-6">
            <p className="handwritten-text whitespace-pre-line">{article.contenu}</p>
          </div>

          {/* Objectifs et description du projet */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 handwritten-title">🎯 Objectifs</h2>
            <p className="handwritten-text mb-4">{projet.objectifs}</p>

            <h2 className="text-xl font-bold mb-4 handwritten-title">📝 Description</h2>
            <p className="handwritten-text">{projet.description}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
