// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Layers, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
      setScrolled(scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <div className="topbar-inner">
        <div className="topbar-brand">
          <Layers className="brand-icon" size={20} />
          <span>Race-to-1 vs. Guess Who</span>
          <span className="brand-tag">Game Theory Audit</span>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`topbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <a href="#viral-strategy" className="topbar-link" onClick={handleLinkClick}>Viral Strategy</a>
          <a href="#audit-findings" className="topbar-link" onClick={handleLinkClick}>Audit Findings</a>
          <a href="#death-valley" className="topbar-link" onClick={handleLinkClick}>Death Valley</a>
          <a href="#dp-matrix" className="topbar-link" onClick={handleLinkClick}>DP Heatmap</a>
          <a href="#corrected-game" className="topbar-link cta-nav-link" onClick={handleLinkClick}>Play Game</a>
        </div>
      </div>
    </nav>
  );
}
