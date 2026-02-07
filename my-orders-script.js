// ==================================================================================== ==
// MY ORDERS PAGE - Order Tracking & Management
// ====================================================================================

class MyOrdersManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.orders = [];
    this.trackingMap = null;
    this.riderMarker = null;
    this.deliveryMarker = null;
    this.init();
  }

  init() {
    // Check if user is logged in
    if (!this.currentUser) {
      window.location.href = 'index.html';
      return;
    }

    // Load orders
    this.loadOrders();
    this.renderOrders();

    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Auto-refresh active orders every 10 seconds
    setInterval(() => {
      if (document.querySelector('.tab-btn.active').dataset.tab === 'active') {
        this.loadOrders();
        this.renderOrders();
      }
    }, 10000);
  }

  loadUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  loadOrders() {
    const userId = this.currentUser.email;
    const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // Filter orders for current user
    this.orders = allOrders.filter(order => 
      order.customer.email === userId
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  renderOrders() {
    const activeOrders = this.orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
    );
    const pastOrders = this.orders.filter(order => 
      ['delivered', 'cancelled'].includes(order.status)
    );

    // Update active count badge
    document.getElementById('activeCount').textContent = activeOrders.length;

    // Render active orders
    this.renderOrdersList('activeOrders', activeOrders, 'emptyActive');
    
    // Render past orders
    this.renderOrdersList('pastOrders', pastOrders, 'emptyPast');
  }

  renderOrdersList(containerId, orders, emptyId) {
    const container = document.getElementById(containerId);
    const emptyState = document.getElementById(emptyId);

    if (orders.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = orders.map(order => this.createOrderCard(order)).join('');

    // Add event listeners
    container.querySelectorAll('.btn-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        this.showTracking(orderId);
      });
    });

    container.querySelectorAll('.btn-reorder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        this.reorder(orderId);
      });
    });

    container.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('click', () => {
        const orderId = card.dataset.orderId;
        this.showTracking(orderId);
      });
    });
  }

  createOrderCard(order) {
    const statusClass = `status-${order.status}`;
    const statusLabel = this.getStatusLabel(order.status);
    const isActive = ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);

    return `
      <div class="order-card" data-order-id="${order.id}">
        <div class="order-header">
          <div class="order-id-section">
            <div class="order-id">${order.id}</div>
            <div class="order-date">${this.formatDate(order.timestamp)}</div>
          </div>
          <div class="order-status-badge ${statusClass}">${statusLabel}</div>
        </div>

        <div class="order-body">
          <div class="restaurant-name-section">
            <i class="fas fa-utensils"></i>
            <span>${this.getRestaurantName(order.restaurant)}</span>
          </div>

          <div class="order-items-list">
            ${order.items.slice(0, 3).map(item => `
              <div class="order-item-entry">
                <span class="item-name-qty">${item.name} x ${item.qty}</span>
                <span class="item-price">NPR ${item.price * item.qty}</span>
              </div>
            `).join('')}
            ${order.items.length > 3 ? `<div class="order-item-entry"><span class="item-name-qty">+${order.items.length - 3} more items</span></div>` : ''}
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">Total: NPR ${order.payment.total}</div>
          <div class="order-actions">
            ${isActive ? `
              <button class="btn-track" data-order-id="${order.id}">
                <i class="fas fa-map-marked-alt"></i> Track
              </button>
            ` : ''}
            ${order.status === 'delivered' ? `
              <button class="btn-reorder" data-order-id="${order.id}">
                <i class="fas fa-redo"></i> Reorder
              </button>
            ` : ''}
            <button class="btn-help" data-order-id="${order.id}">
              <i class="fas fa-question-circle"></i> Help
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getStatusLabel(status) {
    const labels = {
      'pending': 'Order Placed',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
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

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });
  }

  showTracking(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    // Populate tracking modal
    document.getElementById('trackingOrderId').textContent = order.id;
    document.getElementById('trackingRestaurant').textContent = this.getRestaurantName(order.restaurant);

    // Update timeline
    this.updateTimeline(order);

    // Show rider info if assigned
    if (order.rider) {
      this.showRiderInfo(order.rider);
    } else {
      document.getElementById('riderInfo').style.display = 'none';
    }

    // Render order items
    document.getElementById('trackingOrderItems').innerHTML = order.items.map(item => `
      <div class="tracking-item">
        <span>${item.name} x ${item.qty}</span>
        <span>NPR ${item.price * item.qty}</span>
      </div>
    `).join('');

    // Show delivery address
    document.getElementById('trackingAddress').textContent = 
      `${order.delivery.address}, ${order.delivery.area}, ${order.delivery.city}`;

    // Initialize map
    setTimeout(() => {
      this.initTrackingMap(order);
    }, 300);

    // Show modal
    document.getElementById('trackingModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  updateTimeline(order) {
    const steps = {
      'stepConfirmed': ['confirmed', 'preparing', 'out_for_delivery', 'delivered'],
      'stepPreparing': ['preparing', 'out_for_delivery', 'delivered'],
      'stepOutForDelivery': ['out_for_delivery', 'delivered'],
      'stepDelivered': ['delivered']
    };

    // Update timeline steps
    Object.keys(steps).forEach(stepId => {
      const step = document.getElementById(stepId);
      if (steps[stepId].includes(order.status)) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });

    // Mark current step as active
    const currentStepId = `step${order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', '')}`;
    const currentStep = document.getElementById(currentStepId);
    if (currentStep && !currentStep.classList.contains('completed')) {
      currentStep.classList.add('active');
    }

    // Update timestamps
    document.getElementById('timeOrderPlaced').textContent = this.formatTime(order.timestamp);
    if (order.confirmedAt) {
      document.getElementById('timeConfirmed').textContent = this.formatTime(order.confirmedAt);
    }
    if (order.preparingAt) {
      document.getElementById('timePreparing').textContent = this.formatTime(order.preparingAt);
    }
    if (order.outForDeliveryAt) {
      document.getElementById('timeOutForDelivery').textContent = this.formatTime(order.outForDeliveryAt);
    }
    if (order.deliveredAt) {
      document.getElementById('timeDelivered').textContent = this.formatTime(order.deliveredAt);
    }
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showRiderInfo(rider) {
    document.getElementById('riderInfo').style.display = 'block';
    document.getElementById('riderName').textContent = rider.name;
    document.getElementById('riderRating').textContent = rider.rating || '4.8';
    
    const callBtn = document.getElementById('callRider');
    callBtn.href = `tel:${rider.phone}`;
  }

  initTrackingMap(order) {
    const mapContainer = document.getElementById('trackingMap');
    
    // Clear existing map
    if (this.trackingMap) {
      this.trackingMap.remove();
    }

    // Create map centered on delivery location
    const deliveryLat = order.delivery.location?.lat || 27.7172;
    const deliveryLng = order.delivery.location?.lng || 85.3240;

    this.trackingMap = L.map('trackingMap').setView([deliveryLat, deliveryLng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.trackingMap);

    // Add delivery location marker
    this.deliveryMarker = L.marker([deliveryLat, deliveryLng], {
      icon: L.divIcon({
        html: '<div style="background: #48C479; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><i class="fas fa-home"></i></div>',
        className: '',
        iconSize: [32, 32]
      })
    }).addTo(this.trackingMap);

    this.deliveryMarker.bindPopup(`<b>Delivery Address</b><br>${order.delivery.address}`);

    // Add rider location marker if available
    if (order.rider && order.rider.location) {
      const riderLat = order.rider.location.lat;
      const riderLng = order.rider.location.lng;

      this.riderMarker = L.marker([riderLat, riderLng], {
        icon: L.divIcon({
          html: '<div style="background: #E23744; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><i class="fas fa-motorcycle"></i></div>',
          className: '',
          iconSize: [32, 32]
        })
      }).addTo(this.trackingMap);

      this.riderMarker.bindPopup(`<b>${order.rider.name}</b><br>Delivery Rider`);

      // Draw route if rider is out for delivery
      if (order.status === 'out_for_delivery') {
        L.polyline(
          [[riderLat, riderLng], [deliveryLat, deliveryLng]],
          { color: '#E23744', weight: 3, dashArray: '10, 10' }
        ).addTo(this.trackingMap);
      }

      // Adjust map bounds to show both markers
      const bounds = L.latLngBounds([
        [riderLat, riderLng],
        [deliveryLat, deliveryLng]
      ]);
      this.trackingMap.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  reorder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    // Clear current cart
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');

    // Add items to cart
    const cart = {};
    order.items.forEach(item => {
      cart[item.name] = {
        price: item.price,
        qty: item.qty
      };
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartRestaurant', order.restaurant);

    // Redirect to restaurant menu
    window.location.href = `menu.html?restaurant=${order.restaurant}`;
  }
}

// Close tracking modal
function closeTrackingModal() {
  document.getElementById('trackingModal').classList.remove('show');
  document.body.style.overflow = '';
}

// Initialize on page load
let myOrdersManager;

document.addEventListener('DOMContentLoaded', () => {
  myOrdersManager = new MyOrdersManager();
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('trackingModal');
  if (e.target === modal) {
    closeTrackingModal();
  }
});
