// ============================================
// INITIALIZE FROM LOCALSTORAGE
// ============================================
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let cartRestaurant = localStorage.getItem('cartRestaurant') || '';

// Promo codes
const promoCodes = {
  'SAVE10': 10,
  'WELCOME20': 20,
  'FIRST50': 50
};

let appliedDiscount = 0;
let map = null;
let marker = null;
let selectedLocation = null;
let uploadedScreenshot = null;

// ============================================
// PAYMENT QR CODE & SCREENSHOT FUNCTIONALITY
// ============================================

// Sample QR code images (replace with actual QR codes from eSewa/Fonepay)
const paymentQRCodes = {
  esewa: 'https://via.placeholder.com/200x200/60d394/ffffff?text=eSewa+QR', // Replace with actual eSewa QR
  fonepay: 'https://via.placeholder.com/200x200/3498db/ffffff?text=Fonepay+QR' // Replace with actual Fonepay QR
};

// Payment method change handler
document.addEventListener('DOMContentLoaded', function() {
  const paymentMethodRadios = document.querySelectorAll('input[name="summaryPaymentMethod"]');
  const qrPaymentSection = document.getElementById('qrPaymentSection');
  const qrCodeImage = document.getElementById('qrCodeImage');
  const qrPaymentTitle = document.getElementById('qrPaymentTitle');
  const qrInstructions = document.getElementById('qrInstructions');
  const qrAmount = document.getElementById('qrAmount');

  // Explicitly uncheck all payment methods on page load
  paymentMethodRadios.forEach(radio => {
    radio.checked = false;
  });

  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const selectedMethod = this.value;
      
      if (selectedMethod === 'esewa' || selectedMethod === 'fonepay') {
        // Show QR code section
        qrPaymentSection.style.display = 'block';
        
        // Update QR code and text based on payment method
        if (selectedMethod === 'esewa') {
          qrCodeImage.src = paymentQRCodes.esewa;
          qrPaymentTitle.textContent = 'Scan QR with eSewa';
          qrInstructions.textContent = 'Open eSewa app and scan this QR code to complete payment';
        } else if (selectedMethod === 'fonepay') {
          qrCodeImage.src = paymentQRCodes.fonepay;
          qrPaymentTitle.textContent = 'Scan QR with Fonepay';
          qrInstructions.textContent = 'Open Fonepay app and scan this QR code to complete payment';
        }
        
        // Update amount in QR section
        updateQRAmount();
        
      } else {
        // Hide QR code section for Cash on Delivery
        qrPaymentSection.style.display = 'none';
        clearPaymentScreenshot();
      }
      
      // Update place order button state
      updatePlaceOrderButton();
    });
  });

  // Payment screenshot upload functionality
  const paymentScreenshotInput = document.getElementById('paymentScreenshot');
  const screenshotPreview = document.getElementById('screenshotPreview');
  const previewImage = document.getElementById('previewImage');
  const removeScreenshotBtn = document.getElementById('removeScreenshot');
  const fileUploadText = document.getElementById('fileUploadText');

  if (paymentScreenshotInput) {
    paymentScreenshotInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size should not exceed 5MB');
          return;
        }
        
        // Read and display the image
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          screenshotPreview.style.display = 'block';
          fileUploadText.textContent = file.name;
          uploadedScreenshot = file;
          
          // Enable place order button if screenshot is uploaded
          updatePlaceOrderButton();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeScreenshotBtn) {
    removeScreenshotBtn.addEventListener('click', function() {
      clearPaymentScreenshot();
    });
  }
  
  // Initialize on load
  loadCartItems();
});

function clearPaymentScreenshot() {
  const paymentScreenshotInput = document.getElementById('paymentScreenshot');
  const screenshotPreview = document.getElementById('screenshotPreview');
  const previewImage = document.getElementById('previewImage');
  const fileUploadText = document.getElementById('fileUploadText');
  
  if (paymentScreenshotInput) paymentScreenshotInput.value = '';
  if (screenshotPreview) screenshotPreview.style.display = 'none';
  if (previewImage) previewImage.src = '';
  if (fileUploadText) fileUploadText.textContent = 'Choose Screenshot';
  uploadedScreenshot = null;
  updatePlaceOrderButton();
}

function updatePlaceOrderButton() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const selectedPaymentMethodEl = document.querySelector('input[name="summaryPaymentMethod"]:checked');
  
  if (!placeOrderBtn) return;
  
  // Check if cart is empty
  if (Object.keys(cart).length === 0) {
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Cart is Empty';
    return;
  }
  
  // Check if payment method is selected
  if (!selectedPaymentMethodEl) {
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-credit-card"></i> Choose Payment Method';
    return;
  }
  
  const selectedPaymentMethod = selectedPaymentMethodEl.value;
  
  // For eSewa/Fonepay, require screenshot upload
  if (selectedPaymentMethod === 'esewa' || selectedPaymentMethod === 'fonepay') {
    if (uploadedScreenshot) {
      placeOrderBtn.disabled = false;
      placeOrderBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    } else {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Upload Payment Proof';
    }
  } else {
    // For COD, no screenshot needed
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
  }
}

