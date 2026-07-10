import { Car } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';
import VehicleGrid from '@/components/VehicleGrid';

interface VehiclesPageProps {
  searchParams?: {
    search?: string;
    make?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const search = searchParams?.search || '';
  const make = searchParams?.make || '';
  const model = searchParams?.model || '';
  const year = searchParams?.year || '';
  const minPrice = searchParams?.minPrice || '';
  const maxPrice = searchParams?.maxPrice || '';

  const query = new URLSearchParams();
  if (search) query.set('search', search);
  if (make) query.set('make', make);
  if (model) query.set('model', model);
  if (year) query.set('year', year);
  if (minPrice) query.set('minPrice', minPrice);
  if (maxPrice) query.set('maxPrice', maxPrice);

  let vehicles: any[] = [];
  let errorMessage = '';

  try {
    const queryString = query.toString();
    vehicles = await publicApi(`/vehicles${queryString ? `?${queryString}` : ''}`);
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  const showSummary = !!(search || make || model || year || minPrice || maxPrice);

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-slate-300">
              <Car className="h-6 w-6 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">Vehicles</h1>
                <p className="mt-2 max-w-2xl text-slate-400">Browse the latest vehicles imported from our database. These listings are fetched directly from your API so they stay synced with the backend.</p>
              </div>
            </div>
            <div className="rounded-[20px] bg-[#121212] px-4 py-3 text-sm text-slate-300">Data refreshed from the backend each page load.</div>
          </div>

          <form action="/vehicles" method="get" className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
            <label className="rounded-[18px] bg-[#121212] p-4 text-sm text-slate-300">
              <span className="text-xs uppercase text-slate-500">Keyword / VIN</span>
              <input
                name="search"
                defaultValue={search}
                placeholder="Search make, model, VIN..."
                className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </label>
            <label className="rounded-[18px] bg-[#121212] p-4 text-sm text-slate-300">
              <span className="text-xs uppercase text-slate-500">Make</span>
              <input
                name="make"
                defaultValue={make}
                placeholder="Any Make"
                className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </label>
            <label className="rounded-[18px] bg-[#121212] p-4 text-sm text-slate-300">
              <span className="text-xs uppercase text-slate-500">Model</span>
              <input
                name="model"
                defaultValue={model}
                placeholder="Any Model"
                className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </label>
            <label className="rounded-[18px] bg-[#121212] p-4 text-sm text-slate-300">
              <span className="text-xs uppercase text-slate-500">Year</span>
              <input
                name="year"
                defaultValue={year}
                type="number"
                min="1900"
                max="2099"
                placeholder="Any Year"
                className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </label>
            <div className="rounded-[18px] bg-[#121212] p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase text-slate-500">Price Range</span>
                <button type="submit" className="rounded-[14px] bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500">Apply Filters</button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  name="minPrice"
                  defaultValue={minPrice}
                  type="number"
                  min="0"
                  placeholder="Min"
                  className="w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
                />
                <input
                  name="maxPrice"
                  defaultValue={maxPrice}
                  type="number"
                  min="0"
                  placeholder="Max"
                  className="w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white outline-none transition focus:border-red-500"
                />
              </div>
            </div>
          </form>

          {showSummary ? (
            <div className="mt-6 rounded-[24px] bg-[#121212] p-4 text-sm text-slate-300">
              Showing {vehicles.length} vehicle{vehicles.length === 1 ? '' : 's'} matching your filters.
            </div>
          ) : null}
        </div>

        <VehicleGrid vehicles={vehicles} errorMessage={errorMessage} />
      </div>
    </main>
  );
}
