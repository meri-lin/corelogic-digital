'use client';
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

/* Warp: yjet fluturojnë drejt teje me shpejtësi të lartë, pastaj ngadalësohen sapo hapet perdja. */
function Warp() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!,
      ctx = c.getContext('2d')!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dpr = Math.min(devicePixelRatio, 2);
    let w = 0,
      h = 0,
      id = 0,
      speed = 0.045,
      mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    const reset = (s: { x: number; y: number; z: number }) => {
      s.x = Math.random() * 2 - 1;
      s.y = Math.random() * 2 - 1;
      s.z = 1;
    };
    const stars = Array.from({ length: 380 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 0.95 + 0.05,
      p: Math.random(),
    }));
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 60;
      ty = (e.clientY / innerHeight - 0.5) * 40;
    };
    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', move);
    const frame = () => {
      const ready = document.documentElement.hasAttribute('data-ready');
      speed += ((ready ? 0.0016 : 0.045) - speed) * (ready ? 0.025 : 1);
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const k = 0.5 * Math.max(w, h);
      for (const s of stars) {
        const pz = s.z;
        s.z -= speed;
        if (s.z <= 0.02) {
          reset(s);
          continue;
        }
        const x1 = (s.x / pz) * k + w / 2 + mx,
          y1 = (s.y / pz) * k + h / 2 + my;
        const x2 = (s.x / s.z) * k + w / 2 + mx,
          y2 = (s.y / s.z) * k + h / 2 + my;
        if (x2 < 0 || x2 > w || y2 < 0 || y2 > h) {
          reset(s);
          continue;
        }
        ctx.strokeStyle =
          s.p > 0.5
            ? `rgba(92,225,230,${1 - s.z})`
            : `rgba(139,123,255,${1 - s.z})`;
        ctx.lineWidth = (1 - s.z) * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      id = requestAnimationFrame(frame);
    };
    frame();
    return () => {
      cancelAnimationFrame(id);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', move);
    };
  }, []);
  return (
    <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
  );
}

const HEADLINE =
  'Lëri klientët të hyjnë në biznesin tënd përpara se të vijnë.'.split(' ');

export default function Hero({ children }: { children: ReactNode }) {
  return (
    <section
      className="hero relative overflow-hidden px-6 pt-20 pb-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      <style>{`
        .hero::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(520px circle at var(--mx,50%) var(--my,20%),#5ce1e61f,transparent 70%)}
        .w{display:inline-block;transform:translateY(112%)}
        html[data-ready] .w{animation:up .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--i)*70ms)}
        @keyframes up{to{transform:none}}
        .rise{opacity:0;transform:translateY(24px)}
        html[data-ready] .rise{animation:rise .9s ease forwards;animation-delay:var(--d)}
        @keyframes rise{to{opacity:1;transform:none}}
        .pop{opacity:0;transform:translateY(40px) scale(.94);filter:blur(12px)}
        html[data-ready] .pop{animation:pop 1.2s cubic-bezier(.2,.8,.2,1) 1.4s forwards}
        @keyframes pop{to{opacity:1;transform:none;filter:blur(0)}}
        .glow{animation:glow 14s ease-in-out infinite alternate}
        @keyframes glow{to{transform:translate(60px,40px) scale(1.15)}}
        @media (prefers-reduced-motion:reduce){.w,.rise,.pop{opacity:1;transform:none;filter:none;animation:none!important}.glow{animation:none}}
      `}</style>

      <Warp />
      <div className="glow absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#8b7bff]/25 blur-[120px]" />
      <div className="glow absolute top-40 right-0 h-80 w-80 rounded-full bg-[#5ce1e6]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <h1
          className="max-w-4xl text-4xl leading-[1.15] font-bold sm:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {HEADLINE.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <span className="w" style={{ '--i': i } as CSSProperties}>
                {word}
              </span>
              {'\u00A0'}
            </span>
          ))}
        </h1>
        <p
          className="rise mt-6 max-w-xl text-lg text-[#E8EEF9]/70"
          style={{ '--d': '1s' } as CSSProperties}
        >
          Tur virtual 360° për hotele, restorante, klinika dhe prona. Rezervime
          më të sigurta, pyetje më pak, besim që nga klikimi i parë.
        </p>
        <div
          className="rise mt-8 flex flex-wrap gap-4"
          style={{ '--d': '1.2s' } as CSSProperties}
        >
          <a
            href="#contact"
            className="rounded-full bg-[#5ce1e6] px-8 py-3 font-semibold text-[#05070F] hover:bg-white"
          >
            Fillo projektin
          </a>
          <a
            href="#projects"
            className="rounded-full border border-white/20 px-8 py-3 hover:border-white"
          >
            Shiko projektet
          </a>
        </div>
        <div className="pop mt-14">{children}</div>
      </div>
    </section>
  );
}
