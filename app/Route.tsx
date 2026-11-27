import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  if (data.website) return NextResponse.json({ ok: true }); // honeypot: bot
  if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email ?? '') || !data.message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // TODO: dërgo email me Resend (npm i resend), p.sh.:
  // await new Resend(process.env.RESEND_API_KEY).emails.send({ from, to, subject, text: data.message });
  console.log('Contact form:', data);
  return NextResponse.json({ ok: true });
}
