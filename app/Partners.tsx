import Image from 'next/image';

/* Shto këtu partnerët realë. Vendos logot në public/partners/ (PNG ose SVG me sfond transparent).
   Pa `logo`, shfaqet emri si tekst. */
const PARTNERS: { name: string; logo?: string }[] = [
  { name: 'Logo i klientit 1' },
  { name: 'Logo i klientit 2' },
  { name: 'Logo i klientit 3' },
  { name: 'Logo i klientit 4' },
  { name: 'Logo i klientit 5' },
  { name: 'Logo i klientit 6' },
];
// Shembull me logo reale: { name: "Hotel Adriatic", logo: "/partners/hotel-adriatic.svg" }

const TITLE = 'Të besuar nga organizata në Evropë dhe SHBA'; // ndryshoje sipas partnerëve realë

export default function Partners() {
  const row = (key: string) => (
    <ul
      key={key}
      className="flex shrink-0 items-center gap-16 pr-16"
      aria-hidden={key === 'b'}
    >
      {PARTNERS.map((p) => (
        <li
          key={p.name}
          className="flex h-12 items-center opacity-60 transition hover:opacity-100"
        >
          {p.logo ? (
            <Image
              src={p.logo}
              alt={p.name}
              width={140}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
          ) : (
            <span className="text-lg font-semibold whitespace-nowrap text-[#E8EEF9]/70">
              {p.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={TITLE} className="border-y border-white/5 py-14">
      <style>{`
        .marquee{animation:marquee 32s linear infinite}
        .marquee-wrap:hover .marquee{animation-play-state:paused}
        @keyframes marquee{to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){.marquee{animation:none}}
      `}</style>
      <h2
        className="px-6 text-center text-xl text-[#E8EEF9]/80 sm:text-2xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {TITLE}
      </h2>
      <div className="marquee-wrap mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee flex w-max">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </section>
  );
}
