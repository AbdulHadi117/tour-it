import { useState, useMemo } from "react";
import {
  Search,
  Star,
  MapPin,
  Eye,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Page } from "./App";

// ── Province Data ──────────────────────────────────────────────────────────

type Interest =
  | "Historical"
  | "Adventure"
  | "Nature & Valleys"
  | "Family-Friendly"
  | "Religious";

interface Attraction {
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

interface Province {
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

const PROVINCES: Province[] = [
  {
    id: "punjab",
    label: "Punjab",
    capital: "Lahore",
    tagline: "The Heartland of Civilization",
    bestSeason: "Oct – Mar",
    geography:
      "Pakistan's most populous province stretches across the fertile Indus plains, bounded by the Himalayas to the north and the Thar Desert to the east. Five rivers — Jhelum, Chenab, Ravi, Beas, and Sutlej — thread through the landscape.",
    culture:
      "Punjab is the cultural powerhouse of Pakistan, home to Mughal grandeur, Sufi shrines, and a cuisine that defines the subcontinent. The province pulses with festivals: Basant, Mela Chiraghan, and the nightly flag-lowering ceremony at Wagah Border draw visitors year-round.",
    highlights: [
      "Badshahi Mosque",
      "Lahore Fort",
      "Shalimar Gardens",
      "Wagah Border",
      "Taxila Ruins",
    ],
    images: [
      "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1531804308561-b6438d25a810?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1622546758596-f1f06ba11f58?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Badshahi Mosque red brick dome, Lahore",
      "Minar-e-Pakistan tower at dusk",
      "Lahore Fort minaret in evening light",
    ],
  },
  {
    id: "sindh",
    label: "Sindh",
    capital: "Karachi",
    tagline: "Cradle of the Indus Civilisation",
    bestSeason: "Nov – Feb",
    geography:
      "Sindh occupies Pakistan's southeastern corner, where the Indus River fans into its delta before meeting the Arabian Sea. The terrain ranges from the Thar Desert in the east to the Kirthar Mountains in the west.",
    culture:
      "Home to one of humanity's oldest urban civilisations at Mohenjo-daro, Sindh wears its history proudly. Vibrant ajrak textiles, Sufi devotional music (qawwali at Shah Abdul Latif's shrine), and a seafood culture centred on Karachi define its identity.",
    highlights: [
      "Mohenjo-daro",
      "Karachi Clifton Beach",
      "Makli Necropolis",
      "Ranikot Fort",
      "Shah Jahan Mosque",
    ],
    images: [
      "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1642709441467-6816f4dec4af?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Karachi skyline from above",
      "Sea-view buildings along the Karachi waterfront",
      "Colourful Karachi bus on a city street",
    ],
  },
  {
    id: "kpk",
    label: "Khyber Pakhtunkhwa",
    capital: "Peshawar",
    tagline: "Where Rivers Meet the Sky",
    bestSeason: "Apr – Oct",
    geography:
      "KPK is a province of dramatic contrasts — from the scorching Peshawar Vale to the snow-capped peaks of Chitral and Dir. The Swat, Kabul, and Indus rivers carve through its terrain, nourishing emerald valleys.",
    culture:
      "Pashtun hospitality (Pashtunwali code) shapes every encounter here. Peshawar's Qissa Khwani Bazaar has traded stories for centuries, while the Gandhara civilisation left its legacy at Taxila and Takht-i-Bahi.",
    highlights: [
      "Swat Valley",
      "Peshawar Bazaar",
      "Chitral Fort",
      "Mahodand Lake",
      "Takht-i-Bahi",
    ],
    images: [
      "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1782931024365-1f68d52a89ee?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Crystal-clear Swat river rushing through a rocky gorge",
      "Snow-capped peaks above KPK valleys",
      "Broad mountain ridge under an open sky",
    ],
  },
  {
    id: "balochistan",
    label: "Balochistan",
    capital: "Quetta",
    tagline: "Land of Raw, Infinite Horizons",
    bestSeason: "Mar – May, Sep – Nov",
    geography:
      "Pakistan's largest province by area covers a vast semi-arid plateau, ancient mountain ranges, and a 760 km coastline along the Arabian Sea. Makran's lunar landscapes and Ziarat's juniper forests offer stark beauty.",
    culture:
      "Baloch culture revolves around tribal traditions, soulful music (the sitar-like saroz), and intricate embroidery. Quetta's bazaars overflow with dried fruits, carpets, and the region's famed pomegranates.",
    highlights: [
      "Quetta Fruit Market",
      "Makran Coastal Highway",
      "Ziarat Residency",
      "Hingol National Park",
      "Moola Chotok",
    ],
    images: [
      "https://images.unsplash.com/photo-1706608201359-4ac5ed8ff58e?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1663418307198-b0f1321e0841?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1688667370378-00714cbe8c54?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Person walking through Balochistan desert",
      "Rocky landscape with a distant hill in Balochistan",
      "Truck on dirt road through Balochistan plains",
    ],
  },
  {
    id: "gb",
    label: "Gilgit-Baltistan",
    capital: "Gilgit",
    tagline: "Roof of the World",
    bestSeason: "May – Sep",
    geography:
      "Home to five of the world's fourteen 8,000-metre peaks — including K2 — Gilgit-Baltistan is the meeting point of the Karakoram, Hindu Kush, and Himalayan ranges. Hunza, Skardu, and Nagar valleys sit amidst some of the planet's most dramatic scenery.",
    culture:
      "The region's diverse ethnic communities — Shina, Burusho, and Balti — maintain living traditions of polo, stone carving, and high-altitude farming on terraced slopes. The ancient Silk Road passed through Gilgit, leaving Buddhist rock carvings still visible today.",
    highlights: [
      "K2 Base Camp",
      "Hunza Valley",
      "Deosai Plateau",
      "Fairy Meadows",
      "Attabad Lake",
    ],
    images: [
      "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1753696252581-3fec5cf1b825?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Passu Cones jagged peaks above cloud line",
      "Mountain range rising above Hunza valley",
      "Snow-capped peaks of the Karakoram at dusk",
    ],
  },
  {
    id: "ajk",
    label: "Azad Jammu & Kashmir",
    capital: "Muzaffarabad",
    tagline: "Heaven's Green Embrace",
    bestSeason: "Apr – Oct",
    geography:
      "AJK's landscape is defined by dense pine forests, alpine meadows, and glacial lakes carved into the Himalayan foothills. The Neelum River flows through its namesake valley, flanked by peaks rising above 6,000 metres.",
    culture:
      "Kashmiri culture blends Persian influences with mountain traditions — pashmina weaving, walnut-wood craftsmanship, and a cuisine centred on wazwan feasts. Ratti Gali Lake and Shounter Valley attract trekkers seeking solitude.",
    highlights: [
      "Neelum Valley",
      "Ratti Gali Lake",
      "Muzaffarabad Fort",
      "Shounter Valley",
      "Nanga Parbat View",
    ],
    images: [
      "https://images.unsplash.com/photo-1691075622149-2f2c4e02b7cf?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1562913346-61ae3ab9277e?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1753696252568-01a80996daed?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Alpine wildflowers in AJK meadow",
      "Hunza valley seen from above the lake",
      "Snow-capped peaks at sunset in AJK",
    ],
  },
  {
    id: "ict",
    label: "Islamabad Capital Territory",
    capital: "Islamabad",
    tagline: "A Capital Carved From Nature",
    bestSeason: "Oct – Apr",
    geography:
      "Nestled against the Margalla Hills, Islamabad was master-planned in the 1960s with wide boulevards, embassy enclaves, and forested sectors. Rawal Lake provides the city's water supply and a leafy urban park.",
    culture:
      "As Pakistan's administrative capital, Islamabad houses world-class museums, the iconic Faisal Mosque, and the bustling Lok Virsa Folk Heritage Institute. The city's multicultural population gives it a cosmopolitan yet relaxed energy.",
    highlights: [
      "Faisal Mosque",
      "Margalla Hills Trails",
      "Daman-e-Koh",
      "Pakistan Monument",
      "Lok Virsa Museum",
    ],
    images: [
      "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605795733251-a0b6c96d9dea?w=900&h=540&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1603491656337-3b491147917c?w=900&h=540&fit=crop&auto=format",
    ],
    alts: [
      "Faisal Mosque white architecture under blue sky",
      "Faisal Mosque facade and courtyard",
      "Lahore-style mosque architecture",
    ],
  },
];

const ALL_ATTRACTIONS: Attraction[] = [
  // Punjab
  {
    id: 1,
    name: "Badshahi Mosque",
    city: "Lahore",
    province: "punjab",
    interest: "Religious",
    views: 128400,
    rating: 4.9,
    reviews: 8210,
    flag: "Mughal Heritage",
    image:
      "https://images.unsplash.com/photo-1653673662935-ae19b645096f?w=500&h=340&fit=crop&auto=format",
    description:
      "One of the largest mosques in the world, built by Mughal Emperor Aurangzeb in 1673.",
  },
  {
    id: 2,
    name: "Lahore Fort",
    city: "Lahore",
    province: "punjab",
    interest: "Historical",
    views: 96300,
    rating: 4.8,
    reviews: 6540,
    flag: "UNESCO Site",
    image:
      "https://images.unsplash.com/photo-1531804308561-b6438d25a810?w=500&h=340&fit=crop&auto=format",
    description:
      "A citadel used by the Mughal emperors, now a UNESCO World Heritage site.",
  },
  {
    id: 3,
    name: "Taxila Ruins",
    city: "Taxila",
    province: "punjab",
    interest: "Historical",
    views: 44200,
    rating: 4.7,
    reviews: 3120,
    flag: "Ancient Civilisation",
    image:
      "https://images.unsplash.com/photo-1622546758596-f1f06ba11f58?w=500&h=340&fit=crop&auto=format",
    description:
      "An ancient city with ruins dating back 2,500 years, once a centre of Gandhara civilisation.",
  },
  {
    id: 4,
    name: "Wagah Border",
    city: "Lahore",
    province: "punjab",
    interest: "Family-Friendly",
    views: 72100,
    rating: 4.6,
    reviews: 5480,
    flag: "Iconic Experience",
    image:
      "https://images.unsplash.com/photo-1600434890250-44df6e4c0d05?w=500&h=340&fit=crop&auto=format",
    description:
      "Daily flag-lowering ceremony at the Pakistan-India border, a spectacle of national pride.",
  },
  {
    id: 5,
    name: "Shalimar Gardens",
    city: "Lahore",
    province: "punjab",
    interest: "Historical",
    views: 51800,
    rating: 4.7,
    reviews: 4320,
    flag: "UNESCO Site",
    image:
      "https://images.unsplash.com/photo-1603491656337-3b491147917c?w=500&h=340&fit=crop&auto=format",
    description:
      "Magnificent 17th-century Mughal garden with three terraces, fountains, and marble pavilions.",
  },
  {
    id: 6,
    name: "Data Darbar Shrine",
    city: "Lahore",
    province: "punjab",
    interest: "Religious",
    views: 89600,
    rating: 4.8,
    reviews: 7910,
    flag: "Sufi Heritage",
    image:
      "https://images.unsplash.com/photo-1531804308561-b6438d25a810?w=500&h=340&fit=crop&auto=format",
    description:
      "Pakistan's largest Sufi shrine, dedicated to Data Ganj Bakhsh, a revered 11th-century saint.",
  },
  // Sindh
  {
    id: 7,
    name: "Mohenjo-daro",
    city: "Larkana",
    province: "sindh",
    interest: "Historical",
    views: 61400,
    rating: 4.9,
    reviews: 4110,
    flag: "4,500 Years Old",
    image:
      "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=500&h=340&fit=crop&auto=format",
    description:
      "One of the earliest major urban settlements, built around 2500 BCE.",
  },
  {
    id: 8,
    name: "Karachi Clifton Beach",
    city: "Karachi",
    province: "sindh",
    interest: "Family-Friendly",
    views: 115200,
    rating: 4.3,
    reviews: 9870,
    flag: "Urban Escape",
    image:
      "https://images.unsplash.com/photo-1642709441467-6816f4dec4af?w=500&h=340&fit=crop&auto=format",
    description:
      "The most popular beach in Karachi, lined with food stalls, camel rides, and sunset views.",
  },
  {
    id: 9,
    name: "Makli Necropolis",
    city: "Thatta",
    province: "sindh",
    interest: "Historical",
    views: 28900,
    rating: 4.8,
    reviews: 2340,
    flag: "UNESCO Site",
    image:
      "https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?w=500&h=340&fit=crop&auto=format",
    description:
      "One of the world's largest funerary sites, housing tombs spanning four dynasties.",
  },
  {
    id: 10,
    name: "Ranikot Fort",
    city: "Sann",
    province: "sindh",
    interest: "Historical",
    views: 19700,
    rating: 4.7,
    reviews: 1560,
    flag: "World's Largest Fort",
    image:
      "https://images.unsplash.com/photo-1721988277528-06a27beb1811?w=500&h=340&fit=crop&auto=format",
    description:
      "Nicknamed the Great Wall of Sindh, this massive fort spans over 26 km of perimeter walls.",
  },
  {
    id: 11,
    name: "Keenjhar Lake",
    city: "Thatta",
    province: "sindh",
    interest: "Nature & Valleys",
    views: 34500,
    rating: 4.5,
    reviews: 2780,
    flag: "Natural Lake",
    image:
      "https://images.unsplash.com/photo-1642709441467-6816f4dec4af?w=500&h=340&fit=crop&auto=format",
    description:
      "Pakistan's second-largest freshwater lake, a serene escape surrounded by mangroves.",
  },
  {
    id: 12,
    name: "Shah Jahan Mosque",
    city: "Thatta",
    province: "sindh",
    interest: "Religious",
    views: 22300,
    rating: 4.9,
    reviews: 1890,
    flag: "Mughal Architecture",
    image:
      "https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?w=500&h=340&fit=crop&auto=format",
    description:
      "A magnificent 17th-century mosque famous for its 93 domes with acoustic perfection.",
  },
  // KPK
  {
    id: 13,
    name: "Swat Valley",
    city: "Mingora",
    province: "kpk",
    interest: "Nature & Valleys",
    views: 143600,
    rating: 4.9,
    reviews: 11240,
    flag: "Switzerland of Pakistan",
    image:
      "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=500&h=340&fit=crop&auto=format",
    description:
      "A breathtaking valley of green meadows, rivers, and mountains favoured by honeymooners.",
  },
  {
    id: 14,
    name: "Chitral Fort",
    city: "Chitral",
    province: "kpk",
    interest: "Historical",
    views: 31200,
    rating: 4.7,
    reviews: 2450,
    flag: "Royal Heritage",
    image:
      "https://images.unsplash.com/photo-1782931024365-1f68d52a89ee?w=500&h=340&fit=crop&auto=format",
    description:
      "A historic fort that served as the seat of the Mehtar of Chitral for centuries.",
  },
  {
    id: 15,
    name: "Mahodand Lake",
    city: "Kalam",
    province: "kpk",
    interest: "Nature & Valleys",
    views: 57800,
    rating: 4.9,
    reviews: 4320,
    flag: "Alpine Lake",
    image:
      "https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=500&h=340&fit=crop&auto=format",
    description:
      "A stunning alpine lake at 2,800m surrounded by snow-capped peaks in the upper Swat Valley.",
  },
  {
    id: 16,
    name: "Takht-i-Bahi",
    city: "Mardan",
    province: "kpk",
    interest: "Historical",
    views: 24100,
    rating: 4.8,
    reviews: 1970,
    flag: "Gandhara Buddhist",
    image:
      "https://images.unsplash.com/photo-1724142923909-fc4b0c3a2a32?w=500&h=340&fit=crop&auto=format",
    description:
      "A UNESCO-listed Buddhist monastery from the 1st century CE, remarkably well preserved.",
  },
  {
    id: 17,
    name: "Kalash Valleys",
    city: "Chitral",
    province: "kpk",
    interest: "Adventure",
    views: 68400,
    rating: 4.9,
    reviews: 5610,
    flag: "Unique Culture",
    image:
      "https://images.unsplash.com/photo-1782931024365-1f68d52a89ee?w=500&h=340&fit=crop&auto=format",
    description:
      "Home to the Kalash people, an ancient community maintaining pre-Islamic traditions and festivals.",
  },
  {
    id: 18,
    name: "Malam Jabba Ski Resort",
    city: "Malam Jabba",
    province: "kpk",
    interest: "Adventure",
    views: 82300,
    rating: 4.6,
    reviews: 6780,
    flag: "Ski Destination",
    image:
      "https://images.unsplash.com/photo-1626440847069-d8073e1a0cca?w=500&h=340&fit=crop&auto=format",
    description:
      "Pakistan's premier ski resort, offering slopes at over 2,800m elevation in the Swat hills.",
  },
  // Balochistan
  {
    id: 19,
    name: "Hingol National Park",
    city: "Lasbela",
    province: "balochistan",
    interest: "Nature & Valleys",
    views: 38200,
    rating: 4.8,
    reviews: 2870,
    flag: "Largest Park in Pak",
    image:
      "https://images.unsplash.com/photo-1706608201359-4ac5ed8ff58e?w=500&h=340&fit=crop&auto=format",
    description:
      "Pakistan's largest national park, featuring mud volcanoes, sphinx rock formations, and coastal cliffs.",
  },
  {
    id: 20,
    name: "Moola Chotok",
    city: "Khuzdar",
    province: "balochistan",
    interest: "Adventure",
    views: 26700,
    rating: 4.9,
    reviews: 1980,
    flag: "Hidden Gem",
    image:
      "https://images.unsplash.com/photo-1663418307198-b0f1321e0841?w=500&h=340&fit=crop&auto=format",
    description:
      "A dramatic gorge with crystal-clear pools tucked inside a desert landscape.",
  },
  {
    id: 21,
    name: "Ziarat Residency",
    city: "Ziarat",
    province: "balochistan",
    interest: "Historical",
    views: 19400,
    rating: 4.7,
    reviews: 1540,
    flag: "Colonial Heritage",
    image:
      "https://images.unsplash.com/photo-1688667370378-00714cbe8c54?w=500&h=340&fit=crop&auto=format",
    description:
      "The last residence of Muhammad Ali Jinnah, set among the world's second-largest juniper forest.",
  },
  {
    id: 22,
    name: "Makran Coastal Highway",
    city: "Gwadar",
    province: "balochistan",
    interest: "Adventure",
    views: 44500,
    rating: 4.8,
    reviews: 3320,
    flag: "Scenic Drive",
    image:
      "https://images.unsplash.com/photo-1706608201359-4ac5ed8ff58e?w=500&h=340&fit=crop&auto=format",
    description:
      "A 650 km coastal highway running along the Arabian Sea, passing stunning sea stacks and cliffs.",
  },
  {
    id: 23,
    name: "Quetta Hanna Lake",
    city: "Quetta",
    province: "balochistan",
    interest: "Family-Friendly",
    views: 31200,
    rating: 4.5,
    reviews: 2560,
    flag: "City Retreat",
    image:
      "https://images.unsplash.com/photo-1663418307198-b0f1321e0841?w=500&h=340&fit=crop&auto=format",
    description:
      "A scenic lake surrounded by rocky hills, popular for picnics and boating on Quetta's outskirts.",
  },
  {
    id: 24,
    name: "Princess of Hope Rock",
    city: "Makran",
    province: "balochistan",
    interest: "Nature & Valleys",
    views: 23100,
    rating: 4.7,
    reviews: 1870,
    flag: "Natural Wonder",
    image:
      "https://images.unsplash.com/photo-1688667370378-00714cbe8c54?w=500&h=340&fit=crop&auto=format",
    description:
      "A natural rock formation eroded by wind into the shape of a standing woman on the Makran coast.",
  },
  // GB
  {
    id: 25,
    name: "K2 Base Camp",
    city: "Skardu",
    province: "gb",
    interest: "Adventure",
    views: 187400,
    rating: 5.0,
    reviews: 9870,
    flag: "World's 2nd Highest",
    image:
      "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=500&h=340&fit=crop&auto=format",
    description:
      "The ultimate trekker's goal: a 10-day trek to the base of the world's most formidable mountain.",
  },
  {
    id: 26,
    name: "Hunza Valley",
    city: "Hunza",
    province: "gb",
    interest: "Nature & Valleys",
    views: 214600,
    rating: 4.9,
    reviews: 14560,
    flag: "Most Photographed",
    image:
      "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=500&h=340&fit=crop&auto=format",
    description:
      "Possibly Pakistan's most beloved destination — terraced apricot orchards beneath Rakaposhi's glacier.",
  },
  {
    id: 27,
    name: "Deosai Plains",
    city: "Skardu",
    province: "gb",
    interest: "Nature & Valleys",
    views: 76300,
    rating: 4.9,
    reviews: 5430,
    flag: "World's Highest Plateau",
    image:
      "https://images.unsplash.com/photo-1753696252581-3fec5cf1b825?w=500&h=340&fit=crop&auto=format",
    description:
      "At 4,114m, the Deosai is one of the world's highest plateaus and a sanctuary for brown bears.",
  },
  {
    id: 28,
    name: "Fairy Meadows",
    city: "Diamer",
    province: "gb",
    interest: "Adventure",
    views: 138200,
    rating: 4.9,
    reviews: 10210,
    flag: "Iconic Trek",
    image:
      "https://images.unsplash.com/photo-1753696252683-8e4d81bbc560?w=500&h=340&fit=crop&auto=format",
    description:
      "A flower-carpeted alpine meadow with front-row views of Nanga Parbat's Raikot Face.",
  },
  {
    id: 29,
    name: "Attabad Lake",
    city: "Hunza",
    province: "gb",
    interest: "Family-Friendly",
    views: 94500,
    rating: 4.8,
    reviews: 7840,
    flag: "Turquoise Lake",
    image:
      "https://images.unsplash.com/photo-1660387269357-3dc4a654b675?w=500&h=340&fit=crop&auto=format",
    description:
      "An impossibly turquoise lake formed by a 2010 landslide, now one of GB's most-visited sights.",
  },
  {
    id: 30,
    name: "Baltit Fort",
    city: "Hunza",
    province: "gb",
    interest: "Historical",
    views: 61800,
    rating: 4.8,
    reviews: 4980,
    flag: "700 Year Old Fort",
    image:
      "https://images.unsplash.com/photo-1753696252581-3fec5cf1b825?w=500&h=340&fit=crop&auto=format",
    description:
      "A restored 700-year-old fort that was the seat of the Mir of Hunza, with panoramic mountain views.",
  },
  // AJK
  {
    id: 31,
    name: "Neelum Valley",
    city: "Neelum",
    province: "ajk",
    interest: "Nature & Valleys",
    views: 124300,
    rating: 4.9,
    reviews: 9120,
    flag: "River Valley",
    image:
      "https://images.unsplash.com/photo-1691075622149-2f2c4e02b7cf?w=500&h=340&fit=crop&auto=format",
    description:
      "A 240 km valley of turquoise river, dense cedar forests, and meadows along the Line of Control.",
  },
  {
    id: 32,
    name: "Ratti Gali Lake",
    city: "Dawarian",
    province: "ajk",
    interest: "Adventure",
    views: 68900,
    rating: 5.0,
    reviews: 4520,
    flag: "Alpine Jewel",
    image:
      "https://images.unsplash.com/photo-1562913346-61ae3ab9277e?w=500&h=340&fit=crop&auto=format",
    description:
      "A glacial lake at 3,700m accessible by a 10 km trek, ringed by peaks above 5,000m.",
  },
  {
    id: 33,
    name: "Shounter Valley",
    city: "Shounter",
    province: "ajk",
    interest: "Nature & Valleys",
    views: 31400,
    rating: 4.8,
    reviews: 2340,
    flag: "Remote Wilderness",
    image:
      "https://images.unsplash.com/photo-1753696252568-01a80996daed?w=500&h=340&fit=crop&auto=format",
    description:
      "A secluded valley with waterfalls, alpine pastures, and the Shounter Pass into GB.",
  },
  {
    id: 34,
    name: "Muzaffarabad Fort",
    city: "Muzaffarabad",
    province: "ajk",
    interest: "Historical",
    views: 22700,
    rating: 4.6,
    reviews: 1780,
    flag: "Red Fort Ruins",
    image:
      "https://images.unsplash.com/photo-1691075622149-2f2c4e02b7cf?w=500&h=340&fit=crop&auto=format",
    description:
      "A 16th-century fort overlooking the confluence of the Neelum and Jhelum rivers.",
  },
  {
    id: 35,
    name: "Kel Village",
    city: "Kel",
    province: "ajk",
    interest: "Family-Friendly",
    views: 41200,
    rating: 4.8,
    reviews: 3210,
    flag: "Fairytale Village",
    image:
      "https://images.unsplash.com/photo-1562913346-61ae3ab9277e?w=500&h=340&fit=crop&auto=format",
    description:
      "A picturesque riverside village considered the gateway to the upper Neelum Valley's wilder reaches.",
  },
  {
    id: 36,
    name: "Chinari Meadow",
    city: "Muzaffarabad",
    province: "ajk",
    interest: "Family-Friendly",
    views: 28500,
    rating: 4.7,
    reviews: 2120,
    flag: "Green Escape",
    image:
      "https://images.unsplash.com/photo-1753696252568-01a80996daed?w=500&h=340&fit=crop&auto=format",
    description:
      "Lush meadows on the banks of the Neelum River, shaded by ancient chinara (plane) trees.",
  },
  // ICT
  {
    id: 37,
    name: "Faisal Mosque",
    city: "Islamabad",
    province: "ict",
    interest: "Religious",
    views: 196400,
    rating: 4.9,
    reviews: 15670,
    flag: "Iconic Landmark",
    image:
      "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?w=500&h=340&fit=crop&auto=format",
    description:
      "The largest mosque in South Asia, its tent-like structure framed by the Margalla Hills.",
  },
  {
    id: 38,
    name: "Margalla Hills Trails",
    city: "Islamabad",
    province: "ict",
    interest: "Adventure",
    views: 87400,
    rating: 4.7,
    reviews: 7230,
    flag: "Urban Wilderness",
    image:
      "https://images.unsplash.com/photo-1605795733251-a0b6c96d9dea?w=500&h=340&fit=crop&auto=format",
    description:
      "A network of hiking trails starting minutes from the city centre, home to monkeys and leopards.",
  },
  {
    id: 39,
    name: "Pakistan Monument",
    city: "Islamabad",
    province: "ict",
    interest: "Historical",
    views: 112300,
    rating: 4.8,
    reviews: 9450,
    flag: "National Symbol",
    image:
      "https://images.unsplash.com/photo-1623261216813-fbbe4fb7df44?w=500&h=340&fit=crop&auto=format",
    description:
      "A star-shaped granite monument representing Pakistan's four provinces and three territories.",
  },
  {
    id: 40,
    name: "Lok Virsa Museum",
    city: "Islamabad",
    province: "ict",
    interest: "Historical",
    views: 44700,
    rating: 4.8,
    reviews: 3560,
    flag: "Living Culture",
    image:
      "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?w=500&h=340&fit=crop&auto=format",
    description:
      "Pakistan's premier folk heritage museum, with crafts, textiles, and traditional music archives.",
  },
  {
    id: 41,
    name: "Daman-e-Koh",
    city: "Islamabad",
    province: "ict",
    interest: "Family-Friendly",
    views: 73200,
    rating: 4.6,
    reviews: 6120,
    flag: "Panoramic Viewpoint",
    image:
      "https://images.unsplash.com/photo-1605795733251-a0b6c96d9dea?w=500&h=340&fit=crop&auto=format",
    description:
      "A hilltop viewpoint in the Margalla Hills offering a sweeping panorama of the entire capital.",
  },
  {
    id: 42,
    name: "Rawal Lake",
    city: "Islamabad",
    province: "ict",
    interest: "Family-Friendly",
    views: 58900,
    rating: 4.5,
    reviews: 4870,
    flag: "City Reservoir",
    image:
      "https://images.unsplash.com/photo-1623261216813-fbbe4fb7df44?w=500&h=340&fit=crop&auto=format",
    description:
      "A serene artificial lake on the city's edge, popular for boating, picnics, and waterside walks.",
  },
];

const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "Historical", label: "Historical" },
  { value: "Adventure", label: "Adventure Tourism" },
  { value: "Nature & Valleys", label: "Nature & Valleys" },
  { value: "Family-Friendly", label: "Family-Friendly" },
  { value: "Religious", label: "Religious Tourism" },
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
            size={11}
            className={
              i <= Math.round(rating)
                ? "fill-[#E8A33D] text-[#E8A33D]"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-[#E8A33D]">
        {rating}
      </span>
      <span className="text-[11px] text-[#6B7280]">
        ({count.toLocaleString()})
      </span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ExplorePage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [activeProvince, setActiveProvince] =
    useState("punjab");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<
    Set<Interest>
  >(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const availableCities = useMemo(() => {
    const cities = ALL_ATTRACTIONS.filter(
      (a) => a.province === activeProvince,
    ).map((a) => a.city);
    return Array.from(new Set(cities)).sort();
  }, [activeProvince]);

  const province = PROVINCES.find(
    (p) => p.id === activeProvince,
  )!;

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.has(interest)
        ? next.delete(interest)
        : next.add(interest);
      return next;
    });
  };

