import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateAuthFields } from '../utils/validators'; // The one we created earlier

export const useAuthForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const redirectCode = searchParams.get('redirect');
    const { login, signup, loading, error, setError } = useAuth();

    const [fields, setFields] = useState({ fullName: '', username: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});

    // Reset on mode switch
    useEffect(() => {
        setFields({ fullName: '', username: '', password: '' });
        setFieldErrors({});
        setTouched({});
        setSuccess(false);
        setError(null);
    }, [mode, setError]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }, [fieldErrors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const errs = validateAuthFields(mode, fields);
        setFieldErrors(prev => ({ ...prev, [name]: errs[name] || '' }));
    }, [mode, fields]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateAuthFields(mode, fields);
        setFieldErrors(errs);
        setTouched({ fullName: true, username: true, password: true });
        
        if (Object.keys(errs).length > 0) return;

        let result = mode === 'signup' 
            ? await signup({ fullName: fields.fullName.trim(), username: fields.username.trim(), password: fields.password })
            : await login({ username: fields.username.trim(), password: fields.password });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate(redirectCode ? `/${redirectCode}` : '/');
            }, 1800);
        }
    };

    return { 
        mode, redirectCode, fields, fieldErrors, showPwd, setShowPwd, 
        success, touched, loading, error, handleChange, handleBlur, handleSubmit 
    };
};