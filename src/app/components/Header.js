'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header principal */}
      <header className="fixed w-full z-50 bg-transparent backdrop-blur-sm">
        <div className="header-content max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="header-logo text-white font-bold text-xl" aria-current="page">
            JN
          </Link>

          {/* Navigation desktop */}
          <nav className="header-nav hidden md:flex gap-6">
            {['À propos', 'Parcours', 'Projets'].map((item) => (
              <Link
                key={item}
                href={`/#${item.toLowerCase().replace(' ', '')}`}
                className="nav-link text-white/90 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* CV externe */}
            <a
              href="https://rxresu.me/ndiajessi13/jessica-ndiaye-cv"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-white/90 hover:text-white transition-colors"
            >
              CV
            </a>
          </nav>

          {/* Réseaux sociaux */}
          <div className="flex gap-3 items-center">
            <a href="mailto:ndiaye.jessica.info.com" className="tech-badge flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white" aria-label="Email">
              📧
            </a>
            <a href="https://www.linkedin.com/in/ndiaye-jessica-a451592b6/" target="_blank" rel="noopener noreferrer" className="tech-badge flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://github.com/JessicaNDIAYE" target="_blank" rel="noopener noreferrer" className="tech-badge flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white" aria-label="GitHub">
              <Image src="/github.svg" alt="GitHub" width={16} height={16} />
            </a>
          </div>

          {/* Hamburger menu mobile */}
          <button
            className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>

          {/* Menu mobile */}
          {menuOpen && (
            <div className="mobile-menu md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
                {['À propos', 'Parcours', 'Projets', 'Contact'].map((item) => (
                  <Link key={item} href={`/#${item.toLowerCase().replace(' ', '')}`} className="nav-link py-2">
                    {item}
                  </Link>
                ))}
                {/* CV externe */}
                <a
                  href="https://rxresu.me/ndiajessi13/data-science-stage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link py-2"
                >
                  CV
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
