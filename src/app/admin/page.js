'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Tableau de bord
          </h1>

          <div className="mt-10 bg-white/70 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Bienvenue, {user.email}!</h2>
            <p className="text-gray-600">
              Vous pouvez gérer votre portfolio depuis cette page. Utilisez les cartes ci-dessus pour ajouter ou modifier du contenu.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carte pour gerer la bio */}
            <div className="bg-white/70 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Gérer la bio</h2>
              <p className="text-gray-600 mb-4">
                Modifiez votre présentation personnelle.
              </p>
              <button
                className="bg-yellow-50 text-yellow-700 font-medium py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors"
                onClick={() => router.push('/admin/bio')}
              >
                Gérer
              </button>
            </div>
            {/* Carte pour ajouter un projet */}
            <div className="bg-white/70 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter un projet</h2>
              <p className="text-gray-600 mb-4">
                Ajoutez un nouveau projet à votre portfolio.
              </p>
              <button
                className="bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={() => router.push('/admin/projet')}
              >
                Ajouter
              </button>
            </div>

            {/* Carte pour ajouter un article */}
            <div className="bg-white/70 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Ajouter un article</h2>
              <p className="text-gray-600 mb-4">
                Rédigez un nouvel article ou compte rendu.
              </p>
              <button
                className="bg-green-50 text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                onClick={() => router.push('/admin/article')}
              >
                Ajouter
              </button>
            </div>

            {/* Carte pour gérer les expériences */}
            <div className="bg-white/70 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Gérer les expériences</h2>
              <p className="text-gray-600 mb-4">
                Ajoutez ou modifiez vos expériences professionnelles.
              </p>
              <button
                className="bg-purple-50 text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors"
                onClick={() => router.push('/admin/exp')}
              >
                Gérer
              </button>
            </div>

            {/* Carte pour gérer l'éducation */}
            <div className="bg-white/70 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Gérer l&apos;éducation</h2>
              <p className="text-gray-600 mb-4">
                Ajoutez ou modifiez vos formations et diplômes.
              </p>
              <button
                className="bg-yellow-50 text-yellow-700 font-medium py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors"
                onClick={() => router.push('/admin/education')}
              >
                Gérer
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
