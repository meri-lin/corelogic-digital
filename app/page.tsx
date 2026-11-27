'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import Intro from './Intro';
import Hero from './Hero';
import Image from 'next/image';
import Partners from './Partners';

/* ---------- Të dhënat: ndrysho këtu projektet ---------- */
type Project = {
  slug: string;
  title: string;
  place: string;
  category: 'hotel' | 'restaurant' | 'clinic' | 'real-estate';
  tourType: 'link' | 'file';
  tourUrl: string; // link: URL i jashtëm | file: /tours/<slug>/index.html
  colors: [string, string];
};
const PROJECTS: Project[] = [
  {
    slug: 'hotel-adriatic',
    title: 'Hotel Adriatic',
    place: 'Durrës',
    category: 'hotel',
    tourType: 'link',
    tourUrl: 'https://kuula.co/',
    colors: ['#5ce1e6', '#1b2f63'],
  },
  {
    slug: 'villa-olive',
    title: 'Villa Olive',
    place: 'Sarandë',
    category: 'real-estate',
    tourType: 'file',
    tourUrl: '/tours/villa-olive/index.html',
    colors: ['#8b7bff', '#10183a'],
  },
  {
    slug: 'bistro-nord',
    title: 'Bistro Nord',
    place: 'Tiranë',
    category: 'restaurant',
    tourType: 'link',
    tourUrl: 'https://matterport.com/',
    colors: ['#ffb86b', '#2a1633'],
  },
  {
    slug: 'klinika-vita',
    title: 'Klinika Vita',
    place: 'Tiranë',
    category: 'clinic',
    tourType: 'file',
    tourUrl: '/tours/klinika-vita/index.html',
    colors: ['#6ef3b0', '#0d2a35'],
  },
  {
    slug: 'hotel-alpin',
    title: 'Hotel Alpin',
    place: 'Theth',
    category: 'hotel',
    tourType: 'file',
    tourUrl: '/tours/hotel-alpin/index.html',
    colors: ['#7fb2ff', '#14224d'],
  },
  {
    slug: 'loft-blloku',
    title: 'Loft Blloku',
    place: 'Tiranë',
    category: 'real-estate',
    tourType: 'link',
    tourUrl: 'https://kuula.co/',
    colors: ['#ff7aa8', '#241338'],
  },
];
const CATS = [
  { id: 'all', label: 'Të gjitha' },
  { id: 'hotel', label: 'Hotele' },
  { id: 'restaurant', label: 'Restorante' },
  { id: 'clinic', label: 'Klinika' },
  { id: 'real-estate', label: 'Pasuri të paluajtshme' },
] as const;

/* ---------- Panorama demo (zëvendësoje me foto 360 reale: /public/pano.jpg) ---------- */
const W = 1600,
  H = 420;
const arches = Array.from(
  { length: 8 },
  (_, i) =>
    `<path d='M${i * 200 + 30} 260V120a70 70 0 0 1 140 0V260z' fill='url(#w)' opacity='.55'/>`
).join('');
const PANO = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0d1a3a'/><stop offset='.62' stop-color='#1b2f63'/><stop offset='.62' stop-color='#0a1020'/><stop offset='1' stop-color='#142040'/></linearGradient><linearGradient id='w' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#5ce1e6' stop-opacity='.9'/><stop offset='1' stop-color='#8b7bff' stop-opacity='.15'/></linearGradient></defs><rect width='${W}' height='${H}' fill='url(#g)'/>${arches}</svg>`
)}")`;
const HOTSPOTS = [
  { x: 260, label: 'Lobby' },
  { x: 760, label: 'Suita 204' },
  { x: 1240, label: 'Rooftop bar' },
];

