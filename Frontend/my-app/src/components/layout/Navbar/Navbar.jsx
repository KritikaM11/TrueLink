import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// ── Logout Confirmation Modal ──────────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="logout-overlay">
    <div className="logout-modal">
      <div className="logout-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </div>
      <h3 className="logout-modal-title">Are you sure?</h3>
      <div className="logout-modal-actions">
        <button className="logout-btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="logout-btn-confirm" onClick={onConfirm}>Yes, Log out</button>
      </div>
    </div>
  </div>
);


export const Navbar = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (window.location.pathname === '/') {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#hero');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTo = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };


  return (
    <>{showLogoutModal && (
      <LogoutModal
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    )}
      <nav ref={navRef} className={`navbar  ${className || ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo-container">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-icon"
          >
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="#3b82f6"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="#1e3a8a"
            />
          </svg>
          <a href="/" onClick={handleLogoClick} style={{ textDecoration: 'none' }}>
            <span className="logo-text">TrueLink</span>
          </a>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
          )}
        </button>

        <div className={`nav-actions ${isMenuOpen ? 'nav-actions--open' : ''}`}>
          {user ? (
            <>
              <button className="btn-history" onClick={() => navigate('/history')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Past Meetings
              </button>
              <button className="btn-login" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/auth?mode=login')}>
                Sign In
              </button>
              <button className="btn-signup" onClick={() => navigate('/auth?mode=signup')}>
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};