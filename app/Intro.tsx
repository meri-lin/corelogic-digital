'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

/* Preloader: numërues 0→100, pastaj perdja ndahet në dy dhe hap faqen.
   Kur hapet, vendos data-ready në <html> dhe Hero starton animacionet. */
export default function Intro() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'load' | 'open' | 'done'>('load');

  useEffect(() => {
    const root = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.setAttribute('data-ready', '');
      setPhase('done');
      return;
    }
    document.body.style.overflow = 'hidden';
    const DUR = 1900,
      t0 = performance.now();
    let id = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / DUR, 1);
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100)); // ease-out
      if (p < 1) id = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setPhase('open');
          root.setAttribute('data-ready', '');
          document.body.style.overflow = '';
          setTimeout(() => setPhase('done'), 1100);
        }, 250);
      }
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  if (phase === 'done') return null;
  const open = phase === 'open';
  const half =
    'absolute left-0 right-0 bg-[#05070F] transition-transform duration-[1000ms] ease-[cubic-bezier(.77,0,.18,1)]';

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden>
      <div
        className={`${half} top-0 h-1/2 ${open ? '-translate-y-full' : ''}`}
      />
      <div
        className={`${half} bottom-0 h-1/2 ${open ? 'translate-y-full' : ''}`}
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#ffffff14"
              strokeWidth="1.5"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#5ce1e6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * pct) / 100}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#E8EEF9]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pct}
          </span>
        </div>
        <div className="rounded-2xl bg-white px-5 py-3">
          <Image
            src="/logo.png"
            alt="Corelogic Digital"
            width={180}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
