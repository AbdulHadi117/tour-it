import { useEffect, useState, useMemo } from "react";
import {
  Star, MapPin, ChevronRight, ChevronLeft,
  Bookmark, Share2, Calendar, Clock, Wallet,
  ShieldCheck, Utensils, Hotel, Compass, Landmark,
  Eye, Thermometer, ArrowRight, CheckCircle2, Circle,
  Mountain, Waves, Navigation, Users,
} from "lucide-react";
import type { Page } from "./App";
import { fetchMapLayers, type CityMapLayer, type CityPin } from "./travelData";

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = "attractions" | "historical" | "hotels" | "restaurants" | "adventure";

// ── City Data ──────────────────────────────────────────────────────────────
const CITY_FALLBACK = {
  name: "Skardu",
  province: "Gilgit-Baltistan",
  country: "Pakistan",
  tagline: "Gateway to the Karakoram",
  heroImage: "https://images.unsplash.com/photo-1611821824288-95e977eab064?w=900&h=520&fit=crop&auto=format",
  heroAlt: "Brown and green mountains beside an emerald lake in Skardu Valley",
  rating: 4.9,
  reviewCount: 2347,
  altitude: "2,438 m",
  coordinates: "35.3°N 75.6°E",
  description: "Skardu is the capital of Gilgit-Baltistan and the launching pad for expeditions to K2, Broad Peak, and Gasherbrum. The town sits where the Indus and Shigar rivers converge, ringed by peaks of the Karakoram range — the most densely concentrated group of high mountains on Earth.",
};

const QUICK_FACTS_FALLBACK = [
  { icon: <Calendar size={17} strokeWidth={1.7} />, label: "Ideal Duration", value: "3 – 5 Days" },
  { icon: <Thermometer size={17} strokeWidth={1.7} />, label: "Best Season", value: "May – Oct" },
  { icon: <Wallet size={17} strokeWidth={1.7} />, label: "Daily Budget", value: "Medium" },
  { icon: <ShieldCheck size={17} strokeWidth={1.7} />, label: "Safety Rating", value: "Excellent" },
  { icon: <Mountain size={17} strokeWidth={1.7} />, label: "Altitude", value: "2,438 m" },
  { icon: <Users size={17} strokeWidth={1.7} />, label: "Visitors / Year", value: "120k+" },
];

interface Card {
  id: number;
  tab: Tab;
  name: string;
  subtitle: string;
  image: string;
  rating: number;
  reviews: number;
  views: number;
  tag: string;
  tagColor: string;
  meta: string;
  pinId?: number;
}

