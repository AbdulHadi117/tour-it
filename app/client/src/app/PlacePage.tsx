import { useEffect, useState, useRef } from "react";
import {
  Star, MapPin, ChevronRight, ChevronLeft,
  Bookmark, Share2, Phone, Clock, Ticket,
  Wifi, Camera, ParkingSquare, Accessibility,
  Users, Globe, CheckCircle, ChevronDown,
  ThumbsUp, Flag, Plus, Heart, SortDesc,
  Utensils, Hotel, ArrowRight, Shield,
  Navigation2, ExternalLink, X,
} from "lucide-react";
import type { Page } from "./App";
import { fetchPlaceDetail, type PlaceDetail } from "./travelData";

// ── Place Data ─────────────────────────────────────────────────────────────
const PLACE_FALLBACK = {
  name: "Badshahi Mosque",
  subtitle: "Masjid-e-Badshahi",
  category: "Religious Heritage · Mughal Architecture",
  city: "Lahore",
  province: "Punjab",
  address: "Hazuri Bagh Rd, near Lahore Fort, Lahore, Punjab 54000",
  phone: "+92-42-9920-2020",
  website: "badshahimosque.com",
  coordinates: "31.5883° N, 74.3102° E",
  rating: 4.9,
  reviewCount: 8210,
  verifiedBadge: true,
  yearBuilt: "1673 CE",
  builtBy: "Emperor Aurangzeb",
  capacity: "100,000 worshippers",
  classification: "UNESCO Tentative List",
};

const HOURS_FALLBACK = [
  { day: "Monday – Thursday", open: "06:00", close: "22:00", note: "" },
  { day: "Friday", open: "06:00", close: "22:00", note: "Non-worshippers: exit 11:30–14:00" },
  { day: "Saturday – Sunday", open: "06:00", close: "22:00", note: "Peak visitor hours" },
  { day: "Ramadan (all days)", open: "24 hrs", close: "", note: "Open continuously during holy month" },
];

const TICKETS_FALLBACK = [
  { category: "Pakistani Nationals", price: "Free", note: "Valid CNIC required" },
  { category: "Foreign Tourists", price: "PKR 500", note: "≈ USD 1.80 · includes Museum entry" },
  { category: "Students (Intl.)", price: "PKR 200", note: "Valid student ID required" },
  { category: "Photography Permit", price: "PKR 100", note: "For professional equipment only" },
  { category: "Guided Tour (1 hr)", price: "PKR 800", note: "English / Urdu · book at entrance" },
];

const AMENITIES_FALLBACK = [
  { icon: <Users size={15} />, label: "Guided Tours Available", verified: true },
  { icon: <Camera size={15} />, label: "Photography Permitted", verified: true },
  { icon: <Accessibility size={15} />, label: "Wheelchair Accessible (main court)", verified: true },
  { icon: <ParkingSquare size={15} />, label: "Parking (Hazuri Bagh lot)", verified: true },
  { icon: <Globe size={15} />, label: "Multi-language Audio Guides", verified: true },
  { icon: <Wifi size={15} />, label: "Free Wi-Fi (visitor lounge)", verified: false },
  { icon: <Shield size={15} />, label: "Wudu (Ablution) Facilities", verified: true },
  { icon: <Ticket size={15} />, label: "On-site Museum — Relics of the Prophet ﷺ", verified: true },
];

// ── Review Data ─────────────────────────────────────────────────────────────
const RATING_DIST = [
  { stars: 5, pct: 72, count: 5911 },
  { stars: 4, pct: 18, count: 1478 },
  { stars: 3, pct: 6,  count: 493  },
  { stars: 2, pct: 2,  count: 164  },
  { stars: 1, pct: 2,  count: 164  },
];

interface Review {
  id: number;
  name: string;
  origin: string;
  avatar: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
  photos: string[];
  visitType: string;
  verified: boolean;
}

