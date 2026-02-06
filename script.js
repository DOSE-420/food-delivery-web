// ==================== UTILITY FUNCTIONS ====================
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ==================== MOBILE NAVIGATION ====================
class MobileNav {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.mobileNav = document.getElementById('mobileNav');
    this.init();
  }

  init() {
    this.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', (e) => {
      if (!this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.mobileNav.classList.toggle('open');
  }

  close() {
    this.mobileNav.classList.remove('open');
  }
}

// ==================== SEARCH FUNCTIONALITY ====================
class SearchManager {
  constructor() {
    this.searchBtn = document.getElementById('searchBtn');
    this.searchWrap = document.getElementById('searchWrap');
    this.searchInput = document.getElementById('searchInput');
    this.noResultsEl = document.getElementById('noRestaurantResults');
    this.init();
  }

  init() {
    this.searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSearch();
    });

    document.addEventListener('click', (e) => {
      if (!this.searchWrap.contains(e.target) && !this.searchBtn.contains(e.target)) {
        this.closeSearch();
      }
    });

    this.searchInput.addEventListener('input', debounce((e) => {
      this.performSearch(e.target.value);
    }, 300));
  }

  toggleSearch() {
    this.searchWrap.classList.toggle('active');
    if (this.searchWrap.classList.contains('active')) {
      this.searchInput.focus();
    }
  }

  closeSearch() {
    this.searchWrap.classList.remove('active');
  }

  performSearch(query) {
    query = query.toLowerCase();
    const restaurants = document.querySelectorAll('.restaurant-card');
    let found = false;

    restaurants.forEach(card => {
      const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
      const cuisines = card.dataset.cuisine.toLowerCase();

      if (name.includes(query) || cuisines.includes(query)) {
        card.classList.remove('search-hidden');
        found = true;
      } else {
        card.classList.add('search-hidden');
      }
    });

    this.noResultsEl.style.display = found || query === '' ? 'none' : 'block';
  }
}

// ==================== FILTER SYSTEM ====================
class FilterManager {
  constructor() {
    this.filterChips = document.querySelectorAll('.filter-chip');
    this.sortSelect = document.getElementById('sortSelect');
    this.init();
  }

  init() {
    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => this.handleFilter(chip));
    });

    this.sortSelect.addEventListener('change', () => this.handleSort());
  }

  handleFilter(activeChip) {
    this.filterChips.forEach(c => c.classList.remove('active'));
    activeChip.classList.add('active');

    const filter = activeChip.dataset.filter;
    const restaurants = document.querySelectorAll('.restaurant-card');

    restaurants.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('search-hidden');
      } else {
        const cuisines = card.dataset.cuisine.toLowerCase();
        if (cuisines.includes(filter)) {
          card.classList.remove('search-hidden');
        } else {
          card.classList.add('search-hidden');
        }
      }
    });

    this.updateNoResults();
  }

  handleSort() {
    const sortBy = this.sortSelect.value;
    const container = document.querySelector('.restaurants');
    const cards = Array.from(container.children);

    cards.sort((a, b) => {
      switch(sortBy) {
        case 'rating':
          return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        case 'price-low':
          return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        case 'price-high':
          return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        case 'distance':
          return (parseFloat(a.dataset.distance) || 0) - (parseFloat(b.dataset.distance) || 0);
        default:
          return 0;
      }
    });

    cards.forEach(card => container.appendChild(card));
  }

  updateNoResults() {
    const visibleCards = document.querySelectorAll('.restaurant-card:not(.search-hidden)');
    const noResultsEl = document.getElementById('noRestaurantResults');
    noResultsEl.style.display = visibleCards.length === 0 ? 'block' : 'none';
  }
}

// ==================== FAVORITES SYSTEM ====================
class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites();
    this.init();
  }

  loadFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  init() {
    // Apply saved favorites on load
    document.querySelectorAll('.restaurant-card').forEach(card => {
      const name = card.querySelector('.restaurant-name').textContent;
      if (this.favorites.includes(name)) {
        const btn = card.querySelector('.favorite-btn');
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('far', 'fas');
      }
    });
  }

  toggle(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    const card = btn.closest('.restaurant-card');
    const name = card.querySelector('.restaurant-name').textContent;

    if (btn.classList.contains('active')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      if (!this.favorites.includes(name)) {
        this.favorites.push(name);
      }
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      this.favorites = this.favorites.filter(f => f !== name);
    }

    this.saveFavorites();
  }
}

