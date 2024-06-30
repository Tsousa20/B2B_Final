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