import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import ConvertedAmount from '@/components/ConvertedAmount';
import { publicApi } from '@/lib/publicApi';

function normalizeArrayPayload(payload: unknown): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>;
    const nested = candidate.data ?? candidate.items ?? candidate.results;
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

function getItemImageUrl(item: any): string | null {
  if (!item) {
    return null;
  }

  const direct = item.imageUrl ?? item.thumbnail ?? item.coverImage;
  if (typeof direct === 'string' && direct.trim()) {
    return direct;
  }

  const gallery = item.images ?? item.imageUrls ?? [];
  if (Array.isArray(gallery)) {
    const first = gallery[0];
    if (typeof first === 'string' && first.trim()) {
      return first;
    }
    if (first && typeof first === 'object') {
      const nestedUrl = first.url ?? first.secure_url ?? first.src;
      if (typeof nestedUrl === 'string' && nestedUrl.trim()) {
        return nestedUrl;
      }
    }
  }

  return null;
}

async function loadHomePageData() {
  const settled = await Promise.allSettled([
    publicApi('/vehicles'),
    publicApi('/auctions'),
    publicApi('/dealers'),
    publicApi('/brands?take=8'),
    publicApi('/shop/products?take=6').catch(() => publicApi('/shop/products/featured')),
    publicApi('/hire/vehicles?take=6'),
  ]);

  return {
    vehicles: normalizeArrayPayload(settled[0].status === 'fulfilled' ? settled[0].value : undefined),
    auctions: normalizeArrayPayload(settled[1].status === 'fulfilled' ? settled[1].value : undefined),
    dealers: normalizeArrayPayload(settled[2].status === 'fulfilled' ? settled[2].value : undefined),
    brands: normalizeArrayPayload(settled[3].status === 'fulfilled' ? settled[3].value : undefined),
    featuredProducts: normalizeArrayPayload(settled[4].status === 'fulfilled' ? settled[4].value : undefined),
    featuredRentals: normalizeArrayPayload(settled[5].status === 'fulfilled' ? settled[5].value : undefined),
  };
}