const CARDS_FALLBACK: Card[] = [
  // Attractions
  { id: 1, tab: "attractions", name: "Satpara Lake", subtitle: "A sapphire reservoir cradled by arid mountains", image: "https://images.unsplash.com/photo-1677103036843-df9e5ad74eea?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 1840, views: 98400, tag: "Natural Lake", tagColor: "bg-teal-50 text-teal-700 border-teal-200", meta: "16 km from centre", pinId: 3 },
  { id: 2, tab: "attractions", name: "Upper Kachura Lake", subtitle: "Crystal waters set against snow-dusted peaks", image: "https://images.unsplash.com/photo-1562913346-61ae3ab9277e?w=500&h=320&fit=crop&auto=format", rating: 4.8, reviews: 1560, views: 87300, tag: "Scenic Spot", tagColor: "bg-sky-50 text-sky-700 border-sky-200", meta: "31 km from centre", pinId: 4 },
  { id: 3, tab: "attractions", name: "Shangrila Resort Garden", subtitle: "The famed \"heaven on earth\" lakeside resort", image: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?w=500&h=320&fit=crop&auto=format", rating: 4.8, reviews: 2210, views: 134200, tag: "Resort & Garden", tagColor: "bg-green-50 text-green-700 border-green-200", meta: "32 km from centre", pinId: 8 },
  { id: 4, tab: "attractions", name: "Deosai Plains", subtitle: "World's second-highest plateau — wildflowers & bears", image: "https://images.unsplash.com/photo-1668197091449-0a2b87ef7650?w=500&h=320&fit=crop&auto=format", rating: 5.0, reviews: 1120, views: 61700, tag: "National Park", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200", meta: "30 km from centre", pinId: 6 },
  { id: 5, tab: "attractions", name: "Katpana Cold Desert", subtitle: "Asia's highest cold desert — surreal sand dunes", image: "https://images.unsplash.com/photo-1668197091449-0a2b87ef7650?w=500&h=320&fit=crop&auto=format", rating: 4.7, reviews: 890, views: 44200, tag: "Desert", tagColor: "bg-amber-50 text-amber-700 border-amber-200", meta: "8 km from centre" },
  { id: 6, tab: "attractions", name: "Sheosar Lake", subtitle: "Glacial gem at 4,142 m inside Deosai", image: "https://images.unsplash.com/photo-1653163517210-2e3b56190680?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 780, views: 52100, tag: "Alpine Lake", tagColor: "bg-blue-50 text-blue-700 border-blue-200", meta: "62 km via Deosai", pinId: 7 },
  // Historical
  { id: 7, tab: "historical", name: "Kharpocho Fort", subtitle: "16th-century Mughal citadel on a rocky bluff", image: "https://images.unsplash.com/photo-1611821824288-95e977eab064?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 2110, views: 118400, tag: "Mughal Fortress", tagColor: "bg-amber-50 text-amber-700 border-amber-200", meta: "2 km from centre", pinId: 1 },
  { id: 8, tab: "historical", name: "Shigar Fort", subtitle: "400-year-old Amacha Raja palace, now a heritage hotel", image: "https://images.unsplash.com/photo-1671431558001-5f03549c388c?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 1760, views: 94200, tag: "Heritage Hotel", tagColor: "bg-stone-50 text-stone-700 border-stone-200", meta: "35 km via Shigar", pinId: 5 },
  { id: 9, tab: "historical", name: "Skardu Fort", subtitle: "Commanding the confluence of the Indus & Shigar", image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=500&h=320&fit=crop&auto=format", rating: 4.7, reviews: 940, views: 47300, tag: "Historic Fort", tagColor: "bg-orange-50 text-orange-700 border-orange-200", meta: "4 km from centre" },
  { id: 10, tab: "historical", name: "Manthal Rock Carvings", subtitle: "Ancient Buddhist and Silk Road era petroglyphs", image: "https://images.unsplash.com/photo-1668197091449-0a2b87ef7650?w=500&h=320&fit=crop&auto=format", rating: 4.8, reviews: 620, views: 29800, tag: "Petroglyphs", tagColor: "bg-rose-50 text-rose-700 border-rose-200", meta: "12 km from centre" },
  // Hotels
  { id: 11, tab: "hotels", name: "Serena Hotel Skardu", subtitle: "Luxury property with Karakoram panorama views", image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=500&h=320&fit=crop&auto=format", rating: 4.8, reviews: 1120, views: 63400, tag: "Luxury · $$$$", tagColor: "bg-purple-50 text-purple-700 border-purple-200", meta: "City centre · Free WiFi" },
  { id: 12, tab: "hotels", name: "Shangrila Mountain Resort", subtitle: "Lakeside retreat in a legendary alpine garden", image: "https://images.unsplash.com/photo-1707667573875-207658a82c68?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 1640, views: 88700, tag: "Resort · $$$", tagColor: "bg-teal-50 text-teal-700 border-teal-200", meta: "32 km from centre" },
  { id: 13, tab: "hotels", name: "Masherbrum Hotel", subtitle: "Mid-range comfort with K2 heritage decor", image: "https://images.unsplash.com/photo-1671431558001-5f03549c388c?w=500&h=320&fit=crop&auto=format", rating: 4.5, reviews: 780, views: 41200, tag: "Mid-range · $$", tagColor: "bg-sky-50 text-sky-700 border-sky-200", meta: "City centre · Breakfast incl." },
  { id: 14, tab: "hotels", name: "Concordia Motel", subtitle: "Budget-friendly climbers' base with gear storage", image: "https://images.unsplash.com/photo-1707667573875-207658a82c68?w=500&h=320&fit=crop&auto=format", rating: 4.3, reviews: 540, views: 28900, tag: "Budget · $", tagColor: "bg-green-50 text-green-700 border-green-200", meta: "Near airport · Gear storage" },
  // Restaurants
  { id: 15, tab: "restaurants", name: "Shelton's Rezidor", subtitle: "Upscale dining with local trout and Baltistani cuisine", image: "https://images.unsplash.com/photo-1712218275818-6bbb7e5a0a44?w=500&h=320&fit=crop&auto=format", rating: 4.7, reviews: 920, views: 48300, tag: "Fine Dining", tagColor: "bg-amber-50 text-amber-700 border-amber-200", meta: "Trout · Baltistani · $$" },
  { id: 16, tab: "restaurants", name: "Mashabrum Restaurant", subtitle: "River-fresh trout and mountain herb dumplings", image: "https://images.unsplash.com/photo-1572015837827-01671d41e102?w=500&h=320&fit=crop&auto=format", rating: 4.6, reviews: 1140, views: 62400, tag: "Local Cuisine", tagColor: "bg-orange-50 text-orange-700 border-orange-200", meta: "Dumpling · Trout · $" },
  { id: 17, tab: "restaurants", name: "Indus View Café", subtitle: "Rooftop chai and freshly baked breads with river views", image: "https://images.unsplash.com/photo-1584010063908-c90644cae72a?w=500&h=320&fit=crop&auto=format", rating: 4.5, reviews: 680, views: 34700, tag: "Café & Bakery", tagColor: "bg-rose-50 text-rose-700 border-rose-200", meta: "Breakfast · Chai · $" },
  // Adventure
  { id: 18, tab: "adventure", name: "K2 Base Camp Trek", subtitle: "14-day expedition to the foot of the world's hardest mountain", image: "https://images.unsplash.com/photo-1695405919988-638139ec112a?w=500&h=320&fit=crop&auto=format", rating: 5.0, reviews: 1640, views: 198700, tag: "Expert Trek", tagColor: "bg-red-50 text-red-700 border-red-200", meta: "14 days · Very Challenging" },
  { id: 19, tab: "adventure", name: "Deosai Plateau Drive", subtitle: "4×4 journey across the world's second-highest plateau", image: "https://images.unsplash.com/photo-1653163517210-2e3b56190680?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 980, views: 76400, tag: "4×4 Adventure", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200", meta: "1 day · Moderate" },
  { id: 20, tab: "adventure", name: "Satpara Lake Kayaking", subtitle: "Paddle across a 2,600 m high mountain reservoir", image: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?w=500&h=320&fit=crop&auto=format", rating: 4.7, reviews: 560, views: 43200, tag: "Water Sport", tagColor: "bg-sky-50 text-sky-700 border-sky-200", meta: "Half day · Easy" },
  { id: 21, tab: "adventure", name: "Fairy Meadows Trek", subtitle: "Classic 2-day walk to Nanga Parbat's base meadow", image: "https://images.unsplash.com/photo-1637679149566-6af21b6e933a?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 1340, views: 112600, tag: "Trekking", tagColor: "bg-teal-50 text-teal-700 border-teal-200", meta: "2 days · Moderate" },
  { id: 22, tab: "adventure", name: "Rock Climbing — Trango", subtitle: "World-class big wall climbing on the Trango Towers", image: "https://images.unsplash.com/photo-1594331954399-b2f028bcae53?w=500&h=320&fit=crop&auto=format", rating: 4.9, reviews: 420, views: 38900, tag: "Climbing", tagColor: "bg-stone-50 text-stone-700 border-stone-200", meta: "Multi-day · Expert" },
];

// ── Map ────────────────────────────────────────────────────────────────────
const MAP_PINS_FALLBACK: CityPin[] = [
  { id: 1, label: "Kharpocho Fort", x: 238, y: 158, city: "Skardu" },
  { id: 2, label: "Skardu Bazaar", x: 290, y: 198, city: "Skardu" },
  { id: 3, label: "Satpara Lake", x: 376, y: 268, city: "Skardu" },
  { id: 4, label: "Upper Kachura Lake", x: 148, y: 228, city: "Skardu" },
  { id: 5, label: "Shigar Fort", x: 482, y: 148, city: "Shigar Valley" },
  { id: 6, label: "Deosai Plains", x: 510, y: 288, city: "Deosai" },
  { id: 7, label: "Sheosar Lake", x: 558, y: 232, city: "Deosai" },
  { id: 8, label: "Lower Kachura Lake", x: 118, y: 278, city: "Kachura" },
];

const ITINERARIES_FALLBACK = [
  {
    id: 0,
    title: "1-Day Express Tour",
    duration: "1 day",
    badge: "Quick",
    badgeColor: "bg-[#E15B3F]/10 text-[#E15B3F]",
    routeColor: "#E15B3F",
    stops: [1, 2, 3, 4],
    description: "The essential Skardu sampler — fort, bazaar, and two lakes in a single long day.",
    steps: [
      { pin: 1, time: "08:00", name: "Kharpocho Fort", duration: "2 hrs", note: "Sunrise views over the valley" },
      { pin: 2, time: "10:30", name: "Skardu Bazaar", duration: "1 hr", note: "Dried apricots, gems & souvenirs" },
      { pin: 3, time: "12:30", name: "Satpara Lake", duration: "3 hrs", note: "Picnic & optional boat hire" },
      { pin: 4, time: "16:00", name: "Upper Kachura Lake", duration: "2 hrs", note: "Golden hour photography" },
    ],
  },
  {
    id: 1,
    title: "Weekend Escape",
    duration: "2 days",
    badge: "Balanced",
    badgeColor: "bg-[#0E8C88]/10 text-[#0E8C88]",
    routeColor: "#0E8C88",
    stops: [5, 1, 2, 8, 3, 6],
    description: "Two full days balancing ancient heritage with Skardu's finest lake scenery.",
    steps: [
      { pin: 5, time: "Day 1 · 09:00", name: "Shigar Fort", duration: "3 hrs", note: "Heritage hotel & traditional architecture" },
      { pin: 1, time: "Day 1 · 13:30", name: "Kharpocho Fort", duration: "1.5 hrs", note: "Commanding Indus panorama" },
      { pin: 2, time: "Day 1 · 16:00", name: "Skardu Bazaar", duration: "2 hrs", note: "Dinner & evening stroll" },
      { pin: 8, time: "Day 2 · 08:00", name: "Lower Kachura Lake", duration: "2 hrs", note: "Morning mist & fishing boats" },
      { pin: 3, time: "Day 2 · 11:00", name: "Satpara Lake", duration: "3 hrs", note: "Kayaking & lakeside lunch" },
      { pin: 6, time: "Day 2 · 15:30", name: "Deosai Entry Point", duration: "2 hrs", note: "High plateau panorama" },
    ],
  },
  {
    id: 2,
    title: "4-Day Explorer",
    duration: "4 days",
    badge: "Immersive",
    badgeColor: "bg-[#12233A]/10 text-[#12233A]",
    routeColor: "#12233A",
    stops: [1, 5, 8, 4, 3, 6, 7, 2],
    description: "A comprehensive journey covering all landmarks, lakes, and high-altitude plateaus.",
    steps: [
      { pin: 1, time: "Day 1 · Morning", name: "Kharpocho Fort", duration: "2.5 hrs", note: "16th-century Mughal citadel" },
      { pin: 5, time: "Day 1 · Afternoon", name: "Shigar Fort & Palace", duration: "3 hrs", note: "Stay overnight in the fort hotel" },
      { pin: 8, time: "Day 2 · Morning", name: "Lower Kachura Lake", duration: "2 hrs", note: "Reflections in still water" },
      { pin: 4, time: "Day 2 · Afternoon", name: "Upper Kachura Lake", duration: "2 hrs", note: "Trek to the hidden upper pool" },
      { pin: 3, time: "Day 3 · Morning", name: "Satpara Lake & Dam", duration: "3 hrs", note: "Boating on the reservoir" },
      { pin: 6, time: "Day 3 · Afternoon", name: "Deosai Plains", duration: "4 hrs", note: "Spot Himalayan brown bears" },
      { pin: 7, time: "Day 4 · Morning", name: "Sheosar Lake", duration: "3 hrs", note: "4,142 m glacial emerald jewel" },
      { pin: 2, time: "Day 4 · Evening", name: "Skardu Bazaar", duration: "2 hrs", note: "Final dinner & farewell shop" },
    ],
  },
];

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "attractions", label: "Attractions", icon: <Compass size={15} /> },
  { id: "historical", label: "Historical Sites", icon: <Landmark size={15} /> },
  { id: "hotels", label: "Hotels", icon: <Hotel size={15} /> },
  { id: "restaurants", label: "Restaurants", icon: <Utensils size={15} /> },
  { id: "adventure", label: "Adventure & Nature", icon: <Mountain size={15} /> },
];

// ── Star Row ───────────────────────────────────────────────────────────────
function StarRow({ rating, count, size = 13 }: { rating: number; count: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={size} className={i <= Math.round(rating) ? "fill-[#E8A33D] text-[#E8A33D]" : "fill-gray-200 text-gray-200"} />
        ))}
      </div>
      <span className="text-xs font-semibold text-[#E8A33D]">{rating}</span>
      <span className="text-xs text-[#6B7280]">({count.toLocaleString()})</span>
    </div>
  );
}

// ── Interactive Map ────────────────────────────────────────────────────────
function InteractiveMap({ activeItinerary, hoveredPin, onPinHover, activeLayers, pins, itineraries }: {
  activeItinerary: number;
  hoveredPin: number | null;
  onPinHover: (id: number | null) => void;
  activeLayers: Set<string>;
  pins: CityPin[];
  itineraries: typeof ITINERARIES_FALLBACK;
}) {
  const itinerary = itineraries[activeItinerary];
  const activeStops = itinerary.stops;

  const routePoints = itinerary.stops
    .map((id) => pins.find((p) => p.id === id)!)
    .filter(Boolean);

  const routePath = routePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#E8F4F3] border border-[#DDD6C7]">
      <svg
        viewBox="0 0 660 420"
        className="w-full h-full"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Sky */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8D4E8" />
            <stop offset="100%" stopColor="#D6EAE8" />
          </linearGradient>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B8299" />
            <stop offset="100%" stopColor="#8BA0B4" />
          </linearGradient>
          <linearGradient id="valleyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8B99A" />
            <stop offset="100%" stopColor="#D4C4A8" />
          </linearGradient>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EEF4F8" />
            <stop offset="100%" stopColor="#D8E8F0" />
          </linearGradient>
          <filter id="pinShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Sky background */}
        <rect width="660" height="420" fill="url(#skyGrad)" />

        {/* Far mountain range — left */}
        <polygon points="0,220 40,130 90,160 130,100 180,140 230,90 280,130 330,80 380,120 430,70 480,110 530,60 580,100 620,75 660,95 660,220" fill="url(#mountainGrad)" opacity="0.6" />

        {/* Snow caps — left range */}
        <polygon points="130,100 150,85 180,140 160,125" fill="url(#snowGrad)" opacity="0.7" />
        <polygon points="230,90 250,72 280,130 260,108" fill="url(#snowGrad)" opacity="0.7" />
        <polygon points="330,80 355,58 380,120 358,98" fill="url(#snowGrad)" opacity="0.75" />
        <polygon points="430,70 458,48 480,110 456,88" fill="url(#snowGrad)" opacity="0.8" />
        <polygon points="530,60 556,40 580,100 558,78" fill="url(#snowGrad)" opacity="0.85" />

        {/* Mid mountain ridge */}
        <polygon points="0,280 50,230 100,255 160,210 210,240 280,200 350,235 410,205 460,235 520,210 580,238 620,218 660,228 660,310 0,310" fill="#96AEC0" opacity="0.5" />

        {/* Valley floor */}
        <polygon points="0,300 660,300 660,420 0,420" fill="url(#valleyGrad)" />

        {/* Green valley patches */}
        <ellipse cx="290" cy="340" rx="120" ry="40" fill="#8FB87A" opacity="0.45" />
        <ellipse cx="160" cy="360" rx="80" ry="28" fill="#7DAB6A" opacity="0.4" />
        <ellipse cx="460" cy="350" rx="90" ry="32" fill="#8FB87A" opacity="0.38" />

        {/* Indus River — main horizontal ribbon */}
        <path d="M 0 320 C 60 312 120 326 180 318 C 240 310 300 322 360 316 C 420 310 480 320 540 314 C 590 310 630 316 660 312" fill="none" stroke="#5BA3C9" strokeWidth="8" opacity="0.65" />
        <path d="M 0 320 C 60 312 120 326 180 318 C 240 310 300 322 360 316 C 420 310 480 320 540 314 C 590 310 630 316 660 312" fill="none" stroke="#A8D4E8" strokeWidth="4" opacity="0.4" />

        {/* Shigar River tributary */}
        <path d="M 482 148 C 490 200 470 250 450 310" fill="none" stroke="#5BA3C9" strokeWidth="4" opacity="0.5" />

        {/* Satpara Lake */}
        <ellipse cx="376" cy="280" rx="28" ry="22" fill="#5BA3C9" opacity="0.75" />
        <ellipse cx="376" cy="278" rx="22" ry="14" fill="#7BC4E0" opacity="0.5" />

        {/* Lower Kachura Lake */}
        <ellipse cx="118" cy="288" rx="22" ry="16" fill="#5BA3C9" opacity="0.7" />
        <ellipse cx="118" cy="286" rx="16" ry="10" fill="#7BC4E0" opacity="0.5" />

        {/* Upper Kachura Lake */}
        <ellipse cx="148" cy="238" rx="18" ry="13" fill="#5BA3C9" opacity="0.65" />
        <ellipse cx="148" cy="236" rx="12" ry="8" fill="#7BC4E0" opacity="0.5" />

        {/* Sheosar Lake */}
        <ellipse cx="558" cy="242" rx="20" ry="14" fill="#5BA3C9" opacity="0.7" />
        <ellipse cx="558" cy="240" rx="14" ry="9" fill="#7BC4E0" opacity="0.5" />

        {/* Deosai highland zone */}
        <rect x="460" y="250" width="120" height="70" rx="12" fill="#9DB885" opacity="0.28" />
        <text x="520" y="295" fill="#4A7A3A" fontSize="8" textAnchor="middle" fontWeight="600" opacity="0.7">DEOSAI</text>

        {/* Skardu town indicator */}
        <rect x="248" y="185" width="80" height="36" rx="6" fill="#FAF8F3" opacity="0.35" />
        <text x="288" y="206" fill="#12233A" fontSize="9" textAnchor="middle" fontWeight="700" opacity="0.7">SKARDU</text>
        <text x="288" y="216" fill="#6B7280" fontSize="7" textAnchor="middle" opacity="0.6">Town Centre</text>

        {/* Water labels */}
        <text x="376" y="282" fill="white" fontSize="7" textAnchor="middle" fontWeight="600" opacity="0.9">Satpara</text>
        <text x="118" y="291" fill="white" fontSize="6.5" textAnchor="middle" fontWeight="600" opacity="0.9">Kachura</text>
        <text x="558" y="245" fill="white" fontSize="6.5" textAnchor="middle" fontWeight="600" opacity="0.9">Sheosar</text>

        {/* Compass rose */}
        <g transform="translate(620, 50)">
          <circle cx="0" cy="0" r="18" fill="white" opacity="0.8" />
          <text x="0" y="-6" textAnchor="middle" fill="#12233A" fontSize="9" fontWeight="700">N</text>
          <path d="M 0 -14 L 3 0 L 0 4 L -3 0 Z" fill="#12233A" />
          <path d="M 0 14 L 3 0 L 0 -4 L -3 0 Z" fill="#6B7280" opacity="0.5" />
        </g>

        {/* Scale bar */}
        <g transform="translate(30, 395)">
          <line x1="0" y1="0" x2="60" y2="0" stroke="#12233A" strokeWidth="1.5" opacity="0.5" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#12233A" strokeWidth="1.5" opacity="0.5" />
          <line x1="60" y1="-4" x2="60" y2="4" stroke="#12233A" strokeWidth="1.5" opacity="0.5" />
          <text x="30" y="-7" textAnchor="middle" fill="#12233A" fontSize="7" opacity="0.6">10 km</text>
        </g>

        {/* Route path — dashed */}
        {routePoints.length > 1 && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke={itinerary.routeColor}
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.35"
            />
            <path
              d={routePath}
              fill="none"
              stroke={itinerary.routeColor}
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.7"
            />
          </>
        )}

        {/* Direction arrows on route */}
        {routePoints.slice(0, -1).map((from, i) => {
          const to = routePoints[i + 1];
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
          return (
            <g key={i} transform={`translate(${mx},${my}) rotate(${angle})`}>
              <polygon points="0,-3 6,0 0,3" fill={itinerary.routeColor} opacity="0.7" />
            </g>
          );
        })}

        {/* Pins */}
        {pins.map((pin) => {
          const isActive = activeStops.includes(pin.id);
          const isHovered = hoveredPin === pin.id;
          const stopIndex = itinerary.stops.indexOf(pin.id);
          const pinColor = isActive ? itinerary.routeColor : "#94A3B8";
          const layerKey = pin.layer === "road" ? "roads" : pin.layer;
          if (!activeLayers.has(layerKey)) return null;
          const scale = isHovered ? 1.2 : 1;

          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y}) scale(${scale})`}
              style={{ transformOrigin: `${pin.x}px ${pin.y}px`, cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={() => onPinHover(pin.id)}
              onMouseLeave={() => onPinHover(null)}
              filter="url(#pinShadow)"
            >
              {/* Pulse ring when active */}
              {isActive && (
                <circle cx="0" cy="0" r="14" fill={pinColor} opacity="0.15" />
              )}

              {/* Pin body */}
              <circle cx="0" cy="0" r={isActive ? 11 : 8} fill={isActive ? pinColor : "#CBD5E1"} />
              <circle cx="0" cy="0" r={isActive ? 10 : 7} fill="white" />
              <circle cx="0" cy="0" r={isActive ? 7 : 5} fill={isActive ? pinColor : "#94A3B8"} />

              {/* Step number */}
              {isActive && stopIndex >= 0 && (
                <text x="0" y="3.5" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="800">
                  {stopIndex + 1}
                </text>
              )}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredPin && (() => {
          const pin = pins.find((p) => p.id === hoveredPin);
          if (!pin) return null;
          const isActive = activeStops.includes(pin.id);
          const tipX = Math.min(pin.x + 16, 580);
          const tipY = Math.max(pin.y - 32, 12);
          const labelWidth = Math.max(pin.label.length * 5.8 + 16, 80);
          return (
            <g>
              <rect x={tipX} y={tipY} width={labelWidth} height={22} rx="5" fill="#12233A" opacity="0.92" />
              <text x={tipX + labelWidth / 2} y={tipY + 14.5} textAnchor="middle" fill="white" fontSize="8.5" fontWeight="600">
                {pin.label}
              </text>
              {isActive && (
                <circle cx={tipX + labelWidth - 8} cy={tipY + 11} r="4" fill={itinerary.routeColor} />
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function CityPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [mapData, setMapData] = useState<{ layers: CityMapLayer[]; pins: CityPin[] } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("attractions");
  const [savedDestination, setSavedDestination] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["roads", "fuel"]));

  useEffect(() => {
    void fetchMapLayers("skardu").then((data) => {
      setMapData(data);
      setActiveLayers(new Set(data.layers.filter((layer) => layer.visibleByDefault).map((layer) => layer.id)));
    });
  }, []);

  const CITY = CITY_FALLBACK;
  const QUICK_FACTS = QUICK_FACTS_FALLBACK;
  const CARDS = CARDS_FALLBACK;
  const MAP_PINS = mapData?.pins ?? MAP_PINS_FALLBACK;
  const ITINERARIES = ITINERARIES_FALLBACK;
  const mapLayers = mapData?.layers ?? [
    { id: "roads", label: "Roads", description: "Major access roads and scenic drives", visibleByDefault: true },
    { id: "fuel", label: "Fuel", description: "Fuel and repair points" },
    { id: "weather", label: "Weather", description: "Weather conditions and mountain forecasts" },
    { id: "emergency", label: "Emergency", description: "Rescue, hospital, and police points" },
  ];

  const visibleCards = useMemo(
    () => CARDS.filter((c) => c.tab === activeTab),
    [activeTab]
  );

  const itinerary = ITINERARIES[selectedItinerary];

  return (
    <div className="bg-[#FAF8F3] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── CITY HERO BLOCK ───────────────────────────────────────────── */}
      <section
        className="w-full bg-[#12233A] grid grid-cols-1 lg:grid-cols-[55%_45%]"
        style={{ minHeight: 450 }}
      >
        {/* Left — immersive image */}
        <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
          <img
            src={CITY.heroImage}
            alt={CITY.heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 55%" }}
          />
          {/* Gradient vignette */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(18,35,58,0) 60%, rgba(18,35,58,0.35) 100%), linear-gradient(180deg, rgba(18,35,58,0.15) 0%, rgba(18,35,58,0.4) 100%)" }} />

          {/* Breadcrumb overlay */}
          <div className="absolute top-5 left-6 z-10 flex items-center gap-2 text-xs text-white/75">
            <button onClick={() => onNavigate("home")} className="hover:text-white transition-colors">Home</button>
            <ChevronRight size={12} />
            <button onClick={() => onNavigate("explore")} className="hover:text-white transition-colors">Explore</button>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">{CITY.name}</span>
          </div>

          {/* Province tag */}
          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#0E8C88]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <MapPin size={11} />
              {CITY.province}, {CITY.country}
            </span>
            <span className="text-white/50 text-xs">{CITY.altitude} · {CITY.coordinates}</span>
          </div>

          {/* Photo credit */}
          <div className="absolute bottom-5 right-5 z-10">
            <span className="text-white/40 text-[10px]">Photo: Hussain Ali · Unsplash</span>
          </div>
        </div>

        {/* Right — info panel */}
        <div className="bg-white flex flex-col justify-between p-8 lg:p-10">
          {/* Top section */}
          <div>
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">
              City Travel Hub
            </p>
            <h1
              className="text-[#12233A] leading-none mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              {CITY.name}
            </h1>
            <p
              className="text-[#0E8C88] mb-4 font-medium"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontStyle: "italic" }}
            >
              {CITY.tagline}
            </p>

            {/* Rating badges */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#DDD6C7] rounded-xl px-4 py-2.5">
                <StarRow rating={CITY.rating} count={CITY.reviewCount} size={15} />
              </div>
              <div className="flex items-center gap-1.5 bg-[#0E8C88]/8 rounded-xl px-4 py-2.5 border border-[#0E8C88]/15">
                <ShieldCheck size={14} className="text-[#0E8C88]" />
                <span className="text-sm font-semibold text-[#0E8C88]">Excellent Safety</span>
              </div>
            </div>

            <p className="text-[#6B7280] text-sm leading-relaxed mb-6 max-w-sm">
              {CITY.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setSavedDestination(!savedDestination)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                savedDestination
                  ? "bg-[#EBF7F6] border-[#0E8C88] text-[#0E8C88]"
                  : "bg-white border-[#DDD6C7] text-[#12233A] hover:border-[#0E8C88] hover:text-[#0E8C88]"
              }`}
            >
              <Bookmark size={15} className={savedDestination ? "fill-[#0E8C88]" : ""} />
              {savedDestination ? "Saved" : "Save"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDD6C7] bg-white text-[#12233A] text-sm font-semibold hover:border-[#12233A] transition-all">
              <Share2 size={15} />
              Share
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E8C88] hover:bg-[#0B7874] text-white text-sm font-bold transition-all shadow-md shadow-[#0E8C88]/20 active:scale-95">
              <Navigation size={15} />
              Start a Trip Plan
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── QUICK FACTS STRIP ─────────────────────────────────────────── */}
      <div className="bg-[#12233A] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/8">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3 px-6 py-4">
                <div className="text-[#0E8C88] shrink-0">{fact.icon}</div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold leading-none mb-1">
                    {fact.label}
                  </p>
                  <p className="text-white text-sm font-bold leading-none">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-10 space-y-12">

        {/* ── CATEGORY NAVIGATION TABS ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center bg-white border border-[#DDD6C7] rounded-2xl p-1 shadow-sm gap-1">
              {TAB_CONFIG.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? "bg-[#0E8C88] text-white shadow-md"
                      : "text-[#12233A]/60 hover:text-[#12233A] hover:bg-[#FAF8F3]"
                  }`}
                >
                  <span className={activeTab === id ? "text-white" : "text-[#0E8C88]"}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab sub-header */}
          <div className="flex items-center justify-between mt-7 mb-5">
            <div>
              <h2 className="text-[#12233A] font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem" }}>
                {TAB_CONFIG.find((t) => t.id === activeTab)?.label} in {CITY.name}
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">{visibleCards.length} curated listings</p>
            </div>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E8C88] hover:underline">
              View all <ArrowRight size={13} />
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className="group bg-white rounded-[8px] overflow-hidden border border-[#DDD6C7] shadow-sm hover:shadow-lg hover:border-[#0E8C88] transition-all duration-250 cursor-pointer hover:-translate-y-0.5"
              >
                <div className="relative overflow-hidden h-40 bg-[#F0EDE6]">
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/40 to-transparent" />
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <Eye size={10} className="text-white/80" />
                    <span className="text-[10px] text-white font-medium">
                      {card.views >= 1000 ? `${(card.views / 1000).toFixed(0)}k` : card.views}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 mb-2 ${card.tagColor}`}>
                    {card.tag}
                  </span>
                  <h3 className="text-[#12233A] font-bold leading-snug mb-0.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem" }}>
                    {card.name}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] mb-2 leading-relaxed line-clamp-2">{card.subtitle}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#6B7280] mb-2.5">
                    <MapPin size={9} className="text-[#0E8C88]" />
                    {card.meta}
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#F0EDE6]">
                    <StarRow rating={card.rating} count={card.reviews} />
                    <button
                      onClick={() => onNavigate("place")}
                      className="text-[11px] font-semibold text-[#0E8C88] inline-flex items-center gap-0.5 hover:gap-1.5 transition-all"
                    >
                      View <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── SPLIT MAP SECTION ──────────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-1.5">
                Curated Itineraries
              </p>
              <h2 className="text-[#12233A] leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 700 }}>
                How to Spend Your Time in Skardu
              </h2>
            </div>
            <p className="text-sm text-[#6B7280] max-w-xs text-right">
              Select an itinerary to light up the route on the map
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {mapLayers.map((layer) => {
              const enabled = activeLayers.has(layer.id);
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setActiveLayers((prev) => {
                      const next = new Set(prev);
                      next.has(layer.id) ? next.delete(layer.id) : next.add(layer.id);
                      return next;
                    });
                  }}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${enabled ? "bg-[#0E8C88] text-white" : "bg-[#F0EDE6] text-[#6B7280] hover:bg-[#EBF7F6]"}`}
                  title={layer.description}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 rounded-2xl overflow-hidden border border-[#DDD6C7] bg-white shadow-sm" style={{ minHeight: 520 }}>

            {/* Left — Itinerary list */}
            <div className="border-r border-[#DDD6C7] flex flex-col overflow-hidden">
              {/* Itinerary selector tabs */}
              <div className="border-b border-[#DDD6C7] p-4 flex flex-col gap-2">
                {ITINERARIES.map((itin) => (
                  <button
                    key={itin.id}
                    onClick={() => { setSelectedItinerary(itin.id); setExpandedStep(null); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedItinerary === itin.id
                        ? "border-[#0E8C88] bg-[#EBF7F6]"
                        : "border-[#DDD6C7] hover:border-[#0E8C88]/40 hover:bg-[#FAF8F3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Route color swatch */}
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: itin.routeColor }} />
                      <div>
                        <p className={`text-sm font-bold ${selectedItinerary === itin.id ? "text-[#12233A]" : "text-[#12233A]/70"}`}>
                          {itin.title}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">{itin.stops.length} stops · {itin.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${itin.badgeColor}`}>
                        {itin.badge}
                      </span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${selectedItinerary === itin.id ? "rotate-90 text-[#0E8C88]" : "text-[#6B7280]"}`}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected itinerary steps */}
              <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "thin" }}>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-5 border-l-2 border-[#DDD6C7] pl-3">
                  {itinerary.description}
                </p>

                <div className="space-y-1">
                  {itinerary.steps.map((step, i) => {
                    const pin = MAP_PINS.find((p) => p.id === step.pin)!;
                    const isLast = i === itinerary.steps.length - 1;
                    return (
                      <div key={i} className="relative">
                        {/* Connector line */}
                        {!isLast && (
                          <div
                            className="absolute left-[19px] top-10 w-px"
                            style={{ height: "calc(100% + 4px)", backgroundColor: itinerary.routeColor, opacity: 0.25 }}
                          />
                        )}

                        <button
                          onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                          className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                            expandedStep === i ? "bg-[#FAF8F3] border border-[#DDD6C7]" : "hover:bg-[#FAF8F3]"
                          }`}
                        >
                          {/* Step circle */}
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm"
                            style={{ backgroundColor: itinerary.routeColor }}
                          >
                            {i + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-[#12233A] leading-snug">{step.name}</p>
                              {expandedStep === i
                                ? <CheckCircle2 size={13} className="text-[#0E8C88] shrink-0" />
                                : <Circle size={13} className="text-[#DDD6C7] shrink-0" />}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] text-[#6B7280] font-medium">{step.time}</span>
                              <span className="text-[10px] text-[#DDD6C7]">·</span>
                              <span className="text-[10px] text-[#6B7280]">
                                <Clock size={9} className="inline mr-0.5" />{step.duration}
                              </span>
                            </div>

                            {/* Expanded detail */}
                            {expandedStep === i && (
                              <div className="mt-2 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: itinerary.routeColor }} />
                                <p className="text-xs text-[#6B7280] leading-relaxed">{step.note}</p>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#12233A] hover:bg-[#0E8C88] text-white text-sm font-bold transition-all">
                  <Navigation size={14} />
                  Use This Itinerary
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Right — Map */}
            <div className="p-5 flex flex-col gap-3" style={{ minHeight: 440 }}>
              {/* Map header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: itinerary.routeColor }} />
                  <span className="text-sm font-bold text-[#12233A]">{itinerary.title}</span>
                  <span className="text-xs text-[#6B7280]">— {itinerary.stops.length} stops</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Route colour legend items */}
                  {ITINERARIES.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => setSelectedItinerary(it.id)}
                      className="flex items-center gap-1.5 text-[11px] font-medium transition-opacity"
                      style={{ opacity: selectedItinerary === it.id ? 1 : 0.4 }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: it.routeColor }} />
                      {it.title.split(" ").slice(0, 2).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="flex-1" style={{ minHeight: 360 }}>
                <InteractiveMap
                  activeItinerary={selectedItinerary}
                  hoveredPin={hoveredPin}
                  onPinHover={setHoveredPin}
                  activeLayers={activeLayers}
                  pins={MAP_PINS}
                  itineraries={ITINERARIES}
                />
              </div>

              {/* Pin legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 border-t border-[#F0EDE6]">
                {itinerary.stops.map((stopId, i) => {
                  const pin = MAP_PINS.find((p) => p.id === stopId)!;
                  return (
                    <div
                      key={stopId}
                      className="flex items-center gap-1.5 cursor-pointer"
                      onMouseEnter={() => setHoveredPin(stopId)}
                      onMouseLeave={() => setHoveredPin(null)}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: itinerary.routeColor }}>
                        {i + 1}
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-medium leading-tight">{pin?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRAVEL ALERT STRIP ────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-[#E15B3F]/6 border border-[#E15B3F]/25 rounded-xl px-6 py-4">
          <ShieldCheck size={18} className="text-[#E15B3F] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#E15B3F] mb-0.5">Travel Note — Skardu</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              The Karakoram Highway and Skardu Road may be subject to seasonal road closures between November and March due to heavy snowfall. Always confirm road conditions with local authorities before departure. Altitude sickness is possible above 3,500m — acclimatise gradually.
            </p>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#DDD6C7] bg-white mt-4 py-7">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2026 Sair-e-Pakistan · City data last verified May 2026</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate("explore")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E8C88] hover:underline">
              <ChevronLeft size={13} /> Back to Explore
            </button>
            <button onClick={() => onNavigate("home")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#12233A]/50 hover:text-[#12233A] transition-colors">
              <ChevronLeft size={13} /> Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
