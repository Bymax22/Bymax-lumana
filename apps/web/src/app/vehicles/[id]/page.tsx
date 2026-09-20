import { publicApi } from '@/lib/publicApi';
import BuyerVehicleDetail from '@/components/BuyerVehicleDetail';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await publicApi(`/vehicles/${id}`).catch(() => null);
  if (!vehicle) return { title: 'Vehicle | Lumana AutoPlanet' };
  const title = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim();
  const image = vehicle.images?.[0]?.url || vehicle.images?.[0];
  return { title, description: vehicle.description || `${title} available from Lumana AutoPlanet.`, openGraph: { title, description: vehicle.description || title, images: image ? [image] : [] } };
}

export default async function PublicVehicleDetail({ params }: Props) {
  const { id } = await params;
  const vehicle = await publicApi(`/vehicles/${id}`).catch(() => null);

  if (!vehicle) return <div className="p-6">Vehicle not found</div>;

  return <section className="p-6"><BuyerVehicleDetail vehicle={vehicle} /></section>;
}