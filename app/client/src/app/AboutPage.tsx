import { useState } from "react";
import {
  ChevronRight, ArrowRight, Users, Brain, ShieldCheck, WifiOff,
  MapPin, MessageSquare, Star, Award, Globe, Zap, CheckCircle,
  TrendingUp, Database, Layers, Clock, Map, BookOpen, Heart,
  Quote, ChevronLeft,
} from "lucide-react";
import type { Page } from "./App";

// ── Team & Contributors ───────────────────────────────────────────────────
const TEAM = [
  {
    id: 1,
    name: "Aisha Nawaz",
    role: "Co-Founder & CEO",
    origin: "Lahore, Punjab",
    bio: "Former product lead at a GIS startup. Spent 3 years mapping Pakistan's uncharted northern roads before building the platform that makes that data accessible to everyone.",
    img: "https://images.unsplash.com/photo-1734865812496-b2fe2e1a56ca?w=320&h=320&fit=crop&auto=format",
    badge: "Founder",
    badgeColor: "#12233A",
    trips: 48,
    reviews: 124,
    initials: "AN",
  },
  {
    id: 2,
    name: "Tariq Mehmood",
    role: "Co-Founder & CTO",
    origin: "Islamabad, ICT",
    bio: "Full-stack engineer with a passion for offline-first mobile apps. Previously built infrastructure for two Pakistan-based fintech companies.",
    img: "https://images.unsplash.com/photo-1779903596788-0004e2a2680c?w=320&h=320&fit=crop&auto=format",
    badge: "Founder",
    badgeColor: "#12233A",
    trips: 31,
    reviews: 89,
    initials: "TM",
  },
  {
    id: 3,
    name: "Sana Baloch",
    role: "Head of Community",
    origin: "Quetta, Balochistan",
    bio: "Lifelong trekker and writer who has documented 60+ trails across KPK and Balochistan. Manages our 800+ verified local guide network.",
    img: "https://images.unsplash.com/photo-1613930079067-1d3ede2732e7?w=320&h=320&fit=crop&auto=format",
    badge: "Elite Guide",
    badgeColor: "#0E8C88",
    trips: 72,
    reviews: 312,
    initials: "SB",
  },
  {
    id: 4,
    name: "Usman Riaz",
    role: "Lead Data Contributor",
    origin: "Gilgit, GB",
    bio: "Born in the Karakoram, Usman has verified every POI in Gilgit-Baltistan by foot. His ground-truth data feeds our northern region accuracy engine.",
    img: "https://images.unsplash.com/photo-1630346694399-83cabce93a68?w=320&h=320&fit=crop&auto=format",
    badge: "Top Contributor",
    badgeColor: "#E8A33D",
    trips: 95,
    reviews: 540,
    initials: "UR",
  },
  {
    id: 5,
    name: "Mehwish Hassan",
    role: "UX Research Lead",
    origin: "Karachi, Sindh",
    bio: "Conducted 200+ traveler interviews across Pakistan to shape our information architecture. Ensures every screen serves first-time and seasoned explorers equally.",
    img: "https://images.unsplash.com/photo-1605288237997-b161bb64af0e?w=320&h=320&fit=crop&auto=format",
    badge: "Team",
    badgeColor: "#8B5CF6",
    trips: 22,
    reviews: 67,
    initials: "MH",
  },
  {
    id: 6,
    name: "Bilal Chaudhry",
    role: "AI & Algorithms",
    origin: "Faisalabad, Punjab",
    bio: "ML engineer who built our itinerary recommendation engine. Trained on 50,000 real Pakistan trip logs to surface personalised routes with uncanny accuracy.",
    img: "https://images.unsplash.com/photo-1591198159138-1db2fd6f0fe1?w=320&h=320&fit=crop&auto=format",
    badge: "Team",
    badgeColor: "#8B5CF6",
    trips: 18,
    reviews: 41,
    initials: "BC",
  },
];

