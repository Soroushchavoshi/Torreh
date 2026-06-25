import { useState, useRef } from "react";
import { Plus, Minus, ChevronLeft, ChevronDown, Trash2, Pencil, Check, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type MenuItem = {
  id: string;
  name: string;
  emoji: string;
  trayMode?: boolean;
};

type MenuSection = {
  id: string;
  title?: string;
  icon?: string;
  iconStyle?: React.CSSProperties;
  collapsible: boolean;
  items: MenuItem[];
};

function toPersian(n: number) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

const TRAY_PRESETS = [
  { id: "half", label: "نصف سینی" },
  { id: "base", label: "یک کف سینی" },
];

const MENU_SECTIONS: MenuSection[] = [
  {
    id: "nim-baguette-section",
    title: "نیم باگت",
    icon: "🥖",
    collapsible: true,
    items: [
      { id: "nim-baguette", name: "نیم باگت", emoji: "🥖" },
      { id: "sandwichi", name: "ساندویچی", emoji: "🥪" },
      { id: "ghalami", name: "قلمی", emoji: "🥖" },
      { id: "barbari-sadeh", name: "بربری ساده", emoji: "🫓" },
      { id: "barbari-korei", name: "بربری کره ای", emoji: "🫓" },
      { id: "hamburger", name: "همبرگر", emoji: "🍔" },
      { id: "mini-hamburger", name: "مینی همبرگر", emoji: "🍔" },
      { id: "finger-food", name: "فینگر فود", emoji: "🍟" },
      { id: "sandwichi-mac", name: "ساندویچی مک", emoji: "🥪" },
      { id: "burger-mac", name: "برگر مک", emoji: "🍔" },
    ],
  },
  {
    id: "rogan-section",
    title: "روگن",
    icon: "🥖",
    iconStyle: { filter: "sepia(1) saturate(0.3) brightness(0.55)" },
    collapsible: true,
    items: [
      { id: "nim-baguette-rogan", name: "نیم باگت روگن", emoji: "🥖" },
      { id: "sandwichi-rogan", name: "ساندویچی روگن", emoji: "🥪" },
      { id: "ghalami-rogan", name: "قلمی روگن", emoji: "🥖" },
      { id: "mini-burger-rogan", name: "مینی برگر روگن", emoji: "🍔" },
      { id: "hamburger-rogan", name: "همبرگر روگن", emoji: "🍔" },
      { id: "barbari-rogan", name: "بربری روگن", emoji: "🫓" },
      { id: "charki-chavdar", name: "چارکی چاودار", emoji: "🍞" },
    ],
  },
  {
    id: "nan-gerd-section",
    title: "نان گرد",
    icon: "🫓",
    collapsible: true,
    items: [
      { id: "super-siah", name: "سوپر سیاه", emoji: "🍞" },
      { id: "haft-giah", name: "هفت گیاه", emoji: "🌿" },
      { id: "bagel", name: "بیگل", emoji: "🥯" },
      { id: "artisan", name: "آرتیزن", emoji: "🍞" },
      { id: "asal-gerdoo", name: "عسل گردو", emoji: "🍯" },
    ],
  },
  {
    id: "gata-section",
    title: "گاتا",
    icon: "🍪",
    collapsible: true,
    items: [
      { id: "gata-sadeh", name: "گاتا ساده", emoji: "🍪" },
      { id: "gata-khorma", name: "گاتا خرما", emoji: "🍪" },
      { id: "gata-gerdoo", name: "گاتا گردو", emoji: "🍪" },
      { id: "gata-miveyi", name: "گاتا میوه ای", emoji: "🍪" },
      { id: "gata-karebadaam", name: "گاتا کره بادام", emoji: "🍪" },
    ],
  },
  {
    id: "eshtrodel-section",
    title: "اشترودل",
    icon: "🥐",
    collapsible: true,
    items: [
      { id: "eshtrodel-pizza", name: "اشترودل پیتزایی", emoji: "🥐" },
      { id: "eshtrodel-gerdoo", name: "اشترودل گردو", emoji: "🥐" },
      { id: "eshtrodel-albaloo", name: "اشترودل آلبالو", emoji: "🥐" },
    ],
  },
  {
    id: "pirashki-section",
    title: "پیراشکی هات داگ",
    icon: "🌭",
    collapsible: true,
    items: [
      { id: "khamir-pizza", name: "خمیر پیتزا", emoji: "🍕" },
      { id: "pirashki-hotdog", name: "پیراشکی هات داگ", emoji: "🌭" },
      { id: "beef-cheese", name: "بیف چیز", emoji: "🧀" },
      { id: "mazeh", name: "مزه", emoji: "🍽️" },
      { id: "nan-sir", name: "نان سیر", emoji: "🧄" },
      { id: "focaccia", name: "فوکاچیا", emoji: "🫓" },
    ],
  },
  {
    id: "shirmal-section",
    title: "شیرمال",
    icon: "🍞",
    collapsible: true,
    items: [
      { id: "shirmal-gisoo", name: "شیرمال گیسو", emoji: "🍞" },
      { id: "shirmal-makhsoos", name: "شیرمال مخصوص", emoji: "🍞" },
    ],
  },
  {
    id: "simyt-section",
    title: "سیمیت",
    icon: "🥯",
    collapsible: true,
    items: [
      { id: "simyt", name: "سیمیت", emoji: "🥯" },
      { id: "simyt-sobhaneh", name: "سیمیت صبحانه (پنیر)", emoji: "🥯" },
      { id: "simyt-khorma", name: "سیمیت خرما", emoji: "🥯" },
    ],
  },
  {
    id: "croissant-section",
    title: "کروسان",
    icon: "🥐",
    collapsible: true,
    items: [
      { id: "croissant-sadeh", name: "کروسان ساده", emoji: "🥐" },
      { id: "croissant-nutella", name: "کروسان نوتلا", emoji: "🥐" },
      { id: "croissant-badam", name: "کروسان بادام", emoji: "🥐" },
    ],
  },
  {
    id: "pie-section",
    title: "پای",
    icon: "🥧",
    collapsible: true,
    items: [
      { id: "pie-sib", name: "پای سیب", emoji: "🍎", trayMode: true },
      { id: "pie-ananas", name: "پای آناناس", emoji: "🍍", trayMode: true },
    ],
  },
  {
    id: "misc-3-section",
    title: "شیرینی",
    icon: "🍪",
    collapsible: true,
    items: [
      { id: "cake-yazdi", name: "کیک یزدی", emoji: "🎂", trayMode: true },
      { id: "shirini-keshmeshi", name: "شیرینی کشمشی", emoji: "🍇", trayMode: true },
      { id: "saaq-aroos", name: "ساق عروس", emoji: "🌹", trayMode: true },
      { id: "danmarki", name: "دانمارکی", emoji: "🍰", trayMode: true },
      { id: "lando", name: "لندو", emoji: "🍰", trayMode: true },
      { id: "danish", name: "دنیش", emoji: "🥐", trayMode: true },
      { id: "shoorini", name: "شورینی", emoji: "🍪", trayMode: true },
      { id: "mami-nutella", name: "مامی نوتلا", emoji: "🍫", trayMode: true },
      { id: "muffin-sadeh", name: "مافین ساده", emoji: "🧁" },
      { id: "muffin-chocolate", name: "مافین شکلات", emoji: "🧁" },
      { id: "muffin-nescafe", name: "مافین نسکافه", emoji: "☕" },
      { id: "lava", name: "لاوا", emoji: "🍫" },
      { id: "zaban", name: "زبان", emoji: "🍞" },
      { id: "ajma", name: "آجما/آچما", emoji: "🥐" },
      { id: "sitrol-keshmeshi", name: "سیترول کشمشی", emoji: "🍇" },
      { id: "zaban-keshmeshi", name: "زبان کشمشی", emoji: "🍞" },
    ],
  },
  {
    id: "donut-section",
    title: "دونات",
    icon: "🍩",
    collapsible: true,
    items: [
      { id: "donut-shekari", name: "دونات شکری", emoji: "🍩" },
      { id: "donut-kreamddar", name: "دونات کرمدار", emoji: "🍩" },
      { id: "donut-kakaoyi", name: "دونات کاکائویی", emoji: "🍩" },
    ],
  },
  {
    id: "khamir-torsh-section",
    title: "خمیر ترش",
    icon: "🌾",
    collapsible: true,
    items: [
      { id: "paneh", name: "پانه", emoji: "🍞" },
      { id: "chiapata", name: "چیاپاتا", emoji: "🫓" },
      { id: "baguette-original", name: "باگت اورجینال", emoji: "🥖" },
      { id: "ekmak", name: "اکمک", emoji: "🍞" },
    ],
  },
  {
    id: "toast-section",
    title: "تست",
    icon: "🍞",
    collapsible: true,
    items: [
      { id: "toast-bozorg", name: "تست بزرگ", emoji: "🍞" },
      { id: "toast-kuchak", name: "تست کوچک", emoji: "🍞" },
      { id: "toast-rogan-bozorg", name: "تست روگن بزرگ", emoji: "🍞" },
      { id: "toast-rogan-kuchak", name: "تست روگن کوچک", emoji: "🍞" },
      { id: "toast-swital-bozorg", name: "تست سویتال بزرگ", emoji: "🍞" },
      { id: "toast-swital-kuchak", name: "تست سویتال کوچک", emoji: "🍞" },
      { id: "toast-caesar", name: "تست سزار", emoji: "🍞" },
    ],
  },
  {
    id: "salad-section",
    title: "سالاد سیردار",
    icon: "🥗",
    collapsible: true,
    items: [
      { id: "salad-sirdar", name: "سالاد سیردار", emoji: "🥗" },
      { id: "soup-konjedi", name: "سوپ کنجدی", emoji: "🍲" },
      { id: "nan-protein", name: "نان پروتئین", emoji: "🍞" },
      { id: "khoshk-shevid", name: "خشک شوید", emoji: "🌿" },
      { id: "khoshk-tokhme", name: "خشک تخمه", emoji: "🌱" },
      { id: "khoshk-kajand", name: "خشک کنجد", emoji: "🌿" },
      { id: "nan-chai", name: "نان چای", emoji: "☕" },
    ],
  },
  {
    id: "cake-section",
    title: "کیک ها",
    icon: "🎂",
    collapsible: true,
    items: [
      { id: "cake-sib-darchin", name: "کیک سیب و دارچین", emoji: "🍎" },
      { id: "cake-sobhaneh", name: "کیک صبحانه", emoji: "🎂", trayMode: true },
      { id: "cupcake", name: "کاپ کیک", emoji: "🧁" },
      { id: "cheesecake-chocolate", name: "چیز کیک برشی شکلات", emoji: "🍰" },
      { id: "cheesecake-white", name: "چیز کیک برشی سفید", emoji: "🍰" },
      { id: "cake-carrot", name: "کیک هویج", emoji: "🥕" },
      { id: "brownie", name: "براونی", emoji: "🍫", trayMode: true },
      { id: "pudding-asali", name: "پودینگ عسلی", emoji: "🍯", trayMode: true },
      { id: "cake-nutella-kuchak", name: "کیک نوتلا کوچک", emoji: "🍫" },
    ],
  },
  {
    id: "cookie-section",
    title: "کوکی و کاندیل",
    icon: "🍪",
    collapsible: true,
    items: [
      { id: "cookie-rejimi", name: "کوکی رژیمی", emoji: "🍪" },
      { id: "candil", name: "کاندیل", emoji: "🕯️" },
    ],
  },
  {
    id: "swissi-section",
    title: "سوئیسی",
    icon: "🍓",
    collapsible: true,
    items: [
      { id: "swissi-mrabai", name: "سوئیسی مربایی", emoji: "🍓", trayMode: true },
      { id: "swissi-nutella", name: "سوئیسی نوتلایی", emoji: "🍫", trayMode: true },
    ],
  },
  {
    id: "sokharis-section",
    title: "سوخاری",
    icon: "🍞",
    collapsible: true,
    items: [
      { id: "sokharis-shirin", name: "سوخاری شیرین", emoji: "🍞" },
      { id: "sokharis-rogan", name: "سوخاری روگن", emoji: "🍞" },
    ],
  },
  {
    id: "dessert-section",
    title: "دسر",
    icon: "🍮",
    collapsible: true,
    items: [
      { id: "dessert-cheesecake", name: "دسر چیز کیک", emoji: "🍰" },
      { id: "dessert-tiramisu", name: "دسر تیرامیسو", emoji: "🍮" },
      { id: "dessert-mivei-shatoot", name: "دسر میوه ای (شاتوت)", emoji: "🫐" },
      { id: "dessert-mivei-tootfarangi", name: "دسر میوه ای (توت فرنگی)", emoji: "🍓" },
    ],
  },
  {
    id: "shirini-tar-section",
    title: "شیرینی تر",
    icon: "🧁",
    collapsible: true,
    items: [
      { id: "napoleoni", name: "ناپلئونی", emoji: "🥙", trayMode: true },
      { id: "nan-khamei-bozorg", name: "نان خامه ای بزرگ", emoji: "🍞", trayMode: true },
      { id: "nan-khamei-kuchak", name: "نان خامه ای کوچک", emoji: "🍞", trayMode: true },
      { id: "nan-khamei-moozi", name: "نان خامه ای موزی", emoji: "🍌", trayMode: true },
      { id: "eclair-bozorg", name: "اکلر بزرگ", emoji: "🍫", trayMode: true },
      { id: "eclair-kuchak", name: "اکلر کوچک", emoji: "🍫", trayMode: true },
      { id: "faransavi", name: "فرانسوی", emoji: "🥖", trayMode: true },
    ],
  },
  {
    id: "roolet-section",
    title: "رولت",
    icon: "🍰",
    collapsible: true,
    items: [
      { id: "roolet-sadeh", name: "رولت ساده", emoji: "🍰", trayMode: true },
      { id: "roolet-shatoot", name: "رولت شاتوت", emoji: "🍰", trayMode: true },
      { id: "roolet-kakao", name: "رولت کاکائو (نوتلا)", emoji: "🍫", trayMode: true },
      { id: "roolet-pesteh", name: "رولت پسته ای", emoji: "🍰", trayMode: true },
      { id: "roolet-lotus", name: "رولت لوتوس", emoji: "🍰", trayMode: true },
      { id: "roolet-caramel", name: "رولت دلی کاراملی", emoji: "🍯", trayMode: true },
      { id: "roolet-nargil", name: "رولت نارگیلی", emoji: "🥥", trayMode: true },
      { id: "roolet-zardaalu", name: "رولت زردآلو", emoji: "🍑", trayMode: true },
      { id: "roolet-ghahve", name: "رولت پودر قهوه", emoji: "☕", trayMode: true },
      { id: "roolet-picasso", name: "رولت پیکاسو", emoji: "🎨", trayMode: true },
    ],
  },
  {
    id: "mikado-section",
    title: "میکادو",
    icon: "🍫",
    collapsible: true,
    items: [
      { id: "mikado", name: "میکادو", emoji: "🍫", trayMode: true },
    ],
  },
  {
    id: "mochi-section",
    title: "موچی",
    icon: "🍡",
    collapsible: true,
    items: [
      { id: "mochi-tootfarangi", name: "موچی توت فرنگی", emoji: "🍓" },
      { id: "mochi-nutella", name: "موچی نوتلا", emoji: "🍫" },
      { id: "mochi-caramel", name: "موچی کارامل", emoji: "🍯" },
      { id: "mochi-shatoot", name: "موچی شاتوت", emoji: "🫐" },
      { id: "mochi-ranginkaman", name: "موچی رنگین کمان", emoji: "🌈" },
    ],
  },
];

const MENU: MenuItem[] = MENU_SECTIONS.flatMap((s) => s.items);

// ─── TraySelector ────────────────────────────────────────────────────────────
type TraySelectorProps = {
  value: string | null;
  onChange: (val: string) => void;
  onRemove: () => void;
  onClose: () => void;
};

function TraySelector({ value, onChange, onRemove, onClose }: TraySelectorProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function activateCustom() {
    setCustomMode(true);
    setCustomText("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commitCustom() {
    const trimmed = customText.trim();
    if (trimmed) onChange(trimmed);
    setCustomMode(false);
    setCustomText("");
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 mt-3 px-1">
        <div className="flex-1 bg-secondary rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-primary flex-1">{value}</span>
          <button
            onClick={() => onChange("")}
            className="text-muted-foreground active:scale-90 transition-transform"
          >
            <Pencil size={14} />
          </button>
        </div>
        <button
          onClick={onRemove}
          className="text-destructive active:scale-90 transition-transform flex items-center justify-center"
          style={{ width: 44, height: 44 }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 px-1 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-2 flex-1">
          {TRAY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => { onChange(preset.label); setCustomMode(false); }}
              className="border border-border rounded-full text-sm font-medium text-foreground active:scale-95 transition-transform"
              style={{ paddingInline: 14, height: 38, background: "rgba(232,148,58,0.08)" }}
            >
              {preset.label}
            </button>
          ))}

          {!customMode && (
            <button
              onClick={activateCustom}
              className="border border-dashed border-primary/50 rounded-full text-sm font-medium text-primary active:scale-95 transition-transform"
              style={{ paddingInline: 14, height: 38 }}
            >
              مقدار دلخواه…
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-muted-foreground active:scale-90 transition-transform flex items-center justify-center flex-shrink-0"
          style={{ width: 36, height: 36 }}
        >
          <X size={18} />
        </button>
      </div>

      {customMode && (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitCustom()}
            placeholder="مثلاً: یک و نیم سینی"
            className="flex-1 bg-secondary rounded-xl px-3 text-sm text-foreground outline-none border border-primary/40 placeholder:text-muted-foreground"
            style={{ height: 44, caretColor: "#e8943a" }}
          />
          <button
            onClick={commitCustom}
            disabled={!customText.trim()}
            className="bg-primary text-primary-foreground rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:opacity-40"
            style={{ width: 44, height: 44 }}
          >
            <Check size={18} />
          </button>
          <button
            onClick={onRemove}
            className="text-destructive active:scale-90 transition-transform flex items-center justify-center"
            style={{ width: 44, height: 44 }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [lastQuantities, setLastQuantities] = useState<Record<string, number>>({});
  const [traySelections, setTraySelections] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [sectionSelectOrder, setSectionSelectOrder] = useState<string[]>([]);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  function isSectionOpen(sectionId: string) {
    return openSections[sectionId] === true;
  }

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !isSectionOpen(sectionId) }));
  }

  const filteredMenu = searchQuery.trim()
    ? MENU.filter((item) => item.name.includes(searchQuery.trim()))
    : [];

  const confirmedItems = MENU.filter((item) => confirmed[item.id]);
  const hasAnyConfirmed = confirmedItems.some((item) =>
    item.trayMode ? !!traySelections[item.id] : !!quantities[item.id]
  );

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const hasOrder = hasAnyConfirmed || totalQty > 0;
  const confirmedCount = MENU.filter((item) =>
    item.trayMode ? !!traySelections[item.id] : !!quantities[item.id]
  ).length;

  function handleConfirm(id: string) {
    setConfirmed((prev) => ({ ...prev, [id]: true }));
    const item = MENU.find((m) => m.id === id);
    if (!item?.trayMode) {
      setQuantities((prev) => ({ ...prev, [id]: lastQuantities[id] ?? 1 }));
    }
    const section = MENU_SECTIONS.find((s) => s.items.some((i) => i.id === id));
    if (section) {
      setSectionSelectOrder((prev) =>
        prev.includes(section.id) ? prev : [...prev, section.id]
      );
    }
    setSearchQuery("");
  }

  function handleIncrease(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 1) + 1 }));
  }

  function handleDecrease(id: string) {
    const next = (quantities[id] ?? 1) - 1;
    if (next <= 0) handleRemove(id);
    else setQuantities((prev) => ({ ...prev, [id]: next }));
  }

  function handleRemove(id: string) {
    setLastQuantities((prev) => ({ ...prev, [id]: quantities[id] ?? prev[id] ?? 1 }));
    setConfirmed((prev) => ({ ...prev, [id]: false }));
    setEditing((prev) => { const c = { ...prev }; delete c[id]; return c; });
    setQuantities((prev) => { const c = { ...prev }; delete c[id]; return c; });
    setTraySelections((prev) => { const c = { ...prev }; delete c[id]; return c; });
    // remove section from order if no items remain selected
    const section = MENU_SECTIONS.find((s) => s.items.some((i) => i.id === id));
    if (section) {
      const otherSelected = section.items.some(
        (i) => i.id !== id && (confirmed[i.id] || quantities[i.id])
      );
      if (!otherSelected) {
        setSectionSelectOrder((prev) => prev.filter((sid) => sid !== section.id));
      }
    }
  }

  function handleEditStart(id: string) {
    setEditing((prev) => ({ ...prev, [id]: String(quantities[id] ?? 1) }));
    setTimeout(() => inputRefs.current[id]?.select(), 0);
  }

  function handleEditChange(id: string, val: string) {
    const normalized = val.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    if (/^\d*$/.test(normalized)) setEditing((prev) => ({ ...prev, [id]: normalized }));
  }

  function handleEditCommit(id: string) {
    const num = parseInt(editing[id] ?? "", 10);
    if (!isNaN(num) && num > 0) setQuantities((prev) => ({ ...prev, [id]: num }));
    else if (num === 0) { handleRemove(id); return; }
    setEditing((prev) => { const c = { ...prev }; delete c[id]; return c; });
  }

  function handleOrder() {
    setLastQuantities((prev) => ({ ...prev, ...quantities }));
    setOrderPlaced(true);
  }

  function handleReset() {
    setQuantities({});
    setConfirmed({});
    setEditing({});
    setTraySelections({});
    setSectionSelectOrder([]);
    setOrderPlaced(false);
  }

  function scrollToItem(itemId: string) {
    // Find which section this item belongs to
    const section = MENU_SECTIONS.find((s) => s.items.some((i) => i.id === itemId));
    
    // Open the section if it's closed
    if (section && !isSectionOpen(section.id)) {
      setOpenSections((prev) => ({ ...prev, [section.id]: true }));
    }

    // Wait for animation to complete, then scroll
    setTimeout(() => {
      const element = itemRefs.current[itemId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight the item briefly
        setHighlightedItem(itemId);
        setTimeout(() => setHighlightedItem(null), 2000);
      }
    }, 350); // Wait for section expand animation
  }

  function renderItem(item: MenuItem) {
    const isConfirmed = confirmed[item.id];
    const qty = quantities[item.id] ?? 0;
    const trayVal = traySelections[item.id] ?? "";
    const isHighlighted = highlightedItem === item.id;

    return (
      <div
        key={item.id}
        ref={(el) => { itemRefs.current[item.id] = el; }}
        className="rounded-2xl border transition-all duration-300"
        style={{
          background: isConfirmed ? "var(--card)" : "rgba(255,255,255,0.02)",
          borderColor: isConfirmed ? "rgba(232,148,58,0.35)" : "rgba(255,255,255,0.06)",
          boxShadow: isConfirmed 
            ? "0 0 0 1px rgba(232,148,58,0.2)" 
            : isHighlighted 
            ? "0 0 0 2px rgba(232,148,58,0.6)"
            : "none",
        }}
      >
        <div className="px-4 pt-3 pb-3">
          <div className="flex items-center gap-3" style={{ minHeight: 52 }}>
            <span className="flex-1 font-semibold text-foreground text-base leading-snug">
              {item.name}
            </span>

            {!isConfirmed ? (
              <button
                onClick={() => handleConfirm(item.id)}
                className="rounded-xl font-semibold text-sm whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1 text-primary border border-primary"
                style={{ paddingInline: 14, height: 44, background: "rgba(232,148,58,0.08)" }}
              >
                افزودن
                <Plus size={15} />
              </button>
            ) : item.trayMode ? (
              null
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-destructive active:scale-90 transition-transform flex items-center justify-center"
                  style={{ width: 44, height: 44 }}
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center bg-secondary rounded-xl" style={{ padding: 4, gap: 2 }}>
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="text-foreground active:scale-90 transition-transform flex items-center justify-center rounded-lg"
                    style={{ width: 40, height: 40 }}
                  >
                    <Minus size={16} />
                  </button>
                  {editing[item.id] !== undefined ? (
                    <input
                      ref={(el) => { inputRefs.current[item.id] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={editing[item.id]}
                      onChange={(e) => handleEditChange(item.id, e.target.value)}
                      onBlur={() => handleEditCommit(item.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditCommit(item.id)}
                      className="text-center font-bold text-foreground text-base bg-transparent outline-none border-b border-primary"
                      style={{ width: 36, height: 40, caretColor: "#e8943a" }}
                    />
                  ) : (
                    <button
                      onClick={() => handleEditStart(item.id)}
                      className="text-center font-bold text-foreground text-base active:opacity-60 transition-opacity flex items-center justify-center"
                      style={{ width: 36, height: 40 }}
                    >
                      {toPersian(qty)}
                    </button>
                  )}
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="bg-primary text-primary-foreground active:scale-90 transition-transform flex items-center justify-center rounded-lg"
                    style={{ width: 40, height: 40 }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {item.trayMode && isConfirmed && (
            <TraySelector
              value={trayVal}
              onChange={(val) =>
                setTraySelections((prev) => ({ ...prev, [item.id]: val }))
              }
              onRemove={() => handleRemove(item.id)}
              onClose={() => setConfirmed((prev) => ({ ...prev, [item.id]: false }))}
            />
          )}
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    // build ordered list matching chip order (section select order → remaining)
    const orderedSections = [
      ...sectionSelectOrder.map((sid) => MENU_SECTIONS.find((s) => s.id === sid)!),
      ...MENU_SECTIONS.filter((s) => !sectionSelectOrder.includes(s.id)),
    ];
    const orderedItems = orderedSections.flatMap((s) =>
      s.items.filter((item) =>
        item.trayMode ? !!traySelections[item.id] : !!quantities[item.id]
      )
    );

    return (
      <div
        dir="rtl"
        className="min-h-screen bg-background flex flex-col"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5"
          style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 14 }}
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-foreground">خلاصه سفارش</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{toPersian(orderedItems.length)} آیتم انتخاب شده</p>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-md mx-auto w-full px-4 py-5 flex-1">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Table header */}
            <div
              className="flex items-center border-b border-border px-4 py-2.5"
              style={{ background: "rgba(232,148,58,0.06)" }}
            >
              <span className="flex-1 text-xs font-bold text-muted-foreground">آیتم</span>
              <span className="text-xs font-bold text-muted-foreground">مقدار</span>
            </div>

            {/* Rows */}
            {orderedItems.map((item, idx) => {
              const label = item.trayMode
                ? traySelections[item.id]
                : toPersian(quantities[item.id]);
              return (
                <div
                  key={item.id}
                  className="flex items-center px-4 py-3 border-b border-border last:border-b-0"
                  style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}
                >
                  <span className="flex-1 text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm font-bold text-primary">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="px-4 pb-6"
          style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto">
            <button
              onClick={handleReset}
              className="w-full bg-primary text-primary-foreground rounded-2xl font-bold text-base active:scale-95 transition-transform flex items-center justify-center gap-2"
              style={{ height: 52 }}
            >
              سفارش جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5"
        style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">منوی سفارش</h1>
            <p className="text-sm text-muted-foreground mt-0.5">آیتم مورد نظر را انتخاب کنید</p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              style={{ right: 14 }}
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو…"
              className="w-full bg-secondary text-foreground text-sm rounded-xl outline-none placeholder:text-muted-foreground border border-transparent focus:border-primary/40 transition-colors"
              style={{ height: 44, paddingRight: 40, paddingLeft: searchQuery ? 40 : 14, caretColor: "#e8943a" }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                className="absolute top-1/2 -translate-y-1/2 text-muted-foreground active:scale-90 transition-transform"
                style={{ left: 12 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div
        className="max-w-md mx-auto px-4 pt-5"
        style={{ paddingBottom: 180 }}
      >
        {/* Search mode */}
        {searchQuery !== "" && (
          <div className="space-y-3">
            {filteredMenu.length === 0 && (
              <p className="text-center text-muted-foreground text-sm pt-10">آیتمی یافت نشد</p>
            )}
            {filteredMenu.map((item) => renderItem(item))}
            <button
              onClick={() => setSearchQuery("")}
              className="w-full text-sm text-primary active:opacity-50 transition-opacity py-2"
            >
              نمایش لیست کامل
            </button>
          </div>
        )}

        {/* Sections mode */}
        {searchQuery === "" && (
          <div className="space-y-1">
            {[
              ...sectionSelectOrder.map((sid) => MENU_SECTIONS.find((s) => s.id === sid)!),
              ...MENU_SECTIONS.filter((s) => !sectionSelectOrder.includes(s.id)),
            ].map((section, sectionIndex) => {
              const isOpen = !section.collapsible || isSectionOpen(section.id);
              const hasTitle = !!section.title && section.collapsible;
              const prevSection = sectionIndex > 0 ? MENU_SECTIONS[sectionIndex - 1] : null;
              const prevIsOpen = prevSection ? (!prevSection.collapsible || isSectionOpen(prevSection.id)) : false;
              
              // Check if any item from this section is confirmed
              const hasSelectedItems = section.items.some((item) => 
                item.trayMode ? !!traySelections[item.id] : !!quantities[item.id]
              );

              return (
                <motion.div 
                  key={section.id}
                  animate={{
                    marginTop: sectionIndex > 0 && hasTitle 
                      ? (isOpen || prevIsOpen) ? 24 : 12 
                      : 0
                  }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  {sectionIndex > 0 && !hasTitle && !(prevSection?.title && prevSection?.collapsible) && (
                    <div className="border-t border-border opacity-20 my-2" />
                  )}

                  {hasTitle && (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-2.5 w-full rounded-2xl active:opacity-70 transition-opacity relative"
                      style={{
                        paddingInline: 14,
                        paddingBlock: 11,
                        background: isOpen
                          ? "rgba(232,148,58,0.07)"
                          : hasSelectedItems
                          ? "rgba(232,148,58,0.05)"
                          : "rgba(255,255,255,0.03)",
                        border: "1px solid",
                        borderColor: hasSelectedItems
                          ? "rgba(232,148,58,0.45)"
                          : isOpen
                          ? "rgba(232,148,58,0.2)"
                          : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-base" style={section.iconStyle}>{section.icon}</span>
                      <span className="flex-1 text-right text-sm font-bold text-foreground">
                        {section.title}
                      </span>
                      {hasSelectedItems && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2, ease: "backOut" }}
                          className="rounded-full bg-primary"
                          style={{ width: 8, height: 8 }}
                        />
                      )}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <ChevronDown
                          size={15}
                          className="text-muted-foreground flex-shrink-0"
                        />
                      </motion.div>
                    </button>
                  )}

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{
                      height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                      opacity: { duration: 0.2 }
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div 
                      className="rounded-2xl border"
                      style={{ 
                        marginTop: 8,
                        marginInline: 4,
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="space-y-2.5" style={{ padding: 12 }}>
                        {section.items.map((item) => renderItem(item))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border px-4 pt-3"
        style={{
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-md mx-auto space-y-3">
          {/* Chips */}
          {hasOrder && (
            <div>
              <div
                className="flex flex-wrap gap-1.5 overflow-y-auto"
                style={{
                  maxHeight: "96px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(232,148,58,0.3) transparent",
                }}
              >
                {MENU.filter((item) => confirmed[item.id]).map((item) => {
                  const chipLabel = item.trayMode
                    ? traySelections[item.id] || null
                    : quantities[item.id]
                    ? `×${toPersian(quantities[item.id])}`
                    : null;
                  if (!chipLabel) return null;
                  return (
                    <div
                      key={item.id}
                      onClick={() => scrollToItem(item.id)}
                      className="flex items-center gap-1 bg-secondary border border-border rounded-full cursor-pointer active:scale-95 transition-transform"
                      style={{ paddingInline: 9, paddingBlock: 5 }}
                    >
                      <span className="text-xs font-semibold text-foreground">{item.name}</span>
                      <span className="text-xs text-primary font-bold">{chipLabel}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.id);
                        }}
                        className="text-muted-foreground active:text-destructive transition-colors active:scale-90 flex items-center justify-center"
                        style={{ width: 22, height: 22 }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
              {confirmedCount > 3 && (
                <button
                  onClick={() => setClearConfirm(true)}
                  className="mt-1.5 text-xs text-destructive active:opacity-60 transition-opacity"
                >
                  حذف همه موارد
                </button>
              )}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleOrder}
            disabled={!hasOrder}
            className="w-full bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed active:enabled:scale-95"
            style={{ height: 52 }}
          >
            ادامه
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      {/* Clear-all confirmation popup */}
      {clearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setClearConfirm(false)}
        >
          <div
            dir="rtl"
            className="bg-card border border-border rounded-3xl w-full max-w-md mx-4 mb-8 p-6 space-y-4"
            style={{ fontFamily: "'Vazirmatn', sans-serif", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-foreground">حذف همه موارد</p>
              <p className="text-sm text-muted-foreground">از حذف همه آیتم‌های انتخابی مطمئنی؟</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setClearConfirm(false)}
                className="flex-1 bg-secondary text-foreground rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
                style={{ height: 48 }}
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setQuantities({});
                  setConfirmed({});
                  setEditing({});
                  setTraySelections({});
                  setClearConfirm(false);
                }}
                className="flex-1 bg-destructive text-destructive-foreground rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
                style={{ height: 48 }}
              >
                حذف همه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
