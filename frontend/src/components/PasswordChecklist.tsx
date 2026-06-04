import type { PasswordAnalysis } from '../types';

const Item = ({ label, ok }: { label: string; ok: boolean }) => (
  <li className={`rounded-xl border px-4 py-3 text-sm ${ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
    {label}
  </li>
);

export default function PasswordChecklist({ analysis }: { analysis: PasswordAnalysis }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      <Item label={`Length: ${analysis.length} characters`} ok={analysis.length >= 12} />
      <Item label="Has uppercase letter" ok={analysis.hasUppercase} />
      <Item label="Has lowercase letter" ok={analysis.hasLowercase} />
      <Item label="Has number" ok={analysis.hasNumbers} />
      <Item label="Has special character" ok={analysis.hasSpecialCharacters} />
      <Item label={`Entropy: ${analysis.entropy} bits`} ok={analysis.entropy >= 60} />
    </ul>
  );
}
