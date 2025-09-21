"use client";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";

const Navbar = ({ backgroundType = "white" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Only trigger color change after scrolling past the hero section (viewport height)
      const heroHeight = window.innerHeight;
      setIsScrolled(scrollTop > heroHeight - 100); // 100px buffer for smooth transition
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 py-3 h-20 transition-all duration-300 
        border-b border-b-zinc-50/30 backdrop-blur-[1px]
        ${
        backgroundType === "glass" 
          ? (isScrolled 
              ? "bg-white/95 backdrop-blur-sm shadow-lg" 
              : "bg-transparent backdrop-blur-md")
          : "bg-white shadow-lg"
      }`}
    >
      <Logo 
        className={`h-20 lg:h-25 w-auto transition-all duration-300 ${
          backgroundType === "glass" 
            ? (isScrolled ? "filter brightness-0" : "")
            : "filter brightness-0"
        }`}
        useScrollAnimation={backgroundType === 'glass'}
        backgroundType={backgroundType}
      />
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-12">
        <div className={`flex items-center space-x-1 font-semibold transition-colors duration-300 ${
          backgroundType === "glass" 
            ? (isScrolled ? "text-slate-700" : "text-white")
            : "text-slate-700"
        }`}>
          <span>Beranda</span>
          <ChevronDown className="w-5 h-5" />
        </div>
        <a href="#" className={`font-semibold hover:text-yellow-400 transition-colors ${
          backgroundType === "glass" 
            ? (isScrolled ? "text-slate-700" : "text-white")
            : "text-slate-700"
        }`}>Cara Daftar</a>
        <a href="#" className={`font-semibold hover:text-yellow-400 transition-colors ${
          backgroundType === "glass" 
            ? (isScrolled ? "text-slate-700" : "text-white")
            : "text-slate-700"
        }`}>Modul</a>
        <Link href="#" className={`font-semibold hover:text-yellow-400 transition-colors ${
          backgroundType === "glass" 
            ? (isScrolled ? "text-slate-700" : "text-white")
            : "text-slate-700"
        }`}>Tentang</Link>
        <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-11 rounded-lg transition-colors">
          Masuk
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button
        className={`lg:hidden z-30 transition-colors duration-300 ${
          backgroundType === "glass" 
            ? (isScrolled ? "text-slate-700" : "text-white")
            : "text-slate-700"
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-36 left-0 right-0 bg-slate-900/95 backdrop-blur-sm z-20 p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-1 text-white font-semibold">
              <span>Beranda</span>
              <ChevronDown className="w-5 h-5" />
            </div>
            <a href="#" className="text-white font-semibold">Cara Daftar</a>
            <a href="#" className="text-white font-semibold">Modul</a>
            <a href="#" className="text-white font-semibold">Tentang</a>
            <Link href="/login" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg w-full">
              Masuk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;