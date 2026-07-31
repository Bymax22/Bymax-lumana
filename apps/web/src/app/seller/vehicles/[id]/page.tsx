import { publicApi } from '@/lib/publicApi';
import SellerVehicleForm from '@/components/SellerVehicleForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditVehiclePage({ params }: Props) {
  const { id } = await params;
  let vehicle = null;
  try {
    vehicle = await publicApi(`/vehicles/${id}`);
  } catch (e) {
    vehicle = null;
  }

  if (!vehicle) return <div className="p-6">Vehicle not found</div>;

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold">Edit Vehicle</h2>
        <div className="mt-6">
          {/* SellerVehicleForm is client; pass initial via prop */}
          {/* @ts-ignore */}
          <SellerVehicleForm initial={vehicle} />
        </div>
      </div>
    </section>
  );
}
