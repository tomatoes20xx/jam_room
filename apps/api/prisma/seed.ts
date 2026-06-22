import { PrismaClient, type PriceTier } from "@prisma/client";

const prisma = new PrismaClient();

type SeedRoom = {
  name: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  priceTier: PriceTier;
  priceNum: number;
  capacity: string;
  roomSize: string;
  soundproof: string;
  hours: string;
  open: boolean;
  vip: boolean;
  genres: string[];
  overview: string;
  longOverview: string;
  images: string[];
  gear: { title: string; items: string[] }[];
  reviews: { author: string; rating: number; text: string }[];
};

// Placeholder photo as an inline SVG data-URI (real photos arrive via uploadthing).
// No external network dependency — tinted block + label, matching the design prototype.
const TINTS = ["#3a2f4f", "#4a2f2f", "#2f4a3e", "#43391f"];
function pic(label: string, i: number): string {
  const tint = TINTS[i % TINTS.length];
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'>` +
    `<rect width='100%' height='100%' fill='${tint}'/>` +
    `<text x='50%' y='50%' fill='rgba(255,255,255,.85)' font-family='monospace' font-size='30' ` +
    `letter-spacing='3' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ROOMS: SeedRoom[] = [
  {
    name: "სარდაფი / The Cellar",
    neighborhood: "Sololaki",
    address: "12 Asatiani St, Tbilisi 0105",
    lat: 41.6913,
    lng: 44.7989,
    priceTier: "TIER_2",
    priceNum: 30,
    capacity: "12 people",
    roomSize: "Large (12 people)",
    soundproof: "Full isolation",
    hours: "10am – 2am daily",
    open: true,
    vip: true,
    genres: ["PUNK", "HARDCORE", "METAL"],
    overview:
      "Filthy, loud, perfect. A Sololaki basement live room with a wall of cabs and zero complaints from the neighbours.",
    longOverview:
      "A genuine basement bunker built for volume under the old town. Dialed-in live room with house backline, full PA and a vocal booth that has heard a thousand screams. Black walls, sticker-bombed ceiling, engineers on call for tracking.",
    images: ["cellar1", "cellar2", "cellar3", "cellar4"],
    gear: [
      { title: "DRUMS", items: ["Tama Imperialstar 5-pc", "Sabian B8 Pro cymbal pack", "DW 5000 double kick"] },
      { title: "GUITAR", items: ["Marshall JCM800 + 4x12", "Orange Rockerverb 100", "Boss GT-1000"] },
      { title: "BASS", items: ["Ampeg SVT-CL + 8x10 fridge", "Darkglass B7K preamp"] },
      { title: "PA / VOX", items: ["QSC K12.2 mains (2)", "Shure SM58 x4", "Allen & Heath ZED-14"] },
    ],
    reviews: [
      { author: "Dato K.", rating: 5, text: "Loudest room in the city and the cabs are pristine. Booked us last minute, no questions." },
      { author: "Nino B.", rating: 5, text: "The SVT fridge alone is worth it. Vocal booth actually isolates. Our home." },
      { author: "M. Ruiz", rating: 4, text: "Gritty and great. Bathroom is a war zone but who cares, the gear rules." },
    ],
  },
  {
    name: "Distortion Dept.",
    neighborhood: "Vera",
    address: "88 Kiacheli St, Tbilisi 0108",
    lat: 41.7068,
    lng: 44.7906,
    priceTier: "TIER_3",
    priceNum: 45,
    capacity: "8 people",
    roomSize: "Medium (8 people)",
    soundproof: "Floated floor",
    hours: "9am – 12am daily",
    open: true,
    vip: true,
    genres: ["INDIE", "SHOEGAZE", "PUNK"],
    overview: "Boutique rehearsal + tracking suite in Vera. Pedal nerds welcome. Tasteful and very loud.",
    longOverview:
      "A premium, acoustically-treated suite for bands who care about tone. Floated floor, treated walls, and a curated amp closet you can rent into your slot. Free coffee, decent wifi, and a patient house engineer.",
    images: ["dist1", "dist2", "dist3", "dist4"],
    gear: [
      { title: "DRUMS", items: ["Ludwig Classic Maple 4-pc", "Zildjian K Custom set", "Roland SPD-SX"] },
      { title: "GUITAR", items: ["Fender Twin Reverb", "Vox AC30", "Hiwatt DR103 head"] },
      { title: "BASS", items: ["Aguilar DB751 + cab", "Fender Bassman 100"] },
      { title: "KEYS / SYNTH", items: ["Nord Stage 3", "Juno-106", "Roland Space Echo RE-201"] },
    ],
    reviews: [
      { author: "Hazy Lined", rating: 5, text: "The amp closet is unreal. AC30 + Space Echo and we lost an afternoon. Worth it." },
      { author: "P. Okafor", rating: 4, text: "Clean, treated, quiet between takes. Pricey but the tone is there." },
    ],
  },
  {
    name: "Feedback Loop",
    neighborhood: "Marjanishvili",
    address: "45 Aghmashenebeli Ave, Tbilisi 0102",
    lat: 41.7095,
    lng: 44.7993,
    priceTier: "TIER_2",
    priceNum: 36,
    capacity: "10 people",
    roomSize: "Large (10 people)",
    soundproof: "Double-wall",
    hours: "11am – 11pm daily",
    open: false,
    vip: true,
    genres: ["ROCK", "GARAGE", "POP-PUNK"],
    overview: "Three rooms, all loaded. The go-to for touring bands warming up before a show.",
    longOverview:
      "A three-room complex near the venues on Aghmashenebeli. Every room comes stocked with reliable backline and a stage-sized footprint. Merch table, green room, and a roll-up door for loading the van straight in.",
    images: ["fb1", "fb2", "fb3", "fb4"],
    gear: [
      { title: "DRUMS", items: ["Pearl Export 5-pc", "Sabian AAX cymbals", "Stage riser available"] },
      { title: "GUITAR", items: ["Mesa Dual Rectifier", "Fender Hot Rod Deluxe", "2x Marshall 4x12"] },
      { title: "BASS", items: ["Gallien-Krueger 800RB", "Hartke HyDrive 410"] },
      { title: "PA / VOX", items: ["Yamaha DXR12 mains", "Shure SM58 x5", "24-ch Soundcraft desk"] },
    ],
    reviews: [
      { author: "The Cutoffs", rating: 5, text: "Rehearsed here before our show. Stage-sized room meant zero surprises." },
      { author: "J. Tran", rating: 4, text: "Big, loud, professional. Bring your own snare though." },
    ],
  },
  {
    name: "Basement 9",
    neighborhood: "Saburtalo",
    address: "330 Vazha-Pshavela Ave, Tbilisi 0186",
    lat: 41.7251,
    lng: 44.7456,
    priceTier: "TIER_1",
    priceNum: 20,
    capacity: "5 people",
    roomSize: "Small (5 people)",
    soundproof: "Foam treated",
    hours: "12pm – 12am daily",
    open: true,
    vip: false,
    genres: ["HIP-HOP", "R&B", "SOUL"],
    overview: "Cozy beat room with a vocal booth. Cheap hourly, great for sessions and demos.",
    longOverview:
      "A budget-friendly creative room built around a vocal booth and a producer desk. Hook up your laptop and lay down ideas. Perfect for songwriters, rappers and small setups.",
    images: ["b9-1", "b9-2", "b9-3", "b9-4"],
    gear: [
      { title: "RECORDING", items: ["Universal Audio Apollo Twin", "Adam A7X monitors", "Neumann TLM 103"] },
      { title: "KEYS", items: ["Akai MPK261", "NI Maschine", "Korg Minilogue"] },
      { title: "GUITAR", items: ["Fender Blues Junior", "Acoustic DI available"] },
      { title: "EXTRAS", items: ["Treated vocal booth", "Free re-amp on request"] },
    ],
    reviews: [
      { author: "Lo Kee", rating: 5, text: "Cheapest decent booth in Saburtalo. Apollo + TLM103 sounds above the price." },
      { author: "Amara D.", rating: 4, text: "Tight space but everything works. Great for demos." },
    ],
  },
  {
    name: "Garage Saints",
    neighborhood: "Isani",
    address: "600 Ketevan Tsamebuli Ave, Tbilisi 0144",
    lat: 41.6829,
    lng: 44.8412,
    priceTier: "TIER_1",
    priceNum: 18,
    capacity: "7 people",
    roomSize: "Medium (7 people)",
    soundproof: "Basic",
    hours: "2pm – 2am daily",
    open: true,
    vip: false,
    genres: ["GARAGE", "PUNK", "ROCK"],
    overview: "No-frills garage room. Bring your own everything, pay almost nothing, play till late.",
    longOverview:
      "Exactly what it says. A concrete garage with power, a couple of beat-up amps, and a PA that mostly works. The cheapest late-night slot around and the least precious about volume.",
    images: ["gs1", "gs2", "gs3", "gs4"],
    gear: [
      { title: "DRUMS", items: ["Mapex Tornado 5-pc (well-worn)", "House cymbals (BYO ideally)"] },
      { title: "GUITAR", items: ["Peavey 6505 combo", "Fender Frontman 212"] },
      { title: "BASS", items: ["Behringer BX4500H + cab"] },
      { title: "PA / VOX", items: ["Mackie Thump 12 (2)", "2x dynamic mics"] },
    ],
    reviews: [
      { author: "Trash Verb", rating: 4, text: "It is a garage and that is the point. Nobody tells you to turn down. Heaven." },
      { author: "K. Mendes", rating: 4, text: "Gear is rough but functional. Great for loud punk on a budget." },
    ],
  },
  {
    name: "Static & Noise",
    neighborhood: "Chugureti",
    address: "175 Tsinamdzgvrishvili St, Tbilisi 0102",
    lat: 41.7164,
    lng: 44.8035,
    priceTier: "TIER_2",
    priceNum: 32,
    capacity: "8 people",
    roomSize: "Medium (8 people)",
    soundproof: "Double-wall",
    hours: "10am – 1am daily",
    open: false,
    vip: false,
    genres: ["NOISE", "EXPERIMENTAL", "METAL"],
    overview: "For the heavy and the weird. Modular synth corner, doom-ready cabs, patient walls.",
    longOverview:
      "A room built for extremes. Run a doom rig through three cabs or patch a modular into 6-channel surround — the double-walled space takes it. Power everywhere, a tidy patch bay, and an owner who wants to hear what you are making.",
    images: ["sn1", "sn2", "sn3", "sn4"],
    gear: [
      { title: "AMPS", items: ["Sunn Model T reissue", "EarthQuaker pedalboard", "3x Emperor 2x12"] },
      { title: "DRUMS", items: ["Gretsch Catalina Maple 5-pc", "Paiste 2002 cymbals"] },
      { title: "SYNTH", items: ["Eurorack 9U system", "Moog Subharmonicon", "Make Noise 0-Coast"] },
      { title: "PA", items: ["6-channel surround monitoring", "Behringer X32 desk"] },
    ],
    reviews: [
      { author: "Drone Mother", rating: 5, text: "Patch a modular through a Sunn Model T and nobody blinks. The patch bay saved our set." },
      { author: "V. Sokolova", rating: 4, text: "Heavy room done right. Walls handle the low end better than anywhere nearby." },
    ],
  },
  {
    name: "The Practice Pit",
    neighborhood: "Gldani",
    address: "1100 Khizanishvili St, Tbilisi 0167",
    lat: 41.7806,
    lng: 44.8085,
    priceTier: "TIER_1",
    priceNum: 15,
    capacity: "6 people",
    roomSize: "Small (6 people)",
    soundproof: "Foam treated",
    hours: "24 hours",
    open: true,
    vip: false,
    genres: ["ROCK", "METAL", "COVER BANDS"],
    overview: "24-hour lockout-style rooms. Functional, cheap, always open. The grinder favorite.",
    longOverview:
      "A 24-hour facility of small lockout-style rooms for bands that practice on a schedule nobody else keeps. Nothing fancy, everything reliable. Swipe in at 3am, plug into the house combo, grind through the set. Monthly lockouts available.",
    images: ["pp1", "pp2", "pp3", "pp4"],
    gear: [
      { title: "DRUMS", items: ["PDP Center Stage 5-pc", "Wuhan cymbal pack"] },
      { title: "GUITAR", items: ["Line 6 Spider V 120", "Blackstar HT-20 combo"] },
      { title: "BASS", items: ["Fender Rumble 200 combo"] },
      { title: "PA / VOX", items: ["Phonic Powerpod 620", "2x house mics"] },
    ],
    reviews: [
      { author: "Graveshift", rating: 4, text: "3am practice with zero hassle. Bare bones but the door is always open." },
      { author: "R. Patel", rating: 4, text: "Got a monthly lockout here. Small but ours." },
    ],
  },
  {
    name: "Lo-Fi Lab",
    neighborhood: "Vake",
    address: "220 Abashidze St, Tbilisi 0179",
    lat: 41.7099,
    lng: 44.7621,
    priceTier: "TIER_2",
    priceNum: 28,
    capacity: "7 people",
    roomSize: "Medium (7 people)",
    soundproof: "Floated floor",
    hours: "9am – 11pm daily",
    open: true,
    vip: false,
    genres: ["INDIE", "BEDROOM-POP", "JAZZ"],
    overview: "Warm, vibey room with an upright piano and a tape machine. For the soft and the swinging.",
    longOverview:
      "A daylight room with a different temperament. Real upright piano, a working tape machine, ribbon mics and a couch you will not want to leave. Built for jazz combos, indie sessions and anyone chasing a warmer sound.",
    images: ["lf1", "lf2", "lf3", "lf4"],
    gear: [
      { title: "KEYS", items: ["Yamaha U1 upright piano", "Rhodes Mark I", "Wurlitzer 200A"] },
      { title: "RECORDING", items: ["Tascam 388 tape machine", "AEA R84 ribbon", "UA 1176"] },
      { title: "DRUMS", items: ["Gretsch Broadkaster jazz kit", "Istanbul Agop cymbals"] },
      { title: "AMPS", items: ["Fender Deluxe Reverb", "Ampeg B-15 flip-top"] },
    ],
    reviews: [
      { author: "The Soft Hours", rating: 5, text: "Tracked to the Tascam 388 through the R84 and it sounds like 1973. Dreamy." },
      { author: "C. Iwu", rating: 4, text: "Lovely warm room for a jazz trio. Daylight is a nice change." },
    ],
  },
];

async function main() {
  console.log("Seeding Jam Room…");

  // Wipe domain data (keep auth tables).
  await prisma.savedRoom.deleteMany();
  await prisma.review.deleteMany();
  await prisma.gearItem.deleteMany();
  await prisma.gearGroup.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.room.deleteMany();

  // A demo provider owns all the seed rooms.
  const owner = await prisma.user.upsert({
    where: { email: "owner@jamroom.ge" },
    update: { role: "PROVIDER", displayName: "Jam Room Demo" },
    create: {
      email: "owner@jamroom.ge",
      name: "Jam Room Demo",
      displayName: "Jam Room Demo",
      role: "PROVIDER",
      emailVerified: true,
    },
  });

  for (const r of ROOMS) {
    // Review authors as lightweight users.
    const room = await prisma.room.create({
      data: {
        ownerId: owner.id,
        name: r.name,
        neighborhood: r.neighborhood,
        address: r.address,
        lat: r.lat,
        lng: r.lng,
        priceTier: r.priceTier,
        priceNum: r.priceNum,
        capacity: r.capacity,
        roomSize: r.roomSize,
        soundproof: r.soundproof,
        hours: r.hours,
        open: r.open,
        vip: r.vip,
        genres: r.genres,
        overview: r.overview,
        longOverview: r.longOverview,
        images: {
          create: r.images.map((seed, i) => {
            const label = ["LIVE ROOM", "THE GEAR", "THE BOOTH", "THE VIBE"][i] ?? "PHOTO";
            return { url: pic(label, i), key: `seed-${seed}`, label, order: i };
          }),
        },
        gearGroups: {
          create: r.gear.map((g, gi) => ({
            title: g.title,
            order: gi,
            items: { create: g.items.map((text, ii) => ({ text, order: ii })) },
          })),
        },
      },
    });

    for (const rv of r.reviews) {
      const author = await prisma.user.upsert({
        where: { email: `${slug(rv.author)}@demo.jamroom.ge` },
        update: {},
        create: {
          email: `${slug(rv.author)}@demo.jamroom.ge`,
          name: rv.author,
          displayName: rv.author,
          role: "MUSICIAN",
          emailVerified: true,
        },
      });
      await prisma.review.create({
        data: { roomId: room.id, authorId: author.id, rating: rv.rating, text: rv.text },
      });
    }
    console.log(`  ✓ ${r.name}`);
  }

  console.log("Done.");
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
