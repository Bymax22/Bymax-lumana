import { Sparkles } from 'lucide-react';

const services = [
  { title: 'Global Vehicle Import', description: 'Import cars from Japan and manage customs paperwork with a single partner.' },
  { title: 'Customs Clearance', description: 'Fast customs processing with expert support for every shipment.' },
  { title: 'Inspection & Quality', description: 'Thorough pre-shipment inspections and report documentation.' },
  { title: 'Finance Support', description: 'Flexible financing options to help buyers get the right plan.' },
  { title: 'Shipping Coordination', description: 'Door-to-door shipping planning with leading logistics partners.' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Our Services</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Explore the services Lumana offers for vehicle buyers, importers, and dealers.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
              <p className="mt-3 text-slate-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
