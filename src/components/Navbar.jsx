// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Gamepad2, Grid, HelpCircle, Layers, Mail } from 'lucide-react';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="topbar">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <div className="topbar-inner">
        <div className="topbar-brand">
          <Layers className="brand-icon" size={20} />
          <span>Race-to-1 vs. Guess Who</span>
          <span className="brand-tag">Game Theory Audit</span>
        </div>

        <div className="topbar-links">
          <a href="#viral-strategy" className="topbar-link">Viral Strategy</a>
          <a href="#audit-findings" className="topbar-link">Audit Findings</a>
          <a href="#death-valley" className="topbar-link">Death Valley</a>
          <a href="#dp-matrix" className="topbar-link">DP Heatmap</a>
          <a href="#corrected-game" className="topbar-link cta-nav-link">Play Game</a>
        </div>
      </div>
    </nav>
  );
}
