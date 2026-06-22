"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "ka" | "en";

const STORAGE_KEY = "jamroom_lang";
const DEFAULT_LOCALE: Locale = "ka";

type Dict = Record<string, string>;

const en: Dict = {
  // nav / global
  "nav.signin": "SIGN IN",
  "nav.signup": "SIGN UP",
  "nav.signout": "SIGN OUT",
  "brand.finder": "FINDER",
  "masthead.city": "TBILISI",
  "masthead.country": "GEORGIA",
  "footer.tagline": "made loud in tbilisi · plug in & get loud · BYO earplugs",

  // home / api offline
  "home.offline_title": "API OFFLINE",
  "home.offline_pre": "Could not load rooms ({error}). Start the API with",
  "home.offline_post": "and make sure the database is seeded.",
  "home.offline_error": "Could not reach the API",

  // finder
  "finder.count": "{count} rehearsal rooms found across Tbilisi. Book by the hour.",
  "finder.search": "Search rooms, neighborhoods, gear...",
  "finder.clear": "CLEAR",
  "finder.all": "ALL",
  "finder.genre": "GENRE",
  "finder.price": "PRICE",
  "finder.sort": "SORT",
  "finder.open_now": "OPEN NOW",
  "finder.sort_rating": "TOP RATED",
  "finder.sort_price": "CHEAPEST",
  "finder.sort_name": "A–Z",
  "finder.front_row": "FRONT ROW",
  "finder.featured": "/ FEATURED",
  "finder.all_rooms": "ALL ROOMS",
  "finder.listed": "{count} LISTED",
  "finder.empty_title": "NO ROOMS. ALL QUIET.",
  "finder.empty_body": "Nothing matches that search. Ease up on the filters.",
  "finder.reset": "RESET FILTERS",
  "finder.load_more": "LOAD MORE",
  "finder.loading": "LOADING…",

  // room card
  "room.open_now": "OPEN NOW",
  "room.closed": "CLOSED",
  "room.per_hour": "/hr",
  "room.enter": "ENTER →",
  "room.save": "Save",
  "room.unsave": "Unsave",

  // room detail
  "detail.back": "← BACK TO ROOMS",
  "detail.vip_featured": "VIP · FEATURED",
  "detail.reviews_count": "{count} reviews",
  "detail.saved": "SAVED",
  "detail.save": "SAVE",
  "detail.no_photo": "[ NO PHOTO YET ]",
  "detail.photo": "PHOTO {n}",
  "detail.the_room": "THE ROOM",
  "detail.the_gear": "THE GEAR",
  "detail.location": "LOCATION",
  "detail.google_maps": "GOOGLE MAPS",
  "detail.open_maps": "OPEN IN MAPS ↗",
  "detail.the_details": "THE DETAILS",
  "detail.spec_price": "PRICE",
  "detail.spec_room_size": "ROOM SIZE",
  "detail.spec_soundproofing": "SOUNDPROOFING",
  "detail.spec_hours": "HOURS",
  "detail.spec_capacity": "CAPACITY",
  "detail.price_value": "₾{price} / hr ({tier})",
  "detail.from_the_pit": "FROM THE PIT",
  "detail.reviews": "reviews",

  // review form
  "review.signin_suffix": "to leave a review.",
  "review.your_rating": "YOUR RATING",
  "review.stars": "{n} stars",
  "review.placeholder": "How loud did it get? Tell the pit.",
  "review.posting": "POSTING…",
  "review.post": "POST REVIEW →",
  "review.error": "Could not post review",

  // login
  "login.title_pre": "Back to the",
  "login.title_accent": "pit.",
  "login.google": "SIGN IN WITH GOOGLE",
  "login.or_email": "OR EMAIL",
  "login.email": "EMAIL",
  "login.password": "PASSWORD",
  "login.submit": "SIGN IN →",
  "login.error": "Sign in failed",
  "login.new_here": "New here?",

  // signup — shared
  "signup.field_email": "EMAIL",
  "signup.field_password": "PASSWORD",
  "signup.signin_scene": "Already in the scene?",
  "signup.signin_listed": "Already listed?",
  "signup.err_failed": "Sign up failed",
  "signup.err_room_partial": "Account created, but room save failed: {msg}",
  "signup.err_room": "Room save failed",

  // signup — done
  "signup.done_badge": "you're in",
  "signup.done_user_title": "LET’S GET LOUD.",
  "signup.done_provider_title": "ROOM IS LIVE.",
  "signup.done_user_body": "Your account is set. Start digging through Tbilisi’s rehearsal rooms and book your first slot.",
  "signup.done_provider_body": "Your listing is live. Bands can find you, message you, and book by the hour.",
  "signup.done_browse": "→ BROWSE ROOMS",

  // signup — hero / tabs
  "signup.join_pre": "Join the",
  "signup.join_accent": "racket.",
  "signup.hero_note": "Pick your side of the glass. Takes two minutes. Costs nothing.",
  "signup.tab_user_title": "I'M A MUSICIAN",
  "signup.tab_user_sub": "Find rooms · book slots · save favorites",
  "signup.tab_provider_title": "I RUN A ROOM",
  "signup.tab_provider_sub": "List your space · set rates · take bookings",

  // signup — user form
  "signup.quick_start": "QUICK START",
  "signup.google_signup": "SIGN UP WITH GOOGLE",
  "signup.or_oldschool": "OR GO OLD-SCHOOL",
  "signup.username": "USERNAME",
  "signup.create_account": "CREATE ACCOUNT →",

  // signup — provider form
  "signup.provider_google": "CONTINUE WITH GOOGLE",
  "signup.provider_intro": "List your space.",
  "signup.provider_intro_sub": "All fields help bands find you.",
  "signup.sec_basics": "01 · THE BASICS",
  "signup.sec_space": "02 · THE SPACE",
  "signup.sec_gear": "03 · THE GEAR",
  "signup.sec_photos": "04 · THE PHOTOS",
  "signup.sec_pitch": "05 · THE PITCH",
  "signup.field_room_name": "ROOM / VENUE NAME",
  "signup.field_your_name": "YOUR NAME",
  "signup.field_address": "STREET ADDRESS",
  "signup.field_neighborhood": "NEIGHBORHOOD",
  "signup.field_rate": "RATE (₾/HR)",
  "signup.field_capacity": "CAPACITY",
  "signup.field_hours": "HOURS",
  "signup.soundproofing": "SOUNDPROOFING:",
  "signup.equipment": "EQUIPMENT LIST",
  "signup.equipment_hint": "— what bands can plug into",
  "signup.gear_placeholder": "e.g. Marshall JCM800 head",
  "signup.add_gear": "+ ADD GEAR",
  "signup.genres": "GENRES YOU CATER TO",
  "signup.pitch_placeholder": "Tell bands what makes the room loud, weird and worth booking. Vibe, walls, backline — all of it.",
  "signup.list_room": "LIST MY ROOM →",
  "signup.ph_capacity": "12 people",
  "signup.ph_hours": "10am – 2am daily",
  "signup.ph_address": "12 Asatiani St, Tbilisi",
  "signup.ph_neighborhood": "Sololaki",

  // dashboard
  "dash.confirm_delete": "Delete this room listing?",
  "dash.load_error": "Could not load your rooms",
  "dash.title_pre": "Your",
  "dash.title_accent": "rooms.",
  "dash.prompt_signin": "Sign in as a room owner to manage your listings.",
  "dash.list_room": "LIST A ROOM",
  "dash.prompt_empty": "No rooms yet. List your first space.",
  "dash.view": "VIEW",
  "dash.delete": "DELETE",

  // new room
  "newroom.title_pre": "List a",
  "newroom.title_accent": "room.",
  "newroom.subtitle": "Add a new space to your listings.",
  "newroom.cancel": "← BACK TO DASHBOARD",
  "newroom.signin": "Sign in as a room owner to list a room.",
  "newroom.not_provider": "Only room owners can list rooms — your account is a musician account.",

  // profile
  "profile.role_owner": "ROOM OWNER",
  "profile.role_musician": "MUSICIAN",
  "profile.manage_rooms": "MANAGE MY ROOMS",
  "profile.saved_rooms": "★ SAVED ROOMS",

  // saved
  "saved.title_pre": "Your",
  "saved.title_accent": "pit.",
  "saved.empty_title": "NOTHING SAVED YET.",
  "saved.empty_body": "Hit the ★ on any room to keep it here.",
  "saved.badge": "{count} SAVED",

  // not found
  "nf.title": "ALL QUIET.",
  "nf.body": "That room is not on the bill. Head back to the listings.",
  "nf.back": "← BACK TO ROOMS",

  // google button
  "google.continue": "CONTINUE WITH GOOGLE",
  "google.not_configured": "Google sign-in is not configured. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET on the API.",

  // photo uploader
  "photo.remove": "Remove photo",
  "photo.uploading": "UPLOADING",
  "photo.drop": "DROP PHOTO",
  "photo.error": "Upload failed. Is UPLOADTHING_TOKEN set on the API?",

  // soundproofing values
  "soundproof.Full isolation": "Full isolation",
  "soundproof.Double-wall": "Double-wall",
  "soundproof.Floated floor": "Floated floor",
  "soundproof.Foam treated": "Foam treated",
  "soundproof.Basic": "Basic",
};

