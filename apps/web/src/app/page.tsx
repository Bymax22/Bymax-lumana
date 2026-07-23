import Link from 'next/link';
import ConvertedAmount from '@/components/ConvertedAmount';
import { publicApi } from '@/lib/publicApi';

export default async function HomePage() {
  const [vehicles, auctions, dealers, brands] = await Promise.all([
    publicApi('/vehicles').catch(() => []),
    publicApi('/auctions').catch(() => []),
    publicApi('/dealers').catch(() => []),
    publicApi('/admin/brands?take=8').catch(() => []),
  ]);

  // stats and computed lists
  const stats = {
    vehicles: Array.isArray(vehicles) ? vehicles.length : 0,
    dealers: Array.isArray(dealers) ? dealers.length : 0,
    liveAuctions: Array.isArray(auctions) ? auctions.filter((a: any) => a.status === 'LIVE').length : 0,
  };

  const brandCounts: { name: string; count: number }[] = [];
  if (Array.isArray(vehicles)) {
    const map: Record<string, number> = {};
    vehicles.forEach((v: any) => {
      const name = v.make || (v.brand && v.brand.name) || 'Unknown';
      map[name] = (map[name] || 0) + 1;
    });
    Object.keys(map)
      .sort((a, b) => map[b] - map[a])
      .slice(0, 8)
      .forEach((k) => brandCounts.push({ name: k, count: map[k] }));
  }

  const liveList = Array.isArray(auctions) ? auctions.filter((a: any) => a.status === 'LIVE').slice(0, 4) : [];
  const popularBrands = Array.isArray(brands) && brands.length ? brands : brandCounts;

  return (
    <section className="space-y-6">
      {/* Hero */}
      <div className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-[18px] bg-[#121212] px-3 py-2 text-[11px] uppercase text-red-400">Global Vehicle Marketplace</div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">Your World. Your Drive.<br /><span className="text-red-500">Our Planet.</span></h1>
            <p className="max-w-2xl text-slate-300">Buy, import and manage quality vehicles from Japan and around the world.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/vehicles" className="rounded-[18px] bg-red-600 px-4 py-2 text-sm font-semibold uppercase text-white">Explore Vehicles</Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-[18px] bg-[#121212] px-3 py-1 text-sm font-semibold text-white/90">How It Works</Link>
              <Link href="/auth/signup" className="rounded-[18px] bg-yellow-500 px-4 py-2 text-sm font-semibold text-[#0b0b0b]">Sign Up</Link>
            </div>
          </div>

          <div className="relative mx-auto mt-6 h-[420px] w-full max-w-[540px] overflow-hidden rounded-[28px] bg-[#111111] px-6 py-8">
            <div className="absolute inset-0 rounded-[28px] border border-red-600/20" />
            <div className="relative flex h-full items-end justify-center">
              <div className="relative h-[330px] w-full rounded-[24px] bg-[#070707]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase text-slate-400">Find Your Perfect Vehicle</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Search for the exact car you need.</h2>
          </div>
          <Link href="/vehicles" className="rounded-[18px] bg-[#121212] px-3 py-1 text-sm text-slate-300">Advanced Search</Link>
        </div>

        <form action="/vehicles" method="get" className="mt-6 grid gap-4 grid-cols-1 items-stretch xl:grid-cols-[1fr_1fr_1fr_1.4fr_auto]">
          <label className="rounded-[18px] bg-[#121212] p-3 text-sm text-slate-300">
            <span className="text-xs uppercase text-slate-500">Make</span>
            <input name="make" placeholder="Any Make" className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white" />
          </label>

          <label className="rounded-[18px] bg-[#121212] p-3 text-sm text-slate-300">
            <span className="text-xs uppercase text-slate-500">Model</span>
            <input name="model" placeholder="Any Model" className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white" />
          </label>

          <label className="rounded-[18px] bg-[#121212] p-3 text-sm text-slate-300">
            <span className="text-xs uppercase text-slate-500">Year</span>
            <input name="year" placeholder="Any Year" className="mt-2 w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white" />
          </label>

          <label className="rounded-[18px] bg-[#121212] p-3 text-sm text-slate-300">
            <span className="text-xs uppercase text-slate-500">Price Range (USD)</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input name="minPrice" type="number" min="0" placeholder="Min" className="w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white" />
              <input name="maxPrice" type="number" min="0" placeholder="Max" className="w-full rounded-[14px] border border-[#272727] bg-[#121212] px-3 py-3 text-sm text-white" />
            </div>
          </label>

          <button type="submit" className="rounded-[18px] bg-red-600 px-4 text-sm font-semibold uppercase text-white self-center h-12 flex items-center justify-center">Search Vehicles</button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
          <span>Popular Searches:</span>
          {(popularBrands || []).slice(0,5).map((b: any) => (
            <span key={b.id || b.name || b} className="rounded-[14px] bg-[#121212] px-3 py-2">{b.name || b}</span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr_1fr]">
        {/* Live auctions */}
        <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-slate-400">Live Auctions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Live Auctions</h2>
            </div>
            <Link href="/auctions" className="rounded-[18px] bg-[#121212] px-4 py-2 text-xs text-slate-300">View All</Link>
          </div>

          <div className="mt-6 space-y-4">
            {liveList.map((auction: any) => (
              <div key={auction.id} className="rounded-[20px] bg-[#121212] p-4">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-28 rounded-[20px] bg-[#0d0d0d]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase text-slate-500">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[14px] bg-red-600/10 text-red-300">●</span>
                      <span>{auction.vehicle?.make ?? 'Auction'}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{auction.title}</h3>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                      <span className="rounded-[14px] bg-[#0d0d0d] px-3 py-1 uppercase text-slate-400">{new Date(auction.endAt).toLocaleTimeString()}</span>
                      <span className="text-red-400">{auction.currentPrice ? <ConvertedAmount amountUsd={auction.currentPrice} /> : <ConvertedAmount amountUsd={auction.startingPrice} />}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase text-slate-500">{auction.title}</span>
                  <Link href="/auctions" className="rounded-[18px] bg-red-600 px-4 py-1 text-xs font-semibold uppercase text-white">Place Bid</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why choose us */}
        <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <p className="text-sm uppercase text-slate-400">Why Choose Us</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Why Choose Us</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-4 rounded-[18px] bg-[#121212] p-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-red-600/10 text-red-300">{stats.vehicles}</div>
              <div>
                <p className="font-semibold text-white">{stats.vehicles} Vehicles</p>
                <p className="mt-1 text-sm text-slate-400">Wide selection across multiple markets.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[18px] bg-[#121212] p-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-red-600/10 text-red-300">{stats.dealers}</div>
              <div>
                <p className="font-semibold text-white">{stats.dealers} Dealers</p>
                <p className="mt-1 text-sm text-slate-400">Trusted dealer network.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[18px] bg-[#121212] p-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-red-600/10 text-red-300">{stats.liveAuctions}</div>
              <div>
                <p className="font-semibold text-white">{stats.liveAuctions} Live Auctions</p>
                <p className="mt-1 text-sm text-slate-400">Real-time bidding & verified listings.</p>
              </div>
            </div>
          </div>
          <Link href="/services" className="mt-6 inline-flex rounded-[18px] bg-yellow-500 px-6 py-4 text-sm font-semibold text-[#0b0b0b]">Learn More</Link>
        </div>

        {/* Vehicles Browse (conditional) */}
        {Array.isArray(vehicles) && vehicles.length > 0 && (
          <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase text-slate-400">Browse Vehicles</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Latest Vehicles</h2>
              </div>
              <Link href="/vehicles" className="rounded-[18px] bg-[#121212] px-4 py-2 text-xs text-slate-300">Browse All</Link>
            </div>

            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.slice(0, 6).map((v: any) => (
                <Link key={v.id} href={`/vehicles/${v.id}`} className="block rounded-[14px] bg-[#121212] p-4">
                  <div className="h-40 w-full rounded-md bg-[#0d0d0d] bg-center bg-cover" style={{ backgroundImage: v.images?.[0]?.url ? `url(${v.images[0].url})` : undefined }} />
                  <h3 className="mt-3 text-lg font-semibold text-white">{v.make} {v.model}</h3>
                  <p className="text-sm text-slate-400">{v.year}</p>
                  <div className="mt-2 text-red-400 font-semibold">{v.price ? <ConvertedAmount amountUsd={v.price} /> : 'Contact'}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Brands */}
        <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-slate-400">Popular Brands</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Popular Brands</h2>
            </div>
            <span className="text-sm text-slate-300">Top</span>
          </div>
          <div className="mt-6 space-y-4">
            {(popularBrands || []).slice(0,6).map((b: any) => {
              const logoUrl = b.logoUrl?.trim();
              const title = b.name || b.name || b;
              return (
                <div key={b.id || title || b} className="flex items-center justify-between rounded-[18px] bg-[#121212] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white flex items-center justify-center">
                      {!logoUrl && <span>{String(title).charAt(0)}</span>}
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={`${title} logo`}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => {
                            (event.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-[11px] text-slate-500">{b.count ? `${b.count} Vehicles` : ''}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-400">›</span>
                </div>
              );
            })}
          </div>
          <Link href="/dealers" className="text-sm font-semibold text-yellow-400 hover:text-white">View All Brands</Link>
        </div>
      </div>
    </section>
  );
}
