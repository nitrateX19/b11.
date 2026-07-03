document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("categoryGrid");
  const countLabel = document.getElementById("catCount");
  const categories = b11GetCategories();

  if (countLabel) countLabel.textContent = `${categories.length} kategori`;

  grid.innerHTML = categories.map(cat => `
    <article class="cat-card">
      <img src="${cat.image}" alt="${cat.name}" loading="lazy">
      <span class="cat-card-name">${cat.name}</span>
      <span class="cat-card-count">${cat.count} Ürün</span>
    </article>
  `).join("");
});
