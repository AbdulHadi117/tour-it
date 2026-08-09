export type Interest =
  | "Historical"
  | "Adventure"
  | "Nature & Valleys"
  | "Family-Friendly"
  | "Religious";

export interface ProvinceRecord {
  id: string;
  label: string;
  capital: string;
  tagline: string;
  bestSeason: string;
  geography: string;
  culture: string;
  highlights: string[];
  images: string[];
  alts: string[];
}

export interface AttractionRecord {
  id: number;
  name: string;
  city: string;
  province: string;
  interest: Interest;
  views: number;
  rating: number;
  reviews: number;
  flag: string;
  image: string;
  description: string;
}

export interface CityMapLayer {
  id: "roads" | "fuel" | "weather" | "emergency";
  label: string;
  description: string;
  visibleByDefault?: boolean;
}

export interface CityPin {
  id: number;
  label: string;
  x: number;
  y: number;
  city: string;
  layer: "road" | "fuel" | "weather" | "emergency";
  detail: string;
}

export interface TripBlock {
  id: string;
  type: "attraction" | "restaurant" | "hotel" | "transit";
  name: string;
  time: string;
  duration: string;
  costPKR: number;
  note?: string;
}

export interface TripDay {
  id: string;
  label: string;
  date: string;
  city: string;
  cityCode: string;
  blocks: TripBlock[];
}

export interface BudgetEstimate {
  accommodation: number;
  transport: number;
  food: number;
  attractions: number;
  total: number;
}

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  days: TripDay[];
  budget: BudgetEstimate;
  createdAt: string;
}

export interface ExploreCatalog {
  provinces: ProvinceRecord[];
  attractions: AttractionRecord[];
}

export interface PlaceRecord {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  website: string;
  coordinates: string;
  rating: number;
  reviewCount: number;
  verifiedBadge: boolean;
  yearBuilt: string;
  builtBy: string;
  capacity: string;
  classification: string;
}

export interface PlaceHours {
  day: string;
  open: string;
  close: string;
  note: string;
}

export interface PlacePricing {
  category: string;
  price: string;
  note: string;
}

export interface PlaceAmenity {
  label: string;
  verified: boolean;
}

