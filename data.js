/* B11 Market — varsayılan kategori verisi
   Admin panelinden yapılan resim değişiklikleri localStorage'da
   "b11_categories" anahtarı altında saklanır ve bu varsayılanların üzerine yazılır. */

const B11_DEFAULT_CATEGORIES = [
  {
    id: "icecekler",
    name: "İçecekler",
    count: 3,
    image: "https://picsum.photos/seed/b11-icecekler/700/500"
  },
  {
    id: "alkollu-icecekler",
    name: "Alkollü İçecekler",
    count: 2,
    image: "https://picsum.photos/seed/b11-alkollu/700/500"
  },
  {
    id: "atistirmalik-cips",
    name: "Atıştırmalık & Cips",
    count: 2,
    image: "https://picsum.photos/seed/b11-atistirmalik/700/500"
  },
  {
    id: "sekerleme-cikolata",
    name: "Şekerleme & Çikolata",
    count: 2,
    image: "https://picsum.photos/seed/b11-sekerleme/700/500"
  },
  {
    id: "temel-gida",
    name: "Temel Gıda",
    count: 2,
    image: "https://picsum.photos/seed/b11-temel-gida/700/500"
  },
  {
    id: "kahvaltilik",
    name: "Süt & Kahvaltılık",
    count: 2,
    image: "https://picsum.photos/seed/b11-kahvaltilik/700/500"
  },
  {
    id: "meyve-sebze",
    name: "Meyve & Sebze",
    count: 2,
    image: "https://picsum.photos/seed/b11-meyve-sebze/700/500"
  },
  {
    id: "kisisel-bakim-temizlik",
    name: "Kişisel Bakım & Temizlik",
    count: 2,
    image: "https://picsum.photos/seed/b11-temizlik/700/500"
  }
];

const B11_STORAGE_KEY = "b11_categories";

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
    image: overrides[cat.id]?.image || cat.image
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

/** Bir kategoriyi varsayılan resmine döndürür. */
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
