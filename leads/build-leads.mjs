/**
 * Build a food-truck lead list for cold outreach.
 *
 * Why this exists: the food-truck directories (Roaming Hunger, StreetFoodFinder,
 * BestFoodTrucks, Yelp) all block scraping — that data IS their product. Google
 * Places is the one source that will hand it over legitimately, and it returns
 * name / address / phone / website for every truck in a radius in one pass.
 * Socials and email then come from each truck's own site footer.
 *
 * Setup:
 *   1. console.cloud.google.com → enable "Places API (New)" → create an API key
 *   2. export GOOGLE_PLACES_KEY=...
 *   3. node leads/build-leads.mjs > leads/austin-downtown-food-trucks.csv
 *
 * Cost: Places Text Search is billed per request, and Google's free tier covers
 * far more than this needs. ~60 trucks is a handful of requests.
 */

const KEY = process.env.GOOGLE_PLACES_KEY;
if (!KEY) {
  console.error("Set GOOGLE_PLACES_KEY first. See the header of this file.");
  process.exit(1);
}

/* Centered downtown. Places caps ONE text search at 20 results, so breadth comes
   from many cuisine-specific queries rather than a bigger radius — "food truck"
   alone will only ever return the same 20 most-prominent places. 6km keeps it
   central Austin (downtown, East, South Congress, Riverside, UT) without
   dragging in the suburbs. */
const CENTER = { latitude: 30.2672, longitude: -97.7431 };
const RADIUS_M = 6000;
const QUERIES = [
  // generic
  "food truck",
  "food trailer",
  "food truck park",
  // mexican / latin — by far the largest category in Austin
  "taco truck",
  "taqueria trailer",
  "birria truck",
  "breakfast taco truck",
  "torta truck",
  "elotes truck",
  "pupusa truck",
  "arepa food truck",
  "empanada food truck",
  // bbq
  "bbq trailer",
  "barbecue food truck",
  // middle eastern / mediterranean
  "halal food truck",
  "gyro truck",
  "shawarma truck",
  "falafel food truck",
  // asian
  "asian food truck",
  "thai food truck",
  "vietnamese food truck",
  "korean food truck",
  "sushi food truck",
  "ramen food truck",
  // american
  "burger food truck",
  "pizza trailer",
  "sandwich food truck",
  "wings food truck",
  "seafood food truck",
  "crawfish truck",
  "hot dog cart",
  // sweets + drinks
  "dessert food truck",
  "ice cream truck",
  "donut food truck",
  "coffee trailer",
  "shaved ice truck",
  "smoothie truck",
  // dietary
  "vegan food truck",
];

const FIELDS = [
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
].join(",");

async function search(textQuery) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": FIELDS,
    },
    body: JSON.stringify({
      textQuery,
      locationBias: { circle: { center: CENTER, radius: RADIUS_M } },
      maxResultCount: 20,
    }),
  });
  if (!res.ok) {
    console.error(`  ! "${textQuery}" failed: ${res.status} ${await res.text()}`);
    return [];
  }
  const { places = [] } = await res.json();
  return places;
}

/* Pull email + socials out of a truck's own site. Most are Wix/Squarespace,
   where the footer markup still contains the links even if it renders via JS. */
