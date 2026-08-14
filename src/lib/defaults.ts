// Fallback content used when Supabase is unreachable or not configured.
// Mirrors the seeded database values so the site still renders standalone.

export interface Announcement {
  message: string;
  is_active?: boolean;
}

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  message: "Latte lovers, welcome! Sip your love for coffee with our delicious hot and iced flavored lattes.",
  is_active: true,
};

export interface SiteInfo {
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  hours: string;
  hours_short: string;
  hours_schedule: string;
  facebook: string;
  instagram: string;
  maps_embed: string;
}

export const DEFAULT_SITE_INFO: SiteInfo = {
  address_line1: "N. Guevarra St. Brgy. Zone 1",
  address_line2: "Dasmariñas, Cavite, Philippines 4114",
  phone: "0917 172 8458",
  email: "yourbrotherbean@gmail.com",
  hours: "Daily: 9:00 AM – 7:00 PM",
  hours_short: "Open Daily 9:00 AM – 7:00 PM",
  hours_schedule: "9:00 AM – 7:00 PM",
  facebook: "https://www.facebook.com/BrotherBean",
  instagram: "https://www.instagram.com/brotherbean.coffeehouse/",
  maps_embed: "https://www.google.com/maps?q=14.33100764398651,120.9367413696932&z=18&output=embed",
};

export interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  display_order?: number;
  is_active?: boolean;
}

export interface EventItem {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  price: string;
  day: string;
  display_order?: number;
  is_active?: boolean;
}

export const DEFAULT_EVENTS: EventItem[] = [
  {
    title: "Coffee Tasting Session",
    date: "Every Saturday",
    time: "10:00 AM – 11:30 AM",
    description:
      "Join us for a guided coffee tasting. Learn about different brewing methods and flavor profiles while sampling our featured beans.",
    price: "Free with any purchase",
    day: "SAT",
  },
  {
    title: "Open Mic Night",
    date: "Every Friday",
    time: "6:00 PM – 8:00 PM",
    description:
      "Show off your talent or just sit back and enjoy. Poetry, music, comedy — all are welcome on our little stage.",
    price: "Free entry",
    day: "FRI",
  },
  {
    title: "Study & Sip",
    date: "Every Sunday",
    time: "1:00 PM – 5:00 PM",
    description:
      "Bring your books and laptops. Enjoy unlimited brewed coffee refills for just ₱99 while you study.",
    price: "₱99 unlimited coffee",
    day: "SUN",
  },
];

export interface GalleryImage {
  id?: string;
  image_url: string;
  alt_text: string;
  caption: string;
  display_order?: number;
  is_active?: boolean;
}

export const DEFAULT_GALLERY: GalleryImage[] = [
  { image_url: "/gallery/gallery-01-cozy-interior.jpg", alt_text: "Interior of Brother Bean Coffee Shop", caption: "Cozy interior" },
  { image_url: "/gallery/gallery-02-latte-art.jpg", alt_text: "Barista pouring latte art", caption: "Latte art in motion" },
  { image_url: "/gallery/gallery-03-pastries.jpg", alt_text: "Pastry display case", caption: "Fresh pastries daily" },
  { image_url: "/gallery/gallery-04-brewing.jpg", alt_text: "Coffee beans and brewing setup", caption: "Our brewing station" },
  { image_url: "/gallery/gallery-05-friends.jpg", alt_text: "Group of friends enjoying coffee", caption: "Good times with great coffee" },
  { image_url: "/gallery/gallery-06-outdoor.jpg", alt_text: "Outdoor seating area", caption: "Enjoy the Cavite breeze" },
];

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  body_markdown: string;
  published_at?: string | null;
  is_active?: boolean;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    slug: "welcome-to-brother-bean",
    title: "Welcome to Brother Bean Coffee House",
    description: "A little introduction to who we are, what we serve, and what you can expect when you visit.",
    body_markdown:
      "We're thrilled to finally open our doors and welcome you to **Brother Bean Coffee House** — a cozy little spot in the heart of Cavite where good coffee and great company come together.\n\n### Why Brother Bean?\n\nThe name came from the idea that coffee connects us like family.\n\n### Our Promise\n\nEvery drink is made with care. Every guest is treated like family. And every visit should feel like coming home.\n\nCome say hi — we'd love to meet you.",
    published_at: "2026-07-15T00:00:00Z",
  },
];

export interface PageCopy {
  hero: {
    location: string;
    headline_1: string;
    headline_2: string;
    subtext: string;
    primary_cta: string;
    secondary_cta: string;
  };
  offers: {
    eyebrow: string;
    heading: string;
    cards: { title: string; body: string }[];
  };
  stats: { value: number; suffix: string; label: string }[];
  story: {
    eyebrow: string;
    heading: string;
    body: string;
    rating: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    location: string;
    phone: string;
    button: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    quote: string;
  };
}

export const DEFAULT_PAGE_COPY: PageCopy = {
  hero: {
    location: "Dasmariñas, Cavite",
    headline_1: "Your Daily Cup of",
    headline_2: "Warmth",
    subtext: "Handcrafted coffee, warm conversations, and a home away from home in the heart of Cavite.",
    primary_cta: "Explore Our Menu",
    secondary_cta: "Our Story",
  },
  offers: {
    eyebrow: "What We Offer",
    heading: "Why Brother Bean?",
    cards: [
      { title: "Specialty Coffee", body: "Single-origin beans, expertly roasted and brewed to perfection. Every cup tells a story from farm to table." },
      { title: "Fresh Pastries", body: "Baked fresh daily. Pair your coffee with our croissants, ensaymadas, and seasonal treats made with love." },
      { title: "Great Value", body: "Quality coffee at fair prices. Student-friendly, because great taste shouldn't break the bank." },
    ],
  },
  stats: [
    { value: 30, suffix: "+", label: "Drink Varieties" },
    { value: 5, suffix: "", label: "5-Star Rated" },
    { value: 60, suffix: "", label: "Menu Items" },
  ],
  story: {
    eyebrow: "Our Story",
    heading: "A Coffee Shop Born From Connection",
    body: "Brother Bean Coffee House was born from a simple idea — create a space where great coffee meets genuine connection. Located in the heart of Cavite, we serve handcrafted brews made from carefully selected beans, alongside fresh pastries and warm Filipino hospitality.",
    rating: "4.9",
  },
  cta: {
    eyebrow: "Come Visit",
    heading: "Experience Brother Bean",
    location: "Dasmariñas, Cavite · Open Daily 9:00 AM – 7:00 PM",
    phone: "0917 172 8458",
    button: "Get Directions",
  },
  about: {
    eyebrow: "Who We Are",
    heading: "Our Story",
    paragraphs: [
      "Brother Bean Coffee House started as a dream shared by a group of friends who believed that coffee is more than just a drink — it's an experience.",
      "Located in the heart of Cavite, we set out to build a space where the community could gather, work, study, and connect.",
      "Our beans are carefully sourced and roasted to highlight their natural flavors.",
      "We also take pride in our food offerings — from buttery croissants to hearty Filipino sopas, there's something for every craving.",
    ],
    quote: "Come as a customer, leave as family.",
  },
};
