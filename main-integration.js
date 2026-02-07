// ==================== MAIN INTEGRATION SCRIPT ====================
// Combines authentication, user management, ratings, and restaurant functionality

// ==================== RESTAURANT DATA ====================
const restaurants = [
  {
    id: 'walnut-bistro',
    name: 'Walnut Bistro',
    cuisine: 'western,fusion',
    rating: 4.5,
    reviews: 1200,
    price: 800,
    lat: 27.7150,
    lon: 85.3200,
    location: 'Thamel, Kathmandu',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    offer: '50% OFF',
    cuisineTags: ['Western', 'Fusion']
  },
  {
    id: 'kathmandu-grill',
    name: 'Kathmandu Grill',
    cuisine: 'fast-food',
    rating: 4.2,
    reviews: 850,
    price: 500,
    lat: 27.6850,
    lon: 85.3160,
    location: 'Jhamsikhel, Lalitpur',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    offer: 'Free Delivery',
    cuisineTags: ['Grilled', 'Fast Food']
  },
  {
    id: 'everest-pizza',
    name: 'Everest Pizza',
    cuisine: 'italian',
    rating: 4.7,
    reviews: 2100,
    price: 1000,
    lat: 27.7000,
    lon: 85.3080,
    location: 'Durbar Marg, Kathmandu',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    offer: '30% OFF',
    cuisineTags: ['Italian', 'Pizza']
  },
  {
    id: 'himalayan-wok',
    name: 'Himalayan Wok',
    cuisine: 'asian',
    rating: 4.4,
    reviews: 950,
    price: 700,
    lat: 27.6920,
    lon: 85.3190,
    location: 'Lazimpat, Kathmandu',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    offer: '20% OFF',
    cuisineTags: ['Asian', 'Chinese']
  },
  {
    id: 'sweet-escape',
    name: 'Sweet Escape',
    cuisine: 'desserts',
    rating: 4.6,
    reviews: 1500,
    price: 400,
    lat: 27.6980,
    lon: 85.3220,
    location: 'Pulchowk, Lalitpur',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    offer: 'Buy 1 Get 1',
    cuisineTags: ['Desserts', 'Bakery']
  },
  {
    id: 'green-bowl',
    name: 'Green Bowl',
    cuisine: 'healthy',
    rating: 4.3,
    reviews: 680,
    price: 900,
    lat: 27.7050,
    lon: 85.3170,
    location: 'Sanepa, Lalitpur',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    offer: 'Healthy Choice',
    cuisineTags: ['Healthy', 'Salads']
  }
];

// ==================== RATING SYSTEM ====================
class RatingManager {
  constructor() {
    this.ratingModal = document.getElementById('ratingModal');
    this.ratingModalClose = document.getElementById('ratingModalClose');
    this.ratingStars = document.querySelectorAll('#ratingStars i');
    this.ratingText = document.getElementById('ratingText');
    this.ratingForm = document.getElementById('ratingForm');
    this.submitBtn = document.getElementById('submitRatingBtn');
    this.currentRating = 0;
    this.currentRestaurant = null;
    this.currentOrder = null;
    this.selectedTags = [];
    
    this.init();
  }

