// ── Login — warm brown café theme ────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty.');
      return;
    }

    let users = [];
    try { users = JSON.parse(localStorage.getItem('users')) || []; } catch { users = []; }

    const matched = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );

    if (!matched) { setError('Invalid username or password.'); return; }

    localStorage.setItem('current_user', JSON.stringify({ username: matched.username, role }));
    if (role === 'Admin') navigate('/admin');
    else navigate('/tables');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg,#3b2010 0%,#7e4720 50%,#c97a34 100%)' }}>

      <div className="w-full max-w-sm animate-fade-up">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-coffee-lg"
               style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            ☕
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Welcome to</p>
          <h1 className="mt-2 text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Odoo Cafe
          </h1>
          <p className="mt-2 text-sm text-amber-200/70">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-coffee-lg"
             style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5a3218' }}>Username</label>
              <input id="login-username" type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username" autoComplete="username"
                className="café-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5a3218' }}>Password</label>
              <input id="login-password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" autoComplete="current-password"
                className="café-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5a3218' }}>Role</label>
              <select id="login-role" value={role} onChange={(e) => setRole(e.target.value)} className="café-select">
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {error && (
              <p className="rounded-2xl px-4 py-3 text-sm font-medium"
                 style={{ background: '#fee2e2', color: '#b91c1c' }}>{error}</p>
            )}

            <button id="login-submit" type="submit"
              className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#3b2010,#c97a34)' }}>
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#7e4720' }}>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')}
              className="font-bold underline underline-offset-2 transition hover:opacity-70"
              style={{ color: '#c97a34' }}>
              Sign Up
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
