import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function CategoryCard({ icon, title, desc, badge, extra }) {
  return (
    <div className="bg-surface rounded-2xl p-6 border border-border relative overflow-hidden group card-hover flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className="w-11 h-11 rounded-xl bg-accent text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {badge && <span className="bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-text">{badge}</span>}
      </div>
      <div>
        <h3 className="text-lg font-bold font-headline text-text mb-1.5 group-hover:text-primary transition-colors leading-tight">{title}</h3>
        <p className="text-sm text-text/60 leading-relaxed">{desc}</p>
        {extra}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <AppHeader variant="landing" />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-24 pb-32 overflow-hidden max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent rounded-full opacity-50 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary rounded-full opacity-60 blur-3xl -z-10" />
          <div className="max-w-2xl flex-1 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-primary font-label text-sm mb-6 uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" /> Join 10k+ Creators
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-text leading-tight mb-6 tracking-tight">
              Discover Your <br />
              <span className="text-primary relative inline-block">
                Next Passion
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-70" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"></path>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text opacity-80 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Find your people and master your craft in a supportive, community-driven environment. Whether you&apos;re a beginner or an expert, there&apos;s a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup" className="bg-primary text-background font-bold py-4 px-8 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                Join Community <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link to="/signup" className="bg-transparent border-2 border-secondary text-text font-bold py-4 px-8 rounded-lg hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-2">
                Explore Hobbies
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg z-10 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] bg-secondary border-8 border-background">
              <img
                className="w-full h-full object-cover"
                src="/hero-creator.jpg"
                alt="Creator smiling while using the mobile community app in her studio"
              />
              <div className="absolute top-8 -left-6 bg-background rounded-xl p-4 shadow-xl border border-secondary flex items-center gap-3">
                <div className="bg-accent rounded-full p-2 text-primary"><span className="material-symbols-outlined">favorite</span></div>
                <div><p className="text-xs text-text opacity-60">New Connection</p><p className="font-bold text-primary text-sm">Sarah joined Pottery</p></div>
              </div>
              <div className="absolute bottom-12 -right-8 bg-background rounded-xl p-4 shadow-xl border border-secondary">
                <div className="flex -space-x-2 mb-2">
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Member" />
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Member" />
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold text-primary">+12</div>
                </div>
                <p className="text-xs font-bold text-text">Active Members</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Categories</p>
              <h2 className="text-3xl md:text-4xl font-black font-headline text-text tracking-tight">Explore by interest</h2>
            </div>
            <p className="text-sm text-text/60 max-w-md leading-relaxed">Dive into a wide array of interests. Find exactly what sparks your curiosity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[220px]">
            <div className="col-span-1 md:col-span-2 bg-surface rounded-2xl p-7 border border-border relative overflow-hidden group card-hover flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/40 rounded-bl-full -z-0 group-hover:scale-105 transition-transform duration-500" />
              <div className="flex justify-between items-start z-10">
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center"><span className="material-symbols-outlined text-2xl">photo_camera</span></div>
                <span className="bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-text">1.2k Communities</span>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold font-headline text-text mb-1.5">Photography</h3>
                <p className="text-sm text-text/60 max-w-md leading-relaxed">Master the art of light and shadow. Join local photowalks and critique groups.</p>
              </div>
            </div>
            <div className="col-span-1 md:row-span-2 bg-surface rounded-2xl p-7 border border-border relative overflow-hidden group card-hover flex flex-col justify-between min-h-[260px] md:min-h-0">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-5"><span className="material-symbols-outlined text-2xl">restaurant</span></div>
                <h3 className="text-xl font-bold font-headline mb-2">Culinary Arts</h3>
                <p className="text-sm text-text/60 leading-relaxed">From amateur baking to gourmet dinners, share recipes and techniques.</p>
              </div>
              <div className="bg-background rounded-2xl p-4 mt-6 border border-border">
                <div className="flex items-center gap-2 mb-1.5"><span className="material-symbols-outlined text-primary text-sm">event</span><p className="text-xs font-semibold tracking-wide uppercase text-text/60">Upcoming</p></div>
                <p className="text-sm font-semibold text-text">Sourdough Starter Workshop</p>
                <p className="text-xs text-text/50 mt-1">Sat, Oct 12 · 2:00 PM</p>
              </div>
            </div>
            <CategoryCard icon="sports_esports" title="Gaming" desc="Tabletop, PC, or console. Find your squad." badge="890+" />
            <CategoryCard icon="carpenter" title="Woodworking" desc="Crafting beauty from raw materials." badge="320+" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="bg-surface rounded-2xl p-5 border border-border flex items-center gap-4 group card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-2xl">local_florist</span></div>
              <div><h3 className="font-bold font-headline leading-tight">Gardening</h3><p className="text-sm text-text/60">Cultivate your green thumb.</p></div>
              <span className="ml-auto material-symbols-outlined text-text/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div className="bg-surface rounded-2xl p-5 border border-border flex items-center gap-4 group card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-2xl">directions_bike</span></div>
              <div><h3 className="font-bold font-headline leading-tight">Cycling</h3><p className="text-sm text-text/60">Hit the trails or the tarmac together.</p></div>
              <span className="ml-auto material-symbols-outlined text-text/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 border border-border bg-white text-text font-semibold py-2.5 px-6 rounded-full hover:border-primary hover:text-primary transition-all text-sm">
              View all categories <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 md:py-20 bg-surface border-y border-border relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#4F5148 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              </div>
              <blockquote className="text-xl md:text-2xl font-headline font-medium leading-snug text-text mb-8 text-balance">
                &ldquo;I used to practice guitar alone in my room. Through HobbyHive, I found a local jam group that not only improved my skills but gave me a new family of friends.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <img className="w-12 h-12 rounded-full object-cover ring-1 ring-black/5" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80" alt="Marcus Chen" />
                <div className="text-left"><p className="font-semibold text-text text-sm leading-tight">Marcus Chen</p><p className="text-xs text-text/60">Acoustic Guitar · San Francisco</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background pt-12 pb-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <a className="font-headline font-bold text-primary text-xl flex items-center gap-2" href="#"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>widgets</span> HobbyHive</a>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text/60">
              <a className="hover:text-text transition-colors" href="#">About</a>
              <a className="hover:text-text transition-colors" href="#">Guidelines</a>
              <a className="hover:text-text transition-colors" href="#">Privacy</a>
              <a className="hover:text-text transition-colors" href="#">Terms</a>
            </div>
            <div className="flex gap-2">
              <a className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text/60 hover:text-primary hover:border-primary/20 transition" href="#" aria-label="Website"><span className="material-symbols-outlined text-lg">language</span></a>
              <a className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text/60 hover:text-primary hover:border-primary/20 transition" href="#" aria-label="Email"><span className="material-symbols-outlined text-lg">mail</span></a>
            </div>
          </div>
          <div className="text-center border-t border-border pt-6">
            <p className="text-xs text-text/40">© 2024 HobbyHive. All rights reserved. Connect &amp; Create.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

