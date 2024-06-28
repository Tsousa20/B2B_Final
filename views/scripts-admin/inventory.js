// ADD/REMOVE PRODUCT FORM
document.getElementById('toggleAddProductFormButton').addEventListener('click', function() {
    var form = document.getElementById('addProductForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('toggleDeleteProductFormButton').addEventListener('click', function() {
    var form = document.getElementById('deleteProductForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('toggleAddProductPromotion').addEventListener('click', function() {
    var form = document.getElementById('addProductPromotion');

    if (form.style.display === 'none') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('toggleRemoveProductPromotion').addEventListener('click', function() {
    var form = document.getElementById('removeProductPromotion');

    if (form.style.display === 'none') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de edição
    const editButtons = document.querySelectorAll('.tableBtnEdit');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {

            // Mostra o formulário de edição
            const form = document.getElementById('editTableProducts');
            if (form.style.display === 'none' || form.style.display === '') {
                form.style.display = 'block';
                form.scrollIntoView({ behavior: 'smooth' });
            } else {
                form.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de edição
    const editButtons = document.querySelectorAll('.tableBtnEditPromo');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {

            // Mostra o formulário de edição
            const form = document.getElementById('editTableProductsPromotion');
            if (form.style.display === 'none' || form.style.display === '') {
                form.style.display = 'block';
                form.scrollIntoView({ behavior: 'smooth' });
            } else {
                form.style.display = 'none';
            }
        });
    });
});


// EDIT FORM
document.getElementById('field_to_edit').addEventListener('change', function() {
    var selectedField = this.value;

    // Hide all edit fields
    document.querySelectorAll('.input-field-addProduct').forEach(function(element) {
        if (!element.querySelector('select')) {
            element.classList.add('hidden');
        }
    });

    // Show the selected field
    if (selectedField) {
        document.getElementById('edit_' + selectedField).classList.remove('hidden');
    }
});

document.getElementById('toggleFormButton').addEventListener('click', function() {
    var form = document.getElementById('editTableProducts');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});
