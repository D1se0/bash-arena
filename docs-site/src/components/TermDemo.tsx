import { useEffect, useState } from 'react';

const LINES = [
  { cmd: 'ls -a', out: '.  ..  .secreto  README' },
  { cmd: 'cat ~/.secreto', out: 'FLAG{7f3a91c02b48d5e6a09b12cd}' },
  { cmd: 'submit FLAG{7f3a91c02b48d5e6a09b12cd}', out: '✓ FLAG CORRECTA — nivel superado · +25 XP' },
  { cmd: 'next', out: '[LVL 02 · Fundamentos] agent@dojo:~$' },
];

export default function TermDemo() {
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [showOut, setShowOut] = useState(false);

  useEffect(() => {
    const line = LINES[step % LINES.length];
    if (chars < line.cmd.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 40);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowOut(true), 250);
    return () => clearTimeout(t);
  }, [chars, step]);

  useEffect(() => {
    if (!showOut) return;
    const t = setTimeout(() => {
      setShowOut(false);
      setChars(0);
      setStep((s) => s + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [showOut, step]);

  const current = LINES[step % LINES.length];

  // historia visible: últimos 3 pasos completados + el actual
  const history = LINES.map((l, i) => (i < step % LINES.length ? l : null)).filter(Boolean);

  return (
    <div className="rounded-xl bg-[#161a20] border border-edge/60 shadow-[0_0_24px_rgba(136,192,208,0.15)] p-4 font-mono text-sm h-[240px] overflow-hidden">
      {history.slice(-3).map((l, i) => (
        <div key={`${l?.cmd}-${i}`} className="opacity-60">
          <p><span className="text-ice">$</span> {l?.cmd}</p>
          {l?.out && <p className="text-frost/70">{l.out}</p>}
        </div>
      ))}
      <div className="mt-1">
        <p>
          <span className="text-ice">$</span> {current.cmd.slice(0, chars)}
          <span className="animate-pulse">▌</span>
        </p>
        {showOut && (
          <p className={current.out.startsWith('✓') ? 'text-verde' : 'text-frost/80'}>{current.out}</p>
        )}
      </div>
    </div>
  );
}
