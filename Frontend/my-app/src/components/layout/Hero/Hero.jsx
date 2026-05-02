import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageCircle, Monitor, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContext";

import NoMeetingModal from './NoMeetingModal';
import { generateMeetingCode, sanitizeCode, checkRoomExists } from '../../../utils/meetingUtils';

import './Hero.css';

import slide1 from '../../../assets/marketing.jpg';
import slide2 from '../../../assets/chat.jpg';
import slide3 from '../../../assets/chat2.jpg';
import slide4 from '../../../assets/chat3.jpg';

const WORDS = ['Instantly.', 'Freely.', 'Securely.', 'Together.'];

/* Guest Warning Modal */
const GuestWarningModal = ({ code, onLogin, onContinue, onClose }) => (
  <div className="no-meeting-overlay" onClick={onClose}>
    <div
      className="no-meeting-modal guest-warning-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <div className="no-meeting-icon guest-warning-icon">
        <svg viewBox="0 0 24 24" fill="none"
          stroke="#f59e0b" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="no-meeting-title">You're not logged in</h3>

      {/* Subtitle */}
      <p className="no-meeting-subtitle guest-warning-subtitle">
        Your meeting history and chats will <strong>not be saved</strong>.
        <br />
        Log in for the full experience, or continue as a guest.
      </p>

      {/* Code badge */}
      <div className="guest-code-wrapper">
        <span className="guest-code-label">Meeting code</span>
        <span className="no-meeting-code-badge">{code}</span>
      </div>

      <div className="no-meeting-divider" />

      {/* Actions */}
      <div className="no-meeting-actions">
        {/* Login → then redirect back */}
        <button className="no-meeting-btn-start no-meeting-btn-login" onClick={onLogin}>
          <svg viewBox="0 0 24 24">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Log in to save my session
        </button>

        {/* Continue as guest */}
        <button className="no-meeting-btn-continue" onClick={onContinue}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Continue as guest
        </button>

        <button className="no-meeting-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

/* Hero Component  */
export const Hero = () => {

  // ── Ping-pong slider ──────────────────────────────────────────────────────
  const images = [slide1, slide2, slide4, slide3];
  const [currentSlide, setCurrentSlide] = useState(0);
  const directionRef = useRef(1);

  useEffect(() => {
    if (currentSlide === images.length - 1) directionRef.current = -1;
    else if (currentSlide === 0) directionRef.current = 1;
  }, [currentSlide, images.length]);

  useEffect(() => {
    const t = setInterval(
      () => setCurrentSlide(p => p + directionRef.current),
      3500
    );
    return () => clearInterval(t);
  }, []);

  // ── Animated word ─────────────────────────────────────────────────────────
  const [displayWord, setDisplayWord] = useState(WORDS[0]);
  const [wordClass, setWordClass] = useState('word-enter');

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      setWordClass('word-exit');
      setTimeout(() => {
        idx = (idx + 1) % WORDS.length;
        setDisplayWord(WORDS[idx]);
        setWordClass('word-enter');
      }, 320);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  // ── Routing / auth ────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Join state ────────────────────────────────────────────────────────────
  const [code, setCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  // ── No-meeting modal ──────────────────────────────────────────────────────
  const [showNoMeetingModal, setShowNoMeetingModal] = useState(false);
  const [failedCode, setFailedCode] = useState('');

  // ── Guest warning modal (valid code, not logged in) ───────────────────────
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingCode, setPendingCode] = useState('');

  // ── Start-meeting auth flash ──────────────────────────────────────────────
  const [showStartFlash, setShowStartFlash] = useState(false);
  const flashTimerRef = useRef(null);

  const triggerStartFlash = () => {
    setShowStartFlash(true);
    clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setShowStartFlash(false), 4000);
  };

  useEffect(() => () => clearTimeout(flashTimerRef.current), []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Start Meeting — requires login */
  const handleStartMeeting = () => {
    if (!user) {
      triggerStartFlash();
      return;
    }
    const newCode = generateMeetingCode();
    navigate(`/${newCode}?new=true`);
  };

  /** Join as Guest — requires login (creates a fresh room) */
  const handleGuestJoin = () => {
    if (!user) { navigate('/auth?mode=login'); return; }
    const newCode = generateMeetingCode();
    navigate(`/${newCode}`);
  };

  /** Join with code */
  const handleJoin = async () => {
    if (!code.trim()) {
      setJoinError('Please enter a valid meeting code.');
      return;
    }
    const clean = sanitizeCode(code);
    if (!clean) {
      setJoinError('Please enter a valid meeting code.');
      return;
    }
    const MEETING_CODE_REGEX = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

    if (!MEETING_CODE_REGEX.test(clean)) {
      setFailedCode(clean);
      setShowNoMeetingModal(true);
      return;
    }

    // Check if an active meeting with this code actually exists
    setJoinLoading(true);
    setJoinError('');
    const exists = await checkRoomExists(clean);
    setJoinLoading(false);

    if (!exists) {
      setFailedCode(clean);
      setShowNoMeetingModal(true);
      return;
    }

    // Code is valid and meeting exists — check auth
    if (!user) {
      setPendingCode(clean);
      setShowGuestModal(true);
      return;
    }

    navigate(`/${clean}`);
  };

  /** Guest modal: user chose to log in first */
  const handleGuestModalLogin = () => {
    setShowGuestModal(false);
    navigate(`/auth?mode=login&redirect=${pendingCode}`);
  };

  /** Guest modal: user chose to continue without logging in */
  const handleGuestModalContinue = () => {
    setShowGuestModal(false);
    sessionStorage.setItem('tl_guest', 'true');
    navigate(`/${pendingCode}`);
  };

  return (
    <main className="hero-section" id="hero">

      {/* ── No-meeting modal ── */}
      {showNoMeetingModal && (
        <NoMeetingModal
          code={failedCode}
          onStartNew={() => {
            setShowNoMeetingModal(false);
            handleStartMeeting();
          }}
          onClose={() => {
            setShowNoMeetingModal(false);
            setCode('');
          }}
        />
      )}

      {/* ── Guest warning modal ── */}
      {showGuestModal && (
        <GuestWarningModal
          code={pendingCode}
          onLogin={handleGuestModalLogin}
          onContinue={handleGuestModalContinue}
          onClose={() => setShowGuestModal(false)}
        />
      )}

      <div className="heropanel">

        {/* ══ LEFT ══ */}
        <div className="hero-content">

          <h1 className="hero-title">
            Connect&nbsp;
            <span className={`animated-word ${wordClass}`}>{displayWord}</span>
          </h1>

          <p className="hero-subtitle">
            Built for families, friends, and professional teams. <br /> TrueLink makes
            it effortless to meet, chat, and collaborate securely from anywhere.
          </p>

          {/* Primary CTAs */}
          <div className="hero-cta-group">
            <button className="btn-start-meeting" onClick={handleStartMeeting}>
              Start a Meeting
            </button>
          </div>

          {/* ── Auth flash for Start Meeting ── */}
          {showStartFlash && (
            <div className="auth-flash-msg">
              <AlertTriangle size={15} color="#f87171" className="auth-flash-icon" />
              <span className="auth-flash-text">
                You must be signed in to start a meeting.{' '}
                <button
                  onClick={() => navigate('/auth?mode=login')}
                  className="auth-flash-link"
                >
                  Sign in →
                </button>
              </span>
            </div>
          )}

          {/* Or divider */}
          <div className="hero-divider">
            <span className="hero-divider-line" />
            <span className="hero-divider-text">or join with a code</span>
            <span className="hero-divider-line" />
          </div>

          {/* Code input */}
          <div className="join-input-group">
            <input
              type="text"
              placeholder="Enter meeting code…"
              value={code}
              onChange={e => { setCode(e.target.value); setJoinError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
            <button className="btn-join" onClick={handleJoin} disabled={joinLoading}>
              {joinLoading ? 'Checking…' : 'Join'}
            </button>
          </div>

          {joinError && (
            <p className="join-error-msg">
              ⚠️ {joinError}
            </p>
          )}

          {/* Feature bullets */}
          <ul className="features-list">
            {[
              { Icon: Video, label: 'Video & Audio Calling' },
              { Icon: MessageCircle, label: 'Real-Time Messaging' },
              { Icon: Monitor, label: 'Screen Sharing' },
            ].map(({ Icon, label }) => (
              <li key={label}>
                <div className="feature-icon">
                  <Icon size={15} strokeWidth={2.5} />
                </div>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="hero-visuals">
          <div className="image-slider-window">
            <div
              className="image-slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i + 1}`} className="slider-img" />
              ))}
            </div>

            <div className="slider-dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};