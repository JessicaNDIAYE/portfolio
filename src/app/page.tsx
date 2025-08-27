'use client';
import { usePathname } from 'next/navigation';
import Home from './index';
import AdminPage from './admin/page';
import Login from './login/page';

export default function Pages() {
  const pathname = usePathname();

  const renderPage = () => {
    switch (pathname) {
      case '/':
        return <Home />;
      case '/admin':
        return <AdminPage />;
      case '/login':
        return <Login />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-gray-100 to-gray-300">
        <div className="min-h-screen flex flex-col bg-gray-50 cahier-style">
  

        {renderPage()}
        </div>
      </main>
    </div>
  );
}
