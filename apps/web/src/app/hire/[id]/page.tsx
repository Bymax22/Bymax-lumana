import { publicApi } from '@/lib/publicApi';
import RentalDetailClient from '@/components/RentalDetailClient';

interface Props {
  params: Promise<{ id: string }>;
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