export interface PlaceReview {
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

export interface PlaceDetail {
  place: PlaceRecord;
  hours: PlaceHours[];
  tickets: PlacePricing[];
  amenities: PlaceAmenity[];
  reviews: PlaceReview[];
  nearbyEat: Array<{ id: number; name: string; type: string; cuisine: string; distance: string; rating: number; image: string; price: string }>;
  nearbyStay: Array<{ id: number; name: string; type: string; distance: string; rating: number; image: string; price: string }>;
}

export interface TripPlannerSeed {
  cities: Array<{ code: string; name: string; province: string; lat: number; lng: number }>;
  savedTrips: SavedTrip[];
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const EXPLORER_DATA: ExploreCatalog = {
  provinces: [
    {
      id: "punjab",
      label: "Punjab",
      capital: "Lahore",
      tagline: "The Heartland of Civilization",
      bestSeason: "Oct – Mar",
      geography: "Pakistan's most populous province stretches across the fertile Indus plains, bounded by the Himalayas to the north and the Thar Desert to the east.",
      culture: "Punjab is the cultural powerhouse of Pakistan, home to Mughal grandeur, Sufi shrines, and a cuisine that defines the subcontinent.",
      highlights: ["Badshahi Mosque", "Lahore Fort", "Shalimar Gardens", "Wagah Border", "Taxila Ruins"],
      images: [
        "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=900&h=540&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1531804308561-b6438d25a810?w=900&h=540&fit=crop&auto=format",
      ],
      alts: ["Badshahi Mosque at dusk", "Lahore Fort exterior"],
    },
    {
      id: "sindh",
      label: "Sindh",
      capital: "Karachi",
      tagline: "Cradle of the Indus Civilisation",
      bestSeason: "Nov – Feb",
      geography: "Sindh occupies Pakistan's southeastern corner, where the Indus River fans into its delta before meeting the Arabian Sea.",
      culture: "Home to one of humanity's oldest urban civilisations at Mohenjo-daro, Sindh wears its history proudly.",
      highlights: ["Mohenjo-daro", "Makli Necropolis", "Shah Jahan Mosque", "Ranikot Fort"],
      images: [
        "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=900&h=540&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1642709441467-6816f4dec4af?w=900&h=540&fit=crop&auto=format",
      ],
      alts: ["Indus delta landscape", "Karachi waterfront"],
    },
    {
      id: "kpk",
      label: "Khyber Pakhtunkhwa",
      capital: "Peshawar",
      tagline: "Where Rivers Meet the Sky",
      bestSeason: "Apr – Oct",
      geography: "KPK is a province of dramatic contrasts — from the scorching Peshawar Vale to the snow-capped peaks of Chitral and Dir.",
      culture: "Pashtun hospitality shapes every encounter here. Peshawar's Qissa Khwani Bazaar has traded stories for centuries.",
      highlights: ["Swat Valley", "Peshawar Bazaar", "Chitral Fort", "Mahodand Lake", "Takht-i-Bahi"],
      images: [
        "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=900&h=540&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1782931024365-1f68d52a89ee?w=900&h=540&fit=crop&auto=format",
      ],
      alts: ["Swat valley river", "Mountain ridge above KPK"],
    },
    {
      id: "balochistan",
      label: "Balochistan",
      capital: "Quetta",
      tagline: "Land of Raw, Infinite Horizons",
      bestSeason: "Mar – May, Sep – Nov",
      geography: "Pakistan's largest province by area covers a vast semi-arid plateau, ancient mountain ranges, and a long coastline.",
      culture: "Baloch culture revolves around tribal traditions, soulful music, and intricate embroidery.",
      highlights: ["Quetta Fruit Market", "Makran Coastal Highway", "Ziarat Residency", "Hingol National Park"],
      images: [
        "https://images.unsplash.com/photo-1706608201359-4ac5ed8ff58e?w=900&h=540&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1663418307198-b0f1321e0841?w=900&h=540&fit=crop&auto=format",
      ],
      alts: ["Balochistan desert road", "Coastal cliffs"],
    },
    {
      id: "gb",
      label: "Gilgit-Baltistan",
      capital: "Gilgit",
      tagline: "Roof of the World",
      bestSeason: "May – Sep",
      geography: "Home to five of the world's fourteen 8,000-metre peaks — including K2 — Gilgit-Baltistan is the meeting point of the Karakoram, Hindu Kush, and Himalayan ranges.",
      culture: "The region's diverse ethnic communities maintain living traditions of polo, stone carving, and high-altitude farming on terraced slopes.",
      highlights: ["K2 Base Camp", "Hunza Valley", "Deosai Plateau", "Fairy Meadows", "Attabad Lake"],
      images: [
        "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=900&h=540&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=900&h=540&fit=crop&auto=format",
      ],
      alts: ["Karakoram peaks", "Hunza valley panorama"],
    },
  ],
  attractions: [
    { id: 1, name: "Badshahi Mosque", city: "Lahore", province: "punjab", interest: "Religious", views: 128400, rating: 4.9, reviews: 8210, flag: "Mughal Heritage", image: "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=500&h=340&fit=crop&auto=format", description: "One of the largest mosques in the world, built by Mughal Emperor Aurangzeb in 1673." },
    { id: 2, name: "Lahore Fort", city: "Lahore", province: "punjab", interest: "Historical", views: 96300, rating: 4.8, reviews: 6540, flag: "UNESCO Site", image: "https://images.unsplash.com/photo-1531804308561-b6438d25a810?w=500&h=340&fit=crop&auto=format", description: "A citadel used by the Mughal emperors, now a UNESCO World Heritage site." },
    { id: 3, name: "Mohenjo-daro", city: "Larkana", province: "sindh", interest: "Historical", views: 61400, rating: 4.9, reviews: 4110, flag: "4,500 Years Old", image: "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=500&h=340&fit=crop&auto=format", description: "One of the earliest major urban settlements, built around 2500 BCE." },
    { id: 4, name: "Swat Valley", city: "Mingora", province: "kpk", interest: "Nature & Valleys", views: 143600, rating: 4.9, reviews: 11240, flag: "Switzerland of Pakistan", image: "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=500&h=340&fit=crop&auto=format", description: "A breathtaking valley of green meadows, rivers, and mountains favoured by honeymooners." },
    { id: 5, name: "Hingol National Park", city: "Lasbela", province: "balochistan", interest: "Nature & Valleys", views: 38200, rating: 4.8, reviews: 2870, flag: "Largest Park in Pak", image: "https://images.unsplash.com/photo-1706608201359-4ac5ed8ff58e?w=500&h=340&fit=crop&auto=format", description: "Pakistan's largest national park, featuring mud volcanoes, sphinx rock formations, and coastal cliffs." },
    { id: 6, name: "K2 Base Camp", city: "Skardu", province: "gb", interest: "Adventure", views: 187400, rating: 5.0, reviews: 9870, flag: "World's 2nd Highest", image: "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=500&h=340&fit=crop&auto=format", description: "The ultimate trekker's goal: a 10-day trek to the base of the world's most formidable mountain." },
    { id: 7, name: "Hunza Valley", city: "Hunza", province: "gb", interest: "Nature & Valleys", views: 214600, rating: 4.9, reviews: 14560, flag: "Most Photographed", image: "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=500&h=340&fit=crop&auto=format", description: "Possibly Pakistan's most beloved destination — terraced apricot orchards beneath Rakaposhi's glacier." },
  ],
};

const PLACE_DATA: PlaceDetail = {
  place: {
    id: "badshahi-mosque",
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
  },
  hours: [
    { day: "Monday – Thursday", open: "06:00", close: "22:00", note: "" },
    { day: "Friday", open: "06:00", close: "22:00", note: "Non-worshippers: exit 11:30–14:00" },
    { day: "Saturday – Sunday", open: "06:00", close: "22:00", note: "Peak visitor hours" },
  ],
  tickets: [
    { category: "Pakistani Nationals", price: "Free", note: "Valid CNIC required" },
    { category: "Foreign Tourists", price: "PKR 500", note: "≈ USD 1.80 · includes Museum entry" },
    { category: "Guided Tour (1 hr)", price: "PKR 800", note: "English / Urdu · book at entrance" },
  ],
  amenities: [
    { label: "Guided Tours Available", verified: true },
    { label: "Photography Permitted", verified: true },
    { label: "Wheelchair Accessible (main court)", verified: true },
    { label: "Parking (Hazuri Bagh lot)", verified: true },
    { label: "Multi-language Audio Guides", verified: true },
    { label: "Free Wi-Fi (visitor lounge)", verified: false },
  ],
  reviews: [
    {
      id: 1,
      name: "Aisha Mahmood",
      origin: "Karachi, Pakistan",
      avatar: "https://images.unsplash.com/photo-1630494878339-9ceb4a09ef5a?w=80&h=80&fit=crop&auto=format",
      date: "June 2026",
      rating: 5,
      title: "Witnessing it at sunrise is an experience that stays with you forever",
      text: "I've visited Badshahi Mosque many times over the years but this last visit at dawn left me completely speechless.",
      helpful: 347,
      photos: [
        "https://images.unsplash.com/photo-1768084202876-a3d75afce914?w=200&h=140&fit=crop&auto=format",
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
      text: "The mosque is genuinely one of the most impressive structures in South Asia.",
      helpful: 218,
      photos: [],
      visitType: "Couple · Architecture",
      verified: true,
    },
  ],
  nearbyEat: [
    { id: 1, name: "Butt Karahi", type: "Restaurant", cuisine: "Lahori Karahi", distance: "0.3 km", rating: 4.8, image: "https://images.unsplash.com/photo-1779902431972-3433d66fd143?w=300&h=200&fit=crop&auto=format", price: "PKR 800–1,500" },
    { id: 2, name: "Waris Nihari", type: "Restaurant", cuisine: "Traditional Nihari", distance: "0.5 km", rating: 4.7, image: "https://images.unsplash.com/photo-1762922425202-2e65559c047f?w=300&h=200&fit=crop&auto=format", price: "PKR 400–900" },
  ],
  nearbyStay: [
    { id: 1, name: "Pearl Continental Lahore", type: "Luxury Hotel", distance: "2.1 km", rating: 4.7, image: "https://images.unsplash.com/photo-1629552266115-a8a3bbdebeed?w=300&h=200&fit=crop&auto=format", price: "From PKR 18,000/night" },
    { id: 2, name: "Walled City Heritage Inn", type: "Boutique Hotel", distance: "0.6 km", rating: 4.8, image: "https://images.unsplash.com/photo-1632899483117-7168ca4b0db8?w=300&h=200&fit=crop&auto=format", price: "From PKR 7,500/night" },
  ],
};

const PLANNER_SEED: TripPlannerSeed = {
  cities: [
    { code: "LHE", name: "Lahore", province: "Punjab", lat: 31.5204, lng: 74.3587 },
    { code: "ISB", name: "Islamabad", province: "ICT", lat: 33.6844, lng: 73.0479 },
    { code: "GIL", name: "Gilgit", province: "Gilgit-Baltistan", lat: 35.9202, lng: 74.3120 },
  ],
  savedTrips: [],
};

const MAP_LAYERS: Record<string, { layers: CityMapLayer[]; pins: CityPin[] }> = {
  skardu: {
    layers: [
      { id: "roads", label: "Roads", description: "Major access roads and scenic drive corridors", visibleByDefault: true },
      { id: "fuel", label: "Fuel", description: "Fuel stops and repair points along the route" },
      { id: "weather", label: "Weather", description: "Current mountain weather and wind patterns" },
      { id: "emergency", label: "Emergency", description: "Hospitals, rescue outposts, and police stations" },
    ],
    pins: [
      { id: 1, label: "Kharpocho Fort", x: 238, y: 158, city: "Skardu", layer: "road", detail: "Historic access road" },
      { id: 2, label: "Fuel Stop", x: 290, y: 198, city: "Skardu", layer: "fuel", detail: "24/7 diesel and petrol" },
      { id: 3, label: "Satpara Lake", x: 376, y: 268, city: "Skardu", layer: "weather", detail: "Cloud cover and lake wind" },
      { id: 4, label: "Rescue Post", x: 148, y: 228, city: "Skardu", layer: "emergency", detail: "District rescue checkpoint" },
      { id: 5, label: "Shigar Fort", x: 482, y: 148, city: "Shigar Valley", layer: "road", detail: "Scenic route via Shigar road" },
    ],
  },
};

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });
}

