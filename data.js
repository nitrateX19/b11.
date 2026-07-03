/* B11 Market — varsayılan kategori verisi
   Görseller dış bir servise bağımlı olmasın diye tamamen yerel
   (inline SVG) olarak üretiliyor — internet olmadan da, GitHub Pages'te
   de, dosyayı doğrudan açtığında da her zaman görünür.
   Admin panelinden yapılan resim değişiklikleri localStorage'da
   "b11_categories" anahtarı altında saklanır ve bu varsayılanların
   üzerine yazılır. */

const B11_DEFAULT_CATEGORIES = [
  { id: "icecekler",               name: "İçecekler",                 count: 3, color: "#2E6E8E", icon: "cup" },
  { id: "alkollu-icecekler",       name: "Alkollü İçecekler",         count: 2, color: "#7A3B2E", icon: "bottle" },
  { id: "atistirmalik-cips",       name: "Atıştırmalık & Cips",       count: 2, color: "#B6821F", icon: "chip" },
  { id: "sekerleme-cikolata",      name: "Şekerleme & Çikolata",      count: 2, color: "#8A3E5C", icon: "candy" },
  { id: "temel-gida",              name: "Temel Gıda",                count: 2, color: "#4B6E3A", icon: "grain" },
  { id: "kahvaltilik",             name: "Süt & Kahvaltılık",         count: 2, color: "#3C5E7A", icon: "milk" },
  { id: "meyve-sebze",             name: "Meyve & Sebze",             count: 2, color: "#4E7A3E", icon: "leaf" },
  { id: "kisisel-bakim-temizlik",  name: "Kişisel Bakım & Temizlik",  count: 2, color: "#3E6E6A", icon: "bottle" }
];

const B11_STORAGE_KEY = "b11_categories";

/** Basit ikon yolları (stroke tabanlı, tek renk). */
const B11_ICON_PATHS = {
  cup:    "M9 21h6M8 9h8l-1 8a2 2 0 0 1-2 1.8h-2A2 2 0 0 1 9 17L8 9zM7 9h10l-1-4H8L7 9z",
  bottle: "M14 3h-4v3.5L8 9v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-2-2.5V3zM9 12h6",
  chip:   "M5 8l7-4 7 4v8l-7 4-7-4V8zM5 8l7 4 7-4M12 12v8",
  candy:  "M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zM4 8l5 2M20 8l-5 2M4 16l5-2M20 16l-5-2",
  grain:  "M12 3c2 3 2 6 0 9-2-3-2-6 0-9zM12 12v9M8 21h8",
  milk:   "M9 2h6v3l2 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-3V2zM7.5 12h9",
  leaf:   "M5 20c8 0 14-6 14-14V4h-2C9 4 5 10 5 18v2z"
};

/** Bir kategori için içeride üretilen SVG data URI görseli döndürür. */
function b11PlaceholderImage(cat) {
  const path = B11_ICON_PATHS[cat.icon] || B11_ICON_PATHS.leaf;
  const c1 = cat.color;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="700" height="520" viewBox="0 0 700 520">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="#12141c"/>
        </linearGradient>
      </defs>
      <rect width="700" height="520" fill="url(#g)"/>
      <g opacity="0.16">
        ${Array.from({ length: 5 }).map((_, i) =>
          `<rect x="${-100 + i * 180}" y="0" width="70" height="700" fill="#ffffff" transform="rotate(18 350 260)"/>`
        ).join("")}
      </g>
      <g transform="translate(350,225)" stroke="#F4F3EF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.92">
        <g transform="translate(-60,-60) scale(5)">
          <path d="${path}"/>
        </g>
      </g>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\s+/g, " "));
}

/** localStorage'daki güncellemeleri varsayılanların üzerine uygulayıp
 *  güncel kategori listesini döndürür. */
function b11GetCategories() {
  const defaults = B11_DEFAULT_CATEGORIES;
  let overrides = {};
  try {
    const raw = localStorage.getItem(B11_STORAGE_KEY);
    if (raw) overrides = JSON.parse(raw);
  } catch (e) {
    overrides = {};
  }
  return defaults.map((cat) => ({
    ...cat,
    image: overrides[cat.id]?.image || b11PlaceholderImage(cat)
  }));
}

/** Tek bir kategorinin resmini günceller (base64 dataURL bekler). */
function b11SetCategoryImage(categoryId, dataUrl) {
  let overrides = {};
  try {
    const raw = localStorage.getItem(B11_STORAGE_KEY);
    if (raw) overrides = JSON.parse(raw);
  } catch (e) {
    overrides = {};
  }
  overrides[categoryId] = { ...(overrides[categoryId] || {}), image: dataUrl };
  localStorage.setItem(B11_STORAGE_KEY, JSON.stringify(overrides));
}

/** Bir kategoriyi varsayılan (yerel üretilen) resmine döndürür. */
function b11ResetCategoryImage(categoryId) {
  let overrides = {};
  try {
    const raw = localStorage.getItem(B11_STORAGE_KEY);
    if (raw) overrides = JSON.parse(raw);
  } catch (e) {
    overrides = {};
  }
  delete overrides[categoryId];
  localStorage.setItem(B11_STORAGE_KEY, JSON.stringify(overrides));
}