const ka: Dict = {
  // nav / global
  "nav.signin": "შესვლა",
  "nav.signup": "რეგისტრაცია",
  "nav.signout": "გასვლა",
  "brand.finder": "ძიება",
  "masthead.city": "თბილისი",
  "masthead.country": "საქართველო",
  "footer.tagline": "თბილისი ახმაურდა · plug in & get loud · მოიტანე ყურის დამცავი!",

  // home / api offline
  "home.offline_title": "API გათიშულია",
  "home.offline_pre": "ოთახების ჩატვირთვა ვერ მოხერხდა ({error}).",
  "home.offline_post": "და დარწმუნდი, რომ ბაზა შევსებულია.",
  "home.offline_error": "API მიუწვდომელია",

  // finder
  "finder.count": "{count} სარეპეტიციო ოთახი თბილისში. დაჯავშნე!.",
  "finder.search": "მოძებნე ოთახები",
  "finder.clear": "გასუფთავება",
  "finder.all": "ყველა",
  "finder.genre": "ჟანრი",
  "finder.price": "ფასი",
  "finder.sort": "დახარისხება",
  "finder.open_now": "ღია",
  "finder.sort_rating": "საუკეთესო",
  "finder.sort_price": "იაფი",
  "finder.sort_name": "ა–ჰ",
  "finder.front_row": "პირველი რიგი",
  "finder.featured": "/ რჩეული",
  "finder.all_rooms": "ყველა ოთახი",
  "finder.listed": "{count} განთავსებული",
  "finder.empty_title": "ოთახები არ არის. სიჩუმეა.",
  "finder.empty_body": "ვერაფერი მოიძებნა.",
  "finder.reset": "ფილტრების გასუფთავება",
  "finder.load_more": "მეტის ჩვენება",
  "finder.loading": "იტვირთება…",

  // room card
  "room.open_now": "ღიაა",
  "room.closed": "დაკეტილია",
  "room.per_hour": "/სთ",
  "room.enter": "შესვლა →",
  "room.save": "შენახვა",
  "room.unsave": "წაშლა",

  // room detail
  "detail.back": "← ოთახებში დაბრუნება",
  "detail.vip_featured": "VIP · რჩეული",
  "detail.reviews_count": "{count} შეფასება",
  "detail.saved": "შენახულია",
  "detail.save": "შენახვა",
  "detail.no_photo": "[ ფოტო ჯერ არ არის ]",
  "detail.photo": "ფოტო {n}",
  "detail.the_room": "ოთახი",
  "detail.the_gear": "აპარატურა",
  "detail.location": "მდებარეობა",
  "detail.google_maps": "GOOGLE MAPS",
  "detail.open_maps": "გახსენი რუკაზე ↗",
  "detail.the_details": "დეტალები",
  "detail.spec_price": "ფასი",
  "detail.spec_room_size": "ოთახის ზომა",
  "detail.spec_soundproofing": "ხმის იზოლაცია",
  "detail.spec_hours": "საათები",
  "detail.spec_capacity": "ტევადობა",
  "detail.price_value": "₾{price} / სთ ({tier})",
  "detail.from_the_pit": "მოედნიდან",
  "detail.reviews": "შეფასებები",

  // review form
  "review.signin_suffix": "შესაფასებლად.",
  "review.your_rating": "შენი შეფასება",
  "review.stars": "{n} ვარსკვლავი",
  "review.placeholder": "რამდენად მოგეწონათ?",
  "review.posting": "იგზავნება…",
  "review.post": "შეფასების დატოვება →",
  "review.error": "შეფასების გამოქვეყნება ვერ მოხერხდა",

  // login
  "login.title_pre": "დაბრუნდი",
  "login.title_accent": "მოედანზე.",
  "login.google": "შესვლა Google-ით",
  "login.or_email": "ან ელ-ფოსტით",
  "login.email": "ელ-ფოსტა",
  "login.password": "პაროლი",
  "login.submit": "შესვლა →",
  "login.error": "შესვლა ვერ მოხერხდა",
  "login.new_here": "ახალი ხარ?",

  // signup — shared
  "signup.field_email": "ელ-ფოსტა",
  "signup.field_password": "პაროლი",
  "signup.signin_scene": "უკვე სცენაზე ხარ?",
  "signup.signin_listed": "უკვე განათავსე?",
  "signup.err_failed": "რეგისტრაცია ვერ მოხერხდა",
  "signup.err_room_partial": "ანგარიში შეიქმნა, მაგრამ ოთახის შენახვა ვერ მოხერხდა: {msg}",
  "signup.err_room": "ოთახის შენახვა ვერ მოხერხდა",

  // signup — done
  "signup.done_badge": "შემოხვედი",
  "signup.done_user_title": "ავუწიოთ ხმას.",
  "signup.done_provider_title": "ოთახი გამოქვეყნდა.",
  "signup.done_user_body": "ანგარიში მზადაა. დაათვალიერე თბილისის სარეპეტიციო ოთახები და დაჯავშნე პირველი სესია.",
  "signup.done_provider_body": "შენი განცხადება გამოქვეყნდა. ბენდები გიპოვიან, მოგწერენ და დაჯავშნიან საათობრივად.",
  "signup.done_browse": "→ ოთახების დათვალიერება",

  // signup — hero / tabs
  "signup.join_pre": "შემოუერთდი",
  "signup.join_accent": "ხმაურს.",
  "signup.hero_note": "აირჩიე მინის რომელ მხარეს ხარ. ორი წუთი. სრულიად უფასო.",
  "signup.tab_user_title": "მუსიკოსი ვარ",
  "signup.tab_user_sub": "იპოვე ოთახები · დაჯავშნე · შეინახე რჩეულები",
  "signup.tab_provider_title": "ოთახს ვმართავ",
  "signup.tab_provider_sub": "განათავსე სივრცე · დააწესე ფასი · მიიღე ჯავშნები",

  // signup — user form
  "signup.quick_start": "სწრაფი დაწყება",
  "signup.google_signup": "რეგისტრაცია Google-ით",
  "signup.or_oldschool": "ან კლასიკურად",
  "signup.username": "მომხმარებლის სახელი",
  "signup.create_account": "ანგარიშის შექმნა →",

  // signup — provider form
  "signup.provider_google": "გაგრძელება Google-ით",
  "signup.provider_intro": "განათავსე შენი სივრცე.",
  "signup.provider_intro_sub": "ყველა ველი დაგეხმარება რომ გიპოვონ.",
  "signup.sec_basics": "01 · ძირითადი",
  "signup.sec_space": "02 · სივრცე",
  "signup.sec_gear": "03 · აპარატურა",
  "signup.sec_photos": "04 · ფოტოები",
  "signup.sec_pitch": "05 · აღწერა",
  "signup.field_room_name": "ოთახის / ვენიუს სახელი",
  "signup.field_your_name": "შენი სახელი",
  "signup.field_address": "მისამართი",
  "signup.field_neighborhood": "უბანი",
  "signup.field_rate": "ფასი (₾/სთ)",
  "signup.field_capacity": "ტევადობა",
  "signup.field_hours": "სამუშაო საათები",
  "signup.soundproofing": "ხმის იზოლაცია:",
  "signup.equipment": "აპარატურის სია",
  "signup.equipment_hint": "— რასაც ბენდები გამოიყენებენ",
  "signup.gear_placeholder": "მაგ. Marshall JCM800 head",
  "signup.add_gear": "+ აპარატურის დამატება",
  "signup.genres": "ჟანრები, რომლებსაც ანიჭებთ უპირატესობას",
  "signup.pitch_placeholder": "რა ხდის ოთახს გამორჩეულს, სასურველს და დასაჯავშნად ღირებულს? ვაიბი, კედლები, აპარატურა და ა.შ.",
  "signup.list_room": "ჩემი ოთახის განთავსება →",
  "signup.ph_capacity": "12 ადამიანი",
  "signup.ph_hours": "10:00 – 02:00 ყოველდღე",
  "signup.ph_address": "ასათიანის ქ. 12, თბილისი",
  "signup.ph_neighborhood": "სოლოლაკი",

  // dashboard
  "dash.confirm_delete": "წავშალო ეს განცხადება?",
  "dash.load_error": "შენი ოთახების ჩატვირთვა ვერ მოხერხდა",
  "dash.title_pre": "შენი",
  "dash.title_accent": "ოთახები.",
  "dash.prompt_signin": "შედი როგორც ოთახის მფლობელი განცხადებების სამართავად.",
  "dash.list_room": "ოთახის განთავსება",
  "dash.prompt_empty": "ჯერ ოთახები არ არის. განათავსე პირველი სივრცე.",
  "dash.view": "ნახვა",
  "dash.delete": "წაშლა",

  // new room
  "newroom.title_pre": "განათავსე",
  "newroom.title_accent": "ოთახი.",
  "newroom.subtitle": "დაამატე ახალი სივრცე შენს განცხადებებში.",
  "newroom.cancel": "← უკან დაფაზე",
  "newroom.signin": "შედი როგორც ოთახის მფლობელი ოთახის განსათავსებლად.",
  "newroom.not_provider": "ოთახების განთავსება მხოლოდ მფლობელებს შეუძლიათ — შენი ანგარიში მუსიკოსის ანგარიშია.",

  // profile
  "profile.role_owner": "ოთახის მფლობელი",
  "profile.role_musician": "მუსიკოსი",
  "profile.manage_rooms": "ჩემი ოთახების მართვა",
  "profile.saved_rooms": "★ შენახული ოთახები",

  // saved
  "saved.title_pre": "შენი",
  "saved.title_accent": "მოედანი.",
  "saved.empty_title": "ჯერ არაფერია შენახული.",
  "saved.empty_body": "დააჭირე ★-ს ნებისმიერ ოთახზე, რომ აქ შეინახო.",
  "saved.badge": "{count} შენახული",

  // not found
  "nf.title": "სრული სიჩუმე.",
  "nf.body": "ეს ოთახი აფიშაზე არ არის. დაბრუნდი სიაში.",
  "nf.back": "← ოთახებში დაბრუნება",

  // google button
  "google.continue": "გაგრძელება Google-ით",
  "google.not_configured": "Google-ით შესვლა არ არის კონფიგურირებული. დააყენე GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET API-ზე.",

  // photo uploader
  "photo.remove": "ფოტოს წაშლა",
  "photo.uploading": "იტვირთება",
  "photo.drop": "ჩააგდე ფოტო",
  "photo.error": "ატვირთვა ვერ მოხერხდა.",

  // soundproofing values
  "soundproof.Full isolation": "სრული იზოლაცია",
  "soundproof.Double-wall": "ორმაგი კედელი",
  "soundproof.Floated floor": "მცურავი იატაკი",
  "soundproof.Foam treated": "ფოროლონით დამუშავებული",
  "soundproof.Basic": "ჩვეულებრივი",
};

const DICTS: Record<Locale, Dict> = { en, ka };

export type TParams = Record<string, string | number>;
export type TFunc = (key: string, params?: TParams) => string;

type LangContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TFunc;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ka") setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<TFunc>(
    (key, params) => {
      let s = DICTS[locale][key] ?? en[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const value = useMemo<LangContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useT must be used within <LangProvider>");
  return ctx;
}

export function LangToggle() {
  const { locale, setLocale } = useT();
  const seg = (l: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(l)}
      aria-pressed={locale === l}
      style={{
        cursor: "pointer",
        border: 0,
        fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
        letterSpacing: 1,
        fontSize: 13,
        padding: "7px 10px",
        lineHeight: 1,
        ...(locale === l
          ? { background: "var(--red)", color: "var(--paper)" }
          : { background: "transparent", color: "var(--paper)" }),
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ display: "flex", border: "2px solid var(--paper)" }}>
      {seg("ka", "ქარ")}
      {seg("en", "ENG")}
    </div>
  );
}
