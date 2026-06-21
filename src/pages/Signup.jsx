// ── Signup — warm brown café theme ───────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { name, username, email, password } = form;
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    let users = [];
    try { users = JSON.parse(localStorage.getItem('users')) || []; } catch { users = []; }
    if (users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setError('Username already exists. Please choose another.'); return;
    }
    users.push({ name: name.trim(), username: username.trim(), email: email.trim(), password: password.trim() });
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Account created successfully! Redirecting to login…');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10"
         style={{ background: 'linear-gradient(135deg,#3b2010 0%,#7e4720 50%,#c97a34 100%)' }}>
      <div className="w-full max-w-sm animate-fade-up">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-coffee-lg"
               style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            ☕
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Join</p>
          <h1 className="mt-2 text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Odoo Cafe
          </h1>
          <p className="mt-2 text-sm text-amber-200/70">Create your account to get started</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-coffee-lg"
             style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)' }}>
          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { id: 'signup-name',     name: 'name',     label: 'Full Name',  type: 'text',     placeholder: 'Your full name',     autoComplete: 'name' },
              { id: 'signup-username', name: 'username', label: 'Username',   type: 'text',     placeholder: 'Choose a username',  autoComplete: 'username' },
              { id: 'signup-email',    name: 'email',    label: 'Email',      type: 'email',    placeholder: 'you@example.com',    autoComplete: 'email' },
              { id: 'signup-password', name: 'password', label: 'Password',   type: 'password', placeholder: 'Create a password',  autoComplete: 'new-password' },
            ].map(({ id, name, label, type, placeholder, autoComplete }) => (
              <div key={id}>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5a3218' }}>{label}</label>
                <input id={id} name={name} type={type} value={form[name]}
                  onChange={handleChange} placeholder={placeholder} autoComplete={autoComplete}
                  className="café-input" />
              </div>
            ))}

            {error   && <p className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background:'#fee2e2', color:'#b91c1c' }}>{error}</p>}
            {success && <p className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background:'#d1fae5', color:'#065f46' }}>{success}</p>}

            <button id="signup-submit" type="submit"
              className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#3b2010,#c97a34)' }}>
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#7e4720' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/')}
              className="font-bold underline underline-offset-2" style={{ color: '#c97a34' }}>
              Login
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-amber-200/50">
          Odoo Cafe POS &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