  init() {
    // Close modal
    this.ratingModalClose?.addEventListener('click', () => this.close());
    
    // Star rating
    this.ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => this.setRating(index + 1));
      star.addEventListener('mouseenter', () => this.hoverRating(index + 1));
    });
    
    document.getElementById('ratingStars')?.addEventListener('mouseleave', () => {
      this.hoverRating(this.currentRating);
    });
    
    // Tag selection
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTag(btn);
      });
    });
    
    // Form submission
    this.ratingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitRating();
    });
    
    // Check for pending ratings on load
    this.checkPendingRatings();
  }

  checkPendingRatings() {
    if (!authManager.isLoggedIn()) return;
    
    const pendingRatings = this.getPendingRatings();
    if (pendingRatings.length > 0) {
      // Show rating modal for the most recent delivered order
      const mostRecent = pendingRatings[0];
      setTimeout(() => {
        this.show(mostRecent.restaurantId, mostRecent.orderId);
      }, 2000);
    }
  }

  getPendingRatings() {
    const userId = authManager.currentUser?.email;
    if (!userId) return [];
    
    const orders = JSON.parse(localStorage.getItem('userOrders_' + userId) || '[]');
    const ratings = JSON.parse(localStorage.getItem('restaurantRatings') || '[]');
    
    // Find delivered orders that haven't been rated
    return orders.filter(order => {
      const isDelivered = order.status === 'delivered';
      const notRated = !ratings.find(r => r.orderId === order.id);
      return isDelivered && notRated;
    }).map(order => ({
      restaurantId: order.restaurant,
      orderId: order.id,
      deliveredAt: order.deliveredAt
    })).sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt));
  }

  show(restaurantId, orderId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    this.currentRestaurant = restaurant;
    this.currentOrder = orderId;
    this.currentRating = 0;
    this.selectedTags = [];
    
    // Update modal content
    document.getElementById('ratingRestaurantName').textContent = restaurant.name;
    document.getElementById('reviewComment').value = '';
    
    // Reset stars
    this.setRating(0);
    
    // Reset tags
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    this.submitBtn.disabled = true;
    
    // Show modal
    this.ratingModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.ratingModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  setRating(rating) {
    this.currentRating = rating;
    this.hoverRating(rating);
    this.submitBtn.disabled = rating === 0;
    
    const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    this.ratingText.textContent = ratingTexts[rating] || 'Tap to rate';
  }

  hoverRating(rating) {
    this.ratingStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas');
        star.style.color = '#FFC72C';
      } else {
        star.classList.remove('fas');
        star.classList.add('far');
        star.style.color = '#9C9C9C';
      }
    });
  }

  toggleTag(btn) {
    btn.classList.toggle('active');
    const tag = btn.dataset.tag;
    
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
  }

  submitRating() {
    if (!authManager.isLoggedIn()) {
      authManager.showGuestPrompt();
      return;
    }
    
    const comment = document.getElementById('reviewComment').value.trim();
    
    const rating = {
      id: 'R' + Date.now(),
      userId: authManager.currentUser.email,
      userName: authManager.currentUser.name,
      restaurantId: this.currentRestaurant.id,
      orderId: this.currentOrder,
      rating: this.currentRating,
      comment: comment,
      tags: this.selectedTags,
      timestamp: new Date().toISOString()
    };
    
    // Save rating
    const ratings = JSON.parse(localStorage.getItem('restaurantRatings') || '[]');
    ratings.push(rating);
    localStorage.setItem('restaurantRatings', JSON.stringify(ratings));
    
    // Update restaurant average rating
    this.updateRestaurantRating(this.currentRestaurant.id);
    
    // Show success message
    authManager.showSuccess('Thank you for your feedback!');
    
    // Close modal
    this.close();
    
    // Check for more pending ratings
    setTimeout(() => {
      this.checkPendingRatings();
    }, 1000);
  }

  updateRestaurantRating(restaurantId) {
    const ratings = JSON.parse(localStorage.getItem('restaurantRatings') || '[]');
    const restaurantRatings = ratings.filter(r => r.restaurantId === restaurantId);
    
    if (restaurantRatings.length > 0) {
      const avgRating = restaurantRatings.reduce((sum, r) => sum + r.rating, 0) / restaurantRatings.length;
      
      // Update in restaurant data
      const restaurant = restaurants.find(r => r.id === restaurantId);
      if (restaurant) {
        restaurant.rating = Math.round(avgRating * 10) / 10;
        restaurant.reviews = (restaurant.reviews || 0) + 1;
      }
      
      // Re-render restaurant cards
      renderRestaurants();
    }
  }

  getRestaurantRatings(restaurantId) {
    const ratings = JSON.parse(localStorage.getItem('restaurantRatings') || '[]');
    return ratings.filter(r => r.restaurantId === restaurantId);
  }
}

// ==================== RENDER RESTAURANTS ====================
function renderRestaurants() {
  const container = document.querySelector('.restaurants');
  if (!container) return;
  
  container.innerHTML = '';
  
  restaurants.forEach(restaurant => {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.dataset.lat = restaurant.lat;
    card.dataset.lon = restaurant.lon;
    card.dataset.cuisine = restaurant.cuisine;
    card.dataset.rating = restaurant.rating;
    card.dataset.price = restaurant.price;
    
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${restaurant.image}" alt="${restaurant.name}">
        <div class="card-badges">
          <span class="offer-badge">${restaurant.offer}</span>
          <button class="favorite-btn" onclick="toggleFavorite(this)">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="delivery-time-badge">
          <i class="fas fa-clock"></i>
          <span class="delivery-time">25 mins</span>
        </div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <div class="cuisine-tags">
            ${restaurant.cuisineTags.map(tag => `<span class="cuisine-tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="card-meta">
          <div class="rating">
            <i class="fas fa-star"></i>
            <span>${restaurant.rating}</span>
          </div>
          <span class="reviews">${restaurant.reviews.toLocaleString()} reviews</span>
        </div>
        <div class="location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${restaurant.location} • <span class="distance">2.3 km</span></span>
        </div>
        <a href="menu.html?restaurant=${restaurant.id}" class="menu-btn">View Menu</a>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // Apply favorites
  if (favoritesManager) {
    favoritesManager.init();
  }
  
  // Apply location data
  if (locationManager) {
    locationManager.init();
  }
}

// ==================== TOGGLE FAVORITE ====================
function toggleFavorite(btn) {
  if (favoritesManager) {
    favoritesManager.toggle(btn);
  }
}

// ==================== CHECKOUT INTEGRATION ====================
const originalCheckoutBtn = document.getElementById('checkoutBtn');
if (originalCheckoutBtn) {
  originalCheckoutBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    // Check if cart is empty
    if (Object.keys(cart).length === 0) {
      authManager.showError('main', 'Your cart is empty!');
      return;
    }
    
    // Check if user is logged in
    if (!authManager.isLoggedIn()) {
      authManager.showGuestPrompt();
      return;
    }
    
    // Proceed to checkout
    window.location.href = 'checkout.html';
  });
}

// ==================== INITIALIZE ON LOAD ====================
let ratingManager;

document.addEventListener('DOMContentLoaded', () => {
  // Render restaurants
  renderRestaurants();
  
  // Initialize rating manager
  ratingManager = new RatingManager();
  
  console.log('MeroEats Integration System Loaded');
});
