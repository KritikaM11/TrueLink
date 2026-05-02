import React from 'react';
import { User, Lock, Eye, EyeOff, AtSign, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthForm = ({ hookData }) => {
    const { mode, fields, fieldErrors, showPwd, setShowPwd, touched, loading, handleChange, handleBlur, handleSubmit } = hookData;

    const fieldDefs = mode === 'signup'
        ? [
            { name: 'fullName', label: 'Full Name', type: 'text', Icon: User, placeholder: 'e.g. Kritika Mittal', delay: '0.05s' },
            { name: 'username', label: 'Username', type: 'text', Icon: AtSign, placeholder: 'e.g. kritika_mittal', delay: '0.15s' },
            { name: 'password', label: 'Password', type: 'password', Icon: Lock, placeholder: 'Create a password', delay: '0.25s' },
        ]
        : [
            { name: 'username', label: 'Username', type: 'text', Icon: AtSign, placeholder: 'Your username', delay: '0.05s' },
            { name: 'password', label: 'Password', type: 'password', Icon: Lock, placeholder: 'Your password', delay: '0.15s' },
        ];

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="auth-fields">
                {fieldDefs.map(({ name, label, type, Icon, placeholder, delay }) => {
                    const isPassword = name === 'password';
                    const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
                    const hasErr = touched[name] && fieldErrors[name];

                    return (
                        <div className="auth-field" key={name} style={{ animationDelay: delay }}>
                            <label className="auth-label" htmlFor={name}>{label}</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><Icon size={16} strokeWidth={2} /></span>
                                <input
                                    id={name} name={name} type={inputType}
                                    className={`auth-input${hasErr ? ' has-error' : ''}`}
                                    placeholder={placeholder} value={fields[name]}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                {isPassword && (
                                    <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}>
                                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                )}
                            </div>
                            {hasErr && <span className="auth-field-error"><AlertCircle size={12} />{fieldErrors[name]}</span>}
                        </div>
                    );
                })}
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Processing...' : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {mode === 'signup' ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
                    </span>
                )}
            </button>
        </form>
    );
};