const PILLARS = [
  {
    icon: <Users size={26} strokeWidth={1.5} />,
    title: "Community Intelligence",
    subtitle: "50,000+ verified reports",
    body: "Every alert, review, and trail condition update is submitted by travelers who have been there this season — not aggregated from years-old blogs. Collective knowledge, rigorously moderated.",
    tags: ["Peer Reviews", "Trail Reports", "Real-Time Alerts"],
  },
  {
    icon: <Brain size={26} strokeWidth={1.5} />,
    title: "AI-Powered Precision",
    subtitle: "Itineraries in under 15 min",
    body: "Our planning engine ingests your interests, group size, budget, and travel dates to generate day-by-day itineraries enriched with local tips, seasonal warnings, and hidden waypoints.",
    tags: ["Smart Itineraries", "Budget AI", "Personalisation"],
  },
  {
    icon: <ShieldCheck size={26} strokeWidth={1.5} />,
    title: "Verified Local Data",
    subtitle: "800+ ground contributors",
    body: "Opening hours, entry fees, road statuses, and visa requirements are maintained by local experts with direct, current knowledge — reviewed, dated, and version-controlled.",
    tags: ["Live Hours", "Fee Accuracy", "Road Status"],
  },
  {
    icon: <WifiOff size={26} strokeWidth={1.5} />,
    title: "Offline Accessibility",
    subtitle: "Works without signal",
    body: "Download complete region packs — maps, POI details, contact info, emergency protocols — before you leave. Works in Deosai, the Wakhan Corridor, and anywhere towers don't reach.",
    tags: ["Offline Maps", "Cached Data", "Emergency Mode"],
  },
];

const PROBLEMS = [
  "Scattered across dozens of Facebook groups",
  "Outdated blog posts with no expiry dates",
  "Unverified ratings and sponsored placements",
  "No consolidated budget or cost tracker",
  "Zero offline access in remote areas",
  "Duplicate apps for hotels, maps, and reviews",
];

const SOLUTIONS = [
  "Single verified source for all destinations",
  "Real-time contributor updates, timestamped",
  "Editorial review process for every listing",
  "Built-in AI budget planner with live PKR rates",
  "Full offline mode with downloadable region packs",
  "All 8 travel workflows unified in one platform",
];

const STATS = [
  { value: "10,000+", label: "Verified Points of Interest", icon: <MapPin size={22} strokeWidth={1.5} />, sub: "Across all 7 provinces & AJK" },
  { value: "50,000+", label: "Community Reports",           icon: <MessageSquare size={22} strokeWidth={1.5} />, sub: "Submitted in the last 12 months" },
  { value: "8",       label: "App Workflows Unified",       icon: <Layers size={22} strokeWidth={1.5} />, sub: "Hotels, routes, reviews & more" },
  { value: "15 min",  label: "Avg. Planning Time",          icon: <Clock size={22} strokeWidth={1.5} />, sub: "Down from 4+ hours across apps" },
];

const TIMELINE = [
  { year: "2021", label: "Research & Fieldwork", desc: "12 months of user interviews and on-ground data collection across 5 provinces." },
  { year: "2022", label: "Beta Launch",           desc: "Initial release with 2,000 POIs and 400 community testers from across Pakistan." },
  { year: "2023", label: "AI Itinerary Engine",   desc: "Launched personalised planning powered by 50,000 real trip logs." },
  { year: "2024", label: "Offline Mode",          desc: "Full offline region packs covering Gilgit-Baltistan, KPK, and Azad Kashmir." },
  { year: "2025", label: "10k POI Milestone",     desc: "Crossed 10,000 verified points of interest with live editorial review pipeline." },
  { year: "2026", label: "Platform v3",           desc: "Trip Planner 3.0, Travel Journal, and expanded southern Pakistan coverage." },
];

const PRESS = [
  { outlet: "Dawn",         quote: "The most complete travel intelligence platform built for Pakistani roads.",    logo: "D" },
  { outlet: "The News",     quote: "Finally — an app that actually knows what's open at the top of the KKH.",    logo: "N" },
  { outlet: "Geo Tech",     quote: "Sair-e-Pakistan is what happens when locals build tech for local problems.",  logo: "G" },
];

