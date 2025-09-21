'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

const ManageProjectsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // États pour le formulaire d'édition
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [objectifs, setObjectifs] = useState('');
  const [langages, setLangages] = useState('');
  const [lienGithub, setLienGithub] = useState('');
  const [lienProjet, setLienProjet] = useState('');
  const [collaborateurs, setCollaborateurs] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
        loadProjects();
      }
    };
    checkUser();
  }, [router]);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projet')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des projets:', error);
      setMessage('Erreur lors du chargement des projets');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setNom(project.nom || '');
    setDescription(project.description || '');
    setObjectifs(project.objectifs || '');
    setLangages(Array.isArray(project.langages) ? project.langages.join(', ') : '');
    setLienGithub(project.lien_github || '');
    setLienProjet(project.lien_projet || '');
    setCollaborateurs(Array.isArray(project.collaborateurs) ? project.collaborateurs.join(', ') : '');
    setPreview(project.image_url || '');
    setImage(null);
  };

const sanitizeFileName = (name) => {
  return name
    .normalize('NFD')                 // décompose les accents
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/\s+/g, '_')            // remplace les espaces par _
    .replace(/[^a-zA-Z0-9._-]/g, ''); // supprime les caractères invalides
};

const handleImageUpload = async (file) => {
  const fileName = `${Date.now()}_${sanitizeFileName(file.name)}`;

  // Supprimer l’ancienne image si nécessaire
  if (editingProject?.image_url) {
    const oldFileName = editingProject.image_url.split('/').pop();
    if (oldFileName) {
      await supabase.storage.from('projets').remove([`projets/${oldFileName}`]);
    }
  }

  // Upload de la nouvelle image
  const { data, error } = await supabase.storage
    .from('projets')
    .upload(`projets/${fileName}`, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error('Erreur upload image:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('projets')
    .getPublicUrl(`projets/${fileName}`);

  return publicUrl;
};



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    let imageUrl = editingProject.image_url;
    if (image) {
      const uploadedUrl = await handleImageUpload(image);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const { error } = await supabase
      .from('projet')
      .update({
        nom,
        description,
        objectifs,
        langages: langages.split(',').map(lang => lang.trim()),
        lien_github: lienGithub,
        lien_projet: lienProjet,
        collaborateurs: collaborateurs.split(',').map(collab => collab.trim()),
        image_url: imageUrl,
      })
      .eq('id', editingProject.id);

    if (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage('Erreur lors de la mise à jour du projet');
    } else {
      setMessage('Projet mis à jour avec succès !');
      setEditingProject(null);
      loadProjects();
      resetForm();
    }
  };

  const handleDelete = async (projectId, projectName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ?`)) {
      const { error } = await supabase
        .from('projet')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        setMessage('Erreur lors de la suppression du projet');
      } else {
        setMessage('Projet supprimé avec succès !');
        loadProjects();
      }
    }
  };

  const resetForm = () => {
    setNom('');
    setDescription('');
    setObjectifs('');
    setLangages('');
    setLienGithub('');
    setLienProjet('');
    setCollaborateurs('');
    setImage(null);
    setPreview('');
  };

  const cancelEdit = () => {
    setEditingProject(null);
    resetForm();
    setMessage('');
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/grid-bg-admin.svg')",
        backgroundColor: '#f8f9fa',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Gérer les projets
            </h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Retour au tableau de bord
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('succès') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement des projets...</p>
            </div>
          ) : (
            <>
              {/* Liste des projets */}
              {!editingProject && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Projets existants ({projects.length})
                  </h2>
                  
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun projet trouvé. 
                      <button 
                        onClick={() => router.push('/admin/projet')}
                        className="text-blue-600 hover:underline ml-1"
                      >
                        Ajouter votre premier projet
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                {project.image_url && (
                                  <img 
                                    src={project.image_url} 
                                    alt={project.nom}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">{project.nom}</h3>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {project.description?.substring(0, 100)}
                                    {project.description?.length > 100 ? '...' : ''}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {Array.isArray(project.langages) && project.langages.map((lang, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                                {project.lien_github && (
                                  <a href={project.lien_github} target="_blank" rel="noopener noreferrer" 
                                     className="hover:text-gray-700">
                                    🔗 GitHub
                                  </a>
                                )}
                                {project.lien_projet && (
                                  <a href={project.lien_projet} target="_blank" rel="noopener noreferrer" 
                                     className="hover:text-gray-700">
                                    🌐 Projet
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(project)}
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors text-sm"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(project.id, project.nom)}
                                className="bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors text-sm"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Formulaire d'édition */}
              {editingProject && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    Modifier le projet: {editingProject.nom}
                  </h2>
                  
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du projet *
                        </label>
                        <input
                          type="text"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Langages/Technologies (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={langages}
                          onChange={(e) => setLangages(e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objectifs
                      </label>
                      <textarea
                        value={objectifs}
                        onChange={(e) => setObjectifs(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lien GitHub
                        </label>
                        <input
                          type="url"
                          value={lienGithub}
                          onChange={(e) => setLienGithub(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lien du projet
                        </label>
                        <input
                          type="url"
                          value={lienProjet}
                          onChange={(e) => setLienProjet(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Collaborateurs (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        value={collaborateurs}
                        onChange={(e) => setCollaborateurs(e.target.value)}
                        placeholder="Jean Dupont, Marie Martin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image du projet
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {preview && (
                        <div className="mt-4">
                          <img src={preview} alt="Preview" className="max-w-xs h-32 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Mettre à jour le projet
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProjectsPage;