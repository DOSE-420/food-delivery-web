// ============================================
// MENU DATA
// ============================================
const menus = {
  "walnut-bistro": {
    logo: "https://i.imgur.com/0XvA6mS.png",
    cover: "https://i.imgur.com/x2J8q8p.jpg",
    items: [
      { name: "Tomato Soup", price: 250, category: "soup", description: "A rich, velvety tomato soup seasoned with fresh herbs, perfect as a starter." },
      { name: "Mushroom Cream Soup", price: 320, category: "soup", description: "Smooth mushroom cream soup with a hint of garlic and thyme, served warm." },
      { name: "Caesar Salad", price: 450, category: "appetizers", description: "Crisp romaine lettuce with creamy Caesar dressing, croutons, and parmesan cheese." },
      { name: "Bruschetta", price: 380, category: "appetizers", description: "Grilled bread topped with fresh tomatoes, basil, and a drizzle of olive oil." },
      { name: "Spring Rolls", price: 300, category: "snacks", description: "Golden-fried spring rolls filled with fresh vegetables, served with sweet chili sauce." },
      { name: "Club Sandwich", price: 500, category: "snacks", description: "Classic triple-layer sandwich with chicken, bacon, lettuce, tomato, and mayo." },
      { name: "Grilled Chicken", price: 700, category: "snacks", description: "Juicy grilled chicken marinated with herbs and spices, served hot." },
      { name: "Steamed Chicken Momos", price: 400, category: "momo", description: "Soft steamed dumplings filled with minced chicken, served with spicy tomato achar." },
      { name: "Steamed Veg Momos", price: 350, category: "momo", description: "Delicate steamed dumplings stuffed with mixed vegetables and served with sesame chutney." },
      { name: "Fried Chicken Momos", price: 450, category: "momo", description: "Crispy fried dumplings filled with chicken, served with spicy chili sauce." },
      { name: "Cheese Momos", price: 420, category: "momo", description: "Steamed or fried dumplings stuffed with creamy cheese and vegetables." },
      { name: "Spicy Pork Momos", price: 480, category: "momo", description: "Flavorful pork dumplings with a spicy kick, served with traditional achar." },
    ]
  },
  "kathmandu-grill": {
    logo: "https://i.imgur.com/5eQ4T2y.png",
    cover: "https://i.imgur.com/qkY5lQH.jpg",
    items: [
      { name: "Chicken Clear Soup", price: 280, category: "soup", description: "Light and aromatic chicken broth with finely shredded vegetables." },
      { name: "Hot & Sour Soup", price: 300, category: "soup", description: "Tangy and spicy soup with tofu, mushrooms, and aromatic seasonings." },
      { name: "Vori Vori Soup", price: 330, category: "soup", description: "Paraguayan hearty corn flour and cheese soup with rich broth and little balls." },
      { name: "Cream of Tomato Soup", price: 260, category: "soup", description: "Classic smooth tomato soup with herbs, served warm and comforting." },
      { name: "Chicken Sekuwa", price: 520, category: "appetizers", description: "Tender chicken skewers marinated in traditional spices and grilled to perfection." },
      { name: "Paneer Tikka", price: 480, category: "appetizers", description: "Soft paneer cubes marinated in rich spices and char‑grilled for a smoky flavor." },
      { name: "Bruschetta", price: 380, category: "appetizers", description: "Grilled bread topped with fresh tomato, basil, and olive oil." },
      { name: "Chicken Wings", price: 440, category: "appetizers", description: "Spicy and crispy chicken wings tossed in your choice of sauce." },
      { name: "BBQ Ribs", price: 950, category: "snacks", description: "Succulent pork ribs glazed with our signature BBQ sauce." },
      { name: "Grilled Steak", price: 1200, category: "snacks", description: "Premium steak grilled to your liking with a side of seasonal vegetables." },
      { name: "Classic Cheeseburger", price: 550, category: "snacks", description: "Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce." },
      { name: "Loaded Nachos", price: 450, category: "snacks", description: "Crispy tortilla chips topped with cheese, jalapeños, beans, and salsa." },
      { name: "Steamed Chicken Momos", price: 400, category: "momo", description: "Soft steamed dumplings filled with minced chicken, served with spicy tomato achar." },
      { name: "Steamed Veg Momos", price: 350, category: "momo", description: "Delicate steamed dumplings stuffed with mixed vegetables and served with sesame chutney." },
      { name: "Fried Chicken Momos", price: 450, category: "momo", description: "Crispy fried dumplings filled with chicken, served with spicy chili sauce." },
      { name: "Cheese Momos", price: 420, category: "momo", description: "Steamed or fried dumplings stuffed with creamy cheese and vegetables." },
      { name: "Spicy Pork Momos", price: 480, category: "momo", description: "Flavorful pork dumplings with a spicy kick, served with traditional achar." },
      { name: "Margherita Pizza", price: 650, category: "main", description: "Classic Italian pizza with tomato sauce, mozzarella, and basil." },
      { name: "Pepperoni Pizza", price: 750, category: "main", description: "Pizza topped with spicy pepperoni slices and melted cheese." },
      { name: "Spaghetti Carbonara", price: 780, category: "main", description: "Creamy Italian pasta with pancetta, egg, and Parmesan cheese." },
      { name: "Fried Chicken", price: 600, category: "main", description: "Crispy golden fried chicken served with classic sides." },
      { name: "Tacos (3 pcs)", price: 500, category: "main", description: "Soft tortillas filled with seasoned chicken, beef, or veggies." },
      { name: "Sushi Platter", price: 1200, category: "main", description: "Assorted sushi selection with fresh fish, rice, and seaweed." }
    ]
  },
  "everest-pizza": {
    logo: "https://i.imgur.com/BtT5AqB.png",
    cover: "https://i.imgur.com/7hZmX7y.jpg",
    items: [
      { name: "Garlic Soup", price: 260, category: "soup", description: "Creamy soup with roasted garlic, herbs, and a touch of cream." },
      { name: "Cheese Garlic Bread", price: 300, category: "appetizers", description: "Toasted bread topped with melted cheese and garlic butter." },
      { name: "Chicken Wings", price: 420, category: "appetizers", description: "Crispy fried chicken wings tossed in your choice of sauce." },
      { name: "Margherita Pizza", price: 600, category: "pizza", description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil." },
      { name: "Pepperoni Pizza", price: 750, category: "pizza", description: "A flavorful pizza topped with pepperoni slices and melted cheese." },
      { name: "Veggie Supreme Pizza", price: 680, category: "pizza", description: "Loaded with fresh vegetables, cheese, and a savory tomato base." }
    ]
  }
};

// ============================================
// INITIALIZATION
// ============================================
const urlParams = new URLSearchParams(window.location.search);
const restaurantKey = urlParams.get('restaurant') || "walnut-bistro";
const restaurant = menus[restaurantKey];

// Set restaurant info
document.getElementById('restaurant-name').textContent = restaurantKey.replace(/-/g, ' ').toUpperCase();
document.getElementById('restaurant-logo').src = restaurant.logo;
document.getElementById('restaurant-cover').style.backgroundImage = `url(${restaurant.cover})`;

// ============================================
// CART MANAGEMENT
// ============================================
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let cartRestaurant = localStorage.getItem('cartRestaurant') || restaurantKey;

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('cartRestaurant', cartRestaurant);
}