// ── Geometric hero collage ─────────────────────────────────────────────────
function HeroCollage() {
  return (
    <div className="relative h-full w-full select-none" style={{ minHeight: 340 }}>
      {/* Main large image */}
      <div className="absolute rounded-2xl overflow-hidden shadow-2xl" style={{ top: 0, right: 0, width: "62%", height: "68%", zIndex: 3 }}>
        <img
          src="https://images.unsplash.com/photo-1659607168553-197baa0ae9d5?w=580&h=380&fit=crop&auto=format"
          alt="Travelers on cable car with Pakistani flags"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#12233A]/20 to-transparent" />
      </div>
      {/* Bottom-left image */}
      <div className="absolute rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF8F3]" style={{ bottom: 0, left: 0, width: "52%", height: "55%", zIndex: 4 }}>
        <img
          src="https://images.unsplash.com/photo-1631288566521-508a4b3835bd?w=480&h=320&fit=crop&auto=format"
          alt="Local travelers on KKH road Pakistan"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Top-left small */}
      <div className="absolute rounded-xl overflow-hidden shadow-lg border-4 border-[#FAF8F3]" style={{ top: 0, left: 0, width: "34%", height: "42%", zIndex: 2 }}>
        <img
          src="https://images.unsplash.com/photo-1612128952123-88ed13410495?w=280&h=220&fit=crop&auto=format"
          alt="Boats on Pakistan mountain lake"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Bottom-right accent tile */}
      <div className="absolute rounded-xl overflow-hidden shadow-lg border-4 border-[#FAF8F3]" style={{ bottom: "4%", right: 0, width: "34%", height: "30%", zIndex: 5 }}>
        <img
          src="https://images.unsplash.com/photo-1597350340158-6b2c2ff93a3e?w=280&h=160&fit=crop&auto=format"
          alt="Mountain lake with green trees Pakistan"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Teal dot pattern accent */}
      <div className="absolute z-1 opacity-20" style={{ top: 40, left: "32%", width: 80, height: 80, backgroundImage: "radial-gradient(circle, #0E8C88 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }} />
      {/* Amber count badge */}
      <div className="absolute z-10 bg-[#E8A33D] text-white rounded-2xl px-4 py-3 shadow-lg" style={{ top: "42%", left: "30%", transform: "translateX(-50%)" }}>
        <p className="font-black text-xl leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>800+</p>
        <p className="text-xs font-semibold text-white/80 mt-0.5">Local Guides</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeTimeline, setActiveTimeline] = useState(5);

  return (
    <div className="bg-[#FAF8F3] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#DDD6C7] px-8 lg:px-16 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-xs text-[#6B7280]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#0E8C88] transition-colors">Home</button>
          <ChevronRight size={11} />
          <span className="text-[#12233A] font-semibold">About Us</span>
        </div>
      </div>

      {/* ── HERO VISION BANNER ──────────────────────────────────────────── */}
      <section className="bg-[#FAF8F3] border-b border-[#DDD6C7]" style={{ minHeight: 400 }}>
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ minHeight: 400 }}>
          {/* Left: Typography */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#EBF7F6] border border-[#0E8C88]/20 rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E8C88]" />
              <span className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest">Our Mission</span>
            </div>
            <h1
              className="text-[#12233A] leading-[1.08] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Building Pakistan's{" "}
              <em className="not-italic text-[#0E8C88]">Travel Operating System.</em>
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-6 max-w-xl">
              Pakistan's travellers deserve better than scattered Facebook groups, expired blogs, and unverified hotel ratings. We built Sair-e-Pakistan to replace <span className="font-semibold text-[#12233A]">eight fragmented apps</span> with a single, verified travel intelligence platform — from AI itinerary planning to offline mountain maps.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigate("planner")}
                className="inline-flex items-center gap-2 bg-[#0E8C88] hover:bg-[#0B7874] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:gap-3"
              >
                Start Planning <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigate("explore")}
                className="inline-flex items-center gap-2 border border-[#DDD6C7] hover:border-[#12233A] text-[#12233A] text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Explore Destinations
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-[#DDD6C7]">
              {[
                { val: "2021", lbl: "Founded" },
                { val: "7",    lbl: "Provinces covered" },
                { val: "12+",  lbl: "Team members" },
              ].map(s => (
                <div key={s.lbl}>
                  <p className="text-[#12233A] font-black text-2xl leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{s.val}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Geometric collage */}
          <div className="hidden lg:block h-[360px]">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* ── PROBLEM vs SOLUTION ─────────────────────────────────────────── */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">Why We Exist</p>
            <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700 }}>
              The problem is fragmentation.<br /><em className="not-italic text-[#0E8C88]">The solution is one unified platform.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem column */}
            <div className="bg-[#FFF8F6] border border-[#E15B3F]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#E15B3F]/10 rounded-xl flex items-center justify-center">
                  <Layers size={20} className="text-[#E15B3F]" />
                </div>
                <div>
                  <h3 className="text-[#12233A] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>The Scattered Toolkit</h3>
                  <p className="text-xs text-[#E15B3F] font-semibold">What Pakistan travellers face today</p>
                </div>
              </div>
              <ul className="space-y-3">
                {PROBLEMS.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E15B3F]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#E15B3F] font-black text-[10px]">✕</span>
                    </div>
                    <span className="text-[#6B7280] text-sm leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
              {/* Illustration strip */}
              <div className="mt-8 rounded-xl overflow-hidden bg-[#F0EDE6] flex gap-1" style={{ height: 90 }}>
                {[
                  "https://images.unsplash.com/photo-1695405919988-638139ec112a?w=200&h=90&fit=crop&auto=format",
                  "https://images.unsplash.com/photo-1633100291356-19e4e0dcb98f?w=200&h=90&fit=crop&auto=format",
                  "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?w=200&h=90&fit=crop&auto=format",
                ].map((src, i) => (
                  <div key={i} className="flex-1 relative overflow-hidden">
                    <img src={src} className="w-full h-full object-cover opacity-60" alt="" />
                    <div className="absolute inset-0 bg-[#E15B3F]/20" />
                  </div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-[#E15B3F] text-xs font-black px-3 py-1.5 rounded-full shadow">8 separate apps</span>
                </div>
              </div>
            </div>

            {/* Solution column */}
            <div className="bg-[#EBF7F6] border border-[#0E8C88]/25 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0E8C88]/15 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#0E8C88]" />
                </div>
                <div>
                  <h3 className="text-[#12233A] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>The Unified Platform</h3>
                  <p className="text-xs text-[#0E8C88] font-semibold">What Sair-e-Pakistan delivers</p>
                </div>
              </div>
              <ul className="space-y-3">
                {SOLUTIONS.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0E8C88]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={11} className="text-[#0E8C88]" />
                    </div>
                    <span className="text-[#12233A] text-sm leading-snug font-medium">{s}</span>
                  </li>
                ))}
              </ul>
              {/* Teal "unified" visual */}
              <div className="mt-8 bg-[#12233A] rounded-xl px-6 py-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0E8C88] rounded-lg flex items-center justify-center shrink-0">
                  <Globe size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">All workflows, one platform</p>
                  <p className="text-white/50 text-xs mt-0.5">Maps · Reviews · Budget · Itinerary · Offline · Alerts</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[#0E8C88] text-xs font-black bg-[#0E8C88]/15 px-3 py-1.5 rounded-full">v3.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUR CORE PILLARS ────────────────────────────────────────────── */}
      <section className="py-20 px-8 lg:px-16 bg-[#FAF8F3]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">What Makes Us Different</p>
            <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700 }}>
              Four pillars of Pakistan's<br />
              <em className="not-italic text-[#0E8C88]">travel intelligence layer</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <article
                key={i}
                className="bg-white border border-[#DDD6C7] rounded-[8px] p-7 flex flex-col gap-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF7F6] flex items-center justify-center text-[#0E8C88] group-hover:bg-[#0E8C88] group-hover:text-white transition-all duration-300">
                  {pillar.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#0E8C88] uppercase tracking-widest mb-1.5">{pillar.subtitle}</p>
                  <h3 className="text-[#12233A] font-bold text-lg leading-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {pillar.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{pillar.body}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {pillar.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-[#0E8C88] bg-[#EBF7F6] px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATISTICS STRIP ─────────────────────────────────────── */}
      <section className="bg-[#12233A] py-16 px-8 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">Platform Impact</p>
            <h2 className="text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.8vw, 2rem)", fontWeight: 600 }}>
              Numbers that tell the story
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-[#12233A] hover:bg-[#1a3150] transition-colors px-8 py-10 flex flex-col items-center text-center gap-3"
              >
                <div className="text-[#0E8C88]">{stat.icon}</div>
                <div>
                  <div
                    className="text-white font-black leading-none mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 3rem)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[#0E8C88] text-xs font-bold uppercase tracking-wider mb-1.5">{stat.label}</div>
                  <div className="text-white/35 text-xs">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline strip */}
          <div className="mt-16">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center mb-8">Our Journey</p>
            <div className="relative">
              {/* Connector line */}
              <div className="absolute top-4 left-0 right-0 h-px bg-white/10 z-0" />
              <div
                className="absolute top-4 left-0 h-px bg-[#0E8C88] z-0 transition-all duration-500"
                style={{ width: `${((activeTimeline + 1) / TIMELINE.length) * 100}%` }}
              />
              <div className="relative z-10 grid grid-cols-3 lg:grid-cols-6 gap-4">
                {TIMELINE.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTimeline(i)}
                    className="flex flex-col items-center gap-3 group text-center"
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${i <= activeTimeline ? "bg-[#0E8C88] border-[#0E8C88]" : "bg-[#12233A] border-white/20 group-hover:border-white/40"}`}>
                      <div className={`w-2 h-2 rounded-full ${i <= activeTimeline ? "bg-white" : "bg-white/20"}`} />
                    </div>
                    <span className={`text-xs font-bold transition-colors ${i <= activeTimeline ? "text-[#0E8C88]" : "text-white/30 group-hover:text-white/50"}`}>{item.year}</span>
                    {i === activeTimeline && (
                      <div className="bg-white/8 border border-white/10 rounded-xl p-3 absolute top-14 w-40 text-left -translate-x-12 z-20 pointer-events-none shadow-xl">
                        <p className="text-white font-bold text-xs mb-1">{item.label}</p>
                        <p className="text-white/45 text-[10px] leading-relaxed">{item.desc}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY & LEADERSHIP SHOWCASE ─────────────────────────────── */}
      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">The People Behind It</p>
              <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700 }}>
                Founders, guides &<br />
                <em className="not-italic text-[#0E8C88]">top community contributors</em>
              </h2>
            </div>
            <p className="text-sm text-[#6B7280] max-w-xs">Backed by 800+ local contributors across every province, from Karachi to the Khunjerab Pass.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <article
                key={member.id}
                className="bg-[#FAF8F3] border border-[#DDD6C7] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {/* Card header image strip */}
                <div className="h-28 relative overflow-hidden bg-[#12233A]">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #12233A 0%, ${member.badgeColor}60 100%)` }} />
                </div>

                <div className="px-6 pb-6 -mt-10">
                  {/* Avatar */}
                  <div className="flex items-end justify-between mb-4">
                    <div className="relative">
                      <div className="w-[72px] h-[72px] rounded-2xl border-4 border-white overflow-hidden bg-[#EBF7F6] shadow-md">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            el.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                    {/* Badge */}
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white mb-1"
                      style={{ backgroundColor: member.badgeColor }}
                    >
                      {member.badge}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className="text-[#12233A] font-bold text-lg leading-tight mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {member.name}
                  </h3>
                  <p className="text-[#0E8C88] text-xs font-bold mb-1">{member.role}</p>
                  <p className="text-[#6B7280] text-[11px] flex items-center gap-1 mb-4">
                    <MapPin size={10} />{member.origin}
                  </p>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{member.bio}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-0 border-t border-[#DDD6C7] pt-4">
                    <div className="flex-1 text-center">
                      <p className="text-[#12233A] font-black text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{member.trips}</p>
                      <p className="text-[10px] text-[#6B7280] font-medium">Trips</p>
                    </div>
                    <div className="w-px h-8 bg-[#DDD6C7]" />
                    <div className="flex-1 text-center">
                      <p className="text-[#12233A] font-black text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{member.reviews}</p>
                      <p className="text-[10px] text-[#6B7280] font-medium">Reviews</p>
                    </div>
                    <div className="w-px h-8 bg-[#DDD6C7]" />
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <Star size={11} className="fill-[#E8A33D] text-[#E8A33D]" />
                        <Star size={11} className="fill-[#E8A33D] text-[#E8A33D]" />
                        <Star size={11} className="fill-[#E8A33D] text-[#E8A33D]" />
                        <Star size={11} className="fill-[#E8A33D] text-[#E8A33D]" />
                        <Star size={11} className="fill-[#E8A33D] text-[#E8A33D]" />
                      </div>
                      <p className="text-[10px] text-[#6B7280] font-medium">Rating</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Community count strip */}
          <div className="mt-12 bg-[#FAF8F3] border border-[#DDD6C7] rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex -space-x-2">
              {["#0E8C88","#12233A","#E8A33D","#8B5CF6","#E15B3F","#0E8C88","#12233A"].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-[#F0EDE6] flex items-center justify-center text-[#12233A] text-xs font-bold">+793</div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[#12233A] font-bold text-sm">800+ verified local contributors</p>
              <p className="text-[#6B7280] text-xs mt-0.5">Ground-truth data from every district of Pakistan</p>
            </div>
            <button className="text-sm font-bold text-[#0E8C88] flex items-center gap-1.5 hover:gap-2.5 transition-all shrink-0">
              Become a Contributor <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </section>

      {/* ── PRESS MENTIONS ──────────────────────────────────────────────── */}
      <section className="py-16 px-8 lg:px-16 bg-[#FAF8F3] border-y border-[#DDD6C7]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-center text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-10">As seen in</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRESS.map((p, i) => (
              <div key={i} className="bg-white border border-[#DDD6C7] rounded-2xl px-7 py-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#12233A] flex items-center justify-center text-white font-black text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{p.logo}</div>
                  <span className="text-[#12233A] font-bold text-sm">{p.outlet}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Quote size={16} className="text-[#0E8C88] shrink-0 mt-0.5" />
                  <p className="text-[#6B7280] text-sm leading-relaxed italic">"{p.quote}"</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className="fill-[#E8A33D] text-[#E8A33D]"/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER BANNER ───────────────────────────────────────────── */}
      <section className="py-24 px-8 lg:px-16 bg-[#FAF8F3]">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-[#12233A] rounded-3xl px-12 py-16 text-center relative overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 50%, white 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
            {/* Teal glow */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, #0E8C88 0%, transparent 70%)", opacity: 0.07, transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, #E8A33D 0%, transparent 70%)", opacity: 0.07, transform: "translate(-30%, 30%)" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#0E8C88]/15 border border-[#0E8C88]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E8C88]" />
                <span className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest">Ready to Explore?</span>
              </div>
              <h2
                className="text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700 }}
              >
                Start Planning Your<br />
                <em className="not-italic text-[#0E8C88]">Pakistan Adventure Today</em>
              </h2>
              <p className="text-white/55 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                Join 10,000+ travelers who plan smarter with verified local data, AI-powered itineraries, and Pakistan's most comprehensive travel community.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => onNavigate("planner")}
                  className="inline-flex items-center gap-2.5 bg-[#0E8C88] hover:bg-[#0B7874] text-white font-bold text-sm px-8 py-4 rounded-xl transition-all hover:gap-3.5 shadow-lg shadow-[#0E8C88]/25"
                >
                  Start Planning Your Trip <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate("explore")}
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/80 hover:text-white font-semibold text-sm px-8 py-4 rounded-xl transition-all"
                >
                  Browse Destinations
                </button>
              </div>
              {/* Trust signals */}
              <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-white/10 flex-wrap">
                {[
                  { icon: <ShieldCheck size={14}/>, label: "All data verified" },
                  { icon: <WifiOff size={14}/>,    label: "Works offline"     },
                  { icon: <Globe size={14}/>,      label: "All 7 provinces"  },
                  { icon: <Zap size={14}/>,        label: "AI-powered plans" },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-2 text-white/40 text-xs">
                    <span className="text-[#0E8C88]">{t.icon}</span>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page footer nav */}
      <div className="border-t border-[#DDD6C7] bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2026 Sair-e-Pakistan · Building Pakistan's travel operating system</p>
          <div className="flex items-center gap-5">
            {([
              { label: "Home",         page: "home"    },
              { label: "Explore",      page: "explore" },
              { label: "City Hub",     page: "city"    },
              { label: "Place Detail", page: "place"   },
              { label: "Trip Planner", page: "planner" },
            ] as { label: string; page: Page }[]).map(link => (
              <button key={link.page} onClick={() => onNavigate(link.page)} className="text-xs font-medium text-[#6B7280] hover:text-[#0E8C88] transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
