import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { LandingPage } from './pages/Landing';
import { AuthenticationPage } from './pages/Authentication';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VideoMeet } from './pages/VideoMeet';
import { NotFound } from './pages/NotFound';
import { checkRoomExists } from './utils/meetingUtils';
import { MeetingHistory } from './pages/MeetingHistory';


const MEETING_CODE_REGEX = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

/*Full-screen loading spinner */
const LoadingScreen = () => (
    <div style={{
        minHeight: '100vh', background: '#050a14',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 14, fontFamily: 'DM Sans, sans-serif',
        color: 'rgba(255,255,255,0.45)', fontSize: 15,
    }}>
        <span style={{
            width: 22, height: 22,
            border: '2.5px solid rgba(255,255,255,0.1)',
            borderTopColor: '#00d4ff', borderRadius: '50%',
            animation: 'spin 0.75s linear infinite', display: 'inline-block',
        }} />
        Checking meeting…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

/*Guest Warning — shown when URL is valid but user not logged in */
const GuestWarningOverlay = ({ code, onLogin, onContinue }) => (
    <div style={{
        minHeight: '100vh', background: '#050a14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', fontFamily: 'DM Sans, sans-serif',
    }}>
        <div style={{
            background: '#fff', borderRadius: 20,
            padding: '2rem 1.75rem', width: '100%', maxWidth: 400,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'slideUp 0.25s ease',
        }}>
            {/* Warning icon */}
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>

            <h3 style={{
                fontFamily: "'Syne', sans-serif", fontSize: '1.2rem',
                fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center',
            }}>
                You're not logged in
            </h3>

            <p style={{
                fontSize: '0.88rem', color: '#64748b', textAlign: 'center',
                lineHeight: 1.6, marginBottom: 14,
            }}>
                Your meeting history and chats will{' '}
                <strong style={{ color: '#334155' }}>not be saved</strong>.<br />
                Log in for the full experience, or continue as a guest.
            </p>

            {/* Code badge */}
            <div style={{
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '6px 14px', marginBottom: 18,
                display: 'flex', alignItems: 'center', gap: 8,
            }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Meeting</span>
                <span style={{
                    fontFamily: 'monospace', fontWeight: 700,
                    color: '#1d4ed8', letterSpacing: '1.5px', fontSize: 14,
                }}>{code}</span>
            </div>

            <div style={{ width: '100%', height: 1, background: '#e2e8f0', marginBottom: 18 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {/* Login */}
                <button onClick={onLogin} style={{
                    width: '100%', padding: '0.82rem', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(180deg,#1d4ed8 0%,#1e40af 100%)',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(29,78,216,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(29,78,216,0.35)'; }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Log in to save my session
                </button>

                {/* Continue as guest */}
                <button onClick={onContinue} style={{
                    width: '100%', padding: '0.75rem', borderRadius: 12,
                    border: '1px solid #e2e8f0', background: '#f8fafc',
                    color: '#475569', fontSize: '0.9rem', fontWeight: 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6,
                    fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    Continue as guest
                </button>

                {/* Go back */}
                <button onClick={() => window.history.back()} style={{
                    width: '100%', padding: '0.72rem', borderRadius: 12,
                    border: '1px solid #e2e8f0', background: 'transparent',
                    color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                >
                    Go back
                </button>
            </div>
        </div>

        <style>{`
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to   { transform: translateY(0);    opacity: 1; }
            }
        `}</style>
    </div>
);

/*  MeetingGate
   Existence check → auth check → render VideoMeet or guard */
const MeetingGate = ({ code }) => {
    const { user, authLoading } = useAuth();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const isNewRoom = searchParams.get('new') === 'true';

    const [guestAllowed, setGuestAllowed] = useState(
        () => sessionStorage.getItem('tl_guest') === 'true'
    );
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (authLoading) return;

        setStatus('checking');

        // New rooms (host just created) skip the existence check
        if (isNewRoom) {
            if (!user) { setStatus('auth-required'); return; }
            setStatus('ready');
            return;
        }

        // Always verify the room actually exists before letting anyone in
        checkRoomExists(code).then((exists) => {
            if (!exists) { setStatus('not-found'); return; }
            if (!user && !guestAllowed) { setStatus('auth-required'); }
            else { setStatus('ready'); }
        });
    }, [code, authLoading, user, guestAllowed, isNewRoom]);

    if (authLoading || status === 'idle' || status === 'checking') {
        return <LoadingScreen />;
    }
    if (status === 'not-found') {
        return <NotFound />;
    }
    if (status === 'auth-required') {
        return (
            <GuestWarningOverlay
                code={code}
                onLogin={() => navigate(`/auth?mode=login&redirect=${code}`)}
                onContinue={() => {
                    sessionStorage.setItem('tl_guest', 'true');
                    setGuestAllowed(true);
                }}
            />
        );
    }

    // status === 'ready'
    return <VideoMeet />;
};

/* MeetingRoute — format gate before MeetingGate */
const MeetingRoute = () => {
    const { url } = useParams();
    if (!MEETING_CODE_REGEX.test(url)) return <NotFound />;
    return <MeetingGate code={url} />;
};


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthenticationPage />} />
                    <Route path="/history" element={<MeetingHistory />} />
                    <Route path="/:url" element={<MeetingRoute />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;