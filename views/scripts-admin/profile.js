// ALTER IMAGE
document.getElementById('btnAlterImageForm').addEventListener('click', function() {
    var form = document.getElementById('alterImageForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterImage').addEventListener('click', function() {
    var form = document.getElementById('alterImageForm');
    form.style.display = 'none';
});

// ALTER CONTACT
document.getElementById('btnAlterContactForm').addEventListener('click', function() {
    var form = document.getElementById('alterContactForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterContact').addEventListener('click', function() {
    var form = document.getElementById('alterContactForm');
    form.style.display = 'none';
});

// ALTER NAME
document.getElementById('btnAlterNameForm').addEventListener('click', function() {
    var form = document.getElementById('alterNameForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterName').addEventListener('click', function() {
    var form = document.getElementById('alterNameForm');
    form.style.display = 'none';
});

// ALTER ADDRESS
document.addEventListener('DOMContentLoaded', function() {
    const deliveryCountrySelect = document.getElementById('delivery_country');

    fetch('/api/countries')
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name;
                option.textContent = country.name;
                deliveryCountrySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os países:', error);
        });
});

document.getElementById('btnAlterAdressForm').addEventListener('click', function() {
    var form = document.getElementById('alterAdressForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterAdress').addEventListener('click', function() {
    var form = document.getElementById('alterAdressForm');
    form.style.display = 'none';
});

// ALTER EMAIL
document.getElementById('btnAlterEmailForm').addEventListener('click', function() {
    var form = document.getElementById('alterEmailForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterEmail').addEventListener('click', function() {
    var form = document.getElementById('alterEmailForm');
    form.style.display = 'none';
});

// ALTER DESCRIPTION
document.getElementById('btnAlterDescriptionForm').addEventListener('click', function() {
    var form = document.getElementById('alterDescriptionForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterDescription').addEventListener('click', function() {
    var form = document.getElementById('alterDescriptionForm');
    form.style.display = 'none';
});

// ALTER PASSWORD
document.getElementById('btnAlterPasswdForm').addEventListener('click', function() {
    var form = document.getElementById('alterPasswdForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormAlterPasswd').addEventListener('click', function() {
    var form = document.getElementById('alterPasswdForm');
    form.style.display = 'none';
});

