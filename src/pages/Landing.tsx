import { useNavigate } from 'react-router'
import { useState } from 'react'
import { ArrowRight, ChevronDown, Clock, Zap, DollarSign, Activity, Heart, MapPin, BarChart2, TrendingUp, FileText } from 'lucide-react'

export default function Landing() {
  const nav = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1714] font-sans antialiased">
      {/* 1. HEADER / NAVIGATION */}
      <header className="w-full bg-[#FAF8F5] border-b border-[#E8E3DC] sticky top-0 z-50 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => nav('/')}>
            <div className="w-8 h-8 rounded-full bg-[#C4956A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              G
            </div>
            <span className="font-bold text-base tracking-tight text-[#1A1714]">GlowTwin AI</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-xs font-semibold tracking-wider text-[#6B6560] hover:text-[#1A1714] uppercase transition-colors">How It Works</a>
            <a href="#features" className="text-xs font-semibold tracking-wider text-[#6B6560] hover:text-[#1A1714] uppercase transition-colors">Features</a>
            <a href="#pricing" className="text-xs font-semibold tracking-wider text-[#6B6560] hover:text-[#1A1714] uppercase transition-colors">Pricing</a>
          </div>

          {/* Right CTA */}
          <button 
            onClick={() => nav('/upload-selfie')}
            className="px-5 py-2.5 bg-[#1A1714] hover:bg-[#2A2724] text-white text-xs font-bold tracking-widest rounded-full uppercase transition-all"
            style={{ letterSpacing: '0.06em' }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="w-full bg-[#FAF8F5] pt-12 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF3EE] border border-[#E8E3DC] rounded-full mb-6">
              <span className="text-[#C4956A] text-xs">✍</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#6B6560]" style={{ letterSpacing: '0.12em' }}>
                Beauty Decision Intelligence
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-[3.25rem] lg:text-[4.75rem] font-extrabold leading-[1.08] text-[#1A1714] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Know Before <br />
              <span className="italic font-normal text-[#C4956A]">You Glow</span>
            </h1>

            {/* Description */}
            <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed mb-8 max-w-[480px]">
              AI that tells you honestly if that celebrity hairstyle will work for your hair — before you book the appointment.
            </p>

            {/* Buttons & Avatars */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
              <button
                onClick={() => nav('/upload-selfie')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#C4956A] hover:bg-[#B8845A] text-white font-bold text-xs tracking-wider rounded-full shadow-md transition-all uppercase"
                style={{ letterSpacing: '0.08em' }}
              >
                Try GlowTwin AI
                <ArrowRight size={14} />
              </button>

              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-[#FAF8F5] object-cover" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                    alt="User 1" 
                  />
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-[#FAF8F5] object-cover" 
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" 
                    alt="User 2" 
                  />
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-[#FAF8F5] object-cover" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                    alt="User 3" 
                  />
                </div>
                <span className="text-[11px] font-bold text-[#6B6560]">50,000+ analyses</span>
              </div>
            </div>
          </div>

          {/* Right Side Image Layout */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg border border-[#E8E3DC]">
              <img 
                src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800" 
                alt="Wavy golden hair back view" 
                className="w-full h-full object-cover"
              />
              
              {/* Star Rating Badge (Top Right) */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm border border-[#E8E3DC] flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#C4823A] text-[14px]">★</span>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-[#1A1714]">4.9/5.0</span>
              </div>

              {/* Status Metric Card (Bottom Left Overlay) */}
              <div className="absolute bottom-[-20] left-2 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-[#E8E3DC] w-[240px] animate-scale-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#4A9B7F]" />
                  <span className="text-[9px] font-bold tracking-widest text-[#6B6560] uppercase">Analysis Complete</span>
                </div>

                <h3 className="text-base font-bold text-[#1A1714] mb-3">
                  Honey Balayage
                </h3>

                <div className="grid grid-cols-3 divide-x divide-[#E8E3DC] text-center border-t border-[#FAF8F5] pt-2">
                  <div className="pr-1 flex flex-col items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B6560] mb-0.5">Bleach</span>
                    <span className="text-[11px] font-bold text-[#C4503A]">Yes</span>
                  </div>
                  <div className="px-1 flex flex-col items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B6560] mb-0.5">Sessions</span>
                    <span className="text-[11px] font-bold text-[#1A1714]">2–3</span>
                  </div>
                  <div className="pl-1 flex flex-col items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B6560] mb-0.5">Est.</span>
                    <span className="text-[11px] font-bold text-[#1A1714]">$380</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS ROW */}
      <section className="w-full bg-[#FAF8F5] border-y border-[#E8E3DC] px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto py-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E3DC]">
          <div className="flex flex-col items-center py-4 md:py-0 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#1A1714] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>50,000+</span>
            <span className="text-[11px] text-[#6B6560]">Analyses completed</span>
          </div>
          <div className="flex flex-col items-center py-4 md:py-0 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#1A1714] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>92%</span>
            <span className="text-[11px] text-[#6B6560]">Accuracy rate</span>
          </div>
          <div className="flex flex-col items-center py-4 md:py-0 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#1A1714] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>4.9★</span>
            <span className="text-[11px] text-[#6B6560]">Average rating</span>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section className="w-full bg-[#FAF8F5] py-20 px-6 md:px-16 lg:px-24" id="features">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4956A] block mb-4" style={{ letterSpacing: '0.15em' }}>THE PROBLEM</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1A1714] mb-6 max-w-[700px] mx-auto leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            You save the photo. <br />But will it actually work?
          </h2>
          <p className="text-sm lg:text-base text-[#6B6560] leading-relaxed max-w-[650px] mx-auto mb-16">
            Every day, millions of people walk into salons with an inspiration photo and walk out disappointed. The gap between inspiration and reality is expensive, damaging, and completely avoidable.
          </p>

          {/* Grid of 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Will this work for my hair type?",
                desc: "Texture, porosity, and history all affect whether a look is achievable.",
                icon: <Clock size={18} className="text-[#C4956A]" />
              },
              {
                title: "Is my hair healthy enough?",
                desc: "Some transformations require a specific condition to succeed safely.",
                icon: <Zap size={18} className="text-[#C4956A]" />
              },
              {
                title: "How much will this actually cost?",
                desc: "True cost includes sessions, upkeep, and product — not just the first appointment.",
                icon: <DollarSign size={18} className="text-[#C4956A]" />
              },
              {
                title: "How much maintenance will it need?",
                desc: "Some looks require salon visits every 6 weeks. Others can last 6 months.",
                icon: <Activity size={18} className="text-[#C4956A]" />
              },
              {
                title: "Could this damage my hair?",
                desc: "Chemical services carry real risks. You deserve to know them before committing.",
                icon: <Heart size={18} className="text-[#C4956A]" />
              },
              {
                title: "Which salon can realistically do this?",
                desc: "Not every stylist specializes in every technique. Matching matters.",
                icon: <MapPin size={18} className="text-[#C4956A]" />
              }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#FAF3EE] flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-[#1A1714] mb-2.5">
                  {card.title}
                </h3>
                <p className="text-xs text-[#6B6560] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="w-full bg-[#FAF8F5] py-20 border-t border-[#E8E3DC] px-6 md:px-16 lg:px-24" id="how-it-works">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4956A] block mb-4" style={{ letterSpacing: '0.15em' }}>HOW IT WORKS</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1A1714] mb-16" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Three steps to clarity
          </h2>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "Upload your selfie",
                desc: "A natural photo in good light. Our AI reads your hair's texture, condition, porosity, and history.",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
                icon: "📷"
              },
              {
                step: "Add your inspiration",
                desc: "Screenshot from Instagram, Pinterest, or a celebrity photo. Any image works.",
                img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                icon: "✨"
              },
              {
                step: "Get your Reality Report",
                desc: "Complete analysis: feasibility, timeline, cost breakdown, hair health impact, and a Stylist Brief.",
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600",
                icon: "📋"
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* Card image container */}
                <div className="relative w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-md border border-[#E8E3DC] mb-6">
                  <img src={step.img} alt={step.step} className="w-full h-full object-cover" />
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="text-sm">{step.icon}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#1A1714] mb-2.5">
                  {step.step}
                </h3>
                <p className="text-xs text-[#6B6560] leading-relaxed max-w-[260px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT YOU GET */}
      <section className="w-full bg-[#FAF8F5] py-20 border-t border-[#E8E3DC] px-6 md:px-16 lg:px-24" id="pricing">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4956A] block mb-4" style={{ letterSpacing: '0.15em' }}>WHAT YOU GET</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1A1714]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Intelligence, not guesswork
            </h2>
          </div>

          {/* 4 Cards in 2x2 grid with generous padding and gap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: "Hair Health Analysis",
                badge: "Core",
                desc: "Deep analysis of your hair's porosity, elasticity, density, and current condition — the foundation of every recommendation.",
                icon: <Activity size={18} className="text-[#C4956A]" />
              },
              {
                title: "Cost Intelligence",
                badge: "Finance",
                desc: "True cost breakdown: initial session, maintenance schedule, product requirements, and annual cost projection.",
                icon: <BarChart2 size={18} className="text-[#C4956A]" />
              },
              {
                title: "Glow Roadmap",
                badge: "Planning",
                desc: "A visual timeline of your transformation journey — from current state to your goal look, with clear milestones.",
                icon: <TrendingUp size={18} className="text-[#C4956A]" />
              },
              {
                title: "Stylist Brief",
                badge: "Pro",
                desc: "A professional summary your stylist can read in 60 seconds — desired look, hair history, risks, and recommendations.",
                icon: <FileText size={18} className="text-[#C4956A]" />
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E3DC] shadow-sm hover:shadow-md transition-all flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FAF3EE] flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold text-[#1A1714] leading-none">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-[#6B6560] bg-[#F3F0EC] px-2.5 py-0.5 rounded-md font-medium capitalize tracking-normal leading-none">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6560] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL RESULTS, REAL STORIES */}
      <section className="w-full bg-[#FAF8F5] py-20 border-t border-[#E8E3DC] px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1A1714] text-center mb-16" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Real results, real stories
          </h2>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "I wanted platinum blonde but the report told me my hair was too damaged. Six months later — after the repair plan — I finally did it. And it was perfect.",
                name: "Amara J.",
                style: "Platinum Blonde",
                img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150"
              },
              {
                text: "The cost breakdown alone was worth it. I thought balayage was $200. GlowTwin showed me the real annual cost was $1,800. I budgeted and never felt blindsided.",
                name: "Sofia R.",
                style: "Honey Balayage",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              },
              {
                text: "I showed my stylist the GlowTwin Brief. She said it was the most prepared a client had ever been. We finished in one session instead of two.",
                name: "Kevin M.",
                style: "Curl Enhancement",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-4 text-[#C4823A]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#6B6560] leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#FAF8F5] pt-4">
                  <img src={t.img} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-[#1A1714]">{t.name}</p>
                    <p className="text-[10px] text-[#6B6560]">{t.style}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. QUESTIONS (FAQs) */}
      <section className="w-full bg-[#FAF8F5] py-20 border-t border-[#E8E3DC] px-6 md:px-16 lg:px-24">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1A1714] text-center mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Do I need to visit a salon before using GlowTwin AI?",
                a: "No! GlowTwin AI is designed to be used before you book or visit a salon. This way, you understand what's achievable for your hair health, know the real 12-month upkeep cost, and can download a certified Stylist Brief to walk into the salon fully prepared."
              },
              {
                q: "How accurate is the AI hair analysis?",
                a: "Our AI analysis has a 92% accuracy rate. It evaluates hair health, texture, porosity, and historical damage directly from your selfie, cross-referencing it with professional color chemical charts to deliver precise feasibility outcomes."
              },
              {
                q: "What transformation types can I analyze?",
                a: "You can analyze color transformations (e.g., going blonde, balayage, vivid colors), style transformations, cuts, and texturizing treatments. We tell you the bleach requirement, expected sessions, and annual estimate."
              },
              {
                q: "Is my photo data private?",
                a: "Absolutely. We upload your photos securely using encrypted sessions, and all raw images are automatically deleted from the Cloudinary hosting server within 24 hours. Your photos are never saved on our databases or sold."
              }
            ].map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-[#E8E3DC] rounded-xl bg-white overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-xs tracking-wide text-[#1A1714] uppercase"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={14} 
                      className="text-[#6B6560] transition-transform duration-200" 
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  <div 
                    className="transition-all duration-300 ease-in-out"
                    style={{ 
                      maxHeight: isOpen ? '240px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden'
                    }}
                  >
                    <p className="px-6 pb-5 text-xs text-[#6B6560] leading-relaxed border-t border-[#FAF8F5] pt-3">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="w-full bg-[#1A1714] py-24 px-6 md:px-16 lg:px-24 text-center text-white relative">
        <div className="max-w-[700px] mx-auto flex flex-col items-center">
          <h2 className="text-4xl lg:text-[3.25rem] font-bold mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Your transformation <br />starts with clarity.
          </h2>
          <p className="text-xs text-[#A09A95] mb-10 max-w-[400px]">
            Know before you glow. Your first analysis is free.
          </p>

          <button
            onClick={() => nav('/upload-selfie')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#C4956A] hover:bg-[#B8845A] text-white font-bold text-xs tracking-wider rounded-full shadow-lg transition-all uppercase"
            style={{ letterSpacing: '0.08em' }}
          >
            Try GlowTwin AI
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 10. FOOTER BAR */}
      <footer className="w-full bg-white border-t border-[#E8E3DC] py-8 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#C4956A] flex items-center justify-center text-white font-bold text-xs">
              G
            </div>
            <span className="font-bold text-xs text-[#1A1714]">GlowTwin AI</span>
          </div>

          {/* Center */}
          <span className="text-[10px] text-[#6B6560] text-center">
            &copy; 2026 GlowTwin AI &middot; Know Before You Glow
          </span>

          {/* Right */}
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-[10px] text-[#6B6560] hover:text-[#1A1714] transition-colors">Privacy</a>
            <a href="#terms" className="text-[10px] text-[#6B6560] hover:text-[#1A1714] transition-colors">Terms</a>
            <a href="#contact" className="text-[10px] text-[#6B6560] hover:text-[#1A1714] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

