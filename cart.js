// 1. استدعاء عناصر الهيدر والسلة
let cartIcon = document.querySelector(".cart-icon");
let cartProductsDropdown = document.getElementById("carts-products");
let cartDom = document.getElementById('carts-items'); // المكان اللي بيرسم جوة المنيو المنسدلة

let cartDataAddedProducts = document.querySelector(".cart-data-addedproducts"); // المكان اللي بيرسم جوة الصفحة الرئيسية
let totalPriceDom = document.getElementById("total-price");
let badgeDom = document.getElementById("countter");
let favDom = document.getElementById("addedFavProduct");

let username = document.getElementById("user-name");
let userinfo = document.getElementById("header-user-info");
let headerlinks = document.getElementById("header-links");
let logoutBtn = document.getElementById("logout-btn");

let userData = localStorage.getItem('loggedin');
let userDataString = userData ? JSON.parse(userData) : null;

// قراءة البيانات من localStorage
let productsInCart = localStorage.getItem("productsInCart");
let addedItem = productsInCart ? JSON.parse(productsInCart) : [];

let favoraiteProducts = localStorage.getItem("favoraiteProducts");
let favoraitItems = favoraiteProducts ? JSON.parse(favoraiteProducts) : [];

// إظهار اسم المستخدم عند تسجيل الدخول
if (userData && userDataString) {
    if (username) username.innerHTML = `hello , ${userDataString.firstName}`;
    if (userinfo) userinfo.style.display = "block";
    if (headerlinks) headerlinks.style.display = "none";
} else {
    if (userinfo) userinfo.style.display = "none";
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('loggedin');
        window.location.reload();
    });
}

// =========================================================
// 2. دالة رسم المنتجات جوة القائمة المنسدلة (Dropdown Menu)
// =========================================================
function drwaCartUI() {
    let totalQty = addedItem.reduce((acc, item) => acc + (item.qty || 1), 0);
    if (badgeDom) badgeDom.innerHTML = totalQty;

    if (!cartDom) return;

    if (addedItem.length === 0) {
        cartDom.innerHTML = "<p>your cart is empty now</p>";
        return;
    }

    let cartUI = addedItem.map((item) => {
        let currentQty = item.qty || 1;
        return `
        <div class="carts-addeditems" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <div class="items-details">
                <h4 style="font-size:14px; margin:0;">${item.title}</h4>
                <span style="font-size:12px; color:#666;">price: $${item.price * currentQty}</span>
            </div>
            <div class="add-reduce-items" style="display:flex; align-items:center; gap:5px;">
                <button onclick="changeQty(${item.id}, -1)" style="padding:2px 6px;">-</button>
                <span style="font-size:12px;">${currentQty}</span>
                <button onclick="changeQty(${item.id}, 1)" style="padding:2px 6px;">+</button>
            </div>
        </div>
        `;
    });

    cartDom.innerHTML = cartUI.join("");
}

// =========================================================
// 3. دالة رسم المنتجات الرئيسية في صفحة الـ Cart
// =========================================================
function drawCartProductsPage() {
    if (!cartDataAddedProducts) return;

    if (addedItem.length === 0) {
        cartDataAddedProducts.innerHTML = "<p class='empty-msg'>your cart is empty now</p>";
        if (totalPriceDom) totalPriceDom.innerHTML = "$0.00";
        return;
    }

    let totalPrice = 0;

    let cartUI = addedItem.map((item) => {
        let currentQty = item.qty || 1;
        totalPrice += item.price * currentQty;

        return `
        <div class="cart-item-card">
            <img src="${item.imageurl}" class="cart-item-img" alt="${item.title}">
            <div class="cart-item-info">
                <h2>${item.title}</h2>
                <p class="cart-category">Category: ${item.catogory}</p>
                <p class="cart-price">Price: $${item.price}</p>
                <div class="cart-action-row">
                    <div class="qty-control">
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${currentQty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-cart-btn" onclick="removeItemFromCart(${item.id})">Remove from Cart</button>
                </div>
            </div>
        </div>
        `;
    });

    cartDataAddedProducts.innerHTML = cartUI.join("");
    if (totalPriceDom) totalPriceDom.innerHTML = `$${totalPrice.toFixed(2)}`;
}

// =========================================================
// 4. التحكم في الكمية والحذف مع تحديث المكانين فوراً
// =========================================================
function changeQty(id, amount) {
    let item = addedItem.find((i) => i.id === id);
    if (item) {
        item.qty = (item.qty || 1) + amount;
        if (item.qty <= 0) {
            addedItem = addedItem.filter((i) => i.id !== id);
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(addedItem));
    updateAllCartViews();
}

function removeItemFromCart(id) {
    addedItem = addedItem.filter((item) => item.id !== id);
    localStorage.setItem("productsInCart", JSON.stringify(addedItem));
    updateAllCartViews();
}

function updateAllCartViews() {
    drwaCartUI();
    drawCartProductsPage();
}

// =========================================================
// 5. فتح وإغلاق القائمة المنسدلة (Dropdown Toggle)
// =========================================================
if (cartIcon && cartProductsDropdown) {
    cartIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        if (cartProductsDropdown.style.display === "block") {
            cartProductsDropdown.style.display = "none";
        } else {
            cartProductsDropdown.style.display = "block";
        }
    });

    cartProductsDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function () {
        cartProductsDropdown.style.display = "none";
    });
}

// =========================================================
// 6. رسم المفضلة
// =========================================================
function drawFavoriteProducts() {
    if (!favDom) return;

    if (favoraitItems.length === 0) {
        favDom.innerHTML = "<p class='empty-msg'>You have no favorite items</p>";
        return;
    }

    let favUI = favoraitItems.map((item) => {
        return `
        <div class="fav-item-card">
            <img src="${item.imageurl}" class="fav-item-img" alt="${item.title}">
            <div class="fav-item-info">
                <h2>${item.title}</h2>
                <p class="fav-category">Category: ${item.catogory}</p>
                <i class="fa-solid fa-heart fav-heart-icon" onclick="removeFav(${item.id})"></i>
            </div>
        </div>
        `;
    });

    favDom.innerHTML = favUI.join("");
}

function removeFav(id) {
    favoraitItems = favoraitItems.filter((item) => item.id !== id);
    localStorage.setItem("favoraiteProducts", JSON.stringify(favoraitItems));
    drawFavoriteProducts();
}

// تشغيل رسم الكل عند فتح الصفحة
updateAllCartViews();
drawFavoriteProducts();