  const filteredAttractions = useMemo(() => {
    return ALL_ATTRACTIONS.filter((a) => {
      const matchProvince = a.province === activeProvince;
      const matchSearch =
        searchQuery === "" ||
        a.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        a.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchInterest =
        selectedInterests.size === 0 ||
        selectedInterests.has(a.interest);
      const matchCity =
        selectedCity === "" ||
        a.city.toLowerCase() === selectedCity.toLowerCase();
      return (
        matchProvince &&
        matchSearch &&
        matchInterest &&
        matchCity
      );
    });
  }, [
    activeProvince,
    searchQuery,
    selectedInterests,
    selectedCity,
  ]);

  const switchProvince = (id: string) => {
    setActiveProvince(id);
    setCarouselIndex(0);
    setSelectedInterests(new Set());
    setSearchQuery("");
    setSelectedCity("");
  };

  const prevSlide = () =>
    setCarouselIndex((i) =>
      i === 0 ? province.images.length - 1 : i - 1,
    );
  const nextSlide = () =>
    setCarouselIndex((i) =>
      i === province.images.length - 1 ? 0 : i + 1,
    );

  return (
    <div
      className="bg-[#FAF8F3] min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── TOP BANNER ──────────────────────────────────────────────────── */}
      <div
        className="bg-white border-b border-[#DDD6C7]"
        style={{ minHeight: 200 }}
      >
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#6B7280] mb-5">
            <button
              onClick={() => onNavigate("home")}
              className="hover:text-[#0E8C88] transition-colors"
            >
              Home
            </button>
            <ChevronRight size={12} />
            <span className="text-[#12233A] font-medium">
              Explore Destinations
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[#0E8C88] text-xs font-bold uppercase tracking-widest mb-2">
                Province & Territory Explorer
              </p>
              <h1
                className="text-[#12233A] leading-tight mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                  fontWeight: 700,
                }}
              >
                Discover Pakistan
                <br />
                <em className="not-italic text-[#0E8C88]">
                  Province by Province
                </em>
              </h1>
              <p className="text-[#6B7280] text-sm max-w-lg">
                Seven distinct territories, each with its own
                geography, culture, and unmissable attractions.
                Start exploring below.
              </p>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-white border border-[#DDD6C7] rounded-xl px-4 py-3 shadow-sm w-full lg:w-80 focus-within:border-[#0E8C88] focus-within:ring-2 focus-within:ring-[#0E8C88]/20 transition-all">
              <Search
                size={16}
                className="text-[#6B7280] shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities or landmarks…"
                className="flex-1 bg-transparent text-sm text-[#12233A] outline-none placeholder:text-[#12233A]/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} className="text-[#6B7280]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TERRITORY NAVIGATION BAR ────────────────────────────────────── */}
      <div className="bg-white border-b border-[#DDD6C7] sticky top-[80px] z-40">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
          <div className="flex items-stretch overflow-x-auto scrollbar-hide gap-0">
            {PROVINCES.map((prov) => {
              const active = prov.id === activeProvince;
              return (
                <button
                  key={prov.id}
                  onClick={() => switchProvince(prov.id)}
                  className={`relative flex flex-col items-center justify-center px-5 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 shrink-0 ${
                    active
                      ? "text-[#0E8C88] border-[#0E8C88] bg-[#EBF7F6]/40"
                      : "text-[#12233A]/55 border-transparent hover:text-[#12233A] hover:border-[#DDD6C7]"
                  }`}
                >
                  {prov.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0E8C88]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-10 space-y-10">
        {/* ── PROVINCE OVERVIEW PANEL ──────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-[#DDD6C7] bg-white shadow-sm">
          {/* Left — text details (40%) */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EBF7F6] rounded-full px-3 py-1 mb-4">
                <MapPin size={12} className="text-[#0E8C88]" />
                <span className="text-[11px] text-[#0E8C88] font-bold uppercase tracking-wider">
                  {province.capital} · Capital
                </span>
              </div>
              <h2
                className="text-[#12233A] mb-1 leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                }}
              >
                {province.label}
              </h2>
              <p className="text-[#0E8C88] text-sm font-medium italic mb-5">
                {province.tagline}
              </p>

              {/* Best season */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 bg-[#E8A33D]/10 border border-[#E8A33D]/30 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
                  <span className="text-[11px] font-bold text-[#E8A33D] uppercase tracking-wider">
                    Best Season: {province.bestSeason}
                  </span>
                </div>
              </div>

              {/* Geography */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-[#12233A]/40 uppercase tracking-widest mb-1.5">
                  Geography
                </h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {province.geography}
                </p>
              </div>

              {/* Culture */}
              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-[#12233A]/40 uppercase tracking-widest mb-1.5">
                  Culture & People
                </h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {province.culture}
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-[10px] font-bold text-[#12233A]/40 uppercase tracking-widest mb-2.5">
                Top Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {province.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs font-medium text-[#12233A] bg-[#FAF8F3] border border-[#DDD6C7] rounded-full px-3 py-1"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Photo carousel (60%) */}
          <div
            className="lg:col-span-3 relative bg-[#12233A] overflow-hidden"
            style={{ minHeight: 380 }}
          >
            {/* Slides */}
            {province.images.map((img, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === carouselIndex ? 1 : 0 }}
              >
                <img
                  src={img}
                  alt={province.alts[i]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/50 to-transparent" />
              </div>
            ))}

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <p className="text-white/70 text-xs mb-1">
                {province.alts[carouselIndex]}
              </p>
              <div className="flex items-center gap-2">
                {province.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === carouselIndex
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Prev / Next */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide counter badge */}
            <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {carouselIndex + 1} / {province.images.length}
            </div>
          </div>
        </section>

        {/* ── CITY SELECTION BAR ────────────────────────────────────────── */}
        <div className="bg-white border border-[#DDD6C7] rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF7F6] flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-[#0E8C88]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12233A]">
                Filter by City in {province.label}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Select a specific city to view its local
                destinations and attractions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-64 bg-[#FAF8F3] border border-[#DDD6C7] text-[#12233A] text-sm rounded-lg px-4 py-2.5 font-medium focus:outline-none focus:border-[#0E8C88] focus:ring-2 focus:ring-[#0E8C88]/20 cursor-pointer transition-all"
            >
              <option value="">
                All Cities in {province.label}
              </option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity("")}
                className="text-xs font-semibold text-[#0E8C88] hover:underline whitespace-nowrap px-2"
              >
                Clear City
              </button>
            )}
          </div>
        </div>

        {/* ── FILTER + GRID BODY ───────────────────────────────────────── */}
        <div className="flex gap-7 items-start">
          {/* Sidebar — 25% */}
          <aside className="hidden lg:flex flex-col gap-0 w-64 shrink-0 bg-white rounded-xl border border-[#DDD6C7] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD6C7]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={15}
                  className="text-[#0E8C88]"
                />
                <span className="text-sm font-bold text-[#12233A]">
                  Filter
                </span>
              </div>
              {selectedInterests.size > 0 && (
                <button
                  onClick={() =>
                    setSelectedInterests(new Set())
                  }
                  className="text-[11px] font-semibold text-[#0E8C88] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Interest filters */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold text-[#12233A]/40 uppercase tracking-widest mb-4">
                Travel Interests
              </p>
              <div className="flex flex-col gap-0">
                {INTEREST_OPTIONS.map(({ value, label }) => {
                  const checked = selectedInterests.has(value);
                  const count = ALL_ATTRACTIONS.filter(
                    (a) =>
                      a.province === activeProvince &&
                      a.interest === value,
                  ).length;
                  return (
                    <label
                      key={value}
                      className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors select-none ${
                        checked
                          ? "bg-[#EBF7F6]"
                          : "hover:bg-[#FAF8F3]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            checked
                              ? "bg-[#0E8C88] border-[#0E8C88]"
                              : "border-[#DDD6C7]"
                          }`}
                        >
                          {checked && (
                            <svg
                              viewBox="0 0 10 8"
                              className="w-2.5 h-2.5 fill-none stroke-white stroke-2"
                            >
                              <path
                                d="M1 4l2.5 2.5L9 1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${checked ? "text-[#0E8C88] font-semibold" : "text-[#12233A]/70 font-medium"}`}
                        >
                          {label}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${checked ? "bg-[#0E8C88] text-white" : "bg-[#F0EDE6] text-[#6B7280]"}`}
                      >
                        {count}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleInterest(value)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#DDD6C7] mx-6" />

            {/* Results count */}
            <div className="px-6 py-4">
              <p className="text-[11px] text-[#6B7280]">
                Showing{" "}
                <span className="font-bold text-[#12233A]">
                  {filteredAttractions.length}
                </span>{" "}
                {filteredAttractions.length === 1
                  ? "result"
                  : "results"}
                {(selectedInterests.size > 0 ||
                  selectedCity !== "") &&
                  " with filters"}
              </p>
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden w-full">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-[#12233A] bg-white border border-[#DDD6C7] px-4 py-2.5 rounded-lg"
            >
              <SlidersHorizontal
                size={15}
                className="text-[#0E8C88]"
              />
              Filters{" "}
              {selectedInterests.size > 0 &&
                `(${selectedInterests.size})`}
            </button>
          </div>

          {/* ── Attractions grid — 75% ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Grid header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3
                  className="text-[#12233A] font-bold text-base"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {selectedCity
                    ? `${selectedCity} Attractions`
                    : `${province.label} Attractions`}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {filteredAttractions.length} destinations
                  {selectedInterests.size > 0 ||
                  selectedCity !== ""
                    ? ` · filtered`
                    : ""}
                </p>
              </div>
              {(selectedInterests.size > 0 ||
                selectedCity !== "") && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E8C88] bg-[#EBF7F6] border border-[#0E8C88]/20 rounded-full px-3 py-1">
                      City: {selectedCity}
                      <button
                        onClick={() => setSelectedCity("")}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {Array.from(selectedInterests).map(
                    (interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E8C88] bg-[#EBF7F6] border border-[#0E8C88]/20 rounded-full px-3 py-1"
                      >
                        {interest}
                        <button
                          onClick={() =>
                            toggleInterest(interest)
                          }
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>

            {filteredAttractions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F0EDE6] flex items-center justify-center mb-4">
                  <Search
                    size={24}
                    className="text-[#6B7280]"
                  />
                </div>
                <p className="text-[#12233A] font-semibold mb-1">
                  No results found
                </p>
                <p className="text-sm text-[#6B7280]">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedInterests(new Set());
                    setSearchQuery("");
                    setSelectedCity("");
                  }}
                  className="mt-4 text-sm font-semibold text-[#0E8C88] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAttractions.map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple footer strip */}
      <div className="border-t border-[#DDD6C7] bg-white mt-12 py-8">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © 2026 Sair-e-Pakistan · All destinations verified
            by local contributors
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E8C88] hover:underline"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Attraction Card ────────────────────────────────────────────────────────
function AttractionCard({
  attraction,
  onNavigate,
}: {
  attraction: Attraction;
  onNavigate: (p: Page) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const interestColor: Record<Interest, string> = {
    Historical: "bg-amber-50 text-amber-700 border-amber-200",
    Adventure:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Nature & Valleys":
      "bg-teal-50 text-teal-700 border-teal-200",
    "Family-Friendly": "bg-sky-50 text-sky-700 border-sky-200",
    Religious: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-[8px] overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        border: hovered
          ? "1.5px solid #0E8C88"
          : "1.5px solid #DDD6C7",
        boxShadow: hovered
          ? "0 12px 28px rgba(14,140,136,0.12), 0 2px 6px rgba(14,140,136,0.08)"
          : "0 1px 4px rgba(18,35,58,0.06)",
        transform: hovered
          ? "translateY(-2px)"
          : "translateY(0)",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-[#F0EDE6]">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12233A]/45 to-transparent" />

        {/* Flag label */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-[#12233A]/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {attraction.flag}
          </span>
        </div>

        {/* View count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye size={11} className="text-white/80" />
          <span className="text-[10px] text-white font-medium">
            {attraction.views >= 1000
              ? `${(attraction.views / 1000).toFixed(0)}k`
              : attraction.views}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Interest tag */}
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 mb-2 ${interestColor[attraction.interest]}`}
        >
          {attraction.interest}
        </span>

        <h3
          className="text-[#12233A] font-bold leading-tight mb-0.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
          }}
        >
          {attraction.name}
        </h3>

        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] mb-2">
          <MapPin size={10} className="text-[#0E8C88]" />
          {attraction.city}
        </div>

        <p className="text-xs text-[#6B7280] leading-relaxed mb-3 line-clamp-2">
          {attraction.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6]">
          <StarRow
            rating={attraction.rating}
            count={attraction.reviews}
          />
          <button
            onClick={() => onNavigate("place")}
            className="text-[11px] font-semibold text-[#0E8C88] inline-flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            View <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}