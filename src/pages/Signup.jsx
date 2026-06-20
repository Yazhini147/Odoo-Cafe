import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, username, email, password } = form;

    // Validate all fields
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Load existing users
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users')) || [];
    } catch {
      users = [];
    }

    // Check if username already taken
    if (users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setError('Username already exists. Please choose another.');
      return;
    }

    // Save new user
    const newUser = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-3xl font-bold text-white shadow-lg shadow-amber-300/40">
            R
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Join</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Odoo Cafe</h1>
          <p className="mt-2 text-sm text-slate-500">Create your account to get started</p>
        </div>

        {/* Signup Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/80">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Username</label>
              <input
                id="signup-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Create Account
            </button>
          </form>

          {/* Link to Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-semibold text-slate-900 underline underline-offset-2 hover:text-amber-600 transition"
            >
              Login
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
