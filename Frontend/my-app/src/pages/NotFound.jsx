import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050a14',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            gap: '16px',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <h1 style={{
                fontSize: 'clamp(5rem, 15vw, 9rem)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                lineHeight: 1,
                textShadow: '0 0 60px rgba(0, 212, 255, 0.4)',
                letterSpacing: '-4px',
            }}>
                404
            </h1>

            <h2 style={{
                fontSize: '1.4rem',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                color: '#fff',
                margin: 0,
            }}>
                Page not found
            </h2>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '0.75rem 1.6rem',
                        borderRadius: 12,
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    Go Back
                </button>
        </div>
    );
};