const REVIEWS_FALLBACK: Review[] = [
  {
    id: 1,
    name: "Aisha Mahmood",
    origin: "Karachi, Pakistan",
    avatar: "https://images.unsplash.com/photo-1630494878339-9ceb4a09ef5a?w=80&h=80&fit=crop&auto=format",
    date: "June 2026",
    rating: 5,
    title: "Witnessing it at sunrise is an experience that stays with you forever",
    text: "I've visited Badshahi Mosque many times over the years but this last visit at dawn — when the marble courtyard reflects the first light and the call to Fajr prayer echoes off the sandstone walls — left me completely speechless. The scale is impossible to comprehend from photographs. Standing in the centre of the 276-metre courtyard with those four towering minarets at each corner, you feel genuinely humbled. The restoration work by the Agha Khan Foundation is extraordinary and the Museum of the Quran inside the northern minaret is a must-see that most visitors miss entirely.",
    helpful: 347,
    photos: [
      "https://images.unsplash.com/photo-1768084202876-a3d75afce914?w=200&h=140&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1644326792946-4b14a29bcabe?w=200&h=140&fit=crop&auto=format",
    ],
    visitType: "Solo · Heritage",
    verified: true,
  },
  {
    id: 2,
    name: "Ahmed Raza",
    origin: "Islamabad, Pakistan",
    avatar: "https://images.unsplash.com/photo-1621960883434-e910537c8052?w=80&h=80&fit=crop&auto=format",
    date: "May 2026",
    rating: 4,
    title: "Breathtaking architecture — but come early to avoid the weekend crowds",
    text: "The mosque is genuinely one of the most impressive structures in South Asia. Mughal craftsmanship at its peak — the red Nanakshahi brick, the white marble inlay, the carved stucco interiors of the prayer hall. My only gripe is that weekend afternoons are absolutely packed with school groups and day-trippers. The experience suffers from the noise and jostling. If you visit on a Tuesday or Wednesday morning, you'll have the place almost to yourself. The guard who showed us up one of the minarets for PKR 200 baksheesh was well worth it — the 360° views over Lahore Fort, the Hazuri Bagh garden, and the Delhi Gate are unmatched.",
    helpful: 218,
    photos: [
      "https://images.unsplash.com/photo-1644751679699-1613063ca83c?w=200&h=140&fit=crop&auto=format",
    ],
    visitType: "Couple · Architecture",
    verified: true,
  },
  {
    id: 3,
    name: "Sarah Chen",
    origin: "Singapore",
    avatar: "https://images.unsplash.com/photo-1740989804275-2cc460a0eef6?w=80&h=80&fit=crop&auto=format",
    date: "April 2026",
    rating: 5,
    title: "Better than any mosque I have ever visited, anywhere in the world",
    text: "I have been lucky enough to visit mosques from Istanbul to Casablanca to Abu Dhabi, and Badshahi stands alone. There is a warmth and grandeur here that the Gulf's marble mega-mosques simply cannot replicate. The relic chamber inside — housing what is said to be the personal belongings of the Prophet Muhammad ﷺ — is deeply affecting even as a non-Muslim. Staff at the entrance were welcoming and offered abayas for female visitors who needed them at no charge. The reflection of the illuminated domes in the central basin at dusk is a photograph you will show people for years.",
    helpful: 512,
    photos: [
      "https://images.unsplash.com/photo-1580905325386-dfa16677a1f5?w=200&h=140&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=200&h=140&fit=crop&auto=format",
    ],
    visitType: "Solo · International Tourist",
    verified: true,
  },
  {
    id: 4,
    name: "Muhammad Bilal",
    origin: "Multan, Pakistan",
    avatar: "https://images.unsplash.com/photo-1617817638453-4480d05e0b83?w=80&h=80&fit=crop&auto=format",
    date: "March 2026",
    rating: 4,
    title: "Deeply meaningful pilgrimage site — the museum alone is worth the trip",
    text: "Came specifically to see the holy relics housed in the northern gateway. The experience was profoundly moving. Museum staff are knowledgeable and respectful. The main prayer hall interior — with its painted arches, gilded stucco, and intricate pietra dura marble work on the floors — is genuinely overwhelming. Knock off one star purely because the ticketing system is informal and tourist pricing is applied inconsistently. Otherwise flawless.",
    helpful: 189,
    photos: [],
    visitType: "Family · Religious",
    verified: false,
  },
];

// ── Nearby Places ──────────────────────────────────────────────────────────
const NEARBY_EAT_FALLBACK = [
  { id: 1, name: "Butt Karahi", type: "Restaurant", cuisine: "Lahori Karahi", distance: "0.3 km", rating: 4.8, image: "https://images.unsplash.com/photo-1779902431972-3433d66fd143?w=300&h=200&fit=crop&auto=format", price: "PKR 800–1,500" },
  { id: 2, name: "Waris Nihari", type: "Restaurant", cuisine: "Traditional Nihari", distance: "0.5 km", rating: 4.7, image: "https://images.unsplash.com/photo-1762922425202-2e65559c047f?w=300&h=200&fit=crop&auto=format", price: "PKR 400–900" },
  { id: 3, name: "Old City Café", type: "Café", cuisine: "Chai & Snacks", distance: "0.8 km", rating: 4.5, image: "https://images.unsplash.com/photo-1758887263037-9366a858f5ce?w=300&h=200&fit=crop&auto=format", price: "PKR 200–600" },
  { id: 4, name: "Lahori Tikka House", type: "Restaurant", cuisine: "Tikka & BBQ", distance: "1.1 km", rating: 4.6, image: "https://images.unsplash.com/photo-1712218275818-6bbb7e5a0a44?w=300&h=200&fit=crop&auto=format", price: "PKR 1,000–2,000" },
];

