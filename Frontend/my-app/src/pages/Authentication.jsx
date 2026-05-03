import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';
import { BrandPanel } from '../components/auth/BrandPanel';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';
import { NotFound } from './NotFound';
import '../Styles/Auth.css';

export const AuthenticationPage = () => {
    const authData = useAuthForm();
    const { mode, redirectCode, success, error, fields } = authData;
    const [, setSearchParams] = useSearchParams();

    if (mode && mode !== 'login' && mode !== 'signup') return <NotFound />;

    const setMode = (m) => setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('mode', m);
        return next;
    });

    return (
        <div className="auth-page">
            <Navbar className="authnav" />
            <div className="auth-main">
                <BrandPanel />
                <div className="auth-form-panel">
                    <div className="auth-form-card">
                        {success ? (
                            <div className="auth-success">
                                <CheckCircle2 size={32} />
                                <h2>{mode === 'signup' ? 'Welcome aboard! 🎉' : 'Welcome back! 👋'}</h2>
                                <p>Signed in as @{fields.username}. Redirecting...</p>
                            </div>
                        ) : (
                            <>
                                <div className="auth-tabs">
                                    <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
                                    <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Create Account</button>
                                </div>
                                <h1 className="auth-heading">{mode === 'signup' ? 'Create account' : 'Welcome back'}</h1>

                                {error && <div className="auth-error-banner"><AlertCircle size={15} />{error}</div>}

                                <AuthForm hookData={authData} />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};