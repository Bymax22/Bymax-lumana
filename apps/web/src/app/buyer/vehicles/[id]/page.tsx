import { publicApi } from '@/lib/publicApi';
import BuyerVehicleDetail from '@/components/BuyerVehicleDetail';

type Props = { params: Promise<{ id: string }> };

export default async function VehicleDetail({ params }: Props) {
  const { id } = await params;
  const vehicle = await publicApi(`/vehicles/${id}`).catch(() => null);

  if (!vehicle) return <div className="p-6">Vehicle not found</div>;

  return (
    <section className="p-6">
      <BuyerVehicleDetail vehicle={vehicle} />
    </section>
  );
}