const TRIP_STORAGE_KEY = "tourit.saved.trips";

export async function fetchExploreCatalog(): Promise<ExploreCatalog> {
  return delay(EXPLORER_DATA);
}

export async function fetchPlaceDetail(placeId = "badshahi-mosque"): Promise<PlaceDetail> {
  void placeId;
  return delay(PLACE_DATA);
}

export async function fetchTripPlannerSeed(): Promise<TripPlannerSeed> {
  return delay({ ...PLANNER_SEED, savedTrips: loadSavedTrips() });
}

export async function fetchMapLayers(cityId = "skardu"): Promise<{ layers: CityMapLayer[]; pins: CityPin[] }> {
  return delay(MAP_LAYERS[cityId.toLowerCase()] ?? MAP_LAYERS.skardu);
}

export function generateItinerary(input: { destination: string; days: number; budgetPKR: number; groupSize: number }): TripDay[] {
  const baseBlocks: TripBlock[] = [
    { id: "a1", type: "hotel", name: `${input.destination} Stay`, time: "09:00", duration: "30 min", costPKR: 12000 },
    { id: "a2", type: "attraction", name: `${input.destination} Main Sight`, time: "10:00", duration: "2 hrs", costPKR: 1200 },
    { id: "a3", type: "restaurant", name: "Local Lunch", time: "13:00", duration: "1 hr", costPKR: 1800 },
    { id: "a4", type: "attraction", name: "Scenic Stop", time: "15:00", duration: "2 hrs", costPKR: 800 },
    { id: "a5", type: "restaurant", name: "Dinner", time: "19:00", duration: "1 hr", costPKR: 2200 },
  ];

  return Array.from({ length: Math.max(1, days) }, (_, index) => ({
    id: `day-${index + 1}`,
    label: `Day ${index + 1}`,
    date: `Day ${index + 1}`,
    city: input.destination,
    cityCode: input.destination.slice(0, 3).toUpperCase(),
    blocks: baseBlocks.map((block, blockIndex) => ({
      ...block,
      id: `${block.id}-${index + 1}`,
      time: `${8 + blockIndex}:${blockIndex === 0 ? "00" : "30"}`,
      costPKR: Math.round((block.costPKR * Math.max(1, input.groupSize)) * (input.budgetPKR > 0 ? 0.9 : 1)),
    })),
  }));
}

