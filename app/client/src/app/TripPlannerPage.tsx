import { useEffect, useState, useCallback } from "react";
import {
  MapPin, Calendar, Clock, Wallet, Users, ChevronDown, ChevronRight,
  ChevronLeft, Utensils, Building2, Bus, Compass, GripVertical,
  Plus, Trash2, AlertTriangle, Star, Trophy, BookOpen, Heart,
  Map, CloudRain, Edit3, Share2, CheckCircle, Award, Globe,
  Coffee, Camera, Zap, TrendingUp, ArrowRight, X, MoreHorizontal,
  Bookmark, Navigation,
} from "lucide-react";
import type { Page } from "./App";
import {
  estimateBudget,
  fetchTripPlannerSeed,
  generateItinerary,
  loadSavedTrips,
  saveTrip,
  type SavedTrip,
} from "./travelData";

// ── Types ──────────────────────────────────────────────────────────────────
type BlockType = "attraction" | "restaurant" | "hotel" | "transit";
type ProfileTab  = "upcoming" | "wishlist" | "journal";
type CenterView  = "map" | "calendar";

interface TripBlock {
  id: string;
  type: BlockType;
  name: string;
  time: string;
  duration: string;
  costPKR: number;
  note?: string;
}
interface TripDay {
  id: string;
  label: string;
  date: string;
  city: string;
  cityCode: string;
  blocks: TripBlock[];
}

// ── Trip Data ──────────────────────────────────────────────────────────────
const INITIAL_DAYS_FALLBACK: TripDay[] = [
  {
    id: "d1", label: "Day 1", date: "Sat, 28 Jun", city: "Lahore", cityCode: "LHE",
    blocks: [
      { id: "b1", type: "hotel",      name: "Check-in — Walled City Inn",    time: "09:00", duration: "30 min", costPKR: 7500 },
      { id: "b2", type: "attraction", name: "Badshahi Mosque",                time: "10:00", duration: "1.5 hrs", costPKR: 500  },
      { id: "b3", type: "restaurant", name: "Butt Karahi — Lunch",           time: "12:00", duration: "1 hr",  costPKR: 1800 },
      { id: "b4", type: "attraction", name: "Lahore Fort & Shalimar Garden",  time: "13:30", duration: "2 hrs",  costPKR: 600  },
      { id: "b5", type: "restaurant", name: "Data Darbar area — Dinner",     time: "19:00", duration: "1 hr",  costPKR: 2000 },
    ],
  },
  {
    id: "d2", label: "Day 2", date: "Sun, 29 Jun", city: "Islamabad", cityCode: "ISB",
    blocks: [
      { id: "b6",  type: "transit",    name: "Flight LHE → ISB (PK-300)",    time: "07:30", duration: "1 hr",  costPKR: 12000 },
      { id: "b7",  type: "attraction", name: "Faisal Mosque",                 time: "10:00", duration: "1.5 hrs", costPKR: 0   },
      { id: "b8",  type: "attraction", name: "Daman-e-Koh Viewpoint",        time: "12:00", duration: "1 hr",  costPKR: 0    },
      { id: "b9",  type: "restaurant", name: "Monal Restaurant — Lunch",     time: "13:30", duration: "1.5 hrs", costPKR: 3500 },
      { id: "b10", type: "hotel",      name: "Serena Islamabad — Night",      time: "20:00", duration: "",      costPKR: 16000 },
    ],
  },
  {
    id: "d3", label: "Day 3", date: "Mon, 30 Jun", city: "Gilgit", cityCode: "GIL",
    blocks: [
      { id: "b11", type: "transit",    name: "Flight ISB → GIL (PF-404)",    time: "06:00", duration: "1.5 hrs", costPKR: 14000 },
      { id: "b12", type: "attraction", name: "Kharpocho Fort",               time: "09:30", duration: "2 hrs",  costPKR: 0    },
      { id: "b13", type: "restaurant", name: "Mashabrum Restaurant",          time: "12:30", duration: "1 hr",  costPKR: 1200 },
      { id: "b14", type: "hotel",      name: "Serena Hotel Gilgit — Night",  time: "20:00", duration: "",      costPKR: 14000 },
    ],
  },
];

const BUDGET_TOTAL = 95000;

const BLOCK_META: Record<BlockType, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  attraction: { icon: <Compass size={13} />,   color: "text-[#0E8C88]",  bg: "bg-[#EBF7F6]",  border: "border-[#0E8C88]/20"  },
  restaurant: { icon: <Utensils size={13} />,  color: "text-[#E8A33D]",  bg: "bg-amber-50",   border: "border-amber-200"     },
  hotel:      { icon: <Building2 size={13} />, color: "text-[#8B5CF6]",  bg: "bg-purple-50",  border: "border-purple-200"    },
  transit:    { icon: <Bus size={13} />,       color: "text-[#E15B3F]",  bg: "bg-orange-50",  border: "border-orange-200"    },
};

// ── City map coords for Pakistan SVG ──────────────────────────────────────
const CITY_PINS = [
  { code: "LHE", label: "Lahore",     x: 238, y: 188, day: "Day 1" },
  { code: "ISB", label: "Islamabad",  x: 202, y: 142, day: "Day 2" },
  { code: "GIL", label: "Gilgit",     x: 190, y:  72, day: "Day 3" },
];

