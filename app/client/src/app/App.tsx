import { useEffect, useState } from "react";
import {
  Search,
  Star,
  MapPin,
  ChevronDown,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ArrowRight,
  Globe,
  Shield,
  Sparkles,
  Menu,
  X,
  Users,
  Building2,
  MessageSquare,
  LogOut,
} from "lucide-react";
import ExplorePage from "./ExplorePage";
import CityPage from "./CityPage";
import PlacePage from "./PlacePage";
import TripPlannerPage from "./TripPlannerPage";
import AboutPage from "./AboutPage";
import AuthPage from "./AuthPage";
import ProfilePage from "./ProfilePage";
import EmailVerificationPage from "./EmailVerificationPage";
import EmailVerificationResultPage from "./EmailVerificationResultPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import PasswordResetPage from "./PasswordResetPage";
import MagicLinkPage from "./MagicLinkPage";
import MagicLinkProcessingPage from "./MagicLinkProcessingPage";
import AuthStateKitPage from "./AuthStateKitPage";
import {
  clearStoredUserProfile,
  loadStoredUserProfile,
  saveStoredUserProfile,
  updateProfile,
  logoutUser,
  type AuthMode,
  type UserProfile,
} from "./auth";

// ── Types ──────────────────────────────────────────────────────────────────
export type Page =
  "home" | "explore" | "city" | "place" | "planner" | "about" | "auth" | "profile"
  | "email-verify" | "verify-result" | "forgot-password"
  | "reset-password" | "magic-link" | "magic-link-processing" | "auth-kit";

// ── Shared Nav Links ───────────────────────────────────────────────────────
const NAV_LINKS: { label: string; page: Page | null }[] = [
  { label: "Home", page: "home" },
  { label: "Explore Destinations", page: "explore" },
  { label: "Trip Planner", page: "planner" },
  { label: "About Us", page: "about" },
  { label: "Contact", page: null },
];