async function enrich(url) {
  const out = { email: "N/A", instagram: "N/A", facebook: "N/A", tiktok: "N/A" };
  if (!url) return out;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VespoLeadBot/1.0)" },
    });
    if (!res.ok) return out;
    const html = await res.text();

    /* Site templates ship placeholder addresses (user@domain.com, you@email.com)
       and vendor telemetry addresses. Sending to those is worse than having no
       address at all — it inflates bounce rate and hurts domain reputation. */
    const PLACEHOLDER_LOCAL = /^(user|you|your|name|email|username|someone|test|abc|firstname|yourname|info@domain)$/i;
    const PLACEHOLDER_DOMAIN = /^(domain|email|example|yourdomain|mydomain|company|website|test|sentry|wix|squarespace|godaddy|shopify|parastorage|sentry\.io)\./i;
    const email = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      ?.filter((e) => !/\.(png|jpe?g|gif|svg|webp|js|css)$/i.test(e))
      ?.filter((e) => !/(sentry|wix|squarespace|example|godaddy|shopify|parastorage|cloudflare)/i.test(e))
      ?.filter((e) => {
        const [local, domain] = e.split("@");
        return !PLACEHOLDER_LOCAL.test(local) && !PLACEHOLDER_DOMAIN.test(domain);
      });
    if (email?.length) out.email = email[0];

    const ig = html.match(/instagram\.com\/([A-Za-z0-9._]{2,30})/);
    if (ig && !/^(p|reel|explore|accounts)$/i.test(ig[1]))
      out.instagram = `https://instagram.com/${ig[1]}`;

    const fb = html.match(/facebook\.com\/([A-Za-z0-9.\-]{2,50})/);
    if (fb && !/^(sharer|tr|plugins|dialog)$/i.test(fb[1]))
      out.facebook = `https://facebook.com/${fb[1]}`;

    const tt = html.match(/tiktok\.com\/@([A-Za-z0-9._]{2,30})/);
    if (tt) out.tiktok = `https://tiktok.com/@${tt[1]}`;
  } catch {
    /* dead site, TLS error, timeout — leave the N/As */
  }
  return out;
}

/* A text search for "food truck" also returns the venues trucks park in and the
   companies that BUILD and sell trucks. Neither is a customer, so both are
   dropped (set INCLUDE_ALL=1 to keep them for inspection).
   Heuristic on the business name — worth eyeballing the output, since a name is
   not always a reliable signal. Note "food trailer" alone is NOT a tell:
   Ruthie's Food Trailer is a real truck, Universal Food Trailer sells them. */
/* Hand-checked exclusions the name heuristic cannot catch. Add to this rather
   than editing the CSV, so a re-run does not resurrect them.
     iron works barbecue — established brick-and-mortar restaurant, not a truck
     burger bites        — its listed site and email belong to a different
                           business (rnbssteakandfries.com), so the contact
                           data on the row is unreliable */
const EXCLUDE = new Set([
  "iron works barbecue", // established brick-and-mortar restaurant
  "burger bites", // listed site/email belong to a different business
  "crawdad's! crawfish boil catering", // Houston (ZIP 77057) - wrong metro entirely
  "texas krab house round rock", // Round Rock storefront restaurant
  "banger's sausage house & beer garden", // beer garden restaurant, 7.3k reviews
  "casino el camino", // 6th St bar/burger joint, 4.4k reviews
  "via 313 pizza", // restaurant chain
  "big easy bar and grill", // bar & grill
  "shoal creek saloon", // restaurant/saloon
  "de nada cantina - south 1st", // sit-down cantina
  "home slice pizza", // SoCo pizzeria, 11k reviews
  "roppolo's pizzeria west campus", // pizzeria storefront
  "pedroso's pizza- slice shop & take out", // slice shop storefront
  "sammataro slice shop", // storefront (the Sammataro *trailer* stays)
  "p. terry's burger stand", // fast-food chain
  "bahama buck's - austin", // franchise storefront
  "summer moon coffee (mobile moon)", // coffee chain location
  "quality seafood market", // seafood market & restaurant
  "palomino coffee roasters", // roastery/cafe
  "breton organic coffee", // cafe
  "jads mediterranean halal grill austin", // restaurant
  "al shami", // restaurant
  "frozen rolls creamery", // ice cream storefront
  "manolis ice cream, pops, sorbet & more", // storefront
  "noam's gelato & bean", // gelato cafe
  "hippie picnik", // sit-down cafe (their Hippie Ice trailer stays)
]);

