import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function CategoryCard({ icon, title, desc, badge, extra }) {
  return (
    <div className="bg-secondary rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-accent text-primary p-3 rounded-xl inline-block">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        {badge && <span className="bg-background px-3 py-1 rounded-full text-xs font-bold text-text">{badge}</span>}
      </div>
      <div>
        <h3 className="text-xl font-bold font-headline text-text mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-text opacity-80">{desc}</p>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary font-label text-sm mb-6 uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-sm">stars</span> Join 10k+ Creators
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzihpS1gfTW0V2FqHPEQ36EFsUvKbd8Ab2vxhLC-IG7x8tfjbauGS5gpTL8BO3O5uJQwYRkVWAWUn_atEk8_6W7-zGXMGvWNfw7oLEGtp8idZGbr0FP50192GOLq93MSW3FAoNXgGXqyrCOvq-z5U7rSe3IBErD-HQKM-6tUehcvimXqFr4Hub590GozgWo6Yk1WfS_ju2qjvDOsiOHs53sJXM7OGfO5IOcLGSQMjAjqFQHL6bULk_QgA2foq2LY-EmtNMKQ1c2z7Q"
                alt="community"
              />
              <div className="absolute top-8 -left-6 bg-background rounded-xl p-4 shadow-xl border border-secondary flex items-center gap-3">
                <div className="bg-accent rounded-full p-2 text-primary"><span className="material-symbols-outlined">favorite</span></div>
                <div><p className="text-xs text-text opacity-60">New Connection</p><p className="font-bold text-primary text-sm">Sarah joined Pottery</p></div>
              </div>
              <div className="absolute bottom-12 -right-8 bg-background rounded-xl p-4 shadow-xl border border-secondary">
                <div className="flex -space-x-2 mb-2">
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ7vcOXZS6C5VKkm8IqdQfAS62K8YA9szbw4qHu9kHtlxleg_bK0tGZRgGx7pfr6twaZpsLFScca4UY7AJToWwYR4NhpT_D42EZ_Ey1drs1PVYdgKYIuLpyWY-2noMjj6Fh2fnfK1tpagWse6ntCPtXYa5wzQlgiA0mggxq-5oMK2Q5UONU1Du9ypkJrzP54J4WEcYckj0R1W9rNPCyaep1BltK7jNDEuCtxK6B-LZnTXlrT1zJ85oeyX0ZCtV1NLORbiev4eSlyub" alt="" />
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiaKs2tpMknmY2IDUMaCt449gs5_Zw5CsoHNflXaB4HFaVLU-Qx8Mm8MUnPqVpoTSP069pOEBsEPtWIfg6DbqMJjl6aqJviurBFE3XBysiXatLkjkz9CQz0OmDdUh1p_4baElj2anpih6AgXslwaQqJFx3d5bgkQCWiv08REfcOWJSn-OEg-YdCUQcQ6UCOn3W9fDZRkF4WRyaofok2XtD0POVh3psVk-vDbtJNXf32FWzfGspHregNiXdmqbJai3xBqbOBgc-w7Ik" alt="" />
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold text-primary">+12</div>
                </div>
                <p className="text-xs font-bold text-text">Active Members</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-text mb-4 tracking-tight">Explore Categories</h2>
            <p className="text-lg text-text opacity-80">Dive into a wide array of interests. Find exactly what sparks your curiosity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="col-span-1 md:col-span-2 row-span-1 bg-secondary rounded-2xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex justify-between items-start mb-8 z-10">
                <div className="bg-accent text-primary p-3 rounded-xl inline-block"><span className="material-symbols-outlined text-3xl">photo_camera</span></div>
                <span className="bg-background px-3 py-1 rounded-full text-xs font-bold text-text">1.2k Communities</span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-bold font-headline text-text mb-2 group-hover:text-primary transition-colors">Photography</h3>
                <p className="text-text opacity-80 max-w-md">Master the art of light and shadow. Join local photowalks and critique groups.</p>
              </div>
            </div>
            <div className="col-span-1 row-span-2 bg-secondary rounded-2xl p-8 relative overflow-hidden group hover:shadow-xl transition-all flex flex-col justify-between border border-accent">
              <div className="flex flex-col h-full">
                <div className="bg-accent text-primary p-3 rounded-xl inline-block w-fit mb-6"><span className="material-symbols-outlined text-3xl">restaurant</span></div>
                <h3 className="text-2xl font-bold font-headline mb-2 group-hover:text-primary">Culinary Arts</h3>
                <p className="opacity-80 mb-8 flex-grow">From amateur baking to gourmet dinners, share recipes and techniques.</p>
                <div className="bg-background rounded-xl p-4 mt-auto">
                  <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-primary text-sm">event</span><p className="text-xs font-bold">Upcoming Event</p></div>
                  <p className="text-sm opacity-90">Sourdough Starter Workshop</p>
                </div>
              </div>
            </div>
            <CategoryCard icon="sports_esports" title="Gaming" desc="Tabletop, PC, or console. Find your squad." />
            <CategoryCard icon="carpenter" title="Woodworking" desc="Crafting beauty from raw materials." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-secondary rounded-2xl p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
              <div className="bg-accent text-primary p-4 rounded-xl flex-shrink-0"><span className="material-symbols-outlined text-3xl">local_florist</span></div>
              <div><h3 className="text-xl font-bold font-headline mb-1 group-hover:text-primary">Gardening</h3><p className="text-sm opacity-80">Cultivate your green thumb.</p></div>
            </div>
            <div className="bg-secondary rounded-2xl p-6 flex items-center gap-6 group hover:shadow-xl transition-all">
              <div className="bg-accent text-primary p-4 rounded-xl flex-shrink-0"><span className="material-symbols-outlined text-3xl">directions_bike</span></div>
              <div><h3 className="text-xl font-bold font-headline mb-1 group-hover:text-primary">Cycling</h3><p className="text-sm opacity-80">Hit the trails or the tarmac together.</p></div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="border-2 border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary hover:text-background transition-all inline-flex items-center gap-2">
              View All Categories <span className="material-symbols-outlined">grid_view</span>
            </button>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-32 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#4F5148 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-5xl text-primary opacity-50 mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <h4 className="text-2xl md:text-4xl font-headline font-bold leading-tight mb-12">
                &quot;I used to practice guitar alone in my room. Through Hobby Hub, I found a local jam group that not only improved my skills immensely but gave me a new family of friends.&quot;
              </h4>
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-full object-cover border-4 border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuxwpa8fazImP_dqNOKvkohFPA9zj5EfXj-cH5uDUm5gY4O9WKcKkPtjD8BPF7hGwOQNECNE5-kpg-ZgIO_Yzkw5QUT4FLdxyLI24fDYR2z2x75bsw3RJQQtHAdjvjULv3zurhzlv3xFSeuBroRmVb-WWIwygIHkoDYzqMfRBp9kqoqrYh_5B4Lk2Ytuu3Sui_5rwHXJq_LK6y388xDV2ygftypdq9-ZOSb5hUOx6HmLF97cdyTB2MSTnLu__YNj4bV4idTLD-NPf1" alt="" />
                <div className="text-left"><p className="font-bold text-lg">Marcus Chen</p><p className="text-primary text-sm opacity-80">Acoustic Guitar Enthusiast</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background pt-16 pb-8 border-t border-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <a className="text-2xl font-bold text-primary flex items-center gap-2" href="#"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>widgets</span> Hobby Hub</a>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="opacity-70 hover:opacity-100 hover:text-primary" href="#">About Us</a>
              <a className="opacity-70 hover:opacity-100 hover:text-primary" href="#">Guidelines</a>
              <a className="opacity-70 hover:opacity-100 hover:text-primary" href="#">Privacy</a>
              <a className="opacity-70 hover:opacity-100 hover:text-primary" href="#">Terms</a>
            </div>
            <div className="flex gap-4">
              <a className="text-primary bg-secondary p-2 rounded-full hover:bg-accent w-10 h-10 flex items-center justify-center" href="#"><span className="material-symbols-outlined text-sm">language</span></a>
              <a className="text-primary bg-secondary p-2 rounded-full hover:bg-accent w-10 h-10 flex items-center justify-center" href="#"><span className="material-symbols-outlined text-sm">mail</span></a>
            </div>
          </div>
          <div className="text-center border-t border-secondary pt-8">
            <p className="text-sm opacity-50">© 2024 Hobby Hub. All rights reserved. Connect &amp; Create.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