export function estimateBudget(days: TripDay[], groupSize: number): BudgetEstimate {
  const spent = days.flatMap((day) => day.blocks).reduce(
    (accumulator, block) => {
      if (block.type === "hotel") accumulator.accommodation += block.costPKR;
      if (block.type === "transit") accumulator.transport += block.costPKR;
      if (block.type === "restaurant") accumulator.food += block.costPKR;
      if (block.type === "attraction") accumulator.attractions += block.costPKR;
      return accumulator;
    },
    { accommodation: 0, transport: 0, food: 0, attractions: 0 },
  );

  return {
    accommodation: Math.round(spent.accommodation * groupSize),
    transport: Math.round(spent.transport * groupSize),
    food: Math.round(spent.food * groupSize),
    attractions: Math.round(spent.attractions * groupSize),
    total: Math.round((spent.accommodation + spent.transport + spent.food + spent.attractions) * groupSize),
  };
}

export function loadSavedTrips(): SavedTrip[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(TRIP_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as SavedTrip[];
  } catch {
    return [];
  }
}

export function saveTrip(trip: SavedTrip) {
  if (typeof window === "undefined") {
    return;
  }

  const current = loadSavedTrips();
  const next = [trip, ...current.filter((item) => item.id !== trip.id)].slice(0, 12);
  window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(next));
}