const NEARBY_STAY_FALLBACK = [
  { id: 1, name: "Pearl Continental Lahore", type: "Luxury Hotel", distance: "2.1 km", rating: 4.7, image: "https://images.unsplash.com/photo-1629552266115-a8a3bbdebeed?w=300&h=200&fit=crop&auto=format", price: "From PKR 18,000/night" },
  { id: 2, name: "Walled City Heritage Inn", type: "Boutique Hotel", distance: "0.6 km", rating: 4.8, image: "https://images.unsplash.com/photo-1632899483117-7168ca4b0db8?w=300&h=200&fit=crop&auto=format", price: "From PKR 7,500/night" },
  { id: 3, name: "Avari Lahore", type: "4-Star Hotel", distance: "3.4 km", rating: 4.6, image: "https://images.unsplash.com/photo-1629552441775-f348a18a391c?w=300&h=200&fit=crop&auto=format", price: "From PKR 12,000/night" },
  { id: 4, name: "Fort View Guest House", type: "Guesthouse", distance: "0.4 km", rating: 4.5, image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=300&h=200&fit=crop&auto=format", price: "From PKR 3,500/night" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function StarRow({ rating, size = 13, showNum = true }: { rating: number; size?: number; showNum?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(rating) ? "fill-[#E8A33D] text-[#E8A33D]" : "fill-gray-200 text-gray-200"} />
      ))}
      {showNum && <span className="text-xs font-semibold text-[#E8A33D] ml-0.5">{rating}</span>}
    </div>
  );
}

// ── Mini SVG Map ────────────────────────────────────────────────────────────
function MiniMap() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#E8F4F3] border border-[#DDD6C7]" style={{ height: 160 }}>
      <svg viewBox="0 0 280 160" className="w-full h-full">
        <defs>
          <linearGradient id="mmSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8DCEA" />
            <stop offset="100%" stopColor="#D8EAE8" />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="280" height="160" fill="url(#mmSky)" />
        {/* Street grid */}
        <rect x="0" y="0" width="280" height="160" fill="#EBE8E0" />
        {/* Main road — horizontal */}
        <rect x="0" y="72" width="280" height="14" fill="#D4CDBC" />
        <rect x="0" y="77" width="280" height="4" fill="#C8C0AD" opacity="0.5" />
        {/* Secondary road — vertical left */}
        <rect x="48" y="0" width="12" height="160" fill="#D4CDBC" />
        {/* Secondary road — vertical right */}
        <rect x="188" y="0" width="10" height="160" fill="#D4CDBC" />
        {/* Cross road */}
        <rect x="0" y="118" width="280" height="10" fill="#D4CDBC" />
        {/* Lahore Fort block */}
        <rect x="58" y="8" width="80" height="58" rx="3" fill="#C4A882" opacity="0.75" />
        <text x="98" y="38" fill="#7A5E3A" fontSize="7.5" fontWeight="700" textAnchor="middle">Lahore Fort</text>
        {/* Hazuri Bagh garden */}
        <rect x="58" y="88" width="80" height="24" rx="2" fill="#8FB87A" opacity="0.55" />
        <text x="98" y="103" fill="#3A6A2A" fontSize="6.5" fontWeight="600" textAnchor="middle">Hazuri Bagh</text>
        {/* Mosque block */}
        <rect x="148" y="8" width="88" height="58" rx="3" fill="#FAF8F3" stroke="#DDD6C7" strokeWidth="1.5" />
        <text x="192" y="28" fill="#12233A" fontSize="7" fontWeight="700" textAnchor="middle">Badshahi</text>
        <text x="192" y="38" fill="#12233A" fontSize="7" fontWeight="700" textAnchor="middle">Mosque</text>
        {/* Minaret dots */}
        {[[152,12],[152,62],[232,12],[232,62]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#C4A882" />
        ))}
        {/* Main pin */}
        <circle cx="192" cy="42" r="10" fill="#0E8C88" opacity="0.2" />
        <circle cx="192" cy="42" r="7" fill="#0E8C88" />
        <circle cx="192" cy="42" r="3.5" fill="white" />
        {/* Road labels */}
        <text x="140" y="70" fill="#8A7B68" fontSize="6" textAnchor="middle" fontWeight="500">Circular Rd</text>
        <text x="140" y="126" fill="#8A7B68" fontSize="6" textAnchor="middle" fontWeight="500">Delhi Gate Rd</text>
        {/* Compass */}
        <g transform="translate(258,12)">
          <circle cx="0" cy="0" r="10" fill="white" opacity="0.85" />
          <text x="0" y="-3" textAnchor="middle" fill="#12233A" fontSize="6" fontWeight="700">N</text>
          <path d="M 0 -8 L 2 0 L 0 3 L -2 0 Z" fill="#12233A" />
        </g>
      </svg>
    </div>
  );
}

// ── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review, expanded, onToggle }: { review: Review; expanded: boolean; onToggle: () => void }) {
  const [helpful, setHelpful] = useState(false);
  return (
    <article className="bg-white border border-[#DDD6C7] rounded-xl p-6 hover:border-[#0E8C88]/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
            {review.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0E8C88] rounded-full flex items-center justify-center">
                <CheckCircle size={9} className="text-white fill-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#12233A]">{review.name}</p>
              {review.verified && (
                <span className="text-[10px] font-semibold text-[#0E8C88] bg-[#EBF7F6] px-1.5 py-0.5 rounded-full">Verified Visitor</span>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280]">
              <MapPin size={9} className="inline mr-0.5" />{review.origin} · {review.date}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRow rating={review.rating} size={13} showNum={false} />
          <span className="text-[10px] text-[#6B7280] bg-[#F0EDE6] px-2 py-0.5 rounded-full">{review.visitType}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-[#12233A] font-bold mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem" }}>
        "{review.title}"
      </h4>

      {/* Review text */}
      <div className="text-sm text-[#4A5568] leading-relaxed mb-3">
        {expanded ? review.text : review.text.slice(0, 220) + (review.text.length > 220 ? "…" : "")}
        {review.text.length > 220 && (
          <button onClick={onToggle} className="text-[#0E8C88] font-semibold ml-1 hover:underline text-xs">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Trip photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.photos.map((src, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden bg-[#F0EDE6]" style={{ width: 110, height: 76 }}>
              <img src={src} alt={`Trip photo by ${review.name}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
          ))}
          {review.photos.length > 1 && (
            <div className="text-[10px] text-[#6B7280] self-end mb-1">{review.photos.length} photos</div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6]">
        <button
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-all ${helpful ? "text-[#0E8C88]" : "text-[#6B7280] hover:text-[#12233A]"}`}
        >
          <ThumbsUp size={13} className={helpful ? "fill-[#0E8C88]" : ""} />
          Helpful ({review.helpful + (helpful ? 1 : 0)})
        </button>
        <button className="flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#E15B3F] transition-colors">
          <Flag size={11} /> Report
        </button>
      </div>
    </article>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PlacePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [placeData, setPlaceData] = useState<PlaceDetail | null>(null);
  const [saved, setSaved] = useState(false);
  const [addedToTrip, setAddedToTrip] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [sortBy, setSortBy] = useState("Most Helpful");
  const [sortOpen, setSortOpen] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    void fetchPlaceDetail().then(setPlaceData);
  }, []);

  const PLACE = placeData?.place ?? PLACE_FALLBACK;
  const HOURS = placeData?.hours ?? HOURS_FALLBACK;
  const TICKETS = placeData?.tickets ?? TICKETS_FALLBACK;
  const AMENITIES = placeData?.amenities ?? AMENITIES_FALLBACK;
  const REVIEWS = placeData?.reviews ?? REVIEWS_FALLBACK;
  const NEARBY_EAT = placeData?.nearbyEat ?? NEARBY_EAT_FALLBACK;
  const NEARBY_STAY = placeData?.nearbyStay ?? NEARBY_STAY_FALLBACK;
  const [activeNearbyTab, setActiveNearbyTab] = useState<"eat" | "stay">("eat");
  const nearbyRef = useRef<HTMLDivElement>(null);

  const toggleReview = (id: number) =>
    setExpandedReviews((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const displayedAmenities = showAllAmenities ? AMENITIES : AMENITIES.slice(0, 5);

  const sortedReviews = [...REVIEWS].sort((a, b) => {
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    if (sortBy === "Most Recent") return b.id - a.id;
    return b.helpful - a.helpful;
  });

  const scrollNearby = (dir: "left" | "right") => {
    if (nearbyRef.current) nearbyRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── BREADCRUMB HEADER ──────────────────────────────────────── */}
      <div className="bg-white border-b border-[#DDD6C7] px-8 lg:px-12 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-xs text-[#6B7280]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#0E8C88] transition-colors">Home</button>
          <ChevronRight size={11} />
          <button onClick={() => onNavigate("explore")} className="hover:text-[#0E8C88] transition-colors">Explore Destinations</button>
          <ChevronRight size={11} />
          <button onClick={() => onNavigate("city")} className="hover:text-[#0E8C88] transition-colors">Lahore</button>
          <ChevronRight size={11} />
          <span className="text-[#12233A] font-semibold">{PLACE.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-8 space-y-10">

        {/* ── PREMIUM IMAGE GRID GALLERY ─────────────────────────────── */}
        <section className="grid grid-cols-[1fr_320px] gap-3 rounded-2xl overflow-hidden" style={{ height: 440 }}>
          {/* Hero — left large */}
          <div className="relative overflow-hidden bg-[#12233A] group">
            <img
              src="https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=900&h=500&fit=crop&auto=format"
              alt="Badshahi Mosque full facade — red Nanakshahi brick with four white minarets and marble domes"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              style={{ objectPosition: "center 35%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/50 via-transparent to-transparent" />
            {/* Bottom-left overlay */}
            <div className="absolute bottom-5 left-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#0E8C88]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Shield size={11} /> UNESCO Tentative List
                </span>
                <span className="bg-[#12233A]/70 backdrop-blur-sm text-white/90 text-xs px-3 py-1.5 rounded-full">
                  Est. {PLACE.yearBuilt}
                </span>
              </div>
            </div>
            {/* Photo count badge */}
            <div className="absolute top-4 right-4 bg-black/35 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-black/50 transition-colors">
              <Camera size={12} /> View all 48 photos
            </div>
          </div>

          {/* Right — two stacked smaller images */}
          <div className="grid grid-rows-2 gap-3">
            <div className="relative overflow-hidden bg-[#12233A] group rounded-none">
              <img
                src="https://images.unsplash.com/photo-1768084202876-a3d75afce914?w=400&h=260&fit=crop&auto=format"
                alt="Badshahi Mosque glowing at dusk — illuminated minarets reflected in the central pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-3">
                <span className="text-white/60 text-[10px]">Night illumination</span>
              </div>
            </div>
            <div className="relative overflow-hidden bg-[#12233A] group rounded-none">
              <img
                src="https://images.unsplash.com/photo-1601969698347-664ecffcf994?w=400&h=260&fit=crop&auto=format"
                alt="Badshahi Mosque interior carpet — blue and maroon geometric Mughal pattern"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-3">
                <span className="text-white/60 text-[10px]">Prayer hall interior</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAGE TITLE ROW ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-1">{PLACE.category}</p>
            <h1 className="text-[#12233A] leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800 }}>
              {PLACE.name}
              {PLACE.verifiedBadge && (
                <span className="inline-flex items-center gap-1 ml-3 text-sm font-semibold text-[#0E8C88] bg-[#EBF7F6] border border-[#0E8C88]/20 rounded-full px-3 py-1 align-middle">
                  <CheckCircle size={13} /> Verified
                </span>
              )}
            </h1>
            <p className="text-[#6B7280] text-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>{PLACE.subtitle}</p>
            <div className="flex items-center gap-3 mt-2">
              <StarRow rating={PLACE.rating} size={15} />
              <span className="text-sm text-[#6B7280]">{PLACE.reviewCount.toLocaleString()} verified reviews</span>
              <span className="text-[#DDD6C7]">·</span>
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <MapPin size={11} className="text-[#0E8C88]" />{PLACE.city}, {PLACE.province}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD6C7] bg-white text-xs font-semibold text-[#12233A] hover:border-[#12233A] transition-all">
              <Share2 size={13} /> Share
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${saved ? "bg-[#EBF7F6] border-[#0E8C88] text-[#0E8C88]" : "bg-white border-[#DDD6C7] text-[#12233A] hover:border-[#0E8C88]"}`}
            >
              <Heart size={13} className={saved ? "fill-[#0E8C88]" : ""} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ── TWO-COLUMN WORKSPACE ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── MAIN COLUMN (65%) ──────────────────────────────────────── */}
          <div className="space-y-10">

            {/* Historical Overview */}
            <section>
              <h2 className="text-[#12233A] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem" }}>
                About Badshahi Mosque
              </h2>
              <div className="space-y-3 text-sm text-[#4A5568] leading-relaxed">
                <p>
                  Badshahi Mosque — "the Royal Mosque" — was commissioned by the sixth Mughal Emperor Aurangzeb and completed in 1673 CE. Constructed from the distinctive red Nanakshahi brick and white marble quarried from Makrana, Rajputana, it reigns as one of the world's largest mosques, accommodating up to 100,000 worshippers in its sprawling 276-by-276-metre sandstone courtyard.
                </p>
                <p>
                  The complex is defined by its four octagonal minarets at the corner of the outer compound — each rising to 53.6 metres — and its three bulbous white marble domes above the prayer hall roof. The architecture draws from both Persian and Mughal traditions: the decorative work inside the prayer chamber integrates carved stucco, painted frescoes (restored 1939–60), inlaid stonework, and marble pietra dura panels of exceptional refinement.
                </p>
                <p>
                  During the Sikh Empire under Ranjit Singh (1799–1839), the mosque was repurposed as a stable and armoury. British colonial forces used it as a garrison through the 1850s before it was finally restored to Muslim worship in 1856. A major restoration programme led by the Agha Khan Historic Cities Programme between 1999 and 2008 returned the complex to its present immaculate condition.
                </p>
                <p>
                  The mosque's Museum of Holy Relics (northern minaret gateway) houses artefacts attributed to the Prophet Muhammad ﷺ, his daughter Bibi Fatimah, and his son-in-law Hazrat Ali — including a cloak, sandals, and a strand of hair held in a crystal casket. These relics were brought to Lahore by Mughal emperors and remain the most venerated items in the building.
                </p>
              </div>

              {/* Key facts pills */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                {[
                  { label: "Year Built", value: PLACE.yearBuilt },
                  { label: "Commissioned by", value: PLACE.builtBy },
                  { label: "Capacity", value: PLACE.capacity },
                  { label: "Classification", value: PLACE.classification },
                  { label: "Courtyard size", value: "276 × 276 m" },
                  { label: "Minaret height", value: "53.6 m" },
                ].map((f) => (
                  <div key={f.label} className="bg-white border border-[#DDD6C7] rounded-xl px-3.5 py-2 flex flex-col">
                    <span className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">{f.label}</span>
                    <span className="text-sm font-bold text-[#12233A]">{f.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-[#12233A] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
                Amenities & Facilities
              </h2>
              <div className="bg-white border border-[#DDD6C7] rounded-xl overflow-hidden">
                {displayedAmenities.map((a, i) => (
                  <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i < displayedAmenities.length - 1 ? "border-b border-[#F0EDE6]" : ""}`}>
                    <div className="text-[#0E8C88]">{a.icon}</div>
                    <span className="text-sm text-[#12233A] font-medium flex-1">{a.label}</span>
                    {a.verified
                      ? <span className="text-[10px] font-bold text-[#0E8C88] bg-[#EBF7F6] px-2 py-0.5 rounded-full">Verified</span>
                      : <span className="text-[10px] font-medium text-[#6B7280] bg-[#F0EDE6] px-2 py-0.5 rounded-full">Unconfirmed</span>
                    }
                  </div>
                ))}
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="flex items-center gap-2 w-full px-5 py-3.5 text-sm font-semibold text-[#0E8C88] hover:bg-[#FAF8F3] transition-colors border-t border-[#DDD6C7]"
                >
                  <ChevronDown size={15} className={`transition-transform ${showAllAmenities ? "rotate-180" : ""}`} />
                  {showAllAmenities ? "Show fewer amenities" : `Show all ${AMENITIES.length} amenities`}
                </button>
              </div>
            </section>

            {/* Operating Hours & Tickets — two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hours */}
              <section>
                <h2 className="text-[#12233A] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
                  <Clock size={17} className="text-[#0E8C88]" /> Opening Hours
                </h2>
                <div className="bg-white border border-[#DDD6C7] rounded-xl overflow-hidden">
                  {HOURS.map((h, i) => (
                    <div key={i} className={`px-4 py-3 ${i < HOURS.length - 1 ? "border-b border-[#F0EDE6]" : ""}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#12233A]">{h.day}</span>
                        <span className="text-xs font-bold text-[#0E8C88] tabular-nums">
                          {h.close ? `${h.open} – ${h.close}` : h.open}
                        </span>
                      </div>
                      {h.note && (
                        <p className="text-[10px] text-[#E15B3F] mt-0.5 font-medium">{h.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Ticket pricing */}
              <section>
                <h2 className="text-[#12233A] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
                  <Ticket size={17} className="text-[#0E8C88]" /> Ticket Pricing
                </h2>
                <div className="bg-white border border-[#DDD6C7] rounded-xl overflow-hidden">
                  {TICKETS.map((t, i) => (
                    <div key={i} className={`px-4 py-3 ${i < TICKETS.length - 1 ? "border-b border-[#F0EDE6]" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-[#12233A]">{t.category}</p>
                          <p className="text-[10px] text-[#6B7280] mt-0.5">{t.note}</p>
                        </div>
                        <span className={`text-sm font-bold shrink-0 ${t.price === "Free" ? "text-[#0E8C88]" : "text-[#12233A]"}`}>
                          {t.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── COMMUNITY REVIEW HUB ─────────────────────────────────── */}
            <section>
              <h2 className="text-[#12233A] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
                Community Review Hub
              </h2>

              {/* Rating overview */}
              <div className="bg-white border border-[#DDD6C7] rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center">
                  {/* Big rating */}
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <p className="text-[#12233A] font-black leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem" }}>
                      {PLACE.rating}
                    </p>
                    <StarRow rating={PLACE.rating} size={18} showNum={false} />
                    <p className="text-xs text-[#6B7280] mt-1.5">{PLACE.reviewCount.toLocaleString()} reviews</p>
                    <div className="mt-2 flex items-center gap-1.5 bg-[#EBF7F6] rounded-full px-3 py-1">
                      <CheckCircle size={11} className="text-[#0E8C88]" />
                      <span className="text-[10px] font-bold text-[#0E8C88] uppercase tracking-wide">All Verified</span>
                    </div>
                  </div>

                  {/* Distribution bars */}
                  <div className="space-y-2">
                    {RATING_DIST.map((d) => (
                      <div key={d.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5 shrink-0 w-20">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} size={10} className={i <= d.stars ? "fill-[#E8A33D] text-[#E8A33D]" : "fill-gray-200 text-gray-200"} />
                          ))}
                        </div>
                        <div className="flex-1 bg-[#F0EDE6] rounded-full overflow-hidden" style={{ height: 8 }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${d.pct}%`, backgroundColor: d.stars >= 4 ? "#0E8C88" : d.stars === 3 ? "#E8A33D" : "#E15B3F" }}
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-24 text-right justify-end">
                          <span className="text-xs font-bold text-[#12233A]">{d.pct}%</span>
                          <span className="text-[10px] text-[#6B7280]">({d.count.toLocaleString()})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category breakdown row */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6 pt-5 border-t border-[#F0EDE6]">
                  {[
                    { label: "Location", score: "4.9" },
                    { label: "History", score: "5.0" },
                    { label: "Cleanliness", score: "4.8" },
                    { label: "Staff", score: "4.7" },
                    { label: "Value", score: "5.0" },
                    { label: "Accessibility", score: "4.5" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col items-center text-center">
                      <p className="text-[#12233A] font-black text-lg leading-none">{c.score}</p>
                      <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">{c.label}</p>
                      <div className="w-full bg-[#F0EDE6] rounded-full mt-1" style={{ height: 3 }}>
                        <div className="h-full bg-[#E8A33D] rounded-full" style={{ width: `${parseFloat(c.score) / 5 * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort controls */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-[#12233A]">
                  {PLACE.reviewCount.toLocaleString()} reviews
                </p>
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD6C7] rounded-xl text-sm font-semibold text-[#12233A] hover:border-[#0E8C88] transition-all"
                  >
                    <SortDesc size={14} className="text-[#0E8C88]" />
                    {sortBy}
                    <ChevronDown size={13} className={`text-[#6B7280] transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#DDD6C7] rounded-xl shadow-xl z-20 overflow-hidden w-44">
                      {["Most Helpful", "Most Recent", "Highest Rated"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSortBy(opt); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === opt ? "bg-[#EBF7F6] text-[#0E8C88] font-semibold" : "text-[#12233A]/70 hover:bg-[#FAF8F3]"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-4">
                {sortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    expanded={expandedReviews.has(review.id)}
                    onToggle={() => toggleReview(review.id)}
                  />
                ))}
              </div>

              {/* Load more */}
              <button className="w-full mt-5 py-3.5 rounded-xl border border-[#DDD6C7] bg-white text-sm font-semibold text-[#12233A] hover:border-[#0E8C88] hover:text-[#0E8C88] transition-all flex items-center justify-center gap-2">
                Load 20 more reviews
                <ChevronDown size={14} />
              </button>
            </section>
          </div>

          {/* ── STICKY SIDEBAR (35%) ───────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">

            {/* Main action card */}
            <div className="bg-white border border-[#DDD6C7] rounded-2xl overflow-hidden shadow-sm">
              {/* Mini map */}
              <MiniMap />

              {/* Location info */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin size={15} className="text-[#0E8C88] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#12233A] uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{PLACE.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <Navigation2 size={15} className="text-[#0E8C88] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#12233A] uppercase tracking-wide mb-0.5">Coordinates</p>
                      <p className="text-xs text-[#6B7280] font-mono">{PLACE.coordinates}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={15} className="text-[#0E8C88] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#12233A] uppercase tracking-wide mb-0.5">Contact</p>
                      <p className="text-xs text-[#6B7280]">{PLACE.phone}</p>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className="flex items-center gap-2 text-xs font-semibold text-[#0E8C88] hover:underline"
                >
                  <ExternalLink size={12} /> {PLACE.website}
                </a>

                <div className="space-y-2.5 pt-1">
                  {/* Primary CTA */}
                  <button
                    onClick={() => { setAddedToTrip(true); onNavigate("planner"); }}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-98 ${
                      addedToTrip
                        ? "bg-[#0B7874] text-white"
                        : "bg-[#0E8C88] hover:bg-[#0B7874] text-white shadow-md shadow-[#0E8C88]/25"
                    }`}
                  >
                    {addedToTrip
                      ? <><CheckCircle size={15} /> Added to Trip</>
                      : <><Plus size={15} /> Add to Active Trip Itinerary</>
                    }
                  </button>

                  {/* Secondary CTA */}
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      saved
                        ? "border-[#0E8C88] text-[#0E8C88] bg-[#EBF7F6]"
                        : "border-[#DDD6C7] text-[#12233A] hover:border-[#0E8C88] hover:text-[#0E8C88]"
                    }`}
                  >
                    <Bookmark size={14} className={saved ? "fill-[#0E8C88]" : ""} />
                    {saved ? "Saved to Wishlist" : "Save to Wishlist"}
                  </button>
                </div>

                {/* Quick info chips */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0EDE6]">
                  <div className="bg-[#FAF8F3] rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold">Avg. Visit</p>
                    <p className="text-sm font-bold text-[#12233A]">1.5 – 2 hrs</p>
                  </div>
                  <div className="bg-[#FAF8F3] rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold">Best Time</p>
                    <p className="text-sm font-bold text-[#12233A]">Early AM</p>
                  </div>
                  <div className="bg-[#FAF8F3] rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold">Entry</p>
                    <p className="text-sm font-bold text-[#0E8C88]">Free (locals)</p>
                  </div>
                  <div className="bg-[#FAF8F3] rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold">Dress Code</p>
                    <p className="text-sm font-bold text-[#E15B3F]">Modest Req.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust signal card */}
            <div className="bg-[#12233A] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-[#0E8C88]" />
                <p className="text-white text-xs font-bold uppercase tracking-widest">Verified by Sair-e-Pakistan</p>
              </div>
              <p className="text-white/55 text-xs leading-relaxed mb-3">
                All facts, hours, and pricing on this listing were last confirmed by our local editorial team in May 2026. Photos are community-submitted and verified.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["1630494878339", "1621960883434", "1617817638453"].map((id) => (
                    <img key={id} src={`https://images.unsplash.com/photo-${id}?w=28&h=28&fit=crop`} alt="" className="w-7 h-7 rounded-full border-2 border-[#12233A] object-cover" />
                  ))}
                </div>
                <span className="text-white/50 text-[11px]">3 local contributors verified this</span>
              </div>
            </div>

            {/* Alert card */}
            <div className="bg-[#FFF8F6] border border-[#E15B3F]/25 rounded-xl p-4">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E15B3F]/10 flex items-center justify-center shrink-0">
                  <Flag size={11} className="text-[#E15B3F]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#E15B3F] mb-1">Visitor Note</p>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    Shorts and sleeveless clothing are not permitted. Abayas and head coverings are provided free at the gate for all visitors.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── NEARBY RECOMMENDATIONS STRIP ───────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[#12233A] font-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem" }}>
                Nearby Recommendations
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Within 5 km of Badshahi Mosque</p>
            </div>
            {/* Tab switch */}
            <div className="flex items-center bg-white border border-[#DDD6C7] rounded-xl p-1 gap-1">
              {(["eat", "stay"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveNearbyTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeNearbyTab === t ? "bg-[#0E8C88] text-white" : "text-[#12233A]/60 hover:text-[#12233A]"}`}
                >
                  {t === "eat" ? <Utensils size={12} /> : <Hotel size={12} />}
                  {t === "eat" ? "Places to Eat" : "Accommodations"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Scroll arrows */}
            <button
              onClick={() => scrollNearby("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-[#DDD6C7] shadow-md flex items-center justify-center text-[#12233A] hover:border-[#0E8C88] transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollNearby("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-[#DDD6C7] shadow-md flex items-center justify-center text-[#12233A] hover:border-[#0E8C88] transition-all"
            >
              <ChevronRight size={16} />
            </button>

            <div
              ref={nearbyRef}
              className="flex gap-5 overflow-x-auto pb-2"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
            >
              {(activeNearbyTab === "eat" ? NEARBY_EAT : NEARBY_STAY).map((place) => (
                <article
                  key={place.id}
                  className="bg-white rounded-xl border border-[#DDD6C7] overflow-hidden hover:shadow-lg hover:border-[#0E8C88] transition-all duration-250 cursor-pointer flex-shrink-0 hover:-translate-y-0.5"
                  style={{ width: 260, scrollSnapAlign: "start" }}
                >
                  <div className="relative overflow-hidden h-36 bg-[#F0EDE6]">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold text-white bg-[#12233A]/65 backdrop-blur-sm px-2 py-1 rounded-full">
                        {activeNearbyTab === "eat" ? (place as typeof NEARBY_EAT[0]).cuisine : (place as typeof NEARBY_STAY[0]).type}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                      <MapPin size={9} className="text-white/80" />
                      <span className="text-[10px] text-white font-medium">{place.distance}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#12233A] font-bold text-sm leading-snug mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {place.name}
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mb-2">
                      {activeNearbyTab === "eat" ? (place as typeof NEARBY_EAT[0]).price : (place as typeof NEARBY_STAY[0]).price}
                    </p>
                    <div className="flex items-center justify-between">
                      <StarRow rating={place.rating} size={11} />
                      <button className="text-[11px] font-semibold text-[#0E8C88] inline-flex items-center gap-0.5 hover:gap-1.5 transition-all">
                        View <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#DDD6C7] bg-white mt-8 py-7">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2026 Sair-e-Pakistan · Place data last verified May 2026 · Content may not be reproduced without permission</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate("city")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E8C88] hover:underline">
              <ChevronLeft size={13} /> City Hub
            </button>
            <button onClick={() => onNavigate("explore")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#12233A]/50 hover:text-[#12233A] transition-colors">
              <ChevronLeft size={13} /> Explore
            </button>
            <button onClick={() => onNavigate("home")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#12233A]/50 hover:text-[#12233A] transition-colors">
              <ChevronLeft size={13} /> Home
            </button>
            <button onClick={() => onNavigate("planner")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E8C88] hover:underline">
              Trip Planner →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
