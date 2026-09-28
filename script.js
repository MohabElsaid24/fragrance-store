let userinfo = document.getElementById("header-user-info");
let headerlinks = document.getElementById("header-links");
let userData = localStorage.getItem('loggedin');
let username = document.getElementById("user-name");
// 💡 تصحيح 1: إضافة فحص لمنع الـ Error إذا كان userData بـ null
let userDataString = userData ? JSON.parse(userData) : null; 
let logoutBtn = document.getElementById("logout-btn");
let cartProudcts = document.getElementById("carts-products");
let cartIcone = document.getElementById("cart-icone");
let addToCartBtn = document.querySelectorAll('.add-to-cart');
let haertIcone = document.querySelectorAll('.products-iconbtn i');

let products = [
    {id:1 , qty:1 , title:"versachi ", price:200, catogory:"winter" , imageurl:"images/diego-castaneda-zKWbz8JtOPQ-unsplash.jpg" },
    {id:2 , qty:1 , title:"Doir sauvage ", price:200, catogory:"winter" , imageurl:"images/dmitry-vechorko-JQWpwfrcSHg-unsplash.jpg" },
    {id:3 , qty:1 , title:"Ava mount ", price:200, catogory:"winter" , imageurl:"images/ahmadreza-rezaie-beNQcNPbdtk-unsplash.jpg" },
    {id:4 , qty:1 , title:"Thameen ", price:200, catogory:"winter" , imageurl:"images/beautinow-niche-perfume-4BgXng_ZGGo-unsplash.jpg" },
    {id:5 , qty:1 , title:"YSL ", price:200, catogory:"winter" , imageurl:"images//beautinow-niche-perfume-GUBEpWqSQjc-unsplash.jpg" },
    {id:6 , qty:1 , title:"Ms parfaume ", price:200, catogory:"winter" , imageurl:"images/hamza-nouasria-Kf4gB2rslgQ-unsplash.jpg" },
    {id:7 , qty:1 , title:"Acoua digio perfando ", price:200, catogory:"winter" , imageurl:"images/dorrell-tibbs-5FofiNyQKX4-unsplash.jpg" },
    {id:8 , qty:1 , title:"Hugo  ", price:200, catogory:"winter" , imageurl:"images/husien-bisky-0JN93XHMt9c-unsplash.jpg" },
    {id:9 , qty:1 , title:"Poison Girl ", price:200, catogory:"winter" , imageurl:"images/cristina-p-LTzftwDOIMs-unsplash.jpg" }
];

let productsDom = document.getElementById("products-items");
let productsInCart = localStorage.getItem("productsInCart");
let addedItem = productsInCart ? JSON.parse(productsInCart) : [];
let cartDom = document.getElementById('carts-items');
let badgeDom = document.getElementById('countter');
let serchInput = document.getElementById('search-input');
let favoraiteProducts = localStorage.getItem("favoraiteProducts");
let favoraitItems = favoraiteProducts ? JSON.parse(favoraiteProducts) : [];

if (serchInput) {
    serchInput.addEventListener("keyup", function(e) {
        let serchValue = e.target.value.toLowerCase().trim();
        let fillterProduct = products.filter((item) => {
            return item.title.toLowerCase().includes(serchValue);
        });
        drawProductsUI(fillterProduct);
    });
}

function drawProductsUI(allproduct = products) {
    let productsUI = allproduct.map((item) => {
        let isFav = favoraitItems.some((favItem) => favItem.id === item.id);
        let heartColor = isFav ? "red" : "black";
        return `
            <div class="products-iteminfo">
                <img src="${item.imageurl}" alt="">
                <h2>${item.title}</h2>
                <p>price: ${item.price}</p>
                <p>category: ${item.catogory}</p>
                <div class="products-iconbtn">
                    <i class="fa-solid fa-heart heart-icone" style="color: ${heartColor};" onclick="toggleHeart(event , ${item.id})"></i>
                    <button id="btn-${item.id}" class="add-btn" onclick="addToCart(event, ${item.id})">
                        ${addedItem.some(i => i.id === item.id) ? "Remove from cart" : "Add to cart"}
                    </button>
                </div>
            </div>
        `;
    });
    
    if (productsDom) productsDom.innerHTML = productsUI.join("");
}
drawProductsUI(products);

