import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Logged in successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Password Shield</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Login</h1>
          <p className="mt-2 text-sm text-slate-400">Access your dashboard to review password strength, breach exposure, and reuse status.</p>
        </div>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" onChange={(event) => setEmail(event.target.value)} type="email" value={email} required />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Password</span>
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" onChange={(event) => setPassword(event.target.value)} type="password" value={password} required />
        </label>
        <button className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:opacity-60" disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm text-slate-400">
          No account yet? <Link className="text-brand-400" to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
