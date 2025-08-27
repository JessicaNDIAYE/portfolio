"use client"; // Ajoutez cette directive pour indiquer que c'est un composant client

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez next/navigation au lieu de next/router
import { supabase } from '@/app/lib/supabaseClient';


import Header from './components/Header';
import Footer from './components/Footer';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) console.log('Error fetching projects:', error);
      else setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-gray-100 to-gray-300">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center mb-8">Mes Projets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
