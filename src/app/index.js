'use client';
import Head from 'next/head';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function Home() {
  const [bio, setBio] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [projects, setProjects] = useState([]);
  const [exp, setExp] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchBio = async () => {
      const { data, error } = await supabase.from('bio').select('*').single();
      if (error) console.error('Erreur Supabase:', error);
      else setBio(data);
    };
    fetchBio();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projet').select('*');
      if (error) console.log('Error fetching projects:', error);
      else setProjects(data);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchExp = async () => {
      const { data, error } = await supabase.from('exppro').select('*').order('date_debut', { ascending: false });
      if (error) console.log('Error fetching experiences:', error);
      else setExp(data);
    };
    fetchExp();
  }, []);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase.from('education').select('*').order('date_debut', { ascending: false });
      if (error) console.log('Error fetching education:', error);
      else setEducation(data);
    };
    fetchEducation();
  }, []);

  return (
    <>
      <Head>
        <title>Jessica NDIAYE | Portfolio</title>
        <meta name="description" content="Computer Engineering Portfolio" />
      </Head>
      <div className="min-h-screen flex flex-col cahier-bg">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          {/* Section À propos + Langages/Expérience/Éducation côte à côte */}
          <section className={`flex flex-col md:flex-row gap-6 px-4 py-8 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            {/* À propos */}
            <div className="flex-1 bg-cahier-paper shadow-xl rounded-lg border-4 border-black p-6 cahier-section transform transition duration-700 hover:scale-[1.02]">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-black mb-4 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/profile.jpg"
                    alt="Jessica Ndiaye"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div id="about">
                  <h1 className="text-4xl font-bold text-black mb-2 handwritten-title">
                    {bio?.titre}
                  </h1>
                  <p className="text-lg mb-4 handwritten-text">{bio?.sous_titre}</p>
                  <p className="handwritten-text">{bio?.description}</p>
                </div>
              </div>
            </div>

            {/* Langages, Expérience & Éducation */}
            <div className="flex-1 bg-cahier-paper shadow-lg rounded-lg border-2 border-black p-6 cahier-section transform transition duration-700 hover:scale-[1.02]">
              {/* Ruban : Expérience Pro */}
              <div className="relative mb-6 pb-4 border-l-4 border-pink-500 pl-4 bg-pink-50 rounded-l-lg">
                <h2 className="text-xl font-bold text-black mb-2 handwritten-title">💼 Expérience Professionnelle</h2>
                <div className="space-y-3">
                  {exp.map((experience, index) => (
                    <div key={index} className="pl-4 border-l-2 border-pink-300">
                      <h3 className="font-semibold handwritten-text">{experience.intitule}</h3>
                      <p className="text-sm text-gray-700">
                        {experience.date_debut} - {experience.date_fin || 'Présent'} · {experience.compagnie}
                      </p>
                      
                    </div>
                  ))}
                </div>
              </div>

              {/* Ruban : Éducation */}
              <div className="relative mb-6 pb-4 border-l-4 border-purple-500 pl-4 bg-purple-50 rounded-l-lg">
                <h2 className="text-xl font-bold text-black mb-2 handwritten-title">🎓 Formation</h2>
                <div className="space-y-3">
                  {education.map((formation, index) => (
                    <div key={index} className="pl-4 border-l-2 border-purple-300">
                      <h3 className="font-semibold handwritten-text">{formation.intitule}</h3>
                      <p className="text-sm text-gray-700">
                        {formation.date_debut} - {formation.date_fin || 'Présent'} · {formation.lieu}
                      </p>
                      <p className="text-sm handwritten-text">{formation.competences?.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ruban : Langages */}
              <div className="relative pb-4 border-l-4 border-teal-500 pl-4 bg-teal-50 rounded-l-lg">
                <h2 className="text-xl font-bold text-black mb-2 handwritten-title">💻 Langages</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {(bio?.tech_stack || []).map((tech, index) => (
                    <img
                      key={index}
                      src={`https://img.shields.io/badge/${tech}-%23000000.svg?style=for-the-badge&logo=${tech.toLowerCase()}&logoColor=white`}
                      alt={tech}
                      className="h-6 grayscale hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section Projets */}
          <div id="projects" className="max-w-4xl mx-auto bg-cahier-paper shadow-lg rounded-lg border-2 border-black p-6 mb-8 cahier-section">
            <h2 className="text-2xl font-bold text-black mb-4 handwritten-title">Projets</h2>
            <div className="flex flex-wrap gap-4">
              {(projects || []).map((projet, index) => (
                <div
                  key={index}
                  className="w-64 p-4 bg-yellow-100 border-l-4 border-yellow-300 rounded-sm shadow-md transform -rotate-1 hover:-rotate-2 hover:translate-y-[-3px] transition-transform duration-200 relative group"
                >
                  <div className="absolute top-0 left-2 w-16 h-2 bg-yellow-200 rounded-t-lg"></div>
                  <div className="absolute top-1 left-3 w-3 h-3 bg-red-500 rounded-full"></div>
                  <a
                    href={`/articles/${projet.id || ''}`}
                    className="absolute top-2 right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-xl font-bold">+</span>
                  </a>
                  <h3 className="font-bold text-lg mb-1 handwritten-text">📁 {projet.nom}</h3>
                  <p className="text-sm mb-2 handwritten-text">{projet.description}</p>
                  <p className="text-xs"><strong>Objectifs :</strong> {projet.objectifs}</p>
                  <p className="text-xs"><strong>Langages :</strong> {projet.langages.join(', ')}</p>
                  {projet.lien_github && (
                    <a
                      href={projet.lien_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
      
            {/* Section réseaux sociaux */}
            <div id="contact" className="max-w-4xl mx-auto bg-cahier-paper shadow-lg rounded-lg border-2 border-black p-6 mb-8 cahier-section">
              <h2 className="text-2xl font-bold text-black mb-4 handwritten-title">🌐 Contacts</h2>
              <div className="flex space-x-4">
                {(bio?.reseaux_sociaux || []).map((reseau, index) => (
                  <a
                    key={index}
                    href={reseau.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={`https://img.shields.io/badge/${reseau.nom}-%230077B5.svg?logo=${reseau.icone}&logoColor=white`}
                      alt={reseau.nom}
                      className="h-8 grayscale"
                    />
                  </a>
                ))}
              </div>
            </div>

           
          
        </main>
        <Footer />
      </div>
    </>
  );
}