// ── Shared Header ──────────────────────────────────────────────────────────
function SiteHeader({
  currentPage,
  currentUser,
  onNavigate,
  onStartAuth,
  onSignOut,
}: {
  currentPage: Page;
  currentUser: UserProfile | null;
  onNavigate: (p: Page) => void;
  onStartAuth: (mode: AuthMode) => void;
  onSignOut: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[rgba(18,35,58,0.1)]"
      style={{ height: 80 }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0E8C88] flex items-center justify-center">
            <Globe
              size={20}
              className="text-white"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col leading-none text-left">
            <span
              className="text-[#12233A] font-bold tracking-tight group-hover:text-[#0E8C88] transition-colors"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
              }}
            >
              TourIT
            </span>
            <span className="text-[10px] text-[#0E8C88] uppercase tracking-widest font-semibold">
              Tourism Discovery
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ label, page }) => {
            const active = page === currentPage;
            return (
              <button
                key={label}
                onClick={() => page && onNavigate(page)}
                className={`text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "text-[#0E8C88] border-b-2 border-[#0E8C88] pb-0.5"
                    : "text-[#12233A]/70 hover:text-[#12233A]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Auth + mobile */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-2 rounded-full border border-[rgba(18,35,58,0.12)] bg-white px-3 py-2 text-sm font-semibold text-[#12233A] transition-colors hover:border-[#0E8C88]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0E8C88] text-xs font-black text-white">
                  {currentUser.avatarSeed}
                </div>
                <span className="max-w-[130px] truncate">{currentUser.fullName}</span>
              </button>
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(225,91,63,0.18)] bg-[#FBE7E1] px-4 py-2 text-sm font-semibold text-[#E15B3F] transition-colors hover:bg-[#f8d9d0]"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => onStartAuth("signin")}
                className="text-sm font-medium text-[#12233A]/70 hover:text-[#12233A] transition-colors"
              >
                Sign In
              </button>
              <span className="text-[#12233A]/20">/</span>
              <button
                onClick={() => onStartAuth("register")}
                className="text-sm font-semibold text-white bg-[#0E8C88] px-4 py-2 rounded-lg hover:bg-[#0B7874] transition-colors"
              >
                Register
              </button>
            </div>
          )}
          <button
            className="lg:hidden text-[#12233A] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#FAF8F3] border-b border-[rgba(18,35,58,0.1)] shadow-lg py-4 px-8 flex flex-col gap-3">
          {NAV_LINKS.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => {
                if (page) {
                  onNavigate(page);
                  setMobileOpen(false);
                }
              }}
              className="text-sm font-medium text-[#12233A]/70 hover:text-[#12233A] py-1 text-left"
            >
              {label}
            </button>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-[rgba(18,35,58,0.1)] mt-1">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate("profile");
                    setMobileOpen(false);
                  }}
                  className="text-sm font-semibold text-[#12233A]"
                >
                  {currentUser.fullName}
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileOpen(false);
                  }}
                  className="text-sm font-semibold text-[#E15B3F]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onStartAuth("signin");
                    setMobileOpen(false);
                  }}
                  className="text-sm font-medium text-[#12233A]/70"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onStartAuth("register");
                    setMobileOpen(false);
                  }}
                  className="text-sm font-semibold text-white bg-[#0E8C88] px-4 py-2 rounded-lg"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ── Home Page Data ─────────────────────────────────────────────────────────
const CATEGORIES = [
  "Attractions",
  "Hotels",
  "Restaurants",
  "Adventure",
  "Cultural Sites",
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Gilgit-Baltistan",
    tagline: "Roof of the World",
    image:
      "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=600&h=420&fit=crop&auto=format",
    rating: 4.9,
    reviews: 2840,
    province: "Gilgit-Baltistan",
    highlight: "K2 Base Camp",
  },
  {
    id: 2,
    name: "Lahore",
    tagline: "Heart of Pakistan",
    image:
      "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=600&h=420&fit=crop&auto=format",
    rating: 4.8,
    reviews: 5120,
    province: "Punjab",
    highlight: "Badshahi Mosque",
  },
  {
    id: 3,
    name: "Hunza Valley",
    tagline: "Heaven on Earth",
    image:
      "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=600&h=420&fit=crop&auto=format",
    rating: 4.9,
    reviews: 3670,
    province: "Gilgit-Baltistan",
    highlight: "Rakaposhi View",
  },
  {
    id: 4,
    name: "Swat Valley",
    tagline: "Switzerland of Pakistan",
    image:
      "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=600&h=420&fit=crop&auto=format",
    rating: 4.7,
    reviews: 2190,
    province: "KPK",
    highlight: "Malam Jabba",
  },
];

const FEATURES = [
  {
    icon: <MessageSquare size={28} strokeWidth={1.5} />,
    title: "Trusted Community Reviews",
    subtitle: "50,000+ authentic voices",
    description:
      "Every review is verified by our editorial team. Read candid insights from travelers who have actually visited — no sponsored content, no inflated ratings. Just honest accounts from fellow explorers.",
    image:
      "https://images.unsplash.com/photo-1562913346-61ae3ab9277e?w=720&h=500&fit=crop&auto=format",
    imageAlt:
      "Travelers sharing reviews of Hunza Valley landscape",
    stat: "98% verified reviews",
    reverse: false,
  },
  {
    icon: <Sparkles size={28} strokeWidth={1.5} />,
    title: "AI-Personalised Trip Planning",
    subtitle: "Itineraries built around you",
    description:
      "Tell us your interests, travel style, and budget. Our AI draws on 1,200+ curated attractions and local expertise to build a day-by-day itinerary — complete with timing, transport links, and hidden gems.",
    image:
      "https://images.unsplash.com/photo-1753696252581-3fec5cf1b825?w=720&h=500&fit=crop&auto=format",
    imageAlt:
      "Snowy mountain peaks in the Karakoram range at dusk",
    stat: "10k+ trips generated",
    reverse: true,
  },
  {
    icon: <Shield size={28} strokeWidth={1.5} />,
    title: "Verified Local Data",
    subtitle: "Ground-truth accuracy",
    description:
      "Our network of 800+ local contributors keeps every listing fresh. Opening hours, entrance fees, seasonal closures — updated in real time so your plans never unravel on arrival.",
    image:
      "https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=720&h=500&fit=crop&auto=format",
    imageAlt:
      "Brown and grey mountain terrain under a vast blue sky",
    stat: "800+ local contributors",
    reverse: false,
  },
];

const STATS = [
  {
    value: "350+",
    label: "Cities & Towns",
    icon: <Globe size={20} strokeWidth={1.5} />,
  },
  {
    value: "1,200+",
    label: "Attractions Listed",
    icon: <MapPin size={20} strokeWidth={1.5} />,
  },
  {
    value: "50k+",
    label: "Verified Reviews",
    icon: <MessageSquare size={20} strokeWidth={1.5} />,
  },
  {
    value: "800+",
    label: "Local Contributors",
    icon: <Users size={20} strokeWidth={1.5} />,
  },
  {
    value: "120+",
    label: "Partner Hotels",
    icon: <Building2 size={20} strokeWidth={1.5} />,
  },
];

const FOOTER_COLS = [
  {
    heading: "Explore",
    links: [
      "Top Destinations",
      "Adventure Tours",
      "Cultural Heritage",
      "Mountain Treks",
      "Coastal Getaways",
    ],
  },
  {
    heading: "Plan",
    links: [
      "Trip Planner",
      "Travel Guides",
      "Seasonal Picks",
      "Budget Calculator",
      "Visa Information",
    ],
  },
  {
    heading: "Community",
    links: [
      "Write a Review",
      "Share Your Story",
      "Travel Forum",
      "Local Guides",
      "Photo Gallery",
    ],
  },
  {
    heading: "Company",
    links: [
      "About Us",
      "Press & Media",
      "Careers",
      "Partner With Us",
      "Contact Us",
    ],
  },
];

function StarRow({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            className={
              i <= Math.round(rating)
                ? "fill-[#E8A33D] text-[#E8A33D]"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-[#E8A33D]">
        {rating}
      </span>
      <span className="text-xs text-[#6B7280]">
        ({count.toLocaleString()})
      </span>
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
function HomePage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [whereInput, setWhereInput] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden bg-[#12233A]"
        style={{ height: 600 }}
      >
        <img
          src="https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=1440&h=600&fit=crop&auto=format"
          alt="Majestic Karakoram mountain peaks of Pakistan at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,35,58,0.25) 0%, rgba(18,35,58,0.55) 60%, rgba(18,35,58,0.75) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">
              Discover Pakistan
            </span>
          </div>
          <h1
            className="text-white mb-3 leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              maxWidth: 680,
            }}
          >
            Every Journey Begins with a{" "}
            <em className="not-italic text-[#E8A33D]">
              Single Discovery
            </em>
          </h1>
          <p className="text-white/75 text-base mb-8 max-w-xl leading-relaxed">
            From the world's highest peaks to ancient Mughal
            cities — your gateway to Pakistan's most
            extraordinary destinations.
          </p>

          {/* Search card */}
          <div
            className="w-full bg-white shadow-2xl flex flex-col sm:flex-row items-stretch overflow-hidden"
            style={{ maxWidth: 780, borderRadius: 16 }}
          >
            <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-[rgba(18,35,58,0.1)]">
              <MapPin
                size={18}
                className="text-[#0E8C88] shrink-0"
                strokeWidth={2}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-semibold mb-0.5">
                  Where to?
                </span>
                <input
                  type="text"
                  value={whereInput}
                  onChange={(e) =>
                    setWhereInput(e.target.value)
                  }
                  placeholder="City, region, or attraction…"
                  className="text-sm text-[#12233A] font-medium bg-transparent outline-none placeholder:text-[#12233A]/30 w-full"
                />
              </div>
            </div>
            <div className="relative sm:w-56">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full h-full flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-[rgba(18,35,58,0.1)] hover:bg-[#FAF8F3] transition-colors"
              >
                <Globe
                  size={18}
                  className="text-[#0E8C88] shrink-0"
                  strokeWidth={2}
                />
                <div className="flex flex-col flex-1 text-left min-w-0">
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-semibold mb-0.5">
                    Category
                  </span>
                  <span className="text-sm text-[#12233A] font-medium truncate">
                    {selectedCategory}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[#6B7280] shrink-0 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-[rgba(18,35,58,0.12)] rounded-b-xl shadow-xl z-20">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm text-[#12233A] hover:bg-[#EBF7F6] hover:text-[#0E8C88] transition-colors font-medium"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center justify-center gap-2.5 bg-[#0E8C88] hover:bg-[#0B7874] text-white font-semibold text-sm px-7 py-4 transition-colors sm:rounded-r-2xl">
              <Search size={16} strokeWidth={2.5} /> Search
            </button>
          </div>

          <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
            <span className="text-white/50 text-xs">
              Popular:
            </span>
            {[
              "K2 Trek",
              "Lahore Fort",
              "Hunza Valley",
              "Fairy Meadows",
              "Mohenjo-daro",
            ].map((tag) => (
              <button
                key={tag}
                className="text-xs text-white/75 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-2">
                Featured Provinces & Locations
              </p>
              <h2
                className="text-[#12233A] leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                }}
              >
                Pakistan's Most Beloved
                <br />
                <em className="not-italic text-[#0E8C88]">
                  Destinations
                </em>
              </h2>
            </div>
            <button
              onClick={() => onNavigate("explore")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E8C88] hover:gap-3 transition-all"
            >
              View all destinations <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.map((dest) => (
              <article
                key={dest.id}
                className="group bg-white rounded-[8px] overflow-hidden border border-[rgba(18,35,58,0.08)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative overflow-hidden h-52 bg-[#F0EDE6]">
                  <img
                    src={dest.image}
                    alt={`${dest.name} — ${dest.tagline}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-[#0E8C88] px-2.5 py-1 rounded-full">
                    {dest.province}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-[#0E8C88] font-semibold uppercase tracking-widest mb-1">
                    {dest.highlight}
                  </p>
                  <h3
                    className="text-[#12233A] font-bold mb-0.5 leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                    }}
                  >
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mb-3">
                    {dest.tagline}
                  </p>
                  <StarRow
                    rating={dest.rating}
                    count={dest.reviews}
                  />
                  <div className="mt-4 pt-3 border-t border-[rgba(18,35,58,0.07)] flex items-center justify-between">
                    <button
                      onClick={() => onNavigate("place")}
                      className="text-xs font-semibold text-[#0E8C88] inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Explore <ArrowRight size={12} />
                    </button>
                    <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                      <MapPin size={10} />
                      Pakistan
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-24 px-6 lg:px-12 bg-[#FAF8F3]">
        <div className="max-w-[1440px] mx-auto space-y-28">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center ${feat.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF7F6] flex items-center justify-center text-[#0E8C88]">
                    {feat.icon}
                  </div>
                  <span className="text-xs font-bold text-[#0E8C88] uppercase tracking-widest">
                    {feat.subtitle}
                  </span>
                </div>
                <h2
                  className="text-[#12233A] mb-5 leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    fontWeight: 700,
                  }}
                >
                  {feat.title}
                </h2>
                <p className="text-[#6B7280] leading-relaxed text-base mb-7">
                  {feat.description}
                </p>
                <div className="inline-flex items-center gap-2.5 bg-white border border-[rgba(18,35,58,0.1)] rounded-full px-4 py-2 w-fit shadow-sm mb-8">
                  <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
                  <span className="text-sm font-semibold text-[#12233A]">
                    {feat.stat}
                  </span>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#12233A] hover:bg-[#0E8C88] px-6 py-3 rounded-lg transition-colors w-fit"
                >
                  Learn more <ArrowRight size={14} />
                </a>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden bg-[#F0EDE6] shadow-xl aspect-[4/3]">
                  <img
                    src={feat.image}
                    alt={feat.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
                <div
                  className="absolute -z-10 opacity-30"
                  style={{
                    bottom: feat.reverse ? "auto" : -24,
                    top: feat.reverse ? -24 : "auto",
                    right: feat.reverse ? "auto" : -24,
                    left: feat.reverse ? -24 : "auto",
                    width: 120,
                    height: 120,
                    backgroundImage:
                      "radial-gradient(circle, #0E8C88 1.5px, transparent 1.5px)",
                    backgroundSize: "14px 14px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#12233A] py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-3">
              Platform at a Glance
            </p>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 600,
              }}
            >
              Pakistan's most comprehensive travel intelligence
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-10 px-6 text-center bg-[#12233A] hover:bg-[#1a3150] transition-colors"
              >
                <div className="text-[#0E8C88] mb-3">
                  {stat.icon}
                </div>
                <div
                  className="text-white font-bold mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 4vw, 2.75rem)",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-[#0E8C88] text-xs font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative overflow-hidden bg-[#0E8C88] py-16 px-6 lg:px-12 text-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-center gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={18}
                className="fill-[#E8A33D] text-[#E8A33D]"
              />
            ))}
          </div>
          <blockquote
            className="text-white mb-5 leading-relaxed"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontStyle: "italic",
            }}
          >
            "Sair-e-Pakistan transformed how we planned our
            Northern Areas trip. Every single recommendation was
            spot-on — from the best dhabas in Gilgit to the
            hidden viewpoints above Attabad Lake."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              AK
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">
                Ayesha Khan
              </p>
              <p className="text-white/60 text-xs">
                Lahore, Pakistan · 12 trips planned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#12233A] px-6 lg:px-12 pt-16 pb-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#0E8C88] flex items-center justify-center">
                  <Globe
                    size={16}
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>
                <span
                  className="text-white font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                  }}
                >
                  Sair-e-Pakistan
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                Your trusted guide to Pakistan's landscapes,
                history, and culture. From the Karakoram to the
                Arabian Sea.
              </p>
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">
                  Travel updates, direct to you
                </p>
                <div className="flex items-center rounded-lg overflow-hidden border border-white/10">
                  <div className="pl-3 pr-2">
                    <Mail size={15} className="text-white/30" />
                  </div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 bg-transparent text-white text-xs py-3 outline-none placeholder:text-white/25"
                  />
                  <button className="bg-[#0E8C88] hover:bg-[#0B7874] text-white text-xs font-semibold px-4 py-3 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-white/90 text-xs font-bold uppercase tracking-widest mb-5">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/45 text-sm hover:text-[#0E8C88] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © 2026 Sair-e-Pakistan. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0E8C88] flex items-center justify-center text-white/50 hover:text-white transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-5">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Settings",
              ].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-white/30 text-xs hover:text-white/60 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/verify-email")) return "verify-result";
      if (path.startsWith("/reset-password")) return "reset-password";
      if (path.startsWith("/otl")) return "magic-link-processing";
    }
    return "home";
  });
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadStoredUserProfile(),
  );
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      saveStoredUserProfile(currentUser);
    } else {
      clearStoredUserProfile();
    }
  }, [currentUser]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    navigate("auth");
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleRegistrationPending = (email: string) => {
    setPendingVerifyEmail(email);
    navigate("email-verify");
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    navigate("home");
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <SiteHeader
        currentPage={page}
        currentUser={currentUser}
        onNavigate={navigate}
        onStartAuth={startAuth}
        onSignOut={handleSignOut}
      />
      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "explore" && (
        <ExplorePage onNavigate={navigate} />
      )}
      {page === "city" && <CityPage onNavigate={navigate} />}
      {page === "place" && <PlacePage onNavigate={navigate} />}
      {page === "planner" && (
        <TripPlannerPage onNavigate={navigate} />
      )}
      {page === "about" && <AboutPage onNavigate={navigate} />}
      {page === "auth" && (
        <AuthPage
          mode={authMode}
          onModeChange={setAuthMode}
          onNavigate={navigate}
          onAuthSuccess={handleAuthSuccess}
          onRegistrationPending={handleRegistrationPending}
        />
      )}
      {page === "email-verify" && (
        <EmailVerificationPage
          email={pendingVerifyEmail}
          onNavigate={navigate}
          onEditEmail={() => navigate("auth")}
        />
      )}
      {page === "verify-result" && (
        <EmailVerificationResultPage onNavigate={navigate} />
      )}
      {page === "forgot-password" && (
        <ForgotPasswordPage onNavigate={navigate} />
      )}
      {page === "reset-password" && (
        <PasswordResetPage onNavigate={navigate} />
      )}
      {page === "magic-link" && (
        <MagicLinkPage onNavigate={navigate} />
      )}
      {page === "magic-link-processing" && (
        <MagicLinkProcessingPage onNavigate={navigate} onAuthSuccess={handleAuthSuccess} />
      )}
      {page === "auth-kit" && (
        <AuthStateKitPage onNavigate={navigate} />
      )}
      {page === "profile" && currentUser && (
        <ProfilePage
          user={currentUser}
          onNavigate={navigate}
          onUpdateUser={async (updatedProfile) => {
            const result = await updateProfile({
              name: updatedProfile.fullName,
              phone: updatedProfile.phone,
              location: updatedProfile.location,
              bio: updatedProfile.bio,
              travelStyle: updatedProfile.travelStyle,
              languages: updatedProfile.languages,
              newsletter: updatedProfile.newsletter,
              safetyAlerts: updatedProfile.safetyAlerts,
              themeColor: updatedProfile.themeColor,
            });
            setCurrentUser(result);
            return result;
          }}
          onSignOut={handleSignOut}
        />
      )}
      {page === "profile" && !currentUser && (
        <AuthPage
          mode="signin"
          onModeChange={setAuthMode}
          onNavigate={navigate}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}