export default async function HomePage() {
  const { vehicles, auctions, dealers, brands, featuredProducts, featuredRentals } = await loadHomePageData();

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
    <section className="space-y-6 overflow-x-hidden">
      {/* Hero */}
      <div className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-[18px] bg-[#121212] px-3 py-2 text-[11px] uppercase text-red-400">Global Vehicle Marketplace</div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">Your World. Your Drive.<br /><span className="text-red-500">Our Planet.</span></h1>
            <p className="max-w-2xl text-slate-300">Buy, import, hire vehicles, and shop premium auto parts from one trusted platform built for modern mobility.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/vehicles" className="rounded-[18px] bg-red-600 px-4 py-2 text-sm font-semibold uppercase text-white">Explore Vehicles</Link>
              <Link href="/hire" className="rounded-[18px] bg-[#121212] px-4 py-2 text-sm font-semibold uppercase text-white">View Available Fleet</Link>
              <Link href="/shop" className="rounded-[18px] bg-yellow-500 px-4 py-2 text-sm font-semibold text-[#0b0b0b]">Shop Auto Parts</Link>
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
            {liveList.map((auction: any) => {
              const auctionTitle = typeof auction?.title === 'string' ? auction.title : 'Live auction';
              const auctionTime = (() => {
                try {
                  return auction?.endAt ? new Date(auction.endAt).toLocaleTimeString() : 'TBD';
                } catch {
                  return 'TBD';
                }
              })();

              return (
                <div key={auction.id ?? auctionTitle} className="rounded-[20px] bg-[#121212] p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-28 rounded-[20px] bg-[#0d0d0d]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[11px] uppercase text-slate-500">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[14px] bg-red-600/10 text-red-300">●</span>
                        <span>{auction?.vehicle?.make ?? 'Auction'}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">{auctionTitle}</h3>
                      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                        <span className="rounded-[14px] bg-[#0d0d0d] px-3 py-1 uppercase text-slate-400">{auctionTime}</span>
                        <span className="text-red-400">{auction?.currentPrice ? <ConvertedAmount amountUsd={auction.currentPrice} /> : <ConvertedAmount amountUsd={auction?.startingPrice ?? 0} />}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase text-slate-500">{auctionTitle}</span>
                    <Link href="/auctions" className="rounded-[18px] bg-red-600 px-4 py-1 text-xs font-semibold uppercase text-white">Place Bid</Link>
                  </div>
                </div>
              );
            })}
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
              const brandHref = `/vehicles?make=${encodeURIComponent(String(title))}`;

              return (
                <Link key={b.id || title || b} href={brandHref} className="flex items-center justify-between rounded-[18px] bg-[#121212] px-4 py-3 transition hover:bg-[#171717]">
                  <div className="flex items-center gap-3">
                    <BrandLogo title={String(title)} logoUrl={logoUrl} />
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-[11px] text-slate-500">{b.count ? `${b.count} Vehicles` : ''}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-400">›</span>
                </Link>
              );
            })}
          </div>
          <Link href="/vehicles" className="text-sm font-semibold text-yellow-400 hover:text-white">View All Brands</Link>
        </div>
      </div>

      {/* Browse Vehicles */}
      {Array.isArray(vehicles) && vehicles.length > 0 && (
        <div className="mt-6 rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-slate-400">Browse Vehicles</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Latest Vehicles</h2>
            </div>
            <Link href="/vehicles" className="rounded-[18px] bg-[#121212] px-4 py-2 text-xs text-slate-300">Browse All</Link>
          </div>

          <div className="mt-6 overflow-x-auto pb-4 pr-2">
            <div className="flex snap-x snap-mandatory gap-4">
              {vehicles.slice(0, 6).map((v: any) => {
                const imageUrl = getItemImageUrl(v);
                const price = v.price ? <ConvertedAmount amountUsd={v.price} /> : 'Contact';

                return (
                  <Link key={v.id} href={`/buyer/vehicles/${v.id}`} className="group block w-[85%] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.24)] sm:w-[48%] xl:w-[22rem]">
                    <div className="relative h-48 overflow-hidden bg-[#0d0d0d]">
                      {imageUrl ? (
                        <img src={imageUrl} alt={`${v.make || 'Vehicle'} ${v.model || ''}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1f1f1f] via-[#111] to-[#0d0d0d] text-sm uppercase tracking-[0.2em] text-slate-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-red-600/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {v.condition || 'Featured'}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{v.make} {v.model}</h3>
                          <p className="text-sm text-slate-400">{v.year || '—'} • {v.mileage ? `${v.mileage.toLocaleString()} km` : 'Mileage available on request'}</p>
                        </div>
                        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] uppercase text-slate-400">{v.transmission || 'Auto'}</span>
                      </div>

                      <div className="mt-4 grid gap-2 rounded-[16px] bg-[#111111] p-3 text-sm text-slate-300 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase text-slate-500">Fuel</p>
                          <p className="font-medium text-white">{v.fuelType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase text-slate-500">Location</p>
                          <p className="font-medium text-white">{v.location || v.city || 'Contact us'}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Starting from</p>
                          <p className="text-lg font-semibold text-red-400">{price}</p>
                        </div>
                        <span className="rounded-[14px] bg-yellow-500/10 px-3 py-2 text-xs font-semibold uppercase text-yellow-400">View details</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Featured Rentals */}
      {Array.isArray((featuredRentals as any) || []) && (featuredRentals as any).length > 0 && (
        <div className="mt-6 rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-slate-400">Vehicle Hire</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Available Fleet</h2>
            </div>
            <Link href="/hire" className="rounded-[18px] bg-[#121212] px-4 py-2 text-xs text-slate-300">View All Fleet</Link>
          </div>

          <div className="mt-6 overflow-x-auto pb-4 pr-2">
            <div className="flex snap-x snap-mandatory gap-4">
              {(featuredRentals as any).slice(0,6).map((v: any) => {
                const imageUrl = getItemImageUrl(v);
                const price = v.basePrice ? <ConvertedAmount amountUsd={v.basePrice} /> : 'Contact';

                return (
                  <Link key={v.id} href={`/hire/${v.id}`} className="group block w-[85%] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.24)] sm:w-[48%] xl:w-[22rem]">
                    <div className="relative h-48 overflow-hidden bg-[#0d0d0d]">
                      {imageUrl ? (
                        <img src={imageUrl} alt={`${v.make || 'Rental vehicle'} ${v.model || ''}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1f1f1f] via-[#111] to-[#0d0d0d] text-sm uppercase tracking-[0.2em] text-slate-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-yellow-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0b0b0b]">
                        Available now
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{v.make} {v.model}</h3>
                          <p className="text-sm text-slate-400">{v.year || '—'} • {v.seats ? `${v.seats} seats` : 'Flexible booking'}</p>
                        </div>
                        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] uppercase text-slate-400">Hire</span>
                      </div>

                      <div className="mt-4 grid gap-2 rounded-[16px] bg-[#111111] p-3 text-sm text-slate-300 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase text-slate-500">Transmission</p>
                          <p className="font-medium text-white">{v.transmission || 'Auto'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase text-slate-500">Location</p>
                          <p className="font-medium text-white">{v.location || v.city || 'Contact us'}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Daily rate</p>
                          <p className="text-lg font-semibold text-red-400">{price}</p>
                        </div>
                        <span className="rounded-[14px] bg-yellow-500/10 px-3 py-2 text-xs font-semibold uppercase text-yellow-400">Book now</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      {Array.isArray((featuredProducts as any) || []) && (featuredProducts as any).length > 0 && (
        <div className="mt-6 rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase text-slate-400">Auto Spares</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Featured Parts & Accessories</h2>
            </div>
            <Link href="/shop" className="rounded-[18px] bg-[#121212] px-4 py-2 text-xs text-slate-300">Browse Parts</Link>
          </div>

          <div className="mt-6 overflow-x-auto pb-4 pr-2">
            <div className="flex snap-x snap-mandatory gap-4">
              {(featuredProducts as any).slice(0,6).map((p: any) => {
                const imageUrl = getItemImageUrl(p);
                const price = p.price ? <ConvertedAmount amountUsd={p.price} /> : 'Contact';

                return (
                  <Link key={p.id} href={`/shop/${p.id}`} className="group block w-[85%] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.24)] sm:w-[48%] xl:w-[22rem]">
                    <div className="relative h-48 overflow-hidden bg-[#0d0d0d]">
                      {imageUrl ? (
                        <img src={imageUrl} alt={p.name || 'Auto spare'} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1f1f1f] via-[#111] to-[#0d0d0d] text-sm uppercase tracking-[0.2em] text-slate-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-[#121212]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-100">
                        {p.category?.name || 'Parts'}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                          <p className="text-sm text-slate-400">{p.category?.name || 'Auto spare'}</p>
                        </div>
                        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] uppercase text-slate-400">Shop</span>
                      </div>

                      <div className="mt-4 rounded-[16px] bg-[#111111] p-3 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] uppercase text-slate-500">Price</p>
                            <p className="mt-1 font-semibold text-red-400">{price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] uppercase text-slate-500">Availability</p>
                            <p className="mt-1 font-medium text-white">{p.inStock === false ? 'Limited' : 'In stock'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
