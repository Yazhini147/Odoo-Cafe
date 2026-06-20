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

    // Load registered users from localStorage
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users')) || [];
    } catch {
      users = [];
    }

    // Find matching user
    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (!matched) {
      setError('Invalid username or password.');
      return;
    }

    // Save user role in current_user
    localStorage.setItem(
      'current_user',
      JSON.stringify({
        username: matched.username,
        role: role,
      })
    );

    if (role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/tables');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-3xl font-bold text-white shadow-lg shadow-amber-300/40">
            R
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Welcome to</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Odoo Cafe</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Username</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Role</label>
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 bg-white outline-none transition focus:border-slate-900"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Login
            </button>
          </form>

          {/* Link to Signup */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-semibold text-slate-900 underline underline-offset-2 hover:text-amber-600 transition"
            >
              Sign Up
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Odoo Cafe POS &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
