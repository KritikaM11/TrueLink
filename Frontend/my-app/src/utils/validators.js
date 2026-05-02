
export function validateAuthFields(mode, fields) {
  const errors = {};

  if (mode === 'signup') {
    if (!fields.fullName.trim())
      errors.fullName = 'Full name is required.';
    else if (fields.fullName.trim().length < 2)
      errors.fullName = 'Name must be at least 2 characters.';
  }

  if (!fields.username.trim())
    errors.username = 'Username is required.';
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(fields.username))
    errors.username = '3–20 chars, letters, numbers, underscores only.';

  if (!fields.password)
    errors.password = 'Password is required.';
  else if (mode === 'signup' && fields.password.length < 6)
    errors.password = 'Password must be at least 6 characters.';

  return errors;
}