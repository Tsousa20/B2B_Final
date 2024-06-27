//MESSAGE RECEIVED
document.getElementById('viewMessageIcon').addEventListener('click', function() {
    var form = document.getElementById('messageCard');
    var cardMessageInfo = document.getElementById('cardMessageInfo');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        cardMessageInfo.classList.add('highlight');
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeMessageIcon').addEventListener('click', function() {
    var form = document.getElementById('messageCard');
    form.style.display = 'none';
});

//MESSAGE SENT
document.getElementById('viewMessageSentIcon').addEventListener('click', function() {
    var form = document.getElementById('messageSentCard');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeMessageSentIcon').addEventListener('click', function() {
    var form = document.getElementById('messageSentCard');
    form.style.display = 'none';
});

//REPLY FORM
document.getElementById('replyMessageIcon').addEventListener('click', function() {
    var form = document.getElementById('replyMessageForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

//NEW MESSAGE
document.getElementById('newMessage').addEventListener('click', function() {
    var form = document.getElementById('newMessageForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});

document.getElementById('closeFormNewMessage').addEventListener('click', function() {
    var form = document.getElementById('newMessageForm');
    form.style.display = 'none';
});