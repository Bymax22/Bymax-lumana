import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Info className="h-6 w-6 text-slate-200" />
            <h1 className="text-3xl font-bold text-white">About Us</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Lumana AutoPlanet connects buyers, dealers, and logistics partners through a secure global vehicle marketplace.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            <p className="mt-4 text-slate-300">To make vehicle import and export transparent, reliable, and easy to manage for customers across the globe.</p>
          </section>

          <section className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">What We Do</h2>
            <p className="mt-4 text-slate-300">We offer live auction access, vehicle sourcing, customs coordination, financing, and shipping support from a single platform.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