function updateQRAmount() {
  const totalAmountText = document.getElementById('totalAmount').textContent;
  const qrAmount = document.getElementById('qrAmount');
  if (qrAmount) {
    qrAmount.textContent = totalAmountText;
  }
}

// ============================================
// LOAD CART ON PAGE LOAD
// ============================================
function loadCartItems() {
  const orderItemsContainer = document.getElementById('orderItems');
  const restaurantNameEl = document.getElementById('restaurantName');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  
  // Clear existing items
  orderItemsContainer.innerHTML = '';
  
  let subtotal = 0;
  let itemCount = 0;
  
  // Check if cart has items
  if (Object.keys(cart).length === 0) {
    orderItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    restaurantNameEl.textContent = 'No restaurant selected';
    updateCartCount(0);
    calculateTotal();
    updatePlaceOrderButton();
    return;
  }
  
  // Display restaurant name
  if (cartRestaurant) {
    const displayName = cartRestaurant.replace(/-/g, ' ').toUpperCase();
    restaurantNameEl.textContent = displayName;
  }
  
  // Display cart items
  for (let itemName in cart) {
    const item = cart[itemName];
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    itemCount += item.qty;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    itemDiv.innerHTML = `
      <div class="item-details">
        <div class="item-name">${itemName}</div>
        <div class="item-quantity">Qty: ${item.qty}</div>
      </div>
      <div class="item-price">NPR ${itemTotal}</div>
    `;
    orderItemsContainer.appendChild(itemDiv);
  }
  
  // Update cart count
  updateCartCount(itemCount);
  
  // Calculate total
  calculateTotal();
  
  // Update place order button
  updatePlaceOrderButton();
}

function updateCartCount(count) {
  document.getElementById('cartCount').textContent = count;
}

function calculateTotal() {
  let subtotal = 0;
  
  for (let itemName in cart) {
    subtotal += cart[itemName].price * cart[itemName].qty;
  }
  
  const deliveryFee = 50;
  const discount = appliedDiscount;
  const total = subtotal + deliveryFee - discount;
  
  document.getElementById('subtotal').textContent = `NPR ${subtotal}`;
  document.getElementById('deliveryFee').textContent = `NPR ${deliveryFee}`;
  document.getElementById('totalAmount').textContent = `NPR ${total}`;
  
  if (discount > 0) {
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discountAmount').textContent = `- NPR ${discount}`;
  } else {
    document.getElementById('discountRow').style.display = 'none';
  }
  
  // Update QR amount
  updateQRAmount();
}

// ============================================
// PROMO CODE
// ============================================
document.getElementById('applyPromo').addEventListener('click', function() {
  const promoInput = document.getElementById('promoCode');
  const promoMessage = document.getElementById('promoMessage');
  const code = promoInput.value.trim().toUpperCase();
  
  if (promoCodes[code]) {
    appliedDiscount = promoCodes[code];
    promoMessage.textContent = `Promo code applied! NPR ${appliedDiscount} discount`;
    promoMessage.style.color = '#48C479';
    calculateTotal();
  } else if (code === '') {
    promoMessage.textContent = 'Please enter a promo code';
    promoMessage.style.color = '#E23744';
  } else {
    promoMessage.textContent = 'Invalid promo code';
    promoMessage.style.color = '#E23744';
  }
});

// ============================================
// LEAFLET MAP
// ============================================
document.getElementById('getCurrentLocation').addEventListener('click', function() {
  const mapContainer = document.getElementById('mapContainer');
  
  if (mapContainer.style.display === 'none') {
    mapContainer.style.display = 'block';
    
    if (!map) {
      // Initialize map
      map = L.map('map').setView([27.7172, 85.3240], 13); // Kathmandu coordinates
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            map.setView([lat, lng], 15);
            
            if (marker) {
              map.removeLayer(marker);
            }
            
            marker = L.marker([lat, lng]).addTo(map);
            selectedLocation = { lat, lng };
            
            document.getElementById('locationCoords').textContent = 
              `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          },
          function(error) {
            console.log('Geolocation error:', error);
            document.getElementById('locationCoords').textContent = 
              'Unable to get location. Click on the map to set manually.';
          }
        );
      }
      
      // Allow user to click on map to set location
      map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        if (marker) {
          map.removeLayer(marker);
        }
        
        marker = L.marker([lat, lng]).addTo(map);
        selectedLocation = { lat, lng };
        
        document.getElementById('locationCoords').textContent = 
          `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      });
    }
  }
});

// ============================================
// DELIVERY TIME SCHEDULING
// ============================================
document.querySelectorAll('input[name="deliveryTime"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const scheduleTime = document.getElementById('scheduleTime');
    if (this.value === 'scheduled') {
      scheduleTime.style.display = 'block';
      
      // Set minimum datetime to current time
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Add 30 minutes buffer
      const minDateTime = now.toISOString().slice(0, 16);
      document.getElementById('scheduledDateTime').min = minDateTime;
    } else {
      scheduleTime.style.display = 'none';
    }
  });
});