// ── Journal feed photos ────────────────────────────────────────────────────
const JOURNAL_PHOTOS = [
  { id:1,  img: "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=340&h=420&fit=crop&auto=format", label: "Hunza Valley", date: "Apr 2026",  span: "row-span-2" },
  { id:2,  img: "https://images.unsplash.com/photo-1695724426547-c695ce34c358?w=340&h=200&fit=crop&auto=format", label: "KKH Highway",   date: "Mar 2026", span: "" },
  { id:3,  img: "https://images.unsplash.com/photo-1769256125192-dd29d364a7ef?w=340&h=200&fit=crop&auto=format", label: "Skardu Peaks",  date: "Feb 2026", span: "" },
  { id:4,  img: "https://images.unsplash.com/photo-1632309378201-14f05412c697?w=340&h=420&fit=crop&auto=format", label: "K2 Glacier",    date: "Nov 2025", span: "row-span-2" },
  { id:5,  img: "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?w=340&h=200&fit=crop&auto=format", label: "Indus River",   date: "Oct 2025", span: "" },
  { id:6,  img: "https://images.unsplash.com/photo-1669006270959-aa7f7f0695d5?w=340&h=200&fit=crop&auto=format", label: "Swat Valley",   date: "Sep 2025", span: "" },
  { id:7,  img: "https://images.unsplash.com/photo-1760636430788-5e1e8c282a4a?w=340&h=200&fit=crop&auto=format", label: "Chitral Pass",  date: "Aug 2025", span: "" },
  { id:8,  img: "https://images.unsplash.com/photo-1683527394144-d85a1436601c?w=340&h=200&fit=crop&auto=format", label: "Attabad Lake",  date: "Jul 2025", span: "" },
  { id:9,  img: "https://images.unsplash.com/photo-1584562995253-9de7c2a45982?w=340&h=200&fit=crop&auto=format", label: "Gilgit River",  date: "Jun 2025", span: "" },
];

const UPCOMING_TRIPS = [
  { id: 1, title: "Northern Pakistan Expedition", dates: "Jun 28 – Jul 2, 2026", cities: ["Lahore","Islamabad","Gilgit"], status: "active", img: "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=240&h=160&fit=crop&auto=format", days: 5, budget: 95000 },
  { id: 2, title: "Sindh Heritage Circuit", dates: "Aug 15 – 20, 2026", cities: ["Karachi","Thatta","Sukkur"], status: "planned", img: "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=240&h=160&fit=crop&auto=format", days: 6, budget: 60000 },
];

const WISHLIST = [
  { id:1, name: "Deosai Plains Trek",         cat: "Adventure",     img: "https://images.unsplash.com/photo-1668197091449-0a2b87ef7650?w=180&h=120&fit=crop&auto=format", rating: 5.0 },
  { id:2, name: "Kalash Valleys Festival",    cat: "Cultural",      img: "https://images.unsplash.com/photo-1782931024365-1f68d52a89ee?w=180&h=120&fit=crop&auto=format", rating: 4.9 },
  { id:3, name: "Mohenjo-daro Ruins",         cat: "Historical",    img: "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=180&h=120&fit=crop&auto=format", rating: 4.9 },
  { id:4, name: "Fairy Meadows Trek",         cat: "Nature",        img: "https://images.unsplash.com/photo-1637679149566-6af21b6e933a?w=180&h=120&fit=crop&auto=format", rating: 4.9 },
  { id:5, name: "Malam Jabba Ski Resort",     cat: "Adventure",     img: "https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=180&h=120&fit=crop&auto=format", rating: 4.6 },
  { id:6, name: "Neelum Valley",              cat: "Nature",        img: "https://images.unsplash.com/photo-1691075622149-2f2c4e02b7cf?w=180&h=120&fit=crop&auto=format", rating: 4.9 },
];

