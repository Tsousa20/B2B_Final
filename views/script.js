//copy menu for mobile
function copyMenu(){
    //copy inside .dpt-cat(department categories) to .departments
    var dptCategory = document.querySelector('.dpt-cat');
    var dptPlace = document.querySelector('.departments');
    dptPlace.innerHTML = dptCategory.innerHTML;

    //copy inside main nav to new nav
    var mainNav = document.querySelector('.header-nav nav');
    var navPlace = document.querySelector('.off-canvas nav');
    navPlace.innerHTML = mainNav.innerHTML;

    //copy .header-top .wrapper to .thetop-nav
    var topNav = document.querySelector('.header-top .wrapper');
    var topPlace = document.querySelector('.off-canvas .thetop-nav');
    topPlace.innerHTML = topNav.innerHTML;
}
copyMenu();

//show menu on mobile devices
const menuButton = document.querySelector('.trigger'),
      closeButton = document.querySelector('.t-close'),
      addclass = document.querySelector('.site');
menuButton.addEventListener('click', function(){
    addclass.classList.toggle('showmenu')
});
closeButton.addEventListener('click', function(){
    addclass.classList.remove('showmenu')
});


//show sub-menu on mobile devices
const submenu = document.querySelectorAll('.has-child .icon-small');
submenu.forEach((menu) => menu.addEventListener('click', toggle));

function toggle(e){
    e.preventDefault();
    submenu.forEach((item) => item != this ? item.closest('.has-child').classList.remove('expand') : null);
    if (this.closest('.has-child').classList != 'expand');
    this.closest('.has-child').classList.toggle('expand')
};

//slide-swipper (não mexer)
const swiper = new Swiper('.swiper', {
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },

});

//show search
const searchButton = document.querySelector('.t-search'),
      tClose = document.querySelector('.search-close'),
      showClass = document.querySelector('.site');

searchButton.addEventListener('click', function(){
    showClass.classList.toggle('showsearch')
});

tClose.addEventListener('click', function(){
    showClass.classList.remove('showsearch')
});


//show dpt menu
const dptButton = document.querySelector('.dpt-cat .dpt-trigger'),
      dptClass = document.querySelector('.site');
dptButton.addEventListener('click', function(){
    dptClass.classList.toggle('showdpt')
});

//product image slider
var productThumb = new Swiper ('.small-image', {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
        481: {
            spaceBetween: 32,
        }
    }
});

//slide-swipper (não mexer)
var productBig = new Swiper ('.big-image', {
    loop: true,
    autoHeight: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    thumbs: {
        swiper: productThumb,
    }
});

//stock products bar with percentage
var stocks = document.querySelectorAll('.products .stock');
for (let x = 0; x < stocks.length; x++){
    let stock = stocks[x].dataset.stock,
    available = stocks[x].querySelector('.qty-available').innerHTML,
    sold = stocks[x].querySelector('.qty-sold').innerHTML,
    percent = sold*100/stock;

    stocks[x].querySelector('.available').style.width = percent + '%';
};

//show cart on click
const divtoShow = '.mini-cart';
const divPopup = document.querySelector(divtoShow);
const divTrigger = document.querySelector('.cart-trigger');

divTrigger.addEventListener('click', () => {
    setTimeout(() => {
        if(!divPopup.classList.contains('show')){
            divPopup.classList.add('show')
        }
    }, 250)
})

//close by click outside
document.addEventListener('click', (e) => {
    const isClosest = e.target.closest(divtoShow);
    if(!isClosest && divPopup.classList.contains('show')){
        divPopup.classList.remove('show')
    }
})

