import { publicApi } from '@/lib/publicApi';
import RentalDetailClient from '@/components/RentalDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await publicApi(`/hire/vehicles/${id}`).catch(() => null);
  if (!vehicle) return { title: 'Rental vehicle | Lumana AutoPlanet' };
  const title = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} rental`.trim();
  const image = vehicle.images?.[0];
  return { title, description: vehicle.description || `${title} available in ${vehicle.location || 'Lusaka'}.`, openGraph: { title, description: vehicle.description || title, images: image ? [image] : [] } };
}

export default async function HireVehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = await publicApi(`/hire/vehicles/${id}`).catch(() => null);

  if (!vehicle) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Vehicle not found</div>;
  }

  return (
    <section className="space-y-6">
      <RentalDetailClient vehicle={vehicle} />
    </section>
  );
}
