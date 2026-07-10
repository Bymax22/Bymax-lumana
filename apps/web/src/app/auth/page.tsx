import Link from 'next/link';

export default function AuthLandingPage() {
  return (
    <section className="space-y-6 rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-red-400">Membership</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Sign in, sign up, or recover your account quickly.</h1>
          <p className="max-w-2xl text-sm text-slate-300">Create a buyer, seller, admin, driver or inspector account and connect with vehicle listings, auctions, shipping and support in one dashboard.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/login" className="rounded-[18px] bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500">Login</Link>
            <Link href="/auth/signup" className="rounded-[18px] bg-yellow-500 px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-yellow-400">Create Account</Link>
            <Link href="/auth/forgot-password" className="rounded-[18px] border border-slate-700 px-5 py-3 text-sm text-slate-200 transition hover:border-white">Forgot Password</Link>
          </div>
        </div>
          <div className="rounded-[24px] bg-[#111111] p-6 text-sm text-slate-300">
          <p className="text-sm uppercase text-yellow-400">Account types</p>
          <div className="mt-6 space-y-4">
            {[
              { title: 'Buyer / Customer', description: 'Browse vehicles, place orders and manage shipments.' },
              { title: 'Seller / Dealer', description: 'List cars, manage inventory and sell globally.' }
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] bg-[#0d0d0d] p-4">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p>Administrative and inspector accounts are provisioned via secure internal pages.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