function Viewer() {
  const [yaw, setYaw] = useState(0);
  const drag = useRef<number | null>(null);
  const auto = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrap = (v: number) => ((v % W) + W) % W;
  const pause = () => {
    auto.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => (auto.current = true), 3000);
  };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const tick = () => {
      if (auto.current) setYaw((y) => wrap(y + 0.3));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      tabIndex={0}
      role="application"
      aria-label="Pamje 360° demo. Përdor shigjetat majtas dhe djathtas."
      className="relative h-[420px] w-full cursor-grab touch-pan-y overflow-hidden rounded-[28px] border border-white/10 select-none active:cursor-grabbing"
      style={{
        backgroundImage: PANO,
        backgroundSize: `${W}px ${H}px`,
        backgroundPositionX: -yaw,
        backgroundRepeat: 'repeat-x',
      }}
      onPointerDown={(e) => {
        drag.current = e.clientX;
        pause();
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current === null) return;
        setYaw((y) => wrap(y - (e.clientX - drag.current!)));
        drag.current = e.clientX;
        pause();
      }}
      onPointerUp={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          pause();
          setYaw((y) => wrap(y - 40));
        }
        if (e.key === 'ArrowRight') {
          pause();
          setYaw((y) => wrap(y + 40));
        }
      }}
    >
      {HOTSPOTS.map((h) => (
        <button
          key={h.label}
          onClick={() => {
            pause();
            setYaw(wrap(h.x - 400));
          }}
          className="absolute top-[58%] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#5ce1e6]/50 bg-[#05070F]/70 px-3 py-1.5 text-sm text-[#5ce1e6] backdrop-blur hover:bg-[#5ce1e6] hover:text-[#05070F]"
          style={{ left: wrap(h.x - yaw) }}
        >
          <span className="pulse h-2 w-2 rounded-full bg-current" />
          {h.label}
        </button>
      ))}
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#05070F]/70 px-4 py-1.5 text-sm text-[#E8EEF9]/80 backdrop-blur">
        {Math.round((wrap(yaw) / W) * 360)}° · Tërhiqe për të parë përreth
      </div>
    </div>
  );
}

function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>(
    'idle'
  );
  const [err, setErr] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      setErr('Shkruaj një email të vlefshëm.');
      return;
    }
    setErr('');
    setState('sending');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      setState(r.ok ? 'ok' : 'error');
    } catch {
      setState('error');
    }
  }
  const field =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[#E8EEF9] placeholder:text-[#E8EEF9]/40 focus:border-[#5ce1e6] focus:outline-none';
  if (state === 'ok')
    return (
      <p className="rounded-2xl border border-[#6ef3b0]/40 p-6 text-[#6ef3b0]">
        Mesazhi u dërgua. Të përgjigjemi brenda 24 orësh.
      </p>
    );
  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Emri"
          aria-label="Emri"
          className={field}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          aria-label="Email"
          className={field}
        />
      </div>
      <select
        name="type"
        aria-label="Lloji i biznesit"
        className={field}
        defaultValue="hotel"
      >
        <option value="hotel">Hotel</option>
        <option value="restaurant">Restorant</option>
        <option value="clinic">Klinikë</option>
        <option value="real-estate">Pasuri të paluajtshme</option>
        <option value="other">Tjetër</option>
      </select>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Na trego për hapësirën që dëshiron të shfaqësh"
        aria-label="Mesazhi"
        className={field}
      />
      {err && (
        <p role="alert" className="text-[#ff7aa8]">
          {err}
        </p>
      )}
      {state === 'error' && (
        <p role="alert" className="text-[#ff7aa8]">
          Dërgimi dështoi. Provo përsëri ose na shkruaj direkt me email.
        </p>
      )}
      <button
        disabled={state === 'sending'}
        className="justify-self-start rounded-full bg-[#5ce1e6] px-8 py-3 font-semibold text-[#05070F] transition hover:bg-white disabled:opacity-60"
      >
        {state === 'sending' ? 'Po dërgohet…' : 'Kërko ofertë'}
      </button>
    </form>
  );
}

