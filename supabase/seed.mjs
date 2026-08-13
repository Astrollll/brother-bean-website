// Brother Bean — content seeder
// Populates the database with the current site content (menu, events, gallery,
// blog, site info, page copy). Run once after applying migrations:
//
//   $env:SUPABASE_URL = "https://<ref>.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY = "<service_role key>"
//   node supabase/seed.mjs
//
// The service role key is a secret — keep it out of the repo.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

async function api(pathname, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${pathname}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`${options.method || "GET"} ${pathname} -> ${res.status}: ${text}`);
  }
  return res;
}

const upsert = (table, rows) =>
  api(`/rest/v1/${table}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });

const clear = async (table, keyColumn = "id") => {
  const res = await api(`/rest/v1/${table}?${keyColumn}=neq.00000000-0000-0000-0000-000000000000`, {
    method: "DELETE",
  });
  if (res.ok || res.status === 204) return;
  throw new Error(`Failed to clear ${table}: ${res.status}`);
};

async function loadMenu() {
  const dir = path.resolve(__dirname, "../src/content/menu");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  const items = [];
  for (const file of files) {
    const raw = await readFile(path.join(dir, file), "utf8");
    items.push(JSON.parse(raw));
  }
  return items.map((item, i) => ({
    name: item.name,
    description: item.description || "",
    price: item.price || "",
    category: item.category || "Other",
    display_order: i,
    is_active: true,
  }));
}

// ---------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------

const events = [
  {
    title: "Coffee Tasting Session",
    date: "Every Saturday",
    time: "10:00 AM – 11:30 AM",
    description:
      "Join us for a guided coffee tasting. Learn about different brewing methods and flavor profiles while sampling our featured beans.",
    price: "Free with any purchase",
    day: "SAT",
    display_order: 1,
  },
  {
    title: "Open Mic Night",
    date: "Every Friday",
    time: "6:00 PM – 8:00 PM",
    description:
      "Show off your talent or just sit back and enjoy. Poetry, music, comedy — all are welcome on our little stage.",
    price: "Free entry",
    day: "FRI",
    display_order: 2,
  },
  {
    title: "Study & Sip",
    date: "Every Sunday",
    time: "1:00 PM – 5:00 PM",
    description:
      "Bring your books and laptops. Enjoy unlimited brewed coffee refills for just ₱99 while you study.",
    price: "₱99 unlimited coffee",
    day: "SUN",
    display_order: 3,
  },
];

const gallery = [
  { image_url: "/gallery/gallery-01-cozy-interior.jpg", alt_text: "Interior of Brother Bean Coffee Shop", caption: "Cozy interior", display_order: 1 },
  { image_url: "/gallery/gallery-02-latte-art.jpg", alt_text: "Barista pouring latte art", caption: "Latte art in motion", display_order: 2 },
  { image_url: "/gallery/gallery-03-pastries.jpg", alt_text: "Pastry display case", caption: "Fresh pastries daily", display_order: 3 },
  { image_url: "/gallery/gallery-04-brewing.jpg", alt_text: "Coffee beans and brewing setup", caption: "Our brewing station", display_order: 4 },
  { image_url: "/gallery/gallery-05-friends.jpg", alt_text: "Group of friends enjoying coffee", caption: "Good times with great coffee", display_order: 5 },
  { image_url: "/gallery/gallery-06-outdoor.jpg", alt_text: "Outdoor seating area", caption: "Enjoy the Cavite breeze", display_order: 6 },
];

const blogPosts = [
  {
    slug: "welcome-to-brother-bean",
    title: "Welcome to Brother Bean Coffee House",
    description:
      "A little introduction to who we are, what we serve, and what you can expect when you visit.",
    body_markdown:
      "We're thrilled to finally open our doors and welcome you to **Brother Bean Coffee House** — a cozy little spot in the heart of Cavite where good coffee and great company come together.\n\n### Why Brother Bean?\n\nThe name came from the idea that coffee connects us like family. Whether you're a regular or a first-time visitor, you're not just a customer — you're part of the family.\n\n### What We Serve\n\n- **Specialty coffee** — Spanish lattes, caramel macchiatos, americanos, and more\n- **Non-coffee drinks** — Matcha, strawberry milk, chocolate, and iced tea\n- **Fresh pastries** — Croissants, ensaymada, cheese bread, brownies\n- **Hearty food** — Sopas, carbonara, and more\n\n### Our Promise\n\nEvery drink is made with care. Every guest is treated like family. And every visit should feel like coming home.\n\nCome say hi — we'd love to meet you.",
    published_at: "2026-07-15T00:00:00Z",
  },
  {
    slug: "coffee-tasting-guide",
    title: "A Beginner's Guide to Coffee Tasting",
    description:
      "New to specialty coffee? Here are a few tips to help you appreciate the flavors in your cup.",
    body_markdown:
      "Coffee tasting — or \"cupping\" — is the practice of observing the flavors and aromas of brewed coffee. You don't need to be an expert to enjoy it. Here's a simple guide.\n\n### Step 1: Smell\n\nBefore you take a sip, bring the cup close and inhale. What do you notice? Fruity notes? Chocolate? Nuts? The aroma tells you a lot about what's coming.\n\n### Step 2: Slurp\n\nYes, slurping is encouraged. It aerates the coffee and spreads it across your palate, helping you pick up more flavors.\n\n### Step 3: Identify\n\nThink about what you're tasting:\n\n- **Acidity** — Is it bright and crisp? (Like citrus or berries)\n- **Body** — Does it feel light, creamy, or heavy?\n- **Finish** — How long does the flavor linger?\n\n### Step 4: Enjoy\n\nThere's no right or wrong answer. The best coffee is the one you enjoy drinking.\n\nCome join our Saturday coffee tasting sessions at Brother Bean — free with any purchase!",
    published_at: "2026-07-22T00:00:00Z",
  },
  {
    slug: "study-spot-cavite",
    title: "Why Brother Bean Is the Best Study Spot in Cavite",
    description:
      "Looking for a quiet, cozy place to study? Here's why students love spending their afternoons with us.",
    body_markdown:
      "If you're a student in Cavite searching for the perfect study spot, look no further. Here's why Brother Bean has become a go-to for students.\n\n### 1. Free WiFi (That Actually Works)\n\nWe know the struggle of spotty connections. Our internet is fast and reliable — perfect for online classes, research, and group projects.\n\n### 2. Affordable Drinks\n\nWe believe students shouldn't have to choose between eating and drinking good coffee. Our menu is priced with students in mind.\n\n### 3. Sunday Study & Sip\n\nEvery Sunday from 1:00 PM to 5:00 PM, enjoy unlimited brewed coffee refills for just ₱99. Bring your books, your laptop, and your study playlist.\n\n### 4. Comfortable Space\n\nPlenty of tables, good lighting, and a quiet atmosphere. Plus, we play the kind of background music that helps you focus — not sing along to.\n\n### 5. Great Food\n\nStudying burns energy. Fuel up with our carbonara, sopas, or a fresh croissant between sessions.\n\nSee you at Brother Bean — your new favorite study spot.",
    published_at: "2026-07-28T00:00:00Z",
  },
];

const siteContent = [
  {
    key: "announcement",
    data: { message: "Latte lovers, welcome! Sip your love for coffee with our delicious hot and iced flavored lattes.", is_active: true },
  },
  {
    key: "site_info",
    data: {
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
    },
  },
  {
    key: "page_copy",
    data: {
      hero: {
        location: "Dasmariñas, Cavite",
        headline_1: "Your Daily Cup of",
        headline_2: "Warmth",
        subtext:
          "Handcrafted coffee, warm conversations, and a home away from home in the heart of Cavite.",
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
          "Brother Bean Coffee House started as a dream shared by a group of friends who believed that coffee is more than just a drink — it's an experience. It's the warmth of the mug on a rainy morning, the laughter shared over a table, and the quiet moments of reflection between sips.",
          "Located in the heart of Cavite, we set out to build a space where the community could gather, work, study, and connect. Every corner of Brother Bean is designed to feel like a second home — familiar, comforting, and inviting.",
          "Our beans are carefully sourced and roasted to highlight their natural flavors. From the bold kick of our Americano to the creamy sweetness of our Spanish Latte, every drink is made to order with precision and care.",
          "We also take pride in our food offerings — from buttery croissants to hearty Filipino sopas, there's something for every craving.",
        ],
        quote: "Come as a customer, leave as family.",
      },
    },
  },
  {
    key: "home_sections",
    data: {},
  },
];

// ---------------------------------------------------------------
// Run
// ---------------------------------------------------------------

console.log("Loading menu items...");
const menu = await loadMenu();

console.log("Clearing content tables...");
await clear("events");
await clear("gallery_images");
await clear("menu_items");
await clear("blog_posts");
await clear("site_content", "key");

console.log(`Seeding ${menu.length} menu items...`);
await upsert("menu_items", menu);

console.log(`Seeding ${events.length} events...`);
await upsert("events", events);

console.log(`Seeding ${gallery.length} gallery images...`);
await upsert("gallery_images", gallery);

console.log(`Seeding ${blogPosts.length} blog posts...`);
await upsert("blog_posts", blogPosts);

console.log(`Seeding ${siteContent.length} site_content rows...`);
await upsert("site_content", siteContent);

console.log("Seed complete.");