// ── Pakistan SVG Map ────────────────────────────────────────────────────────
function PakistanMap({ days, activeDay }: { days: TripDay[]; activeDay: string }) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const activeIdx = days.findIndex(d => d.id === activeDay);

  return (
    <svg viewBox="0 0 300 340" className="w-full h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <defs>
        <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8D4E0" />
          <stop offset="100%" stopColor="#C8E0C8" />
        </linearGradient>
        <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C8B99A" />
          <stop offset="50%" stopColor="#B8C8A0" />
          <stop offset="100%" stopColor="#A8B890" />
        </linearGradient>
        <filter id="cityGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Ocean / background */}
      <rect width="300" height="340" fill="url(#mapBg)" />

      {/* Pakistan main body */}
      <path d="M 90,38 L 118,20 L 158,18 L 195,28 L 232,22 L 265,52 L 275,90 L 265,145 L 255,200 L 245,258 L 218,292 L 185,308 L 135,306 L 90,288 L 62,258 L 48,218 L 42,168 L 48,108 L 68,68 Z" fill="url(#terrainGrad)" stroke="#A89878" strokeWidth="1" />

      {/* Northern highlands */}
      <path d="M 90,38 L 118,20 L 158,18 L 195,28 L 232,22 L 265,52 L 250,80 L 220,65 L 195,72 L 175,58 L 148,68 L 120,80 L 95,72 Z" fill="#9BADB8" opacity="0.5" />

      {/* Snow on northern peaks */}
      <path d="M 158,18 L 195,28 L 232,22 L 248,40 L 220,35 L 192,42 L 165,32 Z" fill="#E8F0F5" opacity="0.6" />

      {/* Indus river */}
      <path d="M 192,70 C 198,100 196,130 198,160 C 200,190 205,220 210,255 C 212,270 208,285 200,295" fill="none" stroke="#5BA3C9" strokeWidth="2.5" opacity="0.55" />

      {/* Province borders (faint) */}
      <path d="M 48,168 L 155,165 L 198,160 L 240,165" fill="none" stroke="#A89878" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />
      <path d="M 155,165 L 150,250 L 135,306" fill="none" stroke="#A89878" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />

      {/* Arabian Sea */}
      <path d="M 90,288 L 135,306 L 185,308 L 218,292 L 235,310 L 270,330 L 200,340 L 50,340 L 30,310 L 62,258 Z" fill="#5BA3C9" opacity="0.3" />
      <text x="145" y="328" fill="#2A6A9A" fontSize="7.5" fontWeight="600" textAnchor="middle" opacity="0.7">Arabian Sea</text>

      {/* Route line */}
      <path
        d={`M ${CITY_PINS[0].x} ${CITY_PINS[0].y} L ${CITY_PINS[1].x} ${CITY_PINS[1].y} L ${CITY_PINS[2].x} ${CITY_PINS[2].y}`}
        fill="none" stroke="#0E8C88" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.7"
      />
      {/* Direction arrows */}
      {[[CITY_PINS[0], CITY_PINS[1]], [CITY_PINS[1], CITY_PINS[2]]].map(([a, b], i) => {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        return <g key={i} transform={`translate(${mx},${my}) rotate(${angle})`}>
          <polygon points="0,-3.5 7,0 0,3.5" fill="#0E8C88" opacity="0.8" />
        </g>;
      })}

      {/* City pins */}
      {CITY_PINS.map((pin, i) => {
        const isActive = days[activeIdx]?.cityCode === pin.code;
        const hovered = hoveredCity === pin.code;
        return (
          <g key={pin.code} onMouseEnter={() => setHoveredCity(pin.code)} onMouseLeave={() => setHoveredCity(null)} style={{ cursor: "pointer" }}>
            {(isActive || hovered) && <circle cx={pin.x} cy={pin.y} r="16" fill="#0E8C88" opacity="0.15" />}
            <circle cx={pin.x} cy={pin.y} r={isActive ? 13 : 10} fill={isActive ? "#0E8C88" : "white"} stroke={isActive ? "#0B7874" : "#6B7280"} strokeWidth={isActive ? 2 : 1.5} filter={isActive ? "url(#cityGlow)" : undefined} />
            <circle cx={pin.x} cy={pin.y} r={isActive ? 10 : 7} fill={isActive ? "white" : "#CBD5E1"} />
            <circle cx={pin.x} cy={pin.y} r={isActive ? 6 : 4} fill={isActive ? "#0E8C88" : "#94A3B8"} />
            <text x={pin.x} y={pin.y + 3} textAnchor="middle" fill={isActive ? "white" : "#64748B"} fontSize={isActive ? "8" : "7"} fontWeight="800">{i+1}</text>
            <text x={pin.x + 16} y={pin.y - 4} fill={isActive ? "#0E8C88" : "#334155"} fontSize="8.5" fontWeight={isActive ? "700" : "500"}>{pin.label}</text>
            <text x={pin.x + 16} y={pin.y + 7} fill="#64748B" fontSize="7">{pin.day}</text>
          </g>
        );
      })}

      {/* Compass */}
      <g transform="translate(272,22)">
        <circle cx="0" cy="0" r="12" fill="white" opacity="0.85" />
        <text x="0" y="-4" textAnchor="middle" fill="#12233A" fontSize="7" fontWeight="700">N</text>
        <path d="M 0 -9 L 2.5 0 L 0 4 L -2.5 0 Z" fill="#12233A" />
        <path d="M 0 9 L 2.5 0 L 0 -4 L -2.5 0 Z" fill="#94A3B8" opacity="0.5" />
      </g>
    </svg>
  );
}