// ==================== CART MANAGER ====================
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || {};
    this.cartRestaurant = localStorage.getItem('cartRestaurant') || null;
    this.cartBtn = document.getElementById('cartBtn');
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartItems = document.getElementById('cartItems');
    this.cartCount = document.getElementById('cartCount');
    this.cartTotal = document.getElementById('cartTotal');
    this.cartRestaurantName = document.getElementById('cartRestaurantName');
    this.clearBtn = document.getElementById('clearCartBtn');
    this.init();
  }

  init() {
    this.cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDrawer();
    });

    document.addEventListener('click', (e) => {
      if (!this.cartDrawer.contains(e.target) && !this.cartBtn.contains(e.target)) {
        this.closeDrawer();
      }
    });

    this.clearBtn.addEventListener('click', () => this.clearCart());

    this.updateUI();
  }

  toggleDrawer() {
    this.cartDrawer.classList.toggle('open');
  }

  closeDrawer() {
    this.cartDrawer.classList.remove('open');
  }

  addItem(name, price, quantity = 1) {
    if (!this.cart[name]) {
      this.cart[name] = { price, qty: 0 };
    }
    this.cart[name].qty += quantity;
    this.updateUI();
  }

  removeItem(name) {
    delete this.cart[name];
    this.updateUI();
  }

  clearCart() {
    this.cart = {};
    this.cartRestaurant = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
    this.updateUI();
  }

  updateUI() {
    this.cartItems.innerHTML = '';
    let total = 0;
    let totalQty = 0;

    for (let key in this.cart) {
      if (this.cart[key].qty > 0) {
        const li = document.createElement('li');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('cart-item-name');
        nameSpan.textContent = `${key} x ${this.cart[key].qty} = NPR ${this.cart[key].qty * this.cart[key].price}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('cart-item-delete');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => this.removeItem(key));

        li.appendChild(nameSpan);
        li.appendChild(deleteBtn);
        this.cartItems.appendChild(li);

        total += this.cart[key].qty * this.cart[key].price;
        totalQty += this.cart[key].qty;
      }
    }

    if (totalQty === 0) {
      this.cartItems.innerHTML = '<li style="text-align:center;color:var(--text-medium);">Your cart is empty</li>';
      this.cartRestaurant = null;
      localStorage.removeItem('cartRestaurant');
    }

    this.cartCount.textContent = totalQty;
    this.cartTotal.textContent = `Total: NPR ${total}`;
    this.cartRestaurantName.textContent = this.cartRestaurant
      ? "Restaurant: " + this.cartRestaurant.replace(/-/g, ' ').toUpperCase()
      : "";

    localStorage.setItem('cart', JSON.stringify(this.cart));
    if (this.cartRestaurant) {
      localStorage.setItem('cartRestaurant', this.cartRestaurant);
    }
  }

  getTotal() {
    let total = 0;
    for (let key in this.cart) {
      total += this.cart[key].qty * this.cart[key].price;
    }
    return total;
  }

  getTotalItems() {
    let count = 0;
    for (let key in this.cart) {
      count += this.cart[key].qty;
    }
    return count;
  }
}

// ==================== LOCATION & DISTANCE ====================
class LocationManager {
  constructor() {
    this.userLat = null;
    this.userLon = null;
  }

  init() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handlePosition(pos),
        () => console.warn("Location access denied")
      );
    }
  }

  handlePosition(position) {
    this.userLat = position.coords.latitude;
    this.userLon = position.coords.longitude;
    this.updateDistances();
  }

  distance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  formatDistance(meters) {
    return meters < 1000 
      ? Math.round(meters) + " m" 
      : (meters / 1000).toFixed(1) + " km";
  }

  calculateDeliveryTime(meters) {
    const baseTime = 15; // base minutes
    const perKm = 5; // minutes per km
    const km = meters / 1000;
    const min = Math.round(baseTime + km * perKm);
    return `${min}–${min + 6} mins`;
  }

  updateDistances() {
    const container = document.querySelector('.restaurants');
    const cards = Array.from(container.children);

    cards.forEach(card => {
      const d = this.distance(
        this.userLat,
        this.userLon,
        parseFloat(card.dataset.lat),
        parseFloat(card.dataset.lon)
      );
      card.dataset.distance = d;

      const distanceSpan = card.querySelector('.distance');
      if (distanceSpan) {
        distanceSpan.textContent = this.formatDistance(d);
      }

      const timeSpan = card.querySelector('.delivery-time');
      if (timeSpan) {
        timeSpan.textContent = this.calculateDeliveryTime(d);
      }
    });

    // Sort by distance initially
    cards.sort((a, b) => a.dataset.distance - b.dataset.distance);
    cards.forEach(c => container.appendChild(c));
  }
}

// ==================== GLOBAL TOGGLE FAVORITE ====================
// This function is called from onclick in HTML
function toggleFavorite(btn) {
  favoritesManager.toggle(btn);
}

// ==================== INITIALIZE ALL MODULES ====================
let mobileNav, searchManager, filterManager, favoritesManager, cartManager, locationManager;

document.addEventListener('DOMContentLoaded', () => {
  mobileNav = new MobileNav();
  searchManager = new SearchManager();
  filterManager = new FilterManager();
  favoritesManager = new FavoritesManager();
  cartManager = new CartManager();
  locationManager = new LocationManager();
  locationManager.init();
});
