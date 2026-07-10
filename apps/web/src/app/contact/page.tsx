import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Mail className="h-6 w-6 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Reach out for support, sales inquiries, or help with an existing order.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-white">Call Us</h3>
                  <p className="text-sm">+260 123 456 789</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-sm">info@lumanaautoplanet.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">Contact Form</h2>
            <form className="mt-6 space-y-4 text-slate-300">
              <div>
                <label className="text-sm text-slate-400">Name</label>
                <input className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#050505] px-4 py-3 text-white outline-none focus:border-red-500" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <input className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#050505] px-4 py-3 text-white outline-none focus:border-red-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Message</label>
                <textarea className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#050505] px-4 py-3 text-white outline-none focus:border-red-500" rows={5} placeholder="Tell us how we can help." />
              </div>
              <button className="inline-flex items-center justify-center rounded-[18px] bg-yellow-500 px-6 py-3 text-sm font-semibold text-[#0b0b0b] hover:bg-yellow-400">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
