"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageCircle, 
  Zap, 
  Shield, 
  Users, 
  ChevronRight,
  Send,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser != null) {
      router.push("/chat");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-violet-500/30 overflow-x-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ChatConnect
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/login")}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border-none bg-transparent shadow-none"
            variant="ghost"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signUp")}
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border-none"
          >
            Get Started
          </Button>
          <button 
            className="md:hidden p-2 -mr-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-[73px] left-0 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-b border-white/10 z-40 transition-all duration-300 overflow-hidden md:hidden ${
          isMobileMenuOpen ? "max-h-[500px] py-6 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 px-6">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Features</a>
          <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">How it Works</a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Pricing</a>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <div className="flex flex-col gap-3 -mt-2">
            <Button onClick={() => { setIsMobileMenuOpen(false); router.push("/login"); }} className="w-full justify-center bg-white/5 text-white border border-white/10 hover:bg-white/10" variant="outline">Sign In</Button>
            <Button onClick={() => { setIsMobileMenuOpen(false); router.push("/signUp"); }} className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white border-none">Get Started</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left text content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-violet-300 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>The next generation of messaging</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-lg">
            Connect. Chat. <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Collaborate.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Experience lightning-fast, secure, and beautiful messaging. Built for modern teams and communities to stay connected anywhere, instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button
              onClick={() => router.push("/signUp")}
              className="w-full sm:w-auto px-8 py-6 h-auto text-base font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:-translate-y-1 border-none flex items-center gap-2 group"
            >
              Start Chatting for Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-8 py-6 h-auto text-base font-medium rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              variant="outline"
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-gray-800 overflow-hidden flex items-center justify-center shadow-lg">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="ml-2">Join <span className="text-white font-bold">10,000+</span> users worldwide</p>
          </div>
        </div>

        {/* Right UI Mockup */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative perspective-[2000px]">
          {/* Main Mockup Container - Adding 3D rotation transform */}
          <div className="relative z-10 bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform lg:-rotate-y-12 lg:-rotate-x-5 lg:-skew-y-3 transition-transform duration-700 hover:rotate-0 hover:skew-0 hover:scale-105">
            {/* Header Mockup */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 text-center text-sm font-semibold text-gray-300 tracking-wide"># general</div>
            </div>

            {/* Chat Body Mockup */}
            <div className="p-5 space-y-6 h-[350px] sm:h-[420px] flex flex-col justify-end bg-gradient-to-b from-transparent to-black/30">
              {/* Message 1 */}
              <div className="flex gap-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede" alt="Alex" className="w-10 h-10 rounded-full bg-gray-800 shadow-md ring-2 ring-white/10 shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold text-violet-400">Alex</span>
                    <span className="text-xs text-gray-500 font-medium">10:42 AM</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm text-gray-200 shadow-sm border border-white/5">
                    Hey team! Just pushed the latest design updates. 🚀
                  </div>
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex gap-4 flex-row-reverse">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=ffdfbf" alt="You" className="w-10 h-10 rounded-full bg-gray-800 shadow-md ring-2 ring-white/10 shrink-0" />
                <div className="items-end flex flex-col">
                  <div className="flex items-baseline gap-2 flex-row-reverse mb-1">
                    <span className="text-sm font-bold text-blue-400">You</span>
                    <span className="text-xs text-gray-500 font-medium">10:43 AM</span>
                  </div>
                  <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 rounded-2xl rounded-tr-none text-sm text-white shadow-lg shadow-violet-500/20 border border-violet-500/50">
                    Looks amazing! Can't wait to try it out.
                  </div>
                </div>
              </div>

              {/* Message 3 */}
              <div className="flex gap-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=d1d4f9" alt="Sarah" className="w-10 h-10 rounded-full bg-gray-800 shadow-md ring-2 ring-white/10 shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold text-emerald-400">Sarah</span>
                    <span className="text-xs text-gray-500 font-medium">10:44 AM</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm text-gray-200 shadow-sm border border-white/5">
                    I'll start integrating the new API endpoints now.
                  </div>
                </div>
              </div>
            </div>

            {/* Input Mockup */}
            <div className="p-4 bg-gray-900/90 border-t border-white/5 backdrop-blur-md">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  disabled
                  placeholder="Message #general..." 
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-full py-3 px-5 pr-14 text-sm text-gray-300 focus:outline-none placeholder:text-gray-600 shadow-inner"
                />
                <button className="absolute right-2 p-2 bg-violet-600 rounded-full text-white shadow-md shadow-violet-500/30">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-500/30 rounded-full blur-[50px] z-0 animate-pulse"></div>
          <div className="absolute -bottom-16 -left-12 w-48 h-48 bg-blue-500/30 rounded-full blur-[60px] z-0 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-gray-900/40 border-y border-white/5 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">connect</span></h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Powerful features baked right in to make your conversations fluent, fast, and completely secure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.2)]">
              <div className="w-14 h-14 bg-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-violet-500/30 transition-all duration-300 shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Lightning Fast</h3>
              <p className="text-gray-400 text-base leading-relaxed">Built on modern WebSockets for truly real-time updates. No refreshing, no waiting. Instant delivery across all your devices.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)]">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300 shadow-inner">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Secure & Private</h3>
              <p className="text-gray-400 text-base leading-relaxed">Your data is inherently yours. Industry-standard encryption ensures your private conversations stay strictly between participants.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Group Chats</h3>
              <p className="text-gray-400 text-base leading-relaxed">Create dedicated spaces for teams, friends, or vast communities. Organize channels your way without missing a beat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 mt-auto gap-4">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <MessageCircle className="w-6 h-6 text-violet-400" />
          <span className="font-bold text-white text-lg tracking-tight">ChatConnect</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} Suman Koley. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
