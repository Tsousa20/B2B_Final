//Liked Products
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os ícones de "like"
    const likeIcons = document.querySelectorAll('.like-icon');

    likeIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            const productId = this.getAttribute('data-product-id');
            console.log(`Product ID: ${productId}`);

            fetch('/addLikedProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added to your Liked Products List!');
                } else {
                    console.error(message);
                }
            })
            .catch(error => console.error('Error liking product:', error));
        });
    });
});

function openFAQQuestion(id) {
    var element = document.getElementById(id);
    if (element) {
        element.checked = true; // marca a checkbox para abrir a resposta
        element.scrollIntoView({ behavior: 'smooth', block: 'start' }); // rolar até a questão
    }
}

document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchTerm = event.target.value.trim(); // Obter o termo de busca

    // Verificar se o termo de busca é vazio
    if (searchTerm === '') {
        hideSearchResults(); // Ocultar resultados se o campo estiver vazio
        return;
    }

    // Fazer requisição AJAX para buscar produtos
    fetch(`/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displaySearchResults(data.products); // Exibir os resultados da busca
            } else {
                console.error('Erro ao buscar produtos:', data.message);
                alert('Erro ao buscar produtos. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição. Por favor, tente novamente mais tarde.');
        });
});

// Função para exibir os resultados da busca
function displaySearchResults(products) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // Limpar resultados anteriores

    products.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');

        const img = document.createElement('img');
        img.src = `/assets/empresas_img/${product.main_img}`; // Definir o src da imagem
        img.classList.add('product-image');

        
        const text = document.createElement('p');
        text.textContent = `${product.product_name} - ${product.product_reference}`;
        text.classList.add('product-details');

        resultItem.appendChild(img);
        resultItem.appendChild(text);
        
        
        // Adicionar evento de clique para selecionar o produto
        resultItem.addEventListener('click', function() {
            navigateToProductDetail(product.id); // Redirecionar para a página de detalhes do produto
        });

        searchResultsContainer.appendChild(resultItem);
    });

    showSearchResults(); // Mostrar resultados de busca
};

// Função para mostrar os resultados de busca
function showSearchResults() {
    document.getElementById('searchResults').style.display = 'block';
};

// Função para ocultar os resultados de busca
function hideSearchResults() {
    document.getElementById('searchResults').style.display = 'none';
};

function navigateToProductDetail(productId) {
    window.location.href = `/page-single/${productId}`;
};