var idade;
function mudarPagina(){
    setTimeout("location.href = './Jogo.html';",1500);
    lerInstrucoes();
}
function test(){
    console.log('ola')
}
function lerInstrucoes(){
    idade = document.getElementById('idade').value;
    document.getElementById('iniciaJogo').disabled = false;
    document.getElementById('idosos').style.display = 'none';
    document.getElementById('adultos').style.display = 'none';
    document.getElementById('criancas').style.display = 'none';
    document.getElementById('alerta').style.display = 'none';
    localStorage.setItem('tipoPessoa', idade)
    if(idade == 1){
        document.getElementById('criancas').style.display = '';
    }else if(idade == 2){
        document.getElementById('adultos').style.display = '';
    }else if(idade == 3){
        document.getElementById('idosos').style.display = '';
    }else{
        document.getElementById('alerta').style.display = '';
        document.getElementById('iniciaJogo').disabled = true;
    }
}