function increaseQty(name, price) {
  if (Object.keys(cart).length === 0) {
    cartRestaurant = restaurantKey;
    localStorage.setItem('cartRestaurant', cartRestaurant);
  } else if (cartRestaurant !== restaurantKey) {
    showAlert(`You already have items from ${cartRestaurant.replace(/-/g, ' ').toUpperCase()}. Please clear the cart to add items from another restaurant.`, () => {
      clearCart();
      increaseQty(name, price);
    });
    return;
  }

  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }

  updateQuantityDisplay(name);
  updateCart();
  saveCart();
}

function decreaseQty(name, price) {
  if (cart[name] && cart[name].qty > 0) {
    cart[name].qty--;
    if (cart[name].qty === 0) {
      delete cart[name];
    }
    updateQuantityDisplay(name);
    updateCart();
    saveCart();
  }
}

function updateQuantityDisplay(name) {
  const safeName = name.replace(/\s/g, '');
  const qtySpan = document.getElementById('qty-' + safeName);
  if (qtySpan) {
    qtySpan.textContent = cart[name] ? cart[name].qty : 0;
  }
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  
  let total = 0;
  let totalQty = 0;

  for (let key in cart) {
    if (cart[key].qty > 0) {
      const li = document.createElement('li');
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'cart-item-name';
      nameSpan.textContent = `${key} × ${cart[key].qty}`;
      
      const priceSpan = document.createElement('span');
      priceSpan.style.fontWeight = '700';
      priceSpan.style.color = '#e23744';
      priceSpan.textContent = `NPR ${cart[key].qty * cart[key].price}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'cart-item-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.addEventListener('click', () => {
        delete cart[key];
        updateQuantityDisplay(key);
        updateCart();
        saveCart();
      });
      
      const itemDetails = document.createElement('div');
      itemDetails.style.flex = '1';
      itemDetails.appendChild(nameSpan);
      itemDetails.appendChild(document.createElement('br'));
      const priceText = document.createElement('small');
      priceText.appendChild(priceSpan);
      itemDetails.appendChild(priceText);
      
      li.appendChild(itemDetails);
      li.appendChild(deleteBtn);
      cartItems.appendChild(li);
      
      total += cart[key].qty * cart[key].price;
      totalQty += cart[key].qty;
    }
  }

  if (totalQty === 0) {
    cartItems.innerHTML = '<div class="empty-cart-message"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
    cartRestaurant = restaurantKey;
    localStorage.removeItem('cartRestaurant');
  }

  document.getElementById('cartCount').textContent = totalQty;
  document.getElementById('orderBadge').textContent = totalQty;
  document.getElementById('cartTotal').textContent = `Total: NPR ${total}`;
  document.getElementById('cartRestaurantName').textContent = totalQty > 0 ? `From: ${cartRestaurant.replace(/-/g, ' ').toUpperCase()}` : '';

  const placeOrderSection = document.getElementById('placeOrderSection');
  placeOrderSection.style.display = totalQty > 0 ? 'flex' : 'none';
}

function clearCart() {
  cart = {};
  localStorage.removeItem('cart');
  localStorage.removeItem('cartRestaurant');
  
  document.querySelectorAll('[id^="qty-"]').forEach(span => {
    span.textContent = 0;
  });
  
  updateCart();
}

// ============================================
// RENDER MENU
// ============================================
function renderMenu() {
  const categoryNav = document.querySelector('.category-nav');
  const menuContainer = document.getElementById('menuContainer');
  
  categoryNav.innerHTML = '';
  menuContainer.innerHTML = '';

  // Group items by category
  const categoryMap = {};
  restaurant.items.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = [];
    }
    categoryMap[item.category].push(item);
  });

  // Render each category
  Object.keys(categoryMap).forEach(cat => {
    const categoryTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
    const containerId = 'menu-list-' + cat;

    // Add category button
    const btn = document.createElement('button');
    btn.textContent = categoryTitle;
    btn.dataset.target = containerId;
    categoryNav.appendChild(btn);

    // Create section
    const section = document.createElement('div');
    section.className = 'menu-section';
    section.id = containerId;

    const h2 = document.createElement('h2');
    h2.textContent = categoryTitle;
    section.appendChild(h2);

    const header = document.createElement('div');
    header.className = 'menu-header';
    header.innerHTML = '<span>Item Name</span><span class="price">Price</span><span class="quantity">Quantity</span>';
    section.appendChild(header);

    // Add items
    categoryMap[cat].forEach(item => {
      const safeName = item.name.replace(/\s/g, '');
      const div = document.createElement('div');
      div.className = 'menu-item';
      
      // Add click handler for mobile
      div.setAttribute('data-item-name', item.name);
      div.setAttribute('data-item-price', item.price);
      div.setAttribute('data-item-description', item.description || '');
      
      // Check if description is longer than ~100 characters for see more button
      const needsSeeMore = item.description && item.description.length > 100;
      
      div.innerHTML = `
        <div class="menu-item-content">
          <div class="menu-item-name">${item.name}</div>
          <div class="description">
            ${item.description || ''}
            <button class="mobile-see-more" onclick="event.stopPropagation(); openMobileBottomSheet('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.description.replace(/'/g, "\\'")}')">...see more</button>
          </div>
          ${needsSeeMore ? `<button class="see-more-btn" onclick="openItemModal('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.description.replace(/'/g, "\\'")}')">See more</button>` : ''}
        </div>
        <span class="price">NPR ${item.price}</span>
        <div class="qty-controls" onclick="event.stopPropagation()">
          <button onclick="decreaseQty('${item.name}', ${item.price})">−</button>
          <span id="qty-${safeName}">${cart[item.name] ? cart[item.name].qty : 0}</span>
          <button onclick="increaseQty('${item.name}', ${item.price})">+</button>
        </div>
      `;
      section.appendChild(div);
    });

    menuContainer.appendChild(section);
  });
  
  // Add click handlers for mobile menu items
  addMobileClickHandlers();
}

// Add click handlers to menu items for mobile
function addMobileClickHandlers() {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.menu-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function(e) {
        // Don't trigger if clicking on quantity controls
        if (e.target.closest('.qty-controls')) {
          return;
        }
        
        const name = this.getAttribute('data-item-name');
        const price = parseFloat(this.getAttribute('data-item-price'));
        const description = this.getAttribute('data-item-description');
        
        openMobileBottomSheet(name, price, description);
      });
    });
  }
}

// Re-add handlers on window resize
window.addEventListener('resize', () => {
  addMobileClickHandlers();
});

// ============================================
// SEARCH FUNCTIONALITY (MATCHING INDEX.HTML)
// ============================================
const searchBtn = document.getElementById('searchBtn');
const searchWrap = document.getElementById('searchWrap');
const searchInput = document.getElementById('searchInput');
const searchOverlay = document.getElementById('searchOverlay');
const searchOverlayInput = document.getElementById('searchOverlayInput');
const closeSearch = document.getElementById('closeSearch');

// Toggle search wrap (like index.html)
searchBtn.addEventListener('click', e => {
  e.stopPropagation();
  searchWrap.classList.toggle('active');
  if (searchWrap.classList.contains('active')) {
    searchInput.focus();
  }
});

document.addEventListener('click', e => {
  if (!searchWrap.contains(e.target) && !searchBtn.contains(e.target)) {
    searchWrap.classList.remove('active');
  }
});

// Search functionality for inline search
searchInput.addEventListener('input', e => {
  filterMenu(e.target.value.toLowerCase());
});

// Search overlay functionality
closeSearch.addEventListener('click', () => {
  searchOverlay.classList.remove('active');
  searchOverlayInput.value = '';
  filterMenu('');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
    searchOverlay.classList.remove('active');
    searchOverlayInput.value = '';
    filterMenu('');
  }
});

searchOverlayInput.addEventListener('input', e => {
  filterMenu(e.target.value.toLowerCase());
});

function filterMenu(query) {
  const noResults = document.getElementById('noResults');
  let hasResults = false;

  document.querySelectorAll('.menu-item').forEach(item => {
    const text = item.innerText.toLowerCase();
    if (text.includes(query)) {
      item.style.display = 'flex';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });

  document.querySelectorAll('.menu-section').forEach(section => {
    const visibleItems = section.querySelectorAll('.menu-item:not([style*="display: none"])');
    section.style.display = visibleItems.length ? 'block' : 'none';
  });

  noResults.style.display = hasResults || query === '' ? 'none' : 'block';
}

// ============================================
// NAVIGATION (MATCHING INDEX.HTML)
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  mobileNav.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
    mobileNav.classList.remove('open');
  }
});

// Category navigation
document.querySelector('.category-nav').addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const targetId = e.target.dataset.target;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const headerOffset = 100;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
});

// ============================================
// CART DRAWER WITH PLACE ORDER BUTTON DISABLE
// ============================================
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const placeOrderBtn = document.getElementById('stickyPlaceOrderBtn');

cartBtn.addEventListener('click', () => {
  cartDrawer.classList.toggle('open');
  
  // Disable place order button when cart is open
  if (cartDrawer.classList.contains('open')) {
    placeOrderBtn.disabled = true;
  } else {
    placeOrderBtn.disabled = false;
  }
});

document.addEventListener('click', e => {
  if (!cartDrawer.contains(e.target) && !cartBtn.contains(e.target)) {
    cartDrawer.classList.remove('open');
    placeOrderBtn.disabled = false; // Re-enable when cart closes
  }
});

document.getElementById('clearCartBtn').addEventListener('click', clearCart);

// Checkout button - check if cart is empty
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    showAlert('Your cart is empty! Please add some items before checkout.', null);
  } else {
    window.location.href = 'checkout.html';
  }
});

// Place order button - check if cart is empty
placeOrderBtn.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    showAlert('Your cart is empty! Please add some items before checkout.', null);
  } else {
    window.location.href = 'checkout.html';
  }
});

// ============================================
// ALERT MODAL
// ============================================
function showAlert(message, onConfirm) {
  const alert = document.getElementById('restaurantAlert');
  const alertMessage = document.getElementById('alertMessage');
  const alertCancel = document.getElementById('alertCancel');
  const alertConfirm = document.getElementById('alertConfirm');

  alertMessage.textContent = message;
  alert.classList.add('active');

  // If no confirm action, hide confirm button and change cancel to "OK"
  if (!onConfirm) {
    alertConfirm.style.display = 'none';
    alertCancel.textContent = 'OK';
  } else {
    alertConfirm.style.display = 'block';
    alertCancel.textContent = 'Cancel';
  }

  alertCancel.onclick = () => {
    alert.classList.remove('active');
    // Reset button text
    alertCancel.textContent = 'Cancel';
    alertConfirm.style.display = 'block';
  };

  alertConfirm.onclick = () => {
    alert.classList.remove('active');
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  };
}

// ============================================
// ITEM DETAIL MODAL
// ============================================
let currentModalItem = { name: '', price: 0, description: '' };
let modalQty = 0;

function openItemModal(name, price, description) {
  const modal = document.getElementById('itemModal');
  const safeName = name.replace(/\s/g, '');
  
  currentModalItem = { name, price, description };
  modalQty = cart[name] ? cart[name].qty : 0;
  
  document.getElementById('modalItemName').textContent = name;
  document.getElementById('modalItemPrice').textContent = `NPR ${price}`;
  document.getElementById('modalItemDescription').textContent = description;
  document.getElementById('modalQty').textContent = modalQty;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeItemModal() {
  const modal = document.getElementById('itemModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Modal close button
document.getElementById('modalClose').addEventListener('click', closeItemModal);

// Close modal when clicking outside
document.getElementById('itemModal').addEventListener('click', (e) => {
  if (e.target.id === 'itemModal') {
    closeItemModal();
  }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('itemModal').classList.contains('active')) {
    closeItemModal();
  }
});

// Modal quantity controls
document.getElementById('modalIncrease').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    cartRestaurant = restaurantKey;
    localStorage.setItem('cartRestaurant', cartRestaurant);
  } else if (cartRestaurant !== restaurantKey) {
    showAlert(`You already have items from ${cartRestaurant.replace(/-/g, ' ').toUpperCase()}. Please clear the cart to add items from another restaurant.`, () => {
      clearCart();
      modalQty = 1;
      updateModalQty();
    });
    return;
  }
  
  modalQty++;
  updateModalQty();
});

document.getElementById('modalDecrease').addEventListener('click', () => {
  if (modalQty > 0) {
    modalQty--;
    updateModalQty();
  }
});

function updateModalQty() {
  document.getElementById('modalQty').textContent = modalQty;
}

// Add to cart from modal
document.getElementById('modalAddToCart').addEventListener('click', () => {
  const { name, price } = currentModalItem;
  
  if (modalQty > 0) {
    cart[name] = { price, qty: modalQty };
  } else {
    delete cart[name];
  }
  
  updateQuantityDisplay(name);
  updateCart();
  saveCart();
  closeItemModal();
});

// ============================================
// MOBILE BOTTOM SHEET
// ============================================
let currentBottomSheetItem = { name: '', price: 0, description: '' };
let bottomSheetQty = 0;

function openMobileBottomSheet(name, price, description) {
  const bottomSheet = document.getElementById('mobileBottomSheet');
  const overlay = document.getElementById('bottomSheetOverlay');
  const safeName = name.replace(/\s/g, '');
  
  currentBottomSheetItem = { name, price, description };
  bottomSheetQty = cart[name] ? cart[name].qty : 0;
  
  document.getElementById('bottomSheetTitle').textContent = name;
  document.getElementById('bottomSheetPrice').textContent = `NPR ${price}`;
  document.getElementById('bottomSheetDescription').textContent = description || 'No description available';
  document.getElementById('bottomSheetQty').textContent = bottomSheetQty;
  
  overlay.classList.add('active');
  bottomSheet.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileBottomSheet() {
  const bottomSheet = document.getElementById('mobileBottomSheet');
  const overlay = document.getElementById('bottomSheetOverlay');
  
  overlay.classList.remove('active');
  bottomSheet.classList.remove('active');
  document.body.style.overflow = '';
}

// Close bottom sheet when clicking overlay
document.getElementById('bottomSheetOverlay').addEventListener('click', closeMobileBottomSheet);

// Swipe down to close (touch events)
let touchStartY = 0;
let touchEndY = 0;

document.getElementById('mobileBottomSheet').addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.getElementById('mobileBottomSheet').addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  if (touchEndY > touchStartY + 50) {
    closeMobileBottomSheet();
  }
}

// Bottom sheet quantity controls
document.getElementById('bottomSheetIncrease').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    cartRestaurant = restaurantKey;
    localStorage.setItem('cartRestaurant', cartRestaurant);
  } else if (cartRestaurant !== restaurantKey) {
    closeMobileBottomSheet();
    showAlert(`You already have items from ${cartRestaurant.replace(/-/g, ' ').toUpperCase()}. Please clear the cart to add items from another restaurant.`, () => {
      clearCart();
      bottomSheetQty = 1;
      updateBottomSheetQty();
      openMobileBottomSheet(currentBottomSheetItem.name, currentBottomSheetItem.price, currentBottomSheetItem.description);
    });
    return;
  }
  
  bottomSheetQty++;
  updateBottomSheetQty();
});

document.getElementById('bottomSheetDecrease').addEventListener('click', () => {
  if (bottomSheetQty > 0) {
    bottomSheetQty--;
    updateBottomSheetQty();
  }
});

function updateBottomSheetQty() {
  document.getElementById('bottomSheetQty').textContent = bottomSheetQty;
}

// Add to cart from bottom sheet
document.getElementById('bottomSheetAddToCart').addEventListener('click', () => {
  const { name, price } = currentBottomSheetItem;
  
  if (bottomSheetQty > 0) {
    cart[name] = { price, qty: bottomSheetQty };
  } else {
    delete cart[name];
  }
  
  updateQuantityDisplay(name);
  updateCart();
  saveCart();
  closeMobileBottomSheet();
});

// ============================================
// INITIALIZE
// ============================================
renderMenu();
updateCart();