// aumentar a quantidade no cart page-offer
function decreaseQuantity() {
    event.preventDefault();
    var quantityInput = document.querySelector('.input_quantity');
    var currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

function increaseQuantity() {
    event.preventDefault();
    var quantityInput = document.querySelector('.input_quantity');
    var currentQuantity = parseInt(quantityInput.value);
    quantityInput.value = currentQuantity + 1;
}

// Load More Button Page-Category
document.addEventListener('DOMContentLoaded', async () => {
    const DepartmentIdElement = document.getElementById('load-more-Depart');
    const DepartmentId = DepartmentIdElement.dataset.id;

    let offset = 12; // Começa depois dos primeiros 2 produtos
    const loadMoreButton = document.getElementById('load-more-Depart');
    const productsContainer = document.querySelector('.products.main.flexwrap');

    loadMoreButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/load-more-products/${DepartmentId}?offset=${offset}`);
            const { products, total } = await response.json();

            // Adiciona os produtos à lista existente na página
            appendProducts(products);

            offset += 12; // Incrementa o offset para a próxima requisição

            // Verifica se a quantidade de produtos retornados é menor que 2
            if (offset >= total) {
                loadMoreButton.style.display = 'none'; // Esconde o botão
            }
            
        } catch (error) {
            console.error('Erro ao carregar mais produtos:', error);
        }
    });
    function appendProducts(products) {
    // Loop pelos produtos e adiciona cada um à lista de produtos
        products.forEach(product => {
            const productHTML = `
                <div class="media">
                    <div class="thumbnail object-cover">
                        <a href="/page-single/${product.id}">
                            <img src="/assets/empresas_img/${product.main_img}" alt="">
                        </a>
                    </div>
                    <div class="hoverable">
                        <ul>
                            <li class="active"><a href="#"><i class="ri-heart-line"></i></a></li>
                            <li><a href="#"><i class="ri-shuffle-line"></i></a></li>
                        </ul>
                    </div>
                    ${product.is_promotion ? `<div class="discount circle flexcenter"><span>${product.discount_percentage}%</span></div>` : ''}
                </div>
                <div class="content">
                    <div class="rating">
                        <div class="stars">
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                        </div>
                        <span class="mini-text">(2,548)</span>
                    </div>
                    <h3><a href="/page-single/${product.id}">${product.product_name}</a></h3>
                    <div class="price">
                        <span class="current">${product.is_promotion ? product.formatted_promotion_price : product.formatted_price}${product.price_symbol}</span>
                        ${product.is_promotion ? `<span class="normal mini-text">${product.formatted_price}${product.price_symbol}</span>` : ''}
                    </div>
                    <div class="mini-text">
                        <p>By: ${product.company_name}</p>
                    </div>
                    <div class="footer">
                        <ul class="mini-text">
                            <li>Min. Order: ${product.min_order} un</li>
                            <li>Ready to Ship</li>
                        </ul>
                    </div>
                </div>  
            `;
            const productDiv = document.createElement('div');
            productDiv.classList.add('item');
            productDiv.innerHTML = productHTML;
            productsContainer.appendChild(productDiv);
        });
    }
});

// Load More Button Page-Sub_Category
document.addEventListener('DOMContentLoaded', async () => {
    const subDepartmentIdElement = document.getElementById('load-more-subDepart');
    const subDepartmentId = subDepartmentIdElement.dataset.id;

    let offset = 12; // Começa depois dos primeiros 2 produtos
    const loadMoreButton = document.getElementById('load-more-subDepart');
    const productsContainer = document.querySelector('.products.main.flexwrap');

    loadMoreButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/load-more-products-sub-departments/${subDepartmentId}?offset=${offset}`);
            const { products, total } = await response.json();

            // Adiciona os produtos à lista existente na página
            appendProducts(products);

            offset += 12; // Incrementa o offset para a próxima requisição

            // Verifica se a quantidade de produtos retornados é menor que 2
            if (offset >= total) {
                loadMoreButton.style.display = 'none'; // Esconde o botão
            }
            
        } catch (error) {
            console.error('Erro ao carregar mais produtos:', error);
        }
    });
    function appendProducts(products) {
    // Loop pelos produtos e adiciona cada um à lista de produtos
        products.forEach(product => {
            const productHTML = `
                <div class="media">
                    <div class="thumbnail object-cover">
                        <a href="/page-single/${product.id}">
                            <img src="/assets/empresas_img/${product.main_img}" alt="">
                        </a>
                    </div>
                    <div class="hoverable">
                        <ul>
                            <li class="active"><a href="#"><i class="ri-heart-line"></i></a></li>
                            <li><a href="#"><i class="ri-shuffle-line"></i></a></li>
                        </ul>
                    </div>
                    ${product.is_promotion ? `<div class="discount circle flexcenter"><span>${product.discount_percentage}%</span></div>` : ''}
                </div>
                <div class="content">
                    <div class="rating">
                        <div class="stars">
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                            <i class="ri-star-fill" style="color:orange"></i>
                        </div>
                        <span class="mini-text">(2,548)</span>
                    </div>
                    <h3><a href="/page-single/${product.id}">${product.product_name}</a></h3>
                    <div class="price">
                        <span class="current">${product.is_promotion ? product.formatted_promotion_price : product.formatted_price}${product.price_symbol}</span>
                        ${product.is_promotion ? `<span class="normal mini-text">${product.formatted_price}${product.price_symbol}</span>` : ''}
                    </div>
                    <div class="mini-text">
                        <p>By: ${product.company_name}</p>
                    </div>
                    <div class="footer">
                        <ul class="mini-text">
                            <li>Min. Order: ${product.min_order} un</li>
                            <li>Ready to Ship</li>
                        </ul>
                    </div>
                </div>  
            `;
            const productDiv = document.createElement('div');
            productDiv.classList.add('item');
            productDiv.innerHTML = productHTML;
            productsContainer.appendChild(productDiv);
        });
    }
});

