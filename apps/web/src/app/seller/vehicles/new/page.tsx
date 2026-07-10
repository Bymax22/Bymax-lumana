"use client";

import SellerVehicleForm from '@/components/SellerVehicleForm';

export default function NewVehiclePage() {
  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold">Add Vehicle</h2>
        <p className="text-slate-400">Create a new vehicle listing</p>

        <div className="mt-6">
          <SellerVehicleForm />
        </div>
      </div>
    </section>
  );
}
