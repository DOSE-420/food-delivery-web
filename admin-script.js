// ============================================
// GLOBAL STATE
// ============================================
let orders = [];
let riders = [];
let map = null;
let currentOrderId = null;

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  loadOrders();
  loadRiders();
  updateDashboard();
  
  // Listen for new orders from checkout page
  window.addEventListener('storage', function(e) {
    if (e.key === 'adminOrders') {
      loadOrders();
      updateDashboard();
    }
  });
  
  // Auto-refresh every 30 seconds
  setInterval(() => {
    loadOrders();
    updateDashboard();
  }, 30000);
});

// ============================================
// LOAD DATA
// ============================================
function loadOrders() {
  orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
  renderRecentOrders();
  renderAllOrders();
}

function loadRiders() {
  // Sample riders data - in real app, this would come from database
  riders = JSON.parse(localStorage.getItem('riders')) || [
    {
      id: 'R001',
      name: 'Raj Kumar',
      phone: '9841234567',
      vehicle: 'Bike - BA 12 PA 3456',
      status: 'available',
      currentLocation: [27.7172, 85.3240],
      rating: 4.8,
      totalDeliveries: 245
    },
    {
      id: 'R002',
      name: 'Bikash Thapa',
      phone: '9851234567',
      vehicle: 'Scooter - BA 15 PA 7890',
      status: 'available',
      currentLocation: [27.7089, 85.3206],
      rating: 4.6,
      totalDeliveries: 189
    },
    {
      id: 'R003',
      name: 'Anil Shrestha',
      phone: '9861234567',
      vehicle: 'Bike - BA 18 PA 1234',
      status: 'busy',
      currentLocation: [27.7025, 85.3150],
      rating: 4.9,
      totalDeliveries: 312
    }
  ];
  
  localStorage.setItem('riders', JSON.stringify(riders));
  renderRiders();
}

// ============================================
// DASHBOARD UPDATES
// ============================================
function updateDashboard() {
  // Update stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeRiders = riders.filter(r => r.status === 'available').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.payment.total, 0);
  
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('pendingOrders').textContent = pendingOrders;
  document.getElementById('activeRiders').textContent = activeRiders;
  document.getElementById('totalRevenue').textContent = `NPR ${totalRevenue.toLocaleString()}`;
  document.getElementById('ordersBadge').textContent = pendingOrders;
}

