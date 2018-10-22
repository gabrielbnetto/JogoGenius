var idade;
var cond = true;
function mudarPagina(){
    setTimeout("location.href = './Jogo.html';",1500);
}
function lerInstrucoes(){
    alert('Entrou')
    idade = document.getElementById('idade').value;
    if(idade == 1){
        document.getElementById('idosos').style.display = 'none';
        document.getElementById('adultos').style.display = 'none';
    }else if(idade == 2){
            document.getElementById('criancas').style.display = 'none';
            document.getElementById('idosos').style.display = 'none';
    }else if(idade == 3){
        document.getElementById('criancas').style.display = 'none';
        document.getElementById('adultos').style.display = 'none';
    }
    alert(idade)
}