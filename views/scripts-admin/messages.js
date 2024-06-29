//MESSAGE RECEIVED
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de edição
    const viewButtons = document.querySelectorAll('.viewMessageIcon');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const messageId = this.getAttribute('data-message-id');


            fetch(`/message/${messageId}`)
                .then(response => response.json())
                .then(data => {
                    // Atualiza o conteúdo do messageCard com os dados da mensagem recebida
                    const messageCard = document.getElementById('messageCard');
                    const messageH4 = messageCard.querySelector('.message-h4');
                    const messageContent = messageCard.querySelector('p');

                    messageH4.innerHTML = `
                        <h4>From: ${data.sender}</h4>
                        <h4>Title: ${data.title}</h4>
                        <h4>Date: ${data.message_date}</h4>
                    `;
                    messageContent.textContent = data.content;

                    // Mostra o messageCard
                    if (messageCard.style.display === 'none' || messageCard.style.display === '') {
                        messageCard.style.display = 'block';
                        messageCard.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        messageCard.style.display = 'none';
                    }
                })
                .catch(error => console.error('Erro ao buscar detalhes da mensagem:', error));
        });
    });
    
});



document.getElementById('closeMessageIcon').addEventListener('click', function() {
    var form = document.getElementById('messageCard');
    form.style.display = 'none';
});

document.getElementById('closeMessageSentIcon').addEventListener('click', function() {
    var form = document.getElementById('messageSentCard');
    form.style.display = 'none';
});

//MESSAGE SENT
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de edição
    const viewButtons = document.querySelectorAll('.viewMessageSentIcon');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const messageId = this.getAttribute('data-message-id');


            fetch(`/message/${messageId}`)
                .then(response => response.json())
                .then(data => {
                    // Atualiza o conteúdo do messageCard com os dados da mensagem recebida
                    const messageCard = document.getElementById('messageSentCard');
                    const messageH4 = messageCard.querySelector('.message-h4');
                    const messageContent = messageCard.querySelector('p');

                    messageH4.innerHTML = `
                        <h4>To: ${data.recipient_name}</h4>
                        <h4>Title: ${data.title}</h4>
                        <h4>Date: ${data.formatted_message_date}</h4>
                    `;
                    messageContent.textContent = data.content;

                    // Mostra o messageCard
                    if (messageCard.style.display === 'none' || messageCard.style.display === '') {
                        messageCard.style.display = 'block';
                        messageCard.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        messageCard.style.display = 'none';
                    }
                })
                .catch(error => console.error('Erro ao buscar detalhes da mensagem:', error));
        });
    });
    
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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sendMessageForm');
    const companyInput = document.getElementById('company_name');
    const titleInput = document.getElementById('title');
    const msgContentInput = document.getElementById('msg_content');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const company_name = companyInput.value;
        const title = titleInput.value;
        const msg_content = msgContentInput.value;

        // Envia os dados do formulário para a rota sendMessage
        fetch('/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ company_name, title, msg_content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.message);
                
            }
        })
        .catch(error => console.error('Error sending message:', error));
    });
});