// ============================================
// RENDER ORDERS
// ============================================
function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersTable');
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No orders yet</td></tr>';
    return;
  }
  
  const recentOrders = orders.slice(0, 5);
  tbody.innerHTML = recentOrders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customer.name}</td>
      <td>${order.restaurant.replace(/-/g, ' ').toUpperCase()}</td>
      <td><strong>NPR ${order.payment.total}</strong></td>
      <td><span class="status-badge status-${order.status}">${formatStatus(order.status)}</span></td>
      <td>
        <button class="btn-action" onclick="viewOrderDetails('${order.id}')">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderAllOrders() {
  const tbody = document.getElementById('allOrdersTable');
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  
  let filteredOrders = orders;
  if (statusFilter !== 'all') {
    filteredOrders = orders.filter(o => o.status === statusFilter);
  }
  
  if (filteredOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="no-data">No orders found</td></tr>';
    return;
  }
  
  tbody.innerHTML = filteredOrders.map(order => {
    const itemCount = Object.keys(order.items).length;
    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.customer.name}</td>
        <td>${order.customer.phone}</td>
        <td>${order.restaurant.replace(/-/g, ' ').toUpperCase()}</td>
        <td>${itemCount} items</td>
        <td><strong>NPR ${order.payment.total}</strong></td>
        <td>${formatPaymentMethod(order.payment.method)}</td>
        <td><span class="status-badge status-${order.status}">${formatStatus(order.status)}</span></td>
        <td>${order.rider ? order.rider.name : '<span class="text-muted">Not assigned</span>'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action" onclick="viewOrderDetails('${order.id}')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            ${order.status === 'pending' ? `
              <button class="btn-action btn-success" onclick="confirmOrder('${order.id}')" title="Confirm">
                <i class="fas fa-check"></i>
              </button>
              <button class="btn-action btn-danger" onclick="cancelOrder('${order.id}')" title="Cancel">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
            ${order.status === 'confirmed' && !order.rider ? `
              <button class="btn-action btn-primary" onclick="showAssignRider('${order.id}')" title="Assign Rider">
                <i class="fas fa-motorcycle"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================
// RENDER RIDERS
// ============================================
function renderRiders() {
  const grid = document.getElementById('ridersGrid');
  
  grid.innerHTML = riders.map(rider => `
    <div class="rider-card">
      <div class="rider-header">
        <div class="rider-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="rider-info">
          <h3>${rider.name}</h3>
          <p>${rider.id}</p>
        </div>
        <span class="status-badge status-${rider.status}">${rider.status}</span>
      </div>
      <div class="rider-details">
        <div class="detail-item">
          <i class="fas fa-phone"></i>
          <span>${rider.phone}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-motorcycle"></i>
          <span>${rider.vehicle}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-star"></i>
          <span>${rider.rating} ★ (${rider.totalDeliveries} deliveries)</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// ORDER ACTIONS
// ============================================
function viewOrderDetails(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const itemsList = Object.entries(order.items).map(([name, data]) => `
    <div class="order-item-row">
      <span>${name} × ${data.qty}</span>
      <span>NPR ${data.price * data.qty}</span>
    </div>
  `).join('');
  
  document.getElementById('orderModalBody').innerHTML = `
    <div class="order-detail-section">
      <h3><i class="fas fa-receipt"></i> Order Information</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Order ID:</label>
          <span>${order.id}</span>
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <span class="status-badge status-${order.status}">${formatStatus(order.status)}</span>
        </div>
        <div class="detail-item">
          <label>Payment Method:</label>
          <span>${formatPaymentMethod(order.payment.method)}</span>
        </div>
        <div class="detail-item">
          <label>Order Time:</label>
          <span>${new Date(order.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-user"></i> Customer Details</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Name:</label>
          <span>${order.customer.name}</span>
        </div>
        <div class="detail-item">
          <label>Phone:</label>
          <span>${order.customer.phone}</span>
        </div>
        ${order.customer.email ? `
          <div class="detail-item">
            <label>Email:</label>
            <span>${order.customer.email}</span>
          </div>
        ` : ''}
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
      <div class="detail-grid">
        <div class="detail-item full-width">
          <label>Address:</label>
          <span>${order.delivery.address}</span>
        </div>
        <div class="detail-item">
          <label>City:</label>
          <span>${order.delivery.city}</span>
        </div>
        <div class="detail-item">
          <label>Area:</label>
          <span>${order.delivery.area}</span>
        </div>
        ${order.delivery.instructions ? `
          <div class="detail-item full-width">
            <label>Instructions:</label>
            <span>${order.delivery.instructions}</span>
          </div>
        ` : ''}
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-utensils"></i> Order Items</h3>
      <div class="order-items-list">
        ${itemsList}
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-dollar-sign"></i> Payment Summary</h3>
      <div class="payment-summary">
        <div class="payment-row">
          <span>Subtotal:</span>
          <span>NPR ${order.payment.subtotal}</span>
        </div>
        <div class="payment-row">
          <span>Delivery Fee:</span>
          <span>NPR ${order.payment.deliveryFee}</span>
        </div>
        ${order.payment.discount > 0 ? `
          <div class="payment-row discount">
            <span>Discount:</span>
            <span>- NPR ${order.payment.discount}</span>
          </div>
        ` : ''}
        <div class="payment-row total">
          <span>Total:</span>
          <span>NPR ${order.payment.total}</span>
        </div>
      </div>
    </div>
    
    ${order.rider ? `
      <div class="order-detail-section">
        <h3><i class="fas fa-motorcycle"></i> Assigned Rider</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Name:</label>
            <span>${order.rider.name}</span>
          </div>
          <div class="detail-item">
            <label>Phone:</label>
            <span>${order.rider.phone}</span>
          </div>
        </div>
      </div>
    ` : ''}
  `;
  
  document.getElementById('orderModal').style.display = 'flex';
}

function confirmOrder(orderId) {
  if (confirm('Confirm this order?')) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'confirmed';
      localStorage.setItem('adminOrders', JSON.stringify(orders));
      loadOrders();
      updateDashboard();
    }
  }
}

function cancelOrder(orderId) {
  if (confirm('Cancel this order?')) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'cancelled';
      localStorage.setItem('adminOrders', JSON.stringify(orders));
      loadOrders();
      updateDashboard();
    }
  }
}

function showAssignRider(orderId) {
  currentOrderId = orderId;
  
  const availableRiders = riders.filter(r => r.status === 'available');
  
  if (availableRiders.length === 0) {
    alert('No riders available at the moment.');
    return;
  }
  
  document.getElementById('riderSelection').innerHTML = availableRiders.map(rider => `
    <div class="rider-select-card" onclick="assignRider('${orderId}', '${rider.id}')">
      <div class="rider-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="rider-info">
        <h4>${rider.name}</h4>
        <p>${rider.vehicle}</p>
        <p class="rating">${rider.rating} ★ (${rider.totalDeliveries} deliveries)</p>
      </div>
      <i class="fas fa-chevron-right"></i>
    </div>
  `).join('');
  
  document.getElementById('assignRiderModal').style.display = 'flex';
}

function assignRider(orderId, riderId) {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  const rider = riders.find(r => r.id === riderId);
  
  if (orderIndex !== -1 && rider) {
    orders[orderIndex].rider = {
      id: rider.id,
      name: rider.name,
      phone: rider.phone,
      vehicle: rider.vehicle
    };
    orders[orderIndex].status = 'out_for_delivery';
    
    // Update rider status
    const riderIndex = riders.findIndex(r => r.id === riderId);
    riders[riderIndex].status = 'busy';
    
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    localStorage.setItem('riders', JSON.stringify(riders));
    
    loadOrders();
    updateDashboard();
    renderRiders();
    
    closeAssignModal();
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
}

function formatPaymentMethod(method) {
  const methodMap = {
    'esewa': 'eSewa',
    'fonepay': 'Fonepay',
    'cod': 'Cash on Delivery'
  };
  return methodMap[method] || method;
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

function closeAssignModal() {
  document.getElementById('assignRiderModal').style.display = 'none';
  currentOrderId = null;
}

// Close modals on outside click
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ============================================
// NAVIGATION
// ============================================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const page = this.dataset.page;
    showPage(page);
  });
});

function showPage(page) {
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  
  // Update page title
  const titles = {
    'dashboard': 'Dashboard',
    'orders': 'Orders',
    'riders': 'Delivery Riders',
    'map': 'Live Map',
    'restaurants': 'Restaurants',
    'analytics': 'Analytics'
  };
  document.querySelector('.page-title').textContent = titles[page];
  
  // Show page content
  document.querySelectorAll('.page-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(page + 'Page').classList.add('active');
  
  // Initialize map if map page
  if (page === 'map' && !map) {
    initMap();
  }
}

// ============================================
// MAP INITIALIZATION
// ============================================
function initMap() {
  map = L.map('liveMap').setView([27.7172, 85.3240], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add rider markers
  riders.forEach(rider => {
    const markerIcon = L.divIcon({
      html: '<i class="fas fa-motorcycle" style="color: #4facfe; font-size: 24px;"></i>',
      className: 'custom-marker',
      iconSize: [30, 30]
    });
    
    L.marker(rider.currentLocation, { icon: markerIcon })
      .bindPopup(`<strong>${rider.name}</strong><br>${rider.status}`)
      .addTo(map);
  });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
document.getElementById('mobileToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
});

// ============================================
// REFRESH BUTTON
// ============================================
document.getElementById('refreshBtn').addEventListener('click', function() {
  this.querySelector('i').classList.add('fa-spin');
  loadOrders();
  updateDashboard();
  setTimeout(() => {
    this.querySelector('i').classList.remove('fa-spin');
  }, 1000);
});

// ============================================
// STATUS FILTER
// ============================================
document.getElementById('statusFilter')?.addEventListener('change', function() {
  renderAllOrders();
});
