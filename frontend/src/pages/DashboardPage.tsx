import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import api from '../api/client';
import PasswordChecklist from '../components/PasswordChecklist';
import PasswordGeneratorPanel from '../components/PasswordGeneratorPanel';
import StrengthMeter from '../components/StrengthMeter';
import { useAuth } from '../contexts/AuthContext';
import { analyzePassword } from '../lib/passwordAnalysis';
import type { BreachResponse, DashboardSnapshot, PasswordSubmissionResponse } from '../types';

export default function DashboardPage() {
  const { email, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [breach, setBreach] = useState<BreachResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const analysis = useMemo(() => analyzePassword(password), [password]);

  const loadDashboard = async () => {
    const { data } = await api.get<DashboardSnapshot>('/passwords/dashboard');
    setSnapshot(data);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const runBreachCheck = async () => {
    if (!password) return;
    const { data } = await api.post<BreachResponse>('/passwords/breach-check', { password });
    setBreach(data);
  };

  const savePassword = async () => {
    try {
      setSubmitting(true);
      const { data } = await api.post<PasswordSubmissionResponse>('/passwords/analyze-and-store', {
        password,
        score: analysis.score,
        label: analysis.label,
      });
      toast.success(data.message);
      await loadDashboard();
      await runBreachCheck();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Could not save password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Secure credential intelligence</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Password Strength Analyzer</h1>
            <p className="mt-2 text-sm text-slate-400">Signed in as {email}</p>
          </div>
          <button className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200" onClick={logout} type="button">
            Logout
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ['Latest score', snapshot ? `${snapshot.latestPasswordScore}/4` : '--'],
            ['Strength label', snapshot?.latestPasswordLabel || '--'],
            ['Breached', snapshot ? (snapshot.breachStatus ? 'Yes' : 'No') : '--'],
            ['Reuse blocked', snapshot ? (snapshot.reuseStatus ? 'Yes' : 'No') : '--'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
            <div className="space-y-3">
              <label className="block text-sm text-slate-300" htmlFor="password">Analyze password</label>
              <input
                id="password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-base"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a password to analyze"
                type="password"
                value={password}
              />
            </div>
            <StrengthMeter label={analysis.label} score={analysis.score} />
            <PasswordChecklist analysis={analysis} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
                <p className="text-slate-400">Crack time estimate</p>
                <p className="mt-2 text-lg font-semibold text-white">{analysis.crackTimeDisplay}</p>
                <p className="mt-4 text-slate-400">Detected patterns</p>
                <ul className="mt-2 space-y-2">
                  {analysis.patternSummary.length ? analysis.patternSummary.map((item) => <li key={item}>{item}</li>) : <li>No obvious patterns detected.</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
                <p className="text-slate-400">Suggestions</p>
                <ul className="mt-2 space-y-2">
                  {analysis.feedback.suggestions.length ? analysis.feedback.suggestions.map((item) => <li key={item}>{item}</li>) : <li>Password structure looks balanced.</li>}
                </ul>
                {analysis.feedback.warning && <p className="mt-4 text-amber-300">Warning: {analysis.feedback.warning}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400" onClick={() => void runBreachCheck()} type="button">
                Check breach status
              </button>
              <button className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 disabled:opacity-50" disabled={!password || submitting} onClick={() => void savePassword()} type="button">
                {submitting ? 'Saving...' : 'Store password hash'}
              </button>
            </div>
            {breach && (
              <div className={`rounded-2xl border p-4 text-sm ${breach.breached ? 'border-red-500/40 bg-red-500/10 text-red-100' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'}`}>
                {breach.breached ? `Password found in breaches ${breach.count} times.` : 'Password not found in Have I Been Pwned range response.'}
              </div>
            )}
          </div>
          <PasswordGeneratorPanel onGenerate={setPassword} />
        </section>
      </div>
    </main>
  );
}
