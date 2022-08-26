let messages = [];
let newMessages = [];
let participants = [];
let nome = '';
let statusUpdate = undefined;
const scrollToBottom = document.querySelector('.chat');
let selectedContact = document.querySelector('.contacts > .selected');
let selectedVisibility = document.querySelector('.visibilities > .selected');
let messageToSend = {from: '', to: '', text: '', type: ''};

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
    window.location.reload();
}

function statusPost(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
    status.catch(statusFailed);
}

function statusFailed(promisse){
    statusUpdate.clearInterval();
    alert('Falha ao enviar status para o servidor, você será redirecionado à página inicial');
    window.location.reload();
}

function loadingMessagesFailed(promisse){
    alert('Houve uma falha no carregamento das mensagens, você será redirecionado à página inicial');
    window.location.reaload();
    console.log('Falha ao carregar as mensagens');
}

function requestParticipants(promisse){
    messages = promisse.data;
    console.log(messages);
    const participantsPromisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participantsPromisse.then(render);
    participantsPromisse.catch(loadingParticipantsFailed);
    console.log('Mensagens recebidas com sucesso');
}

function loadingParticipantsFailed(promisse){
    alert('Houve uma falha no carregamento dos participantes do chat, você será redirecionado à página inicial');
    window.location.reload();
    console.log('Falaha ao carregar os participantes');
}

function render(promisse){
    participants = promisse.data;
    console.log('Participantes carregados com sucesso');
    document.querySelector('.login-page .loading').classList.add('hidden');
    document.querySelector('.main-page').classList.remove('hidden');
    for (let i = 0; i < messages.length; i++){
        createMessageElement(messages[i]);
    }
    for (let i = 0; i < participants.length; i++){
        if (participants[i].name === nome.name){
            continue;
        }
        createParticipantElement(participants[i]);
    }
    scrollBottom(scrollToBottom);
    setInterval(addChat, 3000);
    setInterval(participantsControl, 10000);
}


function createMessageElement(message){
    const chat = document.querySelector('.chat');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const timeElement = document.createElement('h1');
    timeElement.innerHTML = `(${message.time})`;
    messageElement.appendChild(timeElement);
    const messageSender = document.createElement('h2');
    messageSender.innerHTML = `${message.from}`;
    messageElement.appendChild(messageSender);
    if (message.type === 'status'){
        const statusMessage = document.createElement('h3');
        statusMessage.innerHTML = `${message.text}`;
        messageElement.appendChild(statusMessage);
        messageElement.classList.add('grey');
        chat.appendChild(messageElement);
    }
    else if (message.type === 'message'){
        const joiningText = document.createElement('h3');
        joiningText.innerHTML = `para`;
        messageElement.appendChild(joiningText);
        const messageRecipient = document.createElement('h2');
        messageRecipient.innerHTML = `${message.to}:`;
        messageElement.appendChild(messageRecipient);
        const messageContent = document.createElement('p');
        messageContent.innerHTML = `${message.text}`;
        messageElement.appendChild(messageContent);
        messageElement.classList.add('white');
        chat.appendChild(messageElement);
    }
    else if (message.type === 'private_message' && (message.to === nome.name || message.from === nome.name)){
        const joiningText = document.createElement('h3');
        joiningText.innerHTML = `reservadamente para`;
        messageElement.appendChild(joiningText);
        const messageRecipient = document.createElement('h2');
        messageRecipient.innerHTML = `${message.to}:`;
        messageElement.appendChild(messageRecipient);
        const messageContent = document.createElement('p');
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

function toggleSidebar(){
    document.querySelector('.sidebar').classList.toggle('hidden');
    document.querySelector('.blur').classList.toggle('hidden');
    document.querySelector('.blur').classList.toggle('block');
}

function selectContact(newSelected){
    if (selectedContact === newSelected){
        return;
    }
    const selectedCheckmark = selectedContact.querySelector('.check');
    const newCheckmark = newSelected.querySelector('.hidden');
    selectedContact.classList.remove('selected');
    selectedCheckmark.classList.remove('check');
    selectedCheckmark.classList.add('hidden');
    newSelected.classList.add('selected');
    newCheckmark.classList.remove('hidden');
    newCheckmark.classList.add('check');
    selectedContact = newSelected;
}

function selectVisibility(newSelected){
    if (selectedVisibility === newSelected){
        return;
    }
    const selectedCheckmark = selectedVisibility.querySelector('.check');
    const newCheckmark = newSelected.querySelector('.hidden');
    selectedVisibility.classList.remove('selected');
    selectedCheckmark.classList.remove('check');
    selectedCheckmark.classList.add('hidden');
    newSelected.classList.add('selected');
    newCheckmark.classList.remove('hidden');
    newCheckmark.classList.add('check');
    selectedVisibility = newSelected;
}

function createParticipantElement(participant){
    const contacts = document.querySelector('.contacts');
    const participantElement = document.createElement('div');
    participantElement.classList.add('contact');
    participantElement.setAttribute('onclick', 'selectContact(this)');
    const divElement = document.createElement('div');
    const mainIconElement = document.createElement('ion-icon');
    mainIconElement.setAttribute('name', 'people-sharp');
    divElement.appendChild(mainIconElement);
    const name = document.createElement('h2');
    name.innerHTML = `${participant.name}`;
    divElement.appendChild(name);
    participantElement.appendChild(divElement);
    const checkmark = document.createElement('ion-icon');
    checkmark.setAttribute('name', 'checkmark-sharp');
    checkmark.classList.add('hidden');
    participantElement.appendChild(checkmark);
    contacts.appendChild(participantElement);
}

function sendMessage(){
    if (document.querySelector('.chat-input input').value !== ''){
        messageToSend.from = nome.name;
        messageToSend.to = selectedContact.querySelector('h2').innerHTML;
        messageToSend.text = document.querySelector('.chat-input input').value;
        if (selectedVisibility.querySelector('h2').innerHTML === 'Pública'){
            messageToSend.type = 'message';
        }
        else{
            messageToSend.type = 'private_message';
        }
        if (messageToSend.to === 'Todos' && messageToSend.type === 'private_message'){
            alert('Você não pode enviar mensagens reservadas para todos os participantes!');
            return;
        }
        const sentMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageToSend);
        sentMessage.then(resetMessage);
    }
}

function resetMessage(promisse){
    document.querySelector('.chat-input input').value = '';
    addChat();
}

function participantsControl(){
    const newParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    newParticipants.then(renderParticipants);
    newParticipants.catch(loadingNewParticipantsFailed);
}

function loadingNewParticipantsFailed(){
    alert('Falha ao recarregar os usuários do chat, você será redirecionado à página inicial');
    window.location.reload();
}

function renderParticipants(promisse){
    let renderedContacts = document.querySelectorAll('.contact');
    let selectedName = '';
    for (let i = renderedContacts.length - 1; i > 0; i--){
        if (renderedContacts[i].classList.contains('selected')){
            selectedName = renderedContacts[i].querySelector('h2').innerHTML;
            continue;
        }
        renderedContacts[i].remove();
    }
    participants = promisse.data;
    for (let i = 0; i < participants.length; i++){
        if (participants[i].name === nome.name || participants[i].name === selectedName){
            continue;
        }
        createParticipantElement(participants[i]);
    }
}