if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedin');
        window.location.reload();
    });
}

if (userData && userDataString) {
    if (username) username.innerHTML = `hello , ${userDataString.firstName}`;
    if (userinfo) userinfo.style.display = "block";
    if (headerlinks) headerlinks.style.display = "none";
} else {
    if (userinfo) userinfo.style.display = "none";
}

if (cartProudcts) {
    cartProudcts.addEventListener("click", function(e) {
        e.stopPropagation();
    });
}

if (cartIcone && cartProudcts) {
    cartIcone.addEventListener('click', function() {
        if (cartProudcts.style.display === "block") {
            cartProudcts.style.display = "none";
        } else {
            cartProudcts.style.display = "block";
        }
    });
}

// 💡 تصحيح 2: إضافة سطر localStorage.setItem لتخزين المنتجات عند الإضافة أو الحذف
function addToCart(e, id) {
    if (userData) {
        let choosedItem = products.find((item) => item.id === id);

        if (e.target.innerHTML.trim() === "Add to cart") {
            e.target.innerHTML = "Remove from cart";
            e.target.style.backgroundColor = "red";
            e.target.style.color = "white";
            
            addedItem.push(choosedItem);
        } else {
            e.target.innerHTML = "Add to cart";
            e.target.style.backgroundColor = "blue";
            addedItem = addedItem.filter((item) => item.id !== id);
        }

        // حفظ التغييرات فوراً في LocalStorage
        localStorage.setItem("productsInCart", JSON.stringify(addedItem));
        drwaCartUI();
    } else {
        window.location.href = "login.html";
    }
}

function toggleHeart(e, id) {
    if (userData) {
        let product = products.find((item) => item.id === id);
        let isFav = favoraitItems.some((item) => item.id === id);

        if (isFav) {
            favoraitItems = favoraitItems.filter((item) => item.id !== id);
            e.target.style.color = "black";
        } else {
            favoraitItems.push(product);
            e.target.style.color = "red";
        }

        localStorage.setItem("favoraiteProducts", JSON.stringify(favoraitItems));
    } else {
        window.location.href = "login.html";
    }
}

function drwaCartUI() {
    let totalQty = addedItem.reduce((acc, item) => acc + (item.qty || 1), 0);
    if (badgeDom) badgeDom.innerHTML = totalQty;

    updateButtonsUI();

    if (!cartDom) return;

    if (addedItem.length === 0) {
        cartDom.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    let cartUI = addedItem.map((item) => {
        let currentQty = item.qty || 1;
        return `
        <div class="carts-addeditems">
            <div class="items-details">
                <div><h4>${item.title}</h4></div>
                <div><span>price: $${item.price * currentQty}</span></div>
            </div>
            <div class="qty-control">
                <button class="reduce-product" onclick="reduceQty(${item.id})">-</button>
                <span>${currentQty}</span>
                <button class="add-product" onclick="addQty(${item.id})">+</button>
            </div>
        </div>
        `;
    });

    cartDom.innerHTML = cartUI.join("");
}
drwaCartUI();

function updateButtonsUI() {
    products.forEach((product) => {
        let btn = document.getElementById(`btn-${product.id}`);
        if (btn) {
            let isInCart = addedItem.some((item) => item.id === product.id);

            if (isInCart) {
                btn.innerHTML = "Remove from cart";
                btn.style.backgroundColor = "red";
                btn.style.color = "white";
            } else {
                btn.innerHTML = "Add to cart";
                btn.style.backgroundColor = "blue";
                btn.style.color = "white";
            }
        }
    });
}

function addQty(id) {
    let item = addedItem.find((item) => item.id == id);
    if (item) {
        item.qty = (item.qty || 1) + 1;
    }
    localStorage.setItem("productsInCart", JSON.stringify(addedItem));
    drwaCartUI();
}

function reduceQty(id) {
    let item = addedItem.find((i) => i.id == id);
    if (item) {
        if ((item.qty || 1) > 1) {
            item.qty -= 1;
        } else {
            addedItem = addedItem.filter((item) => item.id != id);
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(addedItem));
    drwaCartUI();
}