// ── Calendar View ───────────────────────────────────────────────────────────
function CalendarView({ days }: { days: TripDay[] }) {
  const hours = [7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  const typeColors: Record<BlockType, string> = {
    attraction: "#0E8C88", restaurant: "#E8A33D", hotel: "#8B5CF6", transit: "#E15B3F"
  };
  return (
    <div className="overflow-auto h-full">
      <div className="flex text-xs font-bold text-white/60 mb-1 pl-10 gap-0">
        {days.map(d => (
          <div key={d.id} className="flex-1 text-center py-2 border-b border-white/10">
            <span className="text-white/90">{d.label}</span>
            <span className="block text-[10px] text-white/40">{d.date} · {d.city}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col w-10 shrink-0">
          {hours.map(h => (
            <div key={h} className="text-[9px] text-white/30 text-right pr-2 font-mono" style={{ height: 28 }}>
              {h}:00
            </div>
          ))}
        </div>
        {/* Day columns */}
        {days.map(day => (
          <div key={day.id} className="flex-1 border-l border-white/5 relative">
            {hours.map(h => (
              <div key={h} className="border-b border-white/5" style={{ height: 28 }} />
            ))}
            {day.blocks.map(block => {
              const [hStr, mStr] = block.time.split(":");
              const hh = parseInt(hStr), mm = parseInt(mStr||"0");
              const top = (hh - 7) * 28 + (mm / 60) * 28;
              const durationMins = parseInt(block.duration) * (block.duration.includes("hr") ? 60 : 1) || 60;
              const height = Math.max((durationMins / 60) * 28, 22);
              return (
                <div
                  key={block.id}
                  className="absolute left-1 right-1 rounded overflow-hidden px-1.5 py-0.5 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ top, height, backgroundColor: typeColors[block.type], opacity: 0.88 }}
                >
                  <p className="text-white font-semibold leading-none" style={{ fontSize: 9 }}>{block.name}</p>
                  <p className="text-white/75 leading-none" style={{ fontSize: 8 }}>{block.time}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function TripPlannerPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [days, setDays] = useState<TripDay[]>(INITIAL_DAYS_FALLBACK);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(["d1","d2","d3"]));
  const [activeDay, setActiveDay] = useState("d1");
  const [centerView, setCenterView] = useState<CenterView>("map");
  const [groupSize, setGroupSize] = useState(2);
  const [profileTab, setProfileTab] = useState<ProfileTab>("upcoming");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [dragItem, setDragItem] = useState<{dayId:string;blockId:string}|null>(null);
  const [dragOverId, setDragOverId] = useState<string|null>(null);
  const [tripSaved, setTripSaved] = useState(false);
  const [destinationInput, setDestinationInput] = useState("Lahore");
  const [tripLengthInput, setTripLengthInput] = useState(3);
  const [budgetInput, setBudgetInput] = useState(BUDGET_TOTAL);

  useEffect(() => {
    void fetchTripPlannerSeed().then((seed) => {
      const persistedTrips = seed.savedTrips.length > 0 ? seed.savedTrips : loadSavedTrips();
      setSavedTrips(persistedTrips);

      const restoredTrip = persistedTrips[0];
      if (restoredTrip?.days?.length) {
        setDays(restoredTrip.days);
        setActiveDay(restoredTrip.days[0].id);
        setDestinationInput(restoredTrip.destination);
      } else {
        setDays(INITIAL_DAYS_FALLBACK);
      }
    });
  }, []);

  const handleGenerateTrip = () => {
    const generatedDays = generateItinerary({
      destination: destinationInput.trim() || "Lahore",
      days: tripLengthInput,
      budgetPKR: budgetInput,
      groupSize,
    });
    setDays(generatedDays);
    setActiveDay(generatedDays[0]?.id ?? "d1");
    setExpandedDays(new Set(generatedDays.map((day) => day.id)));
    setTripSaved(false);
  };

  const handleSaveTrip = () => {
    const budget = estimateBudget(days, groupSize);
    const trip: SavedTrip = {
      id: crypto.randomUUID(),
      title: `${destinationInput || days[0]?.city || "Trip"} itinerary`,
      destination: destinationInput || days[0]?.city || "Trip",
      days,
      budget,
      createdAt: new Date().toISOString(),
    };
    saveTrip(trip);
    setSavedTrips(loadSavedTrips());
    setTripSaved(true);
  };

  // Derived budget
  const allBlocks = days.flatMap(d => d.blocks);
  const totalSpend = allBlocks.reduce((s, b) => s + b.costPKR, 0) * groupSize;
  const categories = [
    { label: "Accommodation", icon: <Building2 size={13}/>, color: "#8B5CF6", allocated: 55000, spent: days.flatMap(d=>d.blocks).filter(b=>b.type==="hotel").reduce((s,b)=>s+b.costPKR,0)*groupSize },
    { label: "Transport",     icon: <Bus size={13}/>,       color: "#E15B3F", allocated: 35000, spent: days.flatMap(d=>d.blocks).filter(b=>b.type==="transit").reduce((s,b)=>s+b.costPKR,0)*groupSize },
    { label: "Food",          icon: <Utensils size={13}/>,  color: "#E8A33D", allocated: 20000, spent: days.flatMap(d=>d.blocks).filter(b=>b.type==="restaurant").reduce((s,b)=>s+b.costPKR,0)*groupSize },
    { label: "Attractions",   icon: <Compass size={13}/>,   color: "#0E8C88", allocated: 10000, spent: days.flatMap(d=>d.blocks).filter(b=>b.type==="attraction").reduce((s,b)=>s+b.costPKR,0)*groupSize },
  ];
  const budgetUsedPct = Math.min((totalSpend / BUDGET_TOTAL) * 100, 100);
  const budgetWarning = budgetUsedPct >= 85;

  const toggleDay = (id: string) => setExpandedDays(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  // Drag-and-drop within a day
  const handleDragStart = useCallback((dayId: string, blockId: string) => setDragItem({dayId, blockId}), []);
  const handleDragOver = useCallback((e: React.DragEvent, blockId: string) => { e.preventDefault(); setDragOverId(blockId); }, []);
  const handleDrop = useCallback((dayId: string, targetId: string) => {
    if (!dragItem || dragItem.dayId !== dayId) return;
    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d;
      const blocks = [...d.blocks];
      const fromIdx = blocks.findIndex(b => b.id === dragItem.blockId);
      const toIdx   = blocks.findIndex(b => b.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return d;
      const [moved] = blocks.splice(fromIdx, 1);
      blocks.splice(toIdx, 0, moved);
      return { ...d, blocks };
    }));
    setDragItem(null); setDragOverId(null);
  }, [dragItem]);

  const removeBlock = (dayId: string, blockId: string) =>
    setDays(prev => prev.map(d => d.id !== dayId ? d : { ...d, blocks: d.blocks.filter(b => b.id !== blockId) }));

  return (
    <div className="bg-[#FAF8F3] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#DDD6C7] px-8 lg:px-12 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-xs text-[#6B7280]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#0E8C88] transition-colors">Home</button>
          <ChevronRight size={11} />
          <span className="text-[#12233A] font-semibold">Trip Planner</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-6 space-y-8">

        {/* Trip header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-bold text-[#0E8C88] bg-[#EBF7F6] border border-[#0E8C88]/20 uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Zap size={9} /> Active Plan
              </span>
              <span className="text-[10px] text-[#6B7280]">{days.length} days · {allBlocks.length} activities · {groupSize} traveller{groupSize>1?"s":""}</span>
            </div>
            <h1 className="text-[#12233A] font-black leading-tight" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,2.8vw,2.2rem)" }}>
              Northern Pakistan Expedition
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5 flex items-center gap-1.5">
              <Calendar size={12}/> Sat 28 Jun – Wed 2 Jul 2026
              <span className="text-[#DDD6C7]">·</span>
              <MapPin size={12} className="text-[#0E8C88]"/> Lahore → Islamabad → Gilgit
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onNavigate("place")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD6C7] bg-white text-xs font-semibold text-[#12233A] hover:border-[#0E8C88] transition-all">
              <Plus size={13} className="text-[#0E8C88]"/> Add Place
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD6C7] bg-white text-xs font-semibold text-[#12233A] hover:border-[#12233A] transition-all">
              <Share2 size={13}/> Share
            </button>
            <button onClick={handleSaveTrip} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${tripSaved ? "bg-[#0E8C88] border-[#0E8C88] text-white" : "bg-[#12233A] border-[#12233A] text-white hover:bg-[#1a3150]"}`}>
              <CheckCircle size={13}/> {tripSaved ? "Saved" : "Save Trip"}
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_0.9fr] gap-4 rounded-2xl border border-[#DDD6C7] bg-white p-5 shadow-sm">
          <label className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Destination</span>
            <input value={destinationInput} onChange={(event) => setDestinationInput(event.target.value)} className="w-full rounded-xl border border-[#DDD6C7] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]" placeholder="Lahore, Skardu, Hunza" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Days</span>
            <input type="number" min={1} max={10} value={tripLengthInput} onChange={(event) => setTripLengthInput(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} className="w-full rounded-xl border border-[#DDD6C7] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Budget PKR</span>
            <div className="flex items-center gap-2">
              <input type="number" min={0} value={budgetInput} onChange={(event) => setBudgetInput(Number(event.target.value) || 0)} className="w-full rounded-xl border border-[#DDD6C7] px-4 py-3 text-sm outline-none focus:border-[#0E8C88]" />
              <button onClick={handleGenerateTrip} className="rounded-xl bg-[#0E8C88] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#0B7874]">
                Generate
              </button>
            </div>
          </label>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {savedTrips.length > 0 ? savedTrips.map((trip) => (
            <button
              key={trip.id}
              onClick={() => {
                setDays(trip.days);
                setActiveDay(trip.days[0]?.id ?? "d1");
                setDestinationInput(trip.destination);
              }}
              className="rounded-2xl border border-[#DDD6C7] bg-white p-4 text-left shadow-sm transition-all hover:border-[#0E8C88] hover:shadow-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0E8C88]">Saved trip</p>
              <p className="mt-2 text-sm font-bold text-[#12233A]">{trip.title}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{trip.destination} · {trip.days.length} days · PKR {trip.budget.total.toLocaleString()}</p>
            </button>
          )) : (
            <div className="rounded-2xl border border-dashed border-[#DDD6C7] bg-white p-4 text-sm text-[#6B7280]">
              Saved trips will appear here after you click Save Trip.
            </div>
          )}
        </section>

        {/* ── THREE-PANEL LAYOUT ─────────────────────────────────────── */}
        <div className="grid grid-cols-[30%_1fr_25%] gap-0 rounded-2xl overflow-hidden border border-[#DDD6C7] shadow-md" style={{ minHeight: 680 }}>

          {/* ═══ LEFT PANEL — Navy Timeline ══════════════════════════ */}
          <aside className="bg-[#12233A] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-white font-bold text-sm">Trip Timeline</p>
                <button className="text-white/40 hover:text-white/70 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-white/35 text-[10px]">{days.length} days · Drag blocks to reorder</p>
            </div>

            {/* Day tree */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2" style={{ scrollbarWidth:"none" }}>
              {days.map((day, di) => {
                const expanded = expandedDays.has(day.id);
                const isActive = activeDay === day.id;
                const dayTotal = day.blocks.reduce((s,b)=>s+b.costPKR,0) * groupSize;
                return (
                  <div key={day.id} className={`rounded-xl overflow-hidden border transition-all ${isActive ? "border-[#0E8C88]/50" : "border-white/8"}`}>
                    {/* Day header */}
                    <button
                      onClick={() => { setActiveDay(day.id); toggleDay(day.id); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors ${isActive ? "bg-[#0E8C88]/15" : "bg-white/4 hover:bg-white/7"}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${isActive ? "bg-[#0E8C88] text-white" : "bg-white/10 text-white/60"}`}>
                        {di+1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-white/75"}`}>{day.label} — {day.city}</p>
                        <p className="text-[10px] text-white/35">{day.date} · {day.blocks.length} stops · PKR {dayTotal.toLocaleString()}</p>
                      </div>
                      <ChevronDown size={13} className={`text-white/30 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
                    </button>

                    {/* Blocks */}
                    {expanded && (
                      <div className="px-3 pb-3 pt-1 space-y-1.5 bg-white/2">
                        {day.blocks.map((block, bi) => {
                          const meta = BLOCK_META[block.type];
                          const isDragging = dragItem?.blockId === block.id;
                          const isOver = dragOverId === block.id;
                          return (
                            <div
                              key={block.id}
                              draggable
                              onDragStart={() => handleDragStart(day.id, block.id)}
                              onDragOver={(e) => handleDragOver(e, block.id)}
                              onDrop={() => handleDrop(day.id, block.id)}
                              onDragEnd={() => { setDragItem(null); setDragOverId(null); }}
                              className={`flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing group transition-all ${isDragging ? "opacity-40 scale-95" : isOver ? "ring-1 ring-[#0E8C88]/60 bg-white/8" : "bg-white/5 hover:bg-white/8"}`}
                            >
                              <GripVertical size={12} className="text-white/15 shrink-0 mt-0.5 group-hover:text-white/40 transition-colors" />
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}>
                                <span className={meta.color}>{meta.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white/85 text-xs font-semibold leading-snug truncate">{block.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-white/30 text-[10px]">{block.time}</span>
                                  {block.duration && <span className="text-white/25 text-[10px]">· {block.duration}</span>}
                                  {block.costPKR > 0 && <span className="text-[#E8A33D] text-[10px] font-medium">PKR {block.costPKR.toLocaleString()}</span>}
                                </div>
                              </div>
                              <button onClick={() => removeBlock(day.id, block.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#E15B3F] transition-all ml-0.5 shrink-0">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          );
                        })}

                        {/* Add block button */}
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/12 text-white/30 text-xs font-medium hover:border-white/25 hover:text-white/50 transition-all">
                          <Plus size={12} /> Add activity to {day.label}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Day */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/12 text-white/25 text-xs font-semibold hover:border-[#0E8C88]/40 hover:text-white/50 transition-all">
                <Plus size={13} /> Add Day
              </button>
            </div>

            {/* Sidebar footer */}
            <div className="px-5 py-4 border-t border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-[#0E8C88]" />
                <span className="text-white/50 text-xs">Group:</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setGroupSize(g=>Math.max(1,g-1))} className="w-5 h-5 rounded bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/15 text-xs">-</button>
                  <span className="text-white font-bold text-xs w-4 text-center">{groupSize}</span>
                  <button onClick={() => setGroupSize(g=>Math.min(10,g+1))} className="w-5 h-5 rounded bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/15 text-xs">+</button>
                </div>
              </div>
              <span className="text-[#0E8C88] text-xs font-bold">PKR {totalSpend.toLocaleString()}</span>
            </div>
          </aside>

          {/* ═══ CENTER PANEL — Map / Calendar ═══════════════════════ */}
          <div className="bg-[#1A2D42] flex flex-col overflow-hidden border-l border-r border-white/5">
            {/* Center header */}
            <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm">Route Overview</p>
                <span className="text-[10px] text-white/35">{CITY_PINS.length} destinations</span>
              </div>
              <div className="flex items-center bg-white/8 rounded-lg p-0.5 gap-0.5">
                <button onClick={() => setCenterView("map")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${centerView==="map" ? "bg-[#0E8C88] text-white" : "text-white/45 hover:text-white/70"}`}>
                  <Map size={12} /> Map
                </button>
                <button onClick={() => setCenterView("calendar")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${centerView==="calendar" ? "bg-[#0E8C88] text-white" : "text-white/45 hover:text-white/70"}`}>
                  <Calendar size={12} /> Timeline
                </button>
              </div>
            </div>

            {/* Coral alert box */}
            {!alertDismissed && (
              <div className="mx-4 mt-4 flex items-start gap-3 bg-[#E15B3F]/12 border border-[#E15B3F]/35 rounded-xl px-4 py-3">
                <AlertTriangle size={15} className="text-[#E15B3F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#E15B3F] text-xs font-bold mb-0.5">⚠ Live Road Advisory — KKH (N-35)</p>
                  <p className="text-white/55 text-[11px] leading-relaxed">Landslide reported near Raikot Bridge (km 342). Alternate route via Chilas recommended. Expect 2–3 hr delay. <span className="text-[#E8A33D] font-semibold">Day 3 may be affected.</span></p>
                </div>
                <button onClick={() => setAlertDismissed(true)} className="text-white/25 hover:text-white/60 shrink-0">
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Weather strip */}
            <div className="mx-4 mt-3 flex items-center gap-0 bg-white/4 rounded-xl overflow-hidden">
              {[
                { city:"Lahore",    icon:<CloudRain size={12}/>, temp:"36°C", cond:"Partly Cloudy" },
                { city:"Islamabad", icon:<CloudRain size={12}/>, temp:"29°C", cond:"Overcast"      },
                { city:"Gilgit",    icon:<CloudRain size={12}/>, temp:"22°C", cond:"Clear & Cool"  },
              ].map((w,i) => (
                <div key={i} className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 ${i<2?"border-r border-white/5":""}`}>
                  <div className="text-[#E8A33D]">{w.icon}</div>
                  <div>
                    <p className="text-white/80 text-xs font-semibold">{w.city}</p>
                    <p className="text-white/35 text-[10px]">{w.temp} · {w.cond}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map / Calendar area */}
            <div className="flex-1 overflow-hidden m-4 mt-3 rounded-xl" style={{ minHeight: 340 }}>
              {centerView === "map" ? (
                <div className="bg-[#0D1F30] rounded-xl overflow-hidden h-full border border-white/5">
                  <PakistanMap days={days} activeDay={activeDay} />
                </div>
              ) : (
                <div className="bg-[#0D1F30] rounded-xl overflow-hidden h-full border border-white/5 p-3">
                  <CalendarView days={days} />
                </div>
              )}
            </div>

            {/* Route step indicators */}
            <div className="px-4 pb-4 flex items-center gap-0">
              {CITY_PINS.map((pin, i) => (
                <div key={pin.code} className="flex items-center flex-1">
                  <button
                    onClick={() => setActiveDay(days[i]?.id || "d1")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${activeDay===days[i]?.id ? "bg-[#0E8C88]/20 border border-[#0E8C88]/30" : "hover:bg-white/5"}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${activeDay===days[i]?.id ? "bg-[#0E8C88] text-white" : "bg-white/10 text-white/40"}`}>
                      {i+1}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-semibold ${activeDay===days[i]?.id?"text-white":"text-white/45"}`}>{pin.label}</p>
                      <p className="text-[10px] text-white/25">{pin.day}</p>
                    </div>
                  </button>
                  {i < CITY_PINS.length - 1 && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="h-px w-full bg-white/10" />
                      <ArrowRight size={10} className="text-white/20 shrink-0 mx-0.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT PANEL — Budget ════════════════════════════════ */}
          <div className="bg-white border-l border-[#DDD6C7] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDD6C7]">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[#12233A] font-bold text-sm">Budget Tracker</p>
                <Wallet size={15} className="text-[#0E8C88]" />
              </div>
              <p className="text-[10px] text-[#6B7280]">{groupSize} person{groupSize>1?"s":""} · PKR</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth:"thin" }}>
              {/* Total budget ring */}
              <div className="bg-[#FAF8F3] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Total Budget</span>
                  {budgetWarning && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#E15B3F] bg-[#E15B3F]/8 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={9}/> {Math.round(budgetUsedPct)}%
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-[#12233A] font-black leading-none" style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem" }}>
                    {totalSpend.toLocaleString()}
                  </span>
                  <span className="text-[#6B7280] text-xs mb-0.5">/ {BUDGET_TOTAL.toLocaleString()} PKR</span>
                </div>
                {/* Main progress bar */}
                <div className="w-full bg-[#F0EDE6] rounded-full overflow-hidden" style={{ height: 10 }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width:`${budgetUsedPct}%`, backgroundColor: budgetWarning ? "#E15B3F" : "#0E8C88" }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-[#6B7280]">Spent</span>
                  <span className={`text-[10px] font-bold ${budgetWarning ? "text-[#E15B3F]" : "text-[#0E8C88]"}`}>
                    PKR {(BUDGET_TOTAL - totalSpend).toLocaleString()} left
                  </span>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">By Category</p>
                {categories.map((cat) => {
                  const pct = Math.min((cat.spent / cat.allocated) * 100, 100);
                  const over = pct >= 100;
                  return (
                    <div key={cat.label} className="bg-[#FAF8F3] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                            <span style={{ color: cat.color }}>{cat.icon}</span>
                          </div>
                          <span className="text-xs font-semibold text-[#12233A]">{cat.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#12233A]">{cat.spent.toLocaleString()}</span>
                          <span className="text-[10px] text-[#6B7280]">/{cat.allocated.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#F0EDE6] rounded-full overflow-hidden" style={{ height: 6 }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, backgroundColor: over ? "#E15B3F" : cat.color }} />
                      </div>
                      {over && (
                        <p className="text-[9px] text-[#E15B3F] font-semibold mt-1 flex items-center gap-1">
                          <AlertTriangle size={8}/> Over by PKR {(cat.spent - cat.allocated).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Per-person breakdown */}
              <div className="bg-[#12233A] rounded-2xl p-4">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-3">Per Person</p>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.label} className="flex items-center justify-between">
                      <span className="text-white/55 text-xs">{cat.label}</span>
                      <span className="text-white text-xs font-bold tabular-nums">PKR {Math.round(cat.spent/groupSize).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                    <span className="text-white text-xs font-bold">Total / person</span>
                    <span className="text-[#0E8C88] text-sm font-black">PKR {Math.round(totalSpend/groupSize).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Itemized list */}
              <div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Itemized Costs</p>
                <div className="space-y-1">
                  {allBlocks.filter(b => b.costPKR > 0).map(block => (
                    <div key={block.id} className="flex items-center justify-between py-1.5 border-b border-[#F0EDE6]">
                      <div className="flex items-center gap-1.5">
                        <span className={BLOCK_META[block.type].color}>{BLOCK_META[block.type].icon}</span>
                        <span className="text-xs text-[#12233A] font-medium truncate max-w-[140px]">{block.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#12233A] tabular-nums shrink-0">
                        {(block.costPKR * groupSize).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROFILE DASHBOARD SECTION ──────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-[#DDD6C7]" />
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest px-3 whitespace-nowrap">Traveller Profile & Journal</span>
            <div className="flex-1 border-t border-[#DDD6C7]" />
          </div>

          {/* Profile header card */}
          <div className="bg-white border border-[#DDD6C7] rounded-2xl overflow-hidden shadow-sm">
            {/* Cover gradient */}
            <div className="h-28 relative overflow-hidden" style={{ background:"linear-gradient(135deg, #12233A 0%, #0E8C88 60%, #1a3a4a 100%)" }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage:"radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize:"20px 20px" }} />
              {/* Cover stats strip */}
              <div className="absolute bottom-3 right-5 flex items-center gap-4">
                {[
                  { val:"7",  lbl:"Cities",   icon:<Globe size={10}/> },
                  { val:"12", lbl:"Reviews",  icon:<Star size={10}/>  },
                  { val:"4",  lbl:"Trips",    icon:<Map size={10}/>   },
                  { val:"3",  lbl:"Badges",   icon:<Award size={10}/> },
                ].map(s => (
                  <div key={s.lbl} className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-white/50">{s.icon}</div>
                    <span className="text-white font-black text-base leading-none">{s.val}</span>
                    <span className="text-white/40 text-[9px] leading-none mt-0.5">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-7 pb-6">
              <div className="flex items-end justify-between -mt-8 mb-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white bg-[#0E8C88] flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ fontFamily:"'Playfair Display',serif" }}>ZA</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C7] text-xs font-semibold text-[#12233A] hover:border-[#12233A] transition-all">
                    <Edit3 size={11}/> Edit Profile
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#0E8C88] text-white text-xs font-bold hover:bg-[#0B7874] transition-all">
                    + Follow
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-[#12233A] font-bold text-lg leading-tight" style={{ fontFamily:"'Playfair Display',serif" }}>Zara Ahmed</h2>
                  <p className="text-[#6B7280] text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin size={11} className="text-[#0E8C88]"/> Lahore, Pakistan
                    <span className="text-[#DDD6C7]">·</span>
                    <Globe size={11} /> Member since Jan 2024
                  </p>
                  <p className="text-sm text-[#6B7280] mt-2 max-w-md leading-relaxed">
                    Architecture graduate & weekend explorer. Passionate about Pakistan's untouched northern landscapes and ancient Mughal heritage. 4 complete journeys documented.
                  </p>
                </div>

                {/* Badge collection */}
                <div className="shrink-0">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Achievement Badges</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { icon:<Trophy size={14}/>,  label:"Elite Guide",     color:"bg-[#E8A33D] text-white",       earned:true  },
                      { icon:<Award size={14}/>,   label:"7 Cities",        color:"bg-[#0E8C88] text-white",       earned:true  },
                      { icon:<Star size={14}/>,    label:"Top Reviewer",    color:"bg-[#8B5CF6] text-white",       earned:true  },
                      { icon:<Camera size={14}/>,  label:"Photo Explorer",  color:"bg-[#E15B3F] text-white",       earned:false },
                      { icon:<Zap size={14}/>,     label:"Speed Planner",   color:"bg-gray-200 text-gray-400",     earned:false },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        title={badge.label}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-white shadow-sm transition-all hover:scale-105 ${badge.earned ? badge.color : "bg-[#F0EDE6] text-[#C0B8AE] border-[#DDD6C7]"}`}
                      >
                        {badge.icon}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1.5">3/5 badges earned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed section */}
          <div className="bg-white border border-[#DDD6C7] rounded-2xl overflow-hidden shadow-sm">
            {/* Tabs */}
            <div className="flex items-stretch border-b border-[#DDD6C7]">
              {([
                { id:"upcoming", label:"My Upcoming Trips",  icon:<Calendar size={14}/> },
                { id:"wishlist", label:"Saved Wishlists",    icon:<Heart size={14}/>    },
                { id:"journal",  label:"Travel Journal Feed",icon:<BookOpen size={14}/> },
              ] as {id:ProfileTab;label:string;icon:React.ReactNode}[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`flex items-center gap-2 px-7 py-4 text-sm font-semibold border-b-2 transition-all ${profileTab===tab.id ? "border-[#0E8C88] text-[#0E8C88] bg-[#EBF7F6]/30" : "border-transparent text-[#12233A]/50 hover:text-[#12233A]"}`}
                >
                  <span className={profileTab===tab.id?"text-[#0E8C88]":"text-[#6B7280]"}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-7">

              {/* ── UPCOMING TRIPS ────────────────────────────────── */}
              {profileTab === "upcoming" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {UPCOMING_TRIPS.map(trip => (
                    <div
                      key={trip.id}
                      className={`rounded-2xl overflow-hidden border cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${trip.status==="active" ? "border-[#0E8C88]/40 ring-1 ring-[#0E8C88]/20" : "border-[#DDD6C7]"}`}
                    >
                      <div className="relative h-36 bg-[#F0EDE6] overflow-hidden">
                        <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${trip.status==="active" ? "bg-[#0E8C88] text-white" : "bg-white/80 text-[#12233A]"}`}>
                            {trip.status==="active" ? "✈ Active Plan" : "Planned"}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                            <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily:"'Playfair Display',serif" }}>{trip.title}</p>
                            <p className="text-white/65 text-xs mt-0.5"><Calendar size={9} className="inline mr-0.5"/>{trip.dates}</p>
                          </div>
                          <span className="text-white/55 text-xs">{trip.days}d</span>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {trip.cities.map(c => (
                            <span key={c} className="text-[10px] font-medium text-[#6B7280] bg-[#F0EDE6] px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#12233A]">PKR {trip.budget.toLocaleString()}</span>
                          {trip.status === "active" && (
                            <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="text-xs font-bold text-[#0E8C88] flex items-center gap-1 hover:gap-1.5 transition-all">
                              Open <ChevronRight size={11}/>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* New trip card */}
                  <div className="rounded-2xl border-2 border-dashed border-[#DDD6C7] flex flex-col items-center justify-center py-10 gap-3 cursor-pointer hover:border-[#0E8C88] hover:bg-[#EBF7F6]/20 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-[#F0EDE6] group-hover:bg-[#EBF7F6] flex items-center justify-center transition-colors">
                      <Plus size={20} className="text-[#6B7280] group-hover:text-[#0E8C88] transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#12233A]/70 group-hover:text-[#0E8C88] transition-colors">Plan a New Trip</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">AI-powered itinerary builder</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SAVED WISHLISTS ───────────────────────────────── */}
              {profileTab === "wishlist" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-[#6B7280]">{WISHLIST.length} saved places</p>
                    <button className="text-xs font-semibold text-[#0E8C88] flex items-center gap-1 hover:underline">
                      Add to Trip Plan <ArrowRight size={12}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {WISHLIST.map(item => (
                      <div key={item.id} className="group rounded-xl overflow-hidden border border-[#DDD6C7] hover:border-[#0E8C88] hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
                        <div className="relative h-24 bg-[#F0EDE6] overflow-hidden">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/50 to-transparent" />
                          <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                            <Heart size={11} className="fill-[#E15B3F] text-[#E15B3F]" />
                          </button>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[#12233A] font-bold text-xs leading-tight mb-0.5">{item.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-[#0E8C88] bg-[#EBF7F6] px-1.5 py-0.5 rounded-full font-medium">{item.cat}</span>
                            <div className="flex items-center gap-0.5">
                              <Star size={9} className="fill-[#E8A33D] text-[#E8A33D]"/>
                              <span className="text-[9px] font-bold text-[#E8A33D]">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── JOURNAL FEED ──────────────────────────────────── */}
              {profileTab === "journal" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm font-bold text-[#12233A]">Digital Travel Journal</p>
                      <p className="text-xs text-[#6B7280]">{JOURNAL_PHOTOS.length} memories documented across Pakistan</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12233A] text-white text-xs font-bold hover:bg-[#0E8C88] transition-all">
                      <Plus size={12}/> Add Memory
                    </button>
                  </div>

                  {/* Photo grid — CSS grid masonry */}
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns:"repeat(4, 1fr)", gridAutoRows:"140px" }}
                  >
                    {JOURNAL_PHOTOS.map((photo, i) => {
                      const isLarge = i === 0 || i === 3;
                      return (
                        <div
                          key={photo.id}
                          className="group relative overflow-hidden rounded-xl bg-[#F0EDE6] cursor-pointer"
                          style={{ gridRow: isLarge ? "span 2" : "span 1" }}
                        >
                          <img
                            src={photo.img}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/60 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform">
                            <p className="text-white font-bold text-xs leading-tight" style={{ fontFamily:"'Playfair Display',serif" }}>{photo.label}</p>
                            <p className="text-white/55 text-[10px] mt-0.5"><Calendar size={8} className="inline mr-0.5"/>{photo.date}</p>
                          </div>
                          {/* Retro corner stamp */}
                          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-[#E8A33D] text-white text-[9px] font-black px-2 py-0.5 rounded-full rotate-2">
                              ✓ Visited
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add memory tile */}
                    <div className="rounded-xl border-2 border-dashed border-[#DDD6C7] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0E8C88] hover:bg-[#EBF7F6]/20 transition-all group">
                      <Plus size={20} className="text-[#DDD6C7] group-hover:text-[#0E8C88] transition-colors" />
                      <span className="text-[10px] font-semibold text-[#6B7280] group-hover:text-[#0E8C88] transition-colors">Add Photo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#DDD6C7] bg-white mt-6 py-6">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2026 Sair-e-Pakistan Trip Planner · AI-powered itinerary builder</p>
          <div className="flex items-center gap-5">
            {(["home","explore","city","place"] as Page[]).map(p => (
              <button key={p} onClick={() => onNavigate(p)} className="text-xs font-medium text-[#6B7280] hover:text-[#0E8C88] capitalize transition-colors">
                {p === "place" ? "Place Details" : p === "city" ? "City Hub" : p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
