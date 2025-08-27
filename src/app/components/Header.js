'use client';
import { useState } from 'react';
import Link from "next/link";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative bg-[#996633] shadow-sm py-4 px-4">
      <div className="flex justify-between items-center">
        {/* Titre */}
        <h1 className="text-2xl font-bold text-white">Jessica NDIAYE</h1>

        {/* Bouton hamburger (mobile) */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-4 text-white">
  <Link href="/#about" className="nav-link">À propos</Link>
  <Link href="/#projects" className="nav-link">Projets</Link>
  <Link href="/#contact" className="nav-link">Contact</Link>
  <Link href="/#CV" className="nav-link">CV</Link>
</nav>
      </div>

      {/* Navigation mobile */}
      {menuOpen && (
        <nav className="flex flex-col mt-2 space-y-2 md:hidden text-white">
          <a href="#about" className="nav-link">À propos</a>
          <a href="#projects" className="nav-link">Projets</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#CV" className="nav-link">CV</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
