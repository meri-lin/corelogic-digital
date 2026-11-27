import type { Metadata } from 'next';
import { Unbounded, Instrument_Sans } from 'next/font/google';
import './globals.css';

const display = Unbounded({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
});
const body = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Corelogic Digital | Tur virtual 360° për biznese',
  description:
    'Tur virtual 360° për hotele, restorante, klinika dhe prona. Rezervime më të sigurta dhe besim që nga klikimi i parë.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" className={`${display.variable} ${body.variable}`}>
      <body className="bg-[#05070F]">{children}</body>
    </html>
  );
}