function classify(name) {
  /* Normalise curly apostrophes — Google returns "Roppolo\u2019s", the exclusion
     list is typed with a straight quote, and they would never match. */
  const n = name.toLowerCase().replace(/[\u2018\u2019]/g, "'");
  if (EXCLUDE.has(n)) return "excluded";
  if (
    /(custom trailer|trailers inc|trailer company|built food|bbq pits|smoker company|pitmaker|manufactur|trailer sales|renters|universal food trailer)/.test(n)
  )
    return "manufacturer";
  /* \bpark\b catches "Thicket Food Park", "The Treehouse Park" and
     "1311 S. 1st St. Park" alike. No legitimate truck in Austin's results
     carries "park" in its name. */
  if (/(\bpark\b|foodpark|food court|trailer eats|^food trucks$|food trucks$)/.test(n))
    return "venue";
  return "truck";
}

/* Pull the ZIP so the sheet can be sorted into walkable clusters, and build a
   one-tap Maps link for in-person visits. */
const zipOf = (addr) => (String(addr || "").match(/\b(7\d{4})\b/) || [, "N/A"])[1];
const mapsLink = (name, addr) =>
  addr
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${addr}`)}`
    : "N/A";

const csv = (v) => {
  const s = String(v ?? "N/A").trim() || "N/A";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/* Google Places has NO food-truck category — a real trailer and a brick-and-
   mortar are both typed `taco_restaurant`. The only usable signal is which
   query surfaced the place. Queries where the VEHICLE is the head noun return
   actual trucks; "thai food truck" just returns Thai restaurants, because
   Google matches the cuisine and ignores the rest. So a place has to be found
   by at least one of these to count as a truck. */
const STRONG = new Set([
  "food truck",
  "food trailer",
  "food truck park",
  "taco truck",
  "taqueria trailer",
  "bbq trailer",
  "pizza trailer",
  "coffee trailer",
  "hot dog cart",
  "ice cream truck",
  "shaved ice truck",
  "crawfish truck",
  "birria truck",
  "torta truck",
  "elotes truck",
  "gyro truck",
  "shawarma truck",
]);

const seen = new Map();
for (const q of QUERIES) {
  console.error(`searching: ${q}`);
  for (const p of await search(q)) {
    const name = p.displayName?.text;
    if (!name) continue;
    if (!seen.has(name)) seen.set(name, { place: p, queries: [] });
    seen.get(name).queries.push(q);
  }
}
console.error(`\n${seen.size} unique places; fetching sites for socials...\n`);

const rows = [];
const INCLUDE_ALL = process.env.INCLUDE_ALL === "1";
let dropped = 0;
let weak = 0;
for (const [name, { place: p, queries }] of seen) {
  const type = classify(name);
  if (type !== "truck" && !INCLUDE_ALL) {
    dropped++;
    continue;
  }
  const strongHits = queries.filter((q) => STRONG.has(q));
  if (!strongHits.length && !INCLUDE_ALL) {
    weak++;
    continue;
  }
  const extra = await enrich(p.websiteUri);
  console.error(`  ${name}${extra.instagram !== "N/A" ? "  ✓ IG" : ""}${extra.email !== "N/A" ? "  ✓ email" : ""}`);
  rows.push([
    name,
    p.formattedAddress,
    zipOf(p.formattedAddress),
    mapsLink(name, p.formattedAddress),
    p.nationalPhoneNumber,
    extra.email,
    p.websiteUri,
    extra.instagram,
    extra.facebook,
    extra.tiktok,
    p.rating ?? "N/A",
    p.userRatingCount ?? "N/A",
    strongHits.join(" | ") || "N/A",
  ]);
}

/* Sort by ZIP then name: trucks in the same pocket end up adjacent, so the
   sheet doubles as a door-knock route. */
rows.sort((a, b) => String(a[2]).localeCompare(String(b[2])) || String(a[0]).localeCompare(String(b[0])));

console.log(
  "name,address,zip,maps_link,phone,email,website,instagram,facebook,tiktok,rating,review_count,found_via"
);
for (const r of rows) console.log(r.map(csv).join(","));
console.error(
  `\nDone — ${rows.length} trucks` +
    (dropped ? `; ${dropped} venues/manufacturers dropped` : "") +
    (weak ? `; ${weak} likely restaurants dropped (no truck-specific query matched)` : "") +
    (dropped || weak ? ". INCLUDE_ALL=1 to keep everything." : "")
);
