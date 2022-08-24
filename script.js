function enterChat(){
    const nome = document.querySelector('.login-page').querySelector('input').value;
    if (nome !== null && nome.length >= 3){
        const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
        toggleLoginPage();
        promisse.then(renderChat);
        promisse.catch(resetLoginPage);
    }
    else if (nome !== null){
        alert('Seu nome tem que possuir pelo menos 3 caracteres');
    }
    else{
        alert('Insira um nome para entrar no Chat');
    }
}

function resetLoginPage(){
    toggleLoginPage();
    alert('O nome inserido já está em uso, insira outro');
}

function toggleLoginPage(){
    document.querySelector('.login-page > img').classList.toggle('hidden');
    document.querySelector('.login-page > div').classList.toggle('hidden');
    document.querySelector('.login-page > div').classList.toggle('login-input-show');
    document.querySelector('.login-page > :nth-child(3)').classList.toggle('hidden');
}

function renderChat(){
    
}