export default function Home() {
  const [cat, setCat] = useState<(typeof CATS)[number]['id']>('all');
  const [open, setOpen] = useState<Project | null>(null);
  const list = PROJECTS.filter((p) => cat === 'all' || p.category === cat);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  return (
    <main
      className="bg-[#05070F] text-[#E8EEF9]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <Intro />
      <style>{`.pulse{animation:p 2s infinite}@keyframes p{50%{box-shadow:0 0 0 8px #5ce1e600;opacity:.5}0%{box-shadow:0 0 0 0 #5ce1e688}}
      a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:2px solid #5ce1e6;outline-offset:3px}
      @media (prefers-reduced-motion:reduce){.pulse{animation:none}}`}</style>

      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#05070F]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#"
            aria-label="Corelogic Digital"
            className="rounded-xl bg-white px-3 py-1.5"
          >
            <Image
              src="/logo.png"
              alt="Corelogic Digital"
              width={160}
              height={40}
              priority
              className="h-7 w-auto"
            />
          </a>
          <nav className="hidden gap-8 text-sm text-[#E8EEF9]/70 md:flex">
            <a href="#projects" className="hover:text-white">
              Projektet
            </a>
            <a href="#process" className="hover:text-white">
              Si funksionon
            </a>
            <a href="#contact" className="hover:text-white">
              Kontakt
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full border border-[#5ce1e6]/60 px-5 py-2 text-sm text-[#5ce1e6] hover:bg-[#5ce1e6] hover:text-[#05070F]"
          >
            Kërko ofertë
          </a>
        </div>
      </header>

      <Hero>
        <Viewer />
      </Hero>

      <Partners />

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <h2
          className="text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Hapësira që kemi sjellë online
        </h2>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist">
          {CATS.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${cat === c.id ? 'border-[#5ce1e6] bg-[#5ce1e6] text-[#05070F]' : 'border-white/15 text-[#E8EEF9]/70 hover:border-white/40'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <button
              key={p.slug}
              onClick={() => setOpen(p)}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] text-left transition hover:border-[#5ce1e6]/60"
            >
              <div
                className="h-48 transition duration-500 group-hover:scale-[1.03]"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${p.colors[0]}66, transparent 60%), linear-gradient(160deg, ${p.colors[1]}, #05070F)`,
                }}
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-[#E8EEF9]/60">
                  {p.place} –{' '}
                  {p.tourType === 'file' ? 'Tur i ngarkuar' : 'Tur me link'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-6xl px-6 py-24">
        <h2
          className="text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Nga ideja te turi, në tre hapa
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            [
              'Çajmë hapësirën',
              'Vijmë në vendin tuaj dhe fotografojmë çdo cep me kamerë 360°.',
            ],
            [
              'Ndërtojmë turin',
              'Bashkojmë pamjet, shtojmë pika interesi dhe e testojmë në telefon e kompjuter.',
            ],
            [
              'E publikojmë',
              'Merr një link dhe kod embed për faqen, Google Maps dhe rrjetet sociale.',
            ],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-[28px] border border-white/10 p-6">
              <span
                className="text-[#5ce1e6]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {i + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-[#E8EEF9]/65">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
        <h2
          className="text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Na tregoni për hapësirën tuaj
        </h2>
        <p className="mt-3 mb-8 text-[#E8EEF9]/65">
          Përgjigjemi brenda 24 orësh me një ofertë të qartë.
        </p>
        <Contact />
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-[#E8EEF9]/50">
        © 2026 Corelogic Digital
      </footer>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          className="fixed inset-0 z-50 flex flex-col bg-[#05070F]/95 p-4 backdrop-blur"
          onClick={() => setOpen(null)}
        >
          <div
            className="mb-3 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold">{open.title}</h3>
            <div className="flex gap-3">
              <a
                href={open.tourUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white"
              >
                Hape në skedë të re
              </a>
              <button
                onClick={() => setOpen(null)}
                className="rounded-full bg-white px-4 py-2 text-sm text-[#05070F]"
              >
                Mbyll
              </button>
            </div>
          </div>
          <iframe
            src={open.tourUrl}
            title={open.title}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            className="w-full flex-1 rounded-2xl border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
