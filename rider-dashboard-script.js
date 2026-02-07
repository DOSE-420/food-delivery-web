// ====================================================================================
// RIDER DASHBOARD - Order Management & Location Tracking
// ====================================================================================

class RiderDashboard {
  constructor() {
    this.riderId = this.loadRiderId();
    this.isOnline = false;
    this.currentDelivery = null;
    this.pendingRequests = [];
    this.completedToday = [];
    this.requestTimeout = null;
    this.currentRequestId = null;
    this.timerInterval = null;
    this.locationWatchId = null;
    this.currentLocation = null;
    this.deliveryMap = null;
    this.requestMap = null;
    
    this.init();
  }

  init() {
    // Initialize rider
    this.setupRiderProfile();
    
    // Online/Offline toggle
    document.getElementById('onlineToggle').addEventListener('change', (e) => {
      this.toggleOnlineStatus(e.target.checked);
    });
    
    // Load data
    this.loadDashboardData();
    this.renderDashboard();
    
    // Start location tracking
    this.startLocationTracking();
    
    // Auto-refresh every 5 seconds
    setInterval(() => {
      if (this.isOnline) {
        this.checkForNewRequests();
        this.updateDashboardStats();
      }
    }, 5000);
  }

  loadRiderId() {
    // In production, this would come from authentication
    let riderId = localStorage.getItem('riderId');
    if (!riderId) {
      riderId = 'R' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('riderId', riderId);
    }
    return riderId;
  }

  setupRiderProfile() {
    const riderData = {
      id: this.riderId,
      name: localStorage.getItem('riderName') || 'Raj Kumar',
      rating: 4.8,
      phone: '9841234567'
    };
    
    document.getElementById('riderName').textContent = riderData.name;
    document.getElementById('riderRating').textContent = riderData.rating;
    
    // Save to localStorage
    localStorage.setItem('riderData_' + this.riderId, JSON.stringify(riderData));
  }

  toggleOnlineStatus(isOnline) {
    this.isOnline = isOnline;
    const statusText = document.getElementById('statusText');
    
    if (isOnline) {
      statusText.textContent = 'Online';
      statusText.classList.add('online');
      this.startLocationTracking();
      this.checkForNewRequests();
    } else {
      statusText.textContent = 'Offline';
      statusText.classList.remove('online');
      this.stopLocationTracking();
    }
  }

