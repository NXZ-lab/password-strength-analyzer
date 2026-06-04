import { useState } from 'react';
import { generatePassword } from '../lib/passwordGenerator';

export default function PasswordGeneratorPanel({ onGenerate }: { onGenerate: (password: string) => void }) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Password generator</h2>
          <p className="text-sm text-slate-400">Generate a random password with enforced character diversity.</p>
        </div>
        <button
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
          onClick={() => onGenerate(generatePassword({ length, includeNumbers, includeSymbols, includeUppercase, includeLowercase }))}
          type="button"
        >
          Generate
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Length</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            max={64}
            min={8}
            onChange={(event) => setLength(Number(event.target.value))}
            type="range"
            value={length}
          />
          <span className="text-slate-400">{length} characters</span>
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          {[
            ['Numbers', includeNumbers, setIncludeNumbers],
            ['Symbols', includeSymbols, setIncludeSymbols],
            ['Uppercase', includeUppercase, setIncludeUppercase],
            ['Lowercase', includeLowercase, setIncludeLowercase],
          ].map(([label, value, setter]) => (
            <label key={label as string} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <input checked={value as boolean} onChange={() => (setter as (next: boolean) => void)(!(value as boolean))} type="checkbox" />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
