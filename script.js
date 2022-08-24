let messages = [];
let newMessages = [];
let participants = [];
let nome = '';
let statusUpdate = undefined;
const scrollToBottom = document.querySelector('.chat');

function enterChat(){
    nome = {name: document.querySelector('.login-page input').value};
    if (nome.name !== '' && nome.name.length >= 3){
        const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
        toggleLoginPage();
        promisse.then(intervalControl);
        promisse.catch(resetLoginPage);
    }
    else if (nome.name !== ''){
        alert('Seu nome tem que possuir pelo menos 3 caracteres');
    }
    else{
        alert('Insira um nome para entrar no Chat');
    }
}

function intervalControl(){
    statusUpdate = setInterval(statusPost, 5000);
    requestChat();
}

function resetLoginPage(){
    toggleLoginPage();
    alert('O nome inserido já está em uso, insira outro');
    console.log('Nome já em uso');
}

function toggleLoginPage(){
    document.querySelector('.login-page > img').classList.toggle('hidden');
    document.querySelector('.login-page > div').classList.toggle('hidden');
    document.querySelector('.login-page > div').classList.toggle('login-input-show');
    document.querySelector('.login-page .loading').classList.toggle('hidden');
    document.querySelector('.login-page input').value = '';
    messages = [];
    newMessages = [];
    participants = [];
    statusUpdate = undefined;
}

function requestChat(){
    console.log('Nome enviado e aceito');
    const messagesPromisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    messagesPromisse.then(requestParticipants);
    messagesPromisse.catch(loadingMessagesFailed);
}

function addChat(){
    const newMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    newMessages.then(renderNewMessages);
    newMessages.catch(loadingNewMessagesFailed);
}

function renderNewMessages(promisse){
    let time = messages[messages.length - 1].time;
    let index = 0;
    for (let i = 0; i < promisse.data.length; i++){
        if (promisse.data[i].time === time){
            index = i;
        }
    }
    for (let  i = index + 1; i < promisse.data.length; i++){
        createMessageElement(promisse.data[i]);
    }
    messages = promisse.data;
    scrollBottom(scrollToBottom);
}

function scrollBottom(element) {
    element.scroll({ top: element.scrollHeight, behavior: "smooth"});
}

function loadingNewMessagesFailed(promisse){
    alert('Houve uma falha no carregamento das mensagens, você será redirecionado à página inicial');
    console.log('Falaha ao carregar novas mensagens');
    toggleLoginPage();
}

function statusPost(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    status.catch(statusFailed);
}

function statusFailed(promisse){
    statusUpdate.clearInterval();
    toggleLoginPage();
}

function loadingMessagesFailed(promisse){
    alert('Houve uma falha no carregamento das mensagens, você será redirecionado à página inicial');
    toggleLoginPage();
    console.log('Falha ao carregar as mensagens');
    clearInterval(statusUpdate);
}

function requestParticipants(promisse){
    messages = promisse.data;
    console.log(messages);
    const participantsPromisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participantsPromisse.then(renderChat);
    participantsPromisse.catch(loadingParticipantsFailed);
    console.log('Mensagens recebidas com sucesso');
}

function loadingParticipantsFailed(promisse){
    alert('Houve uma falha no carregamento dos participantes do chat, você será redirecionado à página inicial');
    toggleLoginPage();
    console.log('Falaha ao carregar os participantes');
    clearInterval(statusUpdate);
}

function renderChat(promisse){
    participants = promisse.data;
    console.log('Participantes carregados com sucesso');
    document.querySelector('.login-page .loading').classList.add('hidden');
    document.querySelector('.main-page').classList.remove('hidden');
    for (let i = 0; i < messages.length; i++){
        createMessageElement(messages[i]);
    }
    scrollBottom(scrollToBottom);
    setInterval(addChat, 3000);
}


function createMessageElement(message){
    let chat = document.querySelector('.chat');
    let messageElement = document.createElement('div');
    messageElement.classList.add('message');
    let timeElement = document.createElement('h1');
    timeElement.innerHTML = `(${message.time})`;
    messageElement.appendChild(timeElement);
    let messageSender = document.createElement('h2');
    messageSender.innerHTML = `${message.from}`;
    messageElement.appendChild(messageSender);
    if (message.type === 'status'){
        let statusMessage = document.createElement('h3');
        statusMessage.innerHTML = `${message.text}`;
        messageElement.appendChild(statusMessage);
        messageElement.classList.add('grey');
        chat.appendChild(messageElement);
    }
    else if (message.type === 'message'){
        let joiningText = document.createElement('h3');
        joiningText.innerHTML = `para`;
        messageElement.appendChild(joiningText);
        let messageRecipient = document.createElement('h2');
        messageRecipient.innerHTML = `${message.to}:`;
        messageElement.appendChild(messageRecipient);
        let messageContent = document.createElement('p');
        messageContent.innerHTML = `${message.text}`;
        messageElement.appendChild(messageContent);
        messageElement.classList.add('white');
        chat.appendChild(messageElement);
    }
    else if (message.type === 'private_message' && (message.to === nome || message.from === nome)){
        let joiningText = document.createElement('h3');
        joiningText.innerHTML = `reservadamente para`;
        messageElement.appendChild(joiningText);
        let messageRecipient = document.createElement('h2');
        messageRecipient.innerHTML = `${message.to}:`;
        messageElement.appendChild(messageRecipient);
        let messageContent = document.createElement('p');
        messageContent.innerHTML = `${message.text}`;
        messageElement.appendChild(messageContent);
        messageElement.classList.add('pink');
        chat.appendChild(messageElement);
    }
}

const loginInput = document.querySelector('.login-page > div > input');
loginInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector('.login-page > div > button').click();
    }
});

const messageInput = document.querySelector('.chat-input > input');
messageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector('.chat-input > button').click();
    }
});