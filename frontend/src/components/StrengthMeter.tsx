interface StrengthMeterProps {
  score: number;
  label: string;
}

const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

export default function StrengthMeter({ score, label }: StrengthMeterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Strength meter</span>
        <span className="font-semibold text-white">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`h-3 rounded-full ${segment <= score ? colors[Math.min(score, 3)] : 'bg-slate-800'}`}
          />
        ))}
      </div>
    </div>
  );
}
