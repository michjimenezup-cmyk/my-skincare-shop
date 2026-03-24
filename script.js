// 1. Initialize ang cart mula sa LocalStorage
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

// Pag-load ng page, update agad ang bilang sa cart icon
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items-list')) {
        displayCartItems();
    }
});

// 2. UNIVERSAL CLICK HANDLER (Event Delegation)
// Mas matatag ito dahil kahit 100 pa ang products mo, lahat sila gagana.
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('add-btn')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').innerText;
        
        // Linisin ang price
        const priceString = productCard.querySelector('.price').innerText;
        const productPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));

        const item = { name: productName, price: productPrice };
        cart.push(item);

        // Save at Update
        localStorage.setItem('myCart', JSON.stringify(cart));
        updateCartCount();
        showToast(`Added ${productName} to cart! 🛒`);
    }
});

// --- SEARCH LOGIC ---
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

if (searchInput) {
    const performSearch = () => {
        const filter = searchInput.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const title = product.querySelector('h3').innerText.toLowerCase();
            
            if (title.includes(filter)) {
                // Eto ang sikreto: "" (empty quotes)
                // Imbes na "block", ibinabalik nito ang original CSS settings mo
                product.style.display = ""; 
            } else {
                product.style.display = "none";
                
            }
        });
    };

    // Click ng Button
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Real-time typing
    searchInput.addEventListener('input', performSearch);
}

// 4. HELPER FUNCTIONS
function updateCartCount() {
    const cartCountDisplay = document.getElementById('cart-count');
    if (cartCountDisplay) {
        cartCountDisplay.innerText = cart.length;
    }
}

function showToast(message) {
    // Para hindi mag-overlap ang mga toast, check kung may existing
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.innerText = message;
    toast.className = "toast-message";
    document.body.appendChild(toast);
    
    setTimeout(() => { 
        if(toast) toast.remove(); 
    }, 3000);
}

// 5. CART PAGE DISPLAY
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('cart-total');
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty.</p>';
        if (totalDisplay) totalDisplay.innerText = '₱0.00';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item-row';
        itemDiv.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;";
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>₱${item.price.toLocaleString()}</span>
            <button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:5px;">Remove</button>
        `;
        cartItemsList.appendChild(itemDiv);
        total += item.price;
    });

    if (totalDisplay) {
        totalDisplay.innerText = `₱${total.toLocaleString()}`;
    }
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
};
