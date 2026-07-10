import { BookOpen } from 'lucide-react';

const blogPosts = [
  { title: 'Car Prices in Japan', date: 'May 24, 2024', summary: 'A breakdown of current Japanese auction pricing and market trends.' },
  { title: 'Best SUVs for Africa', date: 'May 18, 2024', summary: 'The most reliable SUV models for African import buyers.' },
  { title: 'Shipping Updates', date: 'May 15, 2024', summary: 'What to expect from shipping schedules and customs delays.' },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Blog & News</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Stay up to date with market insights and vehicle import news.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.title} className="rounded-[24px] bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="text-sm uppercase text-slate-500">{post.date}</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{post.title}</h2>
              <p className="mt-4 text-slate-300">{post.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