// Adicionar automaticamente o preço de enetrega na página cart
document.addEventListener('DOMContentLoaded', function() {
    const deliveryTypeSpan = document.getElementById('delivery_type');
    const deliverySpeedSelect = document.getElementById('delivery_speed');
    const deliveryCountrySelect = document.getElementById('delivery_country');
    const deliveryPriceSpan = document.getElementById('delivery_price');
    const shippingElement = document.getElementById('shipping');
    const shippingSpeedElement = document.getElementById('shipping-speed');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const deliveryDateInput = document.getElementById('delivery_date');
    

    // Campos ocultos
    const cartSubtotalInput = document.getElementById('cart_subtotal_input');
    const cartShippingPriceInput = document.getElementById('cart_shipping_price_input');
    const cartTotalInput = document.getElementById('cart_total_input');
    const deliveryTypeInput = document.getElementById('delivery_type_input');

    function updateDeliveryPrice() {
        const selectedSpeed = deliverySpeedSelect.value;
        const selectedCountry = deliveryCountrySelect.value;

        // Envia uma solicitação AJAX para obter o preço da entrega
        fetch(`/get-delivery-price?speed=${selectedSpeed}&country=${selectedCountry}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const price = data.price.toFixed(2);
                    deliveryPriceSpan.textContent = `Price: ${data.price.toFixed(2)} €`;
                    shippingElement.textContent = `${data.price.toFixed(2)} €`;
                    shippingSpeedElement.textContent = `(${data.speed})`;
                    deliveryTypeSpan.textContent = `Delivery Type: ${data.deliveryType}`;

                    const earliestDate = new Date(data.earliestDate);
                    flatpickr(deliveryDateInput, {
                        minDate: earliestDate,
                        dateFormat: 'd-m-Y'
                    });

                    // Atualizar campo oculto de shipping
                    cartShippingPriceInput.value = price;
                    deliveryTypeInput.value = data.deliveryType;

                    updateTotal();
                } else {
                    deliveryPriceSpan.textContent = 'Price: €0.00';
                    shippingElement.textContent = '0.00 €';
                    shippingSpeedElement.textContent = '(Standart)';
                    deliveryTypeSpan.textContent = 'Delivery Type: Unknown';

                    // Atualizar campo oculto de shipping
                    cartShippingPriceInput.value = '0.00';
                }
            })
            .catch(error => {
                console.error('Erro ao obter o preço da entrega:', error);
            });
    }

    function updateTotal() {
        const subtotals = document.querySelectorAll('[id^="subtotal_item_"]');
        let subtotal = 0;
        subtotals.forEach(subtotalElement => {
            subtotal += parseFloat(subtotalElement.textContent.replace('€', '').trim());
        });
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`;

        // Atualizar campo oculto de subtotal
        cartSubtotalInput.value = subtotal.toFixed(2);

        const shipping = parseFloat(shippingElement.textContent.replace('€', '').trim());
        const total = subtotal + shipping;
        totalElement.innerHTML = `<strong>${total.toFixed(2)} €</strong>`;

        // Atualizar campo oculto de total
        cartTotalInput.value = total.toFixed(2);
    }

    function updateSubtotalItem(productId) {
        const quantityInput = document.getElementById(`quantity_${productId}`);
        const price = parseFloat(document.getElementById(`price_${productId}`).textContent.replace('€', '').trim());
        const quantity = parseInt(quantityInput.value);
        const subtotal = quantity * price;
        const subtotalElement = document.getElementById(`subtotal_item_${productId}`);
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`;
        updateTotal();
    }

    deliveryCountrySelect.addEventListener('change', updateDeliveryPrice);
    deliverySpeedSelect.addEventListener('change', updateDeliveryPrice);

    updateDeliveryPrice();


    document.querySelectorAll('.item-remove').forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();

            const productId = this.getAttribute('data-product-id');

            try {
                const response = await fetch('/remove-from-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                const result = await response.json();
                if (result.success) {
                    // Mostrar mensagem de confirmação
                    alert('Produto removido do carrinho.');

                    // Recarregar a página
                    window.location.reload();
                } else {
                    alert('Erro ao remover o produto do carrinho.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao remover o produto do carrinho.');
            }
        });
    });

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            increaseQuantityItem(productId);
        });
    });

    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            decreaseQuantityItem(productId);
        });
    });

    function decreaseQuantityItem(productId) {
        const quantityInput = document.getElementById('quantity_' + productId);
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateSubtotalItem(productId);
        }
    }

    function increaseQuantityItem(productId) {
        const quantityInput = document.getElementById('quantity_' + productId);
        let quantity = parseInt(quantityInput.value);
        quantity++;
        quantityInput.value = quantity;
        updateSubtotalItem(productId);
    }
    
});

// Mensagem de confirmação do carrinho
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutForm = document.getElementById('checkout-form');

    checkoutButton.addEventListener('click', function(event) {
        const confirmation = confirm("Do you want to submit your cart?");
        if (confirmation) {
            checkoutForm.submit();
        }
    });
});


// Remover artigos do icon de carrinho
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.item-remove-smallCart').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const productId = button.getAttribute('data-product-id');

            try {
                const response = await fetch('/remove-from-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                const result = await response.json();
                if (result.success) {
                    // Remover o item do DOM
                    button.closest('.item').remove();
                    
                    // Mostrar mensagem de confirmação
                    alert('Produto removido do carrinho.');
                } else {
                    alert('Erro ao remover o produto do carrinho.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao remover o produto do carrinho.');
            }
        });
    });
});









