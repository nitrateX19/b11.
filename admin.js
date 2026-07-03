/* B11 Market — Yönetim Paneli
   NOT: Bu şifre kontrolü tarayıcı tarafında (client-side) çalışır.
   Statik bir GitHub Pages sitesi için pratik bir çözümdür fakat
   gerçek/kritik bir sistemde kullanılacaksa sunucu taraflı
   kimlik doğrulama ile değiştirilmelidir. */
const B11_ADMIN_PASSWORD = "B11-Sorgun-2026!";
const B11_SESSION_KEY = "b11_admin_session";

const loginScreen = document.getElementById("loginScreen");
const panelScreen = document.getElementById("panelScreen");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const adminGrid = document.getElementById("adminGrid");

function showToast(message) {
  let toast = document.querySelector(".save-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "save-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderAdminGrid() {
  const categories = b11GetCategories();
  adminGrid.innerHTML = categories.map(cat => `
    <div class="admin-card" data-id="${cat.id}">
      <div class="admin-card-image">
        <img src="${cat.image}" alt="${cat.name}">
      </div>
      <div class="admin-card-body">
        <h3>${cat.name}</h3>
        <span class="count-label">${cat.count} Ürün</span>
        <label class="file-label">
          Görsel değiştir
          <input type="file" accept="image/*" class="image-input" data-id="${cat.id}">
        </label>
        <button type="button" class="reset-btn" data-id="${cat.id}">Varsayılana döndür</button>
      </div>
    </div>
  `).join("");

  adminGrid.querySelectorAll(".image-input").forEach(input => {
    input.addEventListener("change", handleImageChange);
  });
  adminGrid.querySelectorAll(".reset-btn").forEach(btn => {
    btn.addEventListener("click", handleReset);
  });
}

function handleImageChange(e) {
  const file = e.target.files[0];
  const categoryId = e.target.dataset.id;
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Lütfen bir görsel dosyası seç.");
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    showToast("Görsel 3MB'dan küçük olmalı.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    b11SetCategoryImage(categoryId, reader.result);
    renderAdminGrid();
    showToast("Görsel güncellendi ✓");
  };
  reader.readAsDataURL(file);
}

function handleReset(e) {
  const categoryId = e.target.dataset.id;
  b11ResetCategoryImage(categoryId);
  renderAdminGrid();
  showToast("Varsayılan görsele dönüldü");
}

function enterPanel() {
  loginScreen.hidden = true;
  panelScreen.hidden = false;
  renderAdminGrid();
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (passwordInput.value === B11_ADMIN_PASSWORD) {
    sessionStorage.setItem(B11_SESSION_KEY, "1");
    loginError.hidden = true;
    enterPanel();
  } else {
    loginError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(B11_SESSION_KEY);
  panelScreen.hidden = true;
  loginScreen.hidden = false;
  passwordInput.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(B11_SESSION_KEY) === "1") {
    enterPanel();
  }
});
