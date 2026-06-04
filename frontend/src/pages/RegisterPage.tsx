import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PasswordChecklist from '../components/PasswordChecklist';
import StrengthMeter from '../components/StrengthMeter';
import { useAuth } from '../contexts/AuthContext';
import { analyzePassword } from '../lib/passwordAnalysis';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const analysis = useMemo(() => analyzePassword(password), [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await register(email, password);
      toast.success('Registration successful.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Use a stronger password or different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <form className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Password Shield</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Register</h1>
            <p className="mt-2 text-sm text-slate-400">Create an account and start tracking password strength and reuse history.</p>
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <p className="text-sm text-slate-400">
            Already registered? <Link className="text-brand-400" to="/login">Login</Link>
          </p>
        </form>
        <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft">
          <StrengthMeter label={analysis.label} score={analysis.score} />
          <PasswordChecklist analysis={analysis} />
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
            <p>Crack time estimate: <span className="font-semibold text-white">{analysis.crackTimeDisplay}</span></p>
            <p className="mt-3">Suggestions: {analysis.feedback.suggestions.length ? analysis.feedback.suggestions.join(' ') : 'Password structure looks good.'}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