  startLocationTracking() {
    if ('geolocation' in navigator) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          
          // Update location in localStorage for admin tracking
          localStorage.setItem('riderLocation_' + this.riderId, JSON.stringify(this.currentLocation));
          
          // Update current delivery if active
          if (this.currentDelivery) {
            this.updateDeliveryLocation();
          }
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }
  }

  stopLocationTracking() {
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
  }

  loadDashboardData() {
    const today = new Date().toDateString();
    const deliveries = JSON.parse(localStorage.getItem('riderDeliveries_' + this.riderId) || '[]');
    
    this.completedToday = deliveries.filter(d => 
      new Date(d.deliveredAt).toDateString() === today && d.status === 'delivered'
    );
    
    this.currentDelivery = deliveries.find(d => 
      d.riderId === this.riderId && ['confirmed', 'preparing', 'out_for_delivery'].includes(d.status)
    );
  }

  renderDashboard() {
    this.updateDashboardStats();
    this.renderPendingRequests();
    this.renderCompletedDeliveries();
    
    if (this.currentDelivery) {
      this.showCurrentDelivery();
    }
  }

  updateDashboardStats() {
    document.getElementById('todayDeliveries').textContent = this.completedToday.length;
    document.getElementById('pendingOrders').textContent = this.pendingRequests.length;
    
    const todayEarnings = this.completedToday.reduce((sum, d) => sum + (d.deliveryFee || 50), 0);
    document.getElementById('todayEarnings').textContent = `NPR ${todayEarnings}`;
    
    const totalDistance = this.completedToday.reduce((sum, d) => sum + (d.distance || 0), 0);
    document.getElementById('totalDistance').textContent = `${totalDistance.toFixed(1)} km`;
  }

  checkForNewRequests() {
    const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // Find unassigned orders
    const unassigned = allOrders.filter(order => 
      !order.rider && order.status === 'confirmed'
    );
    
    // Check for new requests not already shown
    unassigned.forEach(order => {
      if (!this.pendingRequests.find(r => r.id === order.id)) {
        this.pendingRequests.push(order);
        this.showNewRequestModal(order);
      }
    });
    
    this.renderPendingRequests();
  }

  showNewRequestModal(order) {
    this.currentRequestId = order.id;
    
    // Populate modal
    document.getElementById('requestOrderId').textContent = order.id;
    document.getElementById('requestRestaurant').textContent = this.getRestaurantName(order.restaurant);
    document.getElementById('requestAddress').textContent = `${order.delivery.address}, ${order.delivery.area}`;
    document.getElementById('requestDistance').textContent = `${this.calculateDistance(order)} km`;
    document.getElementById('requestFee').textContent = `NPR ${order.payment.deliveryFee || 50}`;
    
    // Initialize map
    setTimeout(() => {
      this.initRequestMap(order);
    }, 300);
    
    // Start timer
    this.startRequestTimer(30);
    
    // Show modal
    document.getElementById('requestModal').classList.add('show');
    
    // Play notification sound
    this.playNotificationSound();
  }

  startRequestTimer(seconds) {
    let remaining = seconds;
    const timerText = document.getElementById('timerText');
    const timerProgress = document.getElementById('timerProgress');
    const circumference = 2 * Math.PI * 54; // 54 is the radius
    
    timerText.textContent = remaining;
    
    this.timerInterval = setInterval(() => {
      remaining--;
      timerText.textContent = remaining;
      
      const offset = circumference - (remaining / seconds) * circumference;
      timerProgress.style.strokeDashoffset = offset;
      
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.autoDeclineRequest();
      }
    }, 1000);
  }

  initRequestMap(order) {
    const mapContainer = document.getElementById('requestMap');
    
    if (this.requestMap) {
      this.requestMap.remove();
    }
    
    const lat = order.delivery.location?.lat || 27.7172;
    const lng = order.delivery.location?.lng || 85.3240;
    
    this.requestMap = L.map('requestMap').setView([lat, lng], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.requestMap);
    
    L.marker([lat, lng]).addTo(this.requestMap)
      .bindPopup('Delivery Location');
  }

  calculateDistance(order) {
    // Simple distance calculation (in production, use actual routing)
    if (!this.currentLocation || !order.delivery.location) {
      return 2.5;
    }
    
    const R = 6371; // Earth radius in km
    const dLat = (order.delivery.location.lat - this.currentLocation.lat) * Math.PI / 180;
    const dLng = (order.delivery.location.lng - this.currentLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.currentLocation.lat * Math.PI / 180) * 
              Math.cos(order.delivery.location.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  }

  getRestaurantName(restaurantId) {
    const names = {
      'walnut-bistro': 'Walnut Bistro',
      'kathmandu-grill': 'Kathmandu Grill',
      'everest-pizza': 'Everest Pizza',
      'himalayan-wok': 'Himalayan Wok',
      'sweet-escape': 'Sweet Escape',
      'green-bowl': 'Green Bowl'
    };
    return names[restaurantId] || restaurantId;
  }

  renderPendingRequests() {
    const container = document.getElementById('requestsList');
    const emptyState = document.getElementById('emptyRequests');
    
    if (this.pendingRequests.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = this.pendingRequests.map(order => `
      <div class="request-card">
        <div class="request-header">
          <div class="request-id">${order.id}</div>
          <div class="request-fee">NPR ${order.payment.deliveryFee || 50}</div>
        </div>
        <div class="request-body">
          <div class="request-info">
            <i class="fas fa-utensils"></i>
            <span>${this.getRestaurantName(order.restaurant)}</span>
          </div>
          <div class="request-info">
            <i class="fas fa-map-marker-alt"></i>
            <span>${order.delivery.address}, ${order.delivery.area}</span>
          </div>
          <div class="request-info">
            <i class="fas fa-route"></i>
            <span>${this.calculateDistance(order)} km away</span>
          </div>
        </div>
        <div class="request-actions">
          <button class="btn-decline-quick" onclick="riderDashboard.quickDecline('${order.id}')">
            <i class="fas fa-times"></i> Decline
          </button>
          <button class="btn-accept-quick" onclick="riderDashboard.quickAccept('${order.id}')">
            <i class="fas fa-check"></i> Accept
          </button>
        </div>
      </div>
    `).join('');
  }

  renderCompletedDeliveries() {
    const container = document.getElementById('completedList');
    const emptyState = document.getElementById('emptyCompleted');
    
    if (this.completedToday.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = this.completedToday.map(order => `
      <div class="request-card">
        <div class="request-header">
          <div class="request-id">${order.id}</div>
          <div class="request-fee">+NPR ${order.deliveryFee || 50}</div>
        </div>
        <div class="request-body">
          <div class="request-info">
            <i class="fas fa-utensils"></i>
            <span>${this.getRestaurantName(order.restaurant)}</span>
          </div>
          <div class="request-info">
            <i class="fas fa-check-circle"></i>
            <span>Delivered at ${new Date(order.deliveredAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  quickAccept(orderId) {
    this.currentRequestId = orderId;
    this.acceptRequest();
  }

  quickDecline(orderId) {
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== orderId);
    this.renderPendingRequests();
  }

  playNotificationSound() {
    // Create audio context for notification
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  showCurrentDelivery() {
    document.getElementById('currentDeliverySection').style.display = 'block';
    // Implementation for current delivery card
  }

  updateDeliveryLocation() {
    // Update rider location in the order
    const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === this.currentDelivery.id);
    
    if (orderIndex !== -1) {
      if (!allOrders[orderIndex].rider) {
        allOrders[orderIndex].rider = {};
      }
      allOrders[orderIndex].rider.location = this.currentLocation;
      localStorage.setItem('adminOrders', JSON.stringify(allOrders));
    }
  }
}

// Global functions for button clicks
function acceptRequest() {
  if (!riderDashboard.currentRequestId) return;
  
  clearInterval(riderDashboard.timerInterval);
  
  const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
  const orderIndex = allOrders.findIndex(o => o.id === riderDashboard.currentRequestId);
  
  if (orderIndex !== -1) {
    const riderData = JSON.parse(localStorage.getItem('riderData_' + riderDashboard.riderId));
    
    allOrders[orderIndex].rider = {
      id: riderDashboard.riderId,
      name: riderData.name,
      phone: riderData.phone,
      rating: riderData.rating,
      location: riderDashboard.currentLocation
    };
    allOrders[orderIndex].status = 'preparing';
    allOrders[orderIndex].preparingAt = new Date().toISOString();
    
    localStorage.setItem('adminOrders', JSON.stringify(allOrders));
    
    riderDashboard.currentDelivery = allOrders[orderIndex];
    riderDashboard.pendingRequests = riderDashboard.pendingRequests.filter(r => r.id !== riderDashboard.currentRequestId);
    
    document.getElementById('requestModal').classList.remove('show');
    
    riderDashboard.renderDashboard();
    riderDashboard.showDeliveryModal();
  }
}

function declineRequest() {
  clearInterval(riderDashboard.timerInterval);
  riderDashboard.pendingRequests = riderDashboard.pendingRequests.filter(r => r.id !== riderDashboard.currentRequestId);
  document.getElementById('requestModal').classList.remove('show');
  riderDashboard.renderPendingRequests();
}

// Initialize
let riderDashboard;

document.addEventListener('DOMContentLoaded', () => {
  riderDashboard = new RiderDashboard();
});
