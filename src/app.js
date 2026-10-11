// База даних товарів
const products = [
  { id: 1, name: "Бездротові навушники", price: 2999, category: "audio" },
  { id: 2, name: "Механічна клавіатура", price: 4200, category: "peripherals" },
  { id: 3, name: "Ігрова миша", price: 1800, category: "peripherals" },
  { id: 4, name: "4K Монітор", price: 12500, category: "monitors" },
  { id: 5, name: "Студійний мікрофон", price: 3500, category: "audio" }
];

// Стан кошика з підтримкою LocalStorage
let cart = JSON.parse(localStorage.getItem("techstore_cart")) || [];

// Елементи DOM
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const cartItemsContainer = document.getElementById("cart-items");
const totalSumEl = document.getElementById("total-sum");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

// Збереження стан у LocalStorage
function saveCart() {
  localStorage.setItem("techstore_cart", JSON.stringify(cart));
  updateCartUI();
}

// Оновлення інтерфейсу кошика
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCountEl.innerText = totalCount;
  totalSumEl.innerText = totalPrice;

  cartItemsContainer.innerHTML = cart.length === 0 
    ? "<p>Кошик порожній</p>" 
    : cart.map(item => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.price} грн × ${item.quantity}</small>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Видалити</button>
        </div>
      `).join("");
}

// Рендеринг товарів з урахуванням фільтрів
function renderProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filtered.length === 0
    ? "<p>Товарів не знайдено</p>"
    : filtered.map(product => `
        <div class="product-card">
          <h3>${product.name}</h3>
          <p>Ціна: <strong>${product.price} грн</strong></p>
          <button onclick="addToCart(${product.id})">Додати в кошик</button>
        </div>
      `).join("");
}

// Функції роботи з кошиком (глобальні для onclick)
window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
};

window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
};

// Події модального вікна
cartBtn.addEventListener("click", () => cartModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => cartModal.classList.add("hidden"));

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Кошик порожній!");
  alert("Дякуємо за замовлення!");
  cart = [];
  saveCart();
  cartModal.classList.add("hidden");
});

// Слухачі фільтрації
searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);

// Ініціалізація
renderProducts();
updateCartUI();