// ============================================
// FORM VALIDATION & PLACE ORDER
// ============================================
document.getElementById('placeOrderBtn').addEventListener('click', function() {
  const form = document.getElementById('deliveryForm');
  
  // Check if form is valid
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Check if cart is empty
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Check if payment method is selected
  const selectedPaymentMethodEl = document.querySelector('input[name="summaryPaymentMethod"]:checked');
  if (!selectedPaymentMethodEl) {
    alert('Please select a payment method');
    return;
  }
  
  const selectedPaymentMethod = selectedPaymentMethodEl.value;
  
  // Check payment method and screenshot requirement
  if ((selectedPaymentMethod === 'esewa' || selectedPaymentMethod === 'fonepay') && !uploadedScreenshot) {
    alert('Please upload payment screenshot before placing order');
    return;
  }
  
  // Get form data
  const formData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    altPhone: document.getElementById('altPhone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    area: document.getElementById('area').value,
    deliveryInstructions: document.getElementById('deliveryInstructions').value,
    deliveryTime: document.querySelector('input[name="deliveryTime"]:checked').value,
    scheduledDateTime: document.getElementById('scheduledDateTime').value,
    paymentMethod: selectedPaymentMethod,
    paymentScreenshot: uploadedScreenshot ? uploadedScreenshot.name : null,
    location: selectedLocation,
    cart: cart,
    restaurant: cartRestaurant,
    subtotal: calculateSubtotal(),
    deliveryFee: 50,
    discount: appliedDiscount,
    total: calculateFinalTotal()
  };
  
  console.log('Order placed:', formData);
  
  // Update progress to complete
  updateProgressToComplete();
  
  // Generate order ID
  const orderId = '#' + Math.random().toString(36).substr(2, 9).toUpperCase();
  document.getElementById('orderId').textContent = orderId;
  
  // Save order to localStorage for admin dashboard
  saveOrderToAdmin(orderId, formData);
  
  // Show success modal
  document.getElementById('successModal').style.display = 'flex';
  
  // Clear cart and screenshot
  localStorage.removeItem('cart');
  localStorage.removeItem('cartRestaurant');
  cart = {};
  cartRestaurant = '';
  clearPaymentScreenshot();
});

function calculateSubtotal() {
  let subtotal = 0;
  for (let itemName in cart) {
    subtotal += cart[itemName].price * cart[itemName].qty;
  }
  return subtotal;
}

function calculateFinalTotal() {
  return calculateSubtotal() + 50 - appliedDiscount;
}

function saveOrderToAdmin(orderId, orderData) {
  // Get existing orders or initialize empty array
  let orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
  
  // Create order object
  const order = {
    id: orderId,
    customer: {
      name: orderData.fullName,
      phone: orderData.phone,
      altPhone: orderData.altPhone,
      email: orderData.email
    },
    delivery: {
      address: orderData.address,
      city: orderData.city,
      area: orderData.area,
      instructions: orderData.deliveryInstructions,
      location: orderData.location
    },
    restaurant: orderData.restaurant,
    items: orderData.cart,
    payment: {
      method: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total
    },
    deliveryTime: {
      type: orderData.deliveryTime,
      scheduled: orderData.scheduledDateTime || null
    },
    status: 'pending',
    rider: null,
    timestamp: new Date().toISOString(),
    estimatedDelivery: calculateEstimatedDelivery()
  };
  
  // Add to orders array
  orders.unshift(order); // Add to beginning
  
  // Save to localStorage
  localStorage.setItem('adminOrders', JSON.stringify(orders));
  
  // Trigger storage event for admin dashboard (if open in another tab)
  window.dispatchEvent(new Event('storage'));
}

function calculateEstimatedDelivery() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 35); // 35 minutes from now
  return now.toISOString();
}

function updateProgressToComplete() {
  // Remove active from payment step
  const steps = document.querySelectorAll('.step');
  const stepLines = document.querySelectorAll('.step-line');
  
  // Activate complete step
  steps[2].classList.add('active'); // Complete step
  stepLines[1].classList.add('active'); // Line to complete
}

// ============================================
// CLOSE MODAL
// ============================================
function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  const modal = document.getElementById('successModal');
  if (e.target === modal) {
    closeModal();
  }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', function(e) {
  e.stopPropagation();
  mobileNav.classList.toggle('open');
});

document.addEventListener('click', function(e) {
  if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
    mobileNav.classList.remove('open');
  }
});

// ============================================
// CART BUTTON (GO BACK TO MENU)
// ============================================
document.getElementById('cartBtn').addEventListener('click', function() {
  if (cartRestaurant) {
    window.location.href = `menu.html?restaurant=${cartRestaurant}`;
  } else {
    window.location.href = 'index.html';
  }
});
