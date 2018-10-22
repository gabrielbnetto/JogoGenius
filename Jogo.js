var game = (function() {

  /**
    Pedro Abs 24/10/2012
    Conceitos utilizados neste programa:
        - Programação Orientada a Objetos em Javascript;
        - Prototype inheritance;
        - Adicionando métodos dinamicamente a objetos da arvore DOM;
        - Disparando eventos customizados;
        - Chamando uma função em um contexto específico 'function call';
        - Função de execução imediata;
        - Usando funções para definir escopo;
        - Protegendo funções para que sempre sejam utilizadas com o operador New;
	- Recursividade.
    */

  function Genius() {
    // Programação defensiva: mesmo que a função seja chamada sem o 'new' ela irá executar como se tivesse sido
    // chamada com new.
    if (!(this instanceof Genius)) {
      return new Genius();
    }

    // inicializa variáveis
    this.sequence = []; // sequencia que o Jogo executará
    this.digited = []; // sequencia que o usuário vai digitando.
    this.currentConsumed = 0; // posição em que o usuário está na sequência do jogo.

    // EVENTOS:
    // quando o usuário erra a sequência apresentada pelo jogo
    this.onWrongSequence = undefined;

    // já pré configura o evento que é disparado quando a sequência digitada é correta
    this.onRightSequence = function() {
      if (this.currentConsumed >= this.sequence.length - 1) {
        this.onWin instanceof Function ? this.onWin(this.currentConsumed + 1) : '';
        return;
      }
      //alert('Próxima sequência...');
      this.currentConsumed++;
      this.executeSequence();
    };

    // quando o usuário acerta toda a sequência apresentada pelo jogo.
    this.onWin = undefined;


    //Inicializa a interface setando eventos e atribuindo métodos.
    function init() {
      // this = genius: abaixo (fora desta função) a chamamos assim: init.call(this);
      var genius = this;

      var divs = document.getElementsByTagName("div");

      for (var i = 0, max = divs.length; i < max; i++) {
        var div = divs[i];

        if (div.className.search("peca") >= 0) {
          var peca = div;

          //adicionando piscador na peça [div]
          peca.blink = function() {
            //aqui, this representa a própria peça
            var peca = this;

            // variável que serve para 'blinkar' a peça.
            peca.toggle = true;

            // resetando o setInterval (se já existir para esta peça).
            window.clearInterval(peca.interval);

            // iniciando um novo setInterval.
            peca.interval = window.setInterval(function() {
              if (peca.toggle) {
                // evento beforeBlink que pode ou não ser codificado
                // só será executado se diferente de undefined
                peca.beforeBlink instanceof Function ? peca.beforeBlink(peca, genius) : '';
                var sel = peca.getAttribute("sel");
                peca.className = "peca " + sel;
                // faz a condição  passar para o else na próxima execução de setInterval
                peca.toggle = false;
              } else {
                var unsel = peca.getAttribute("unsel");
                peca.className = "peca " + unsel;
                // remove o setInterval, que faz a peça piscar
                window.clearInterval(peca.interval);
                // evento afterBlink que pode ou não ser codificado
                // só será executado se diferente de undefined
                peca.afterBlink instanceof Function ? peca.afterBlink(peca, genius) : '';
              }

            }, 250);
          };


          // seta evento
          peca.onmousedown = function() {
            // this é a peça atual
            var sel = this.getAttribute("sel");
            this.className = "peca " + sel;
          };

          // seta evento
          peca.onmouseup = function() {
            // this é a peça atual
            var unsel = this.getAttribute("unsel");
            this.className = "peca " + unsel;
          };

          // seta outros eventos só para garantir
          peca.ondragstart = peca.onmouseup;
          peca.ondragover = peca.onmouseup;
          peca.onblur = peca.onmouseup;

          // seta evento
          peca.onclick = function() {

            // this é a peça atual
            var id = this.id.charAt(4);
            id = window.parseInt(id);
            // adiciona na sequencia digitada o id
            genius.digited.push(id);
            //console.info('console.info ' + genius.digited.toString());
            if (genius.verify() === false) {
              // dispara o evento de sequencia errada
              genius.onWrongSequence instanceof Function ? genius.onWrongSequence(genius.currentConsumed + 1) : '';
            } else {
              // se tivermos terminado de digitar a sequencia toda
              if (genius.digited.length === genius.currentConsumed + 1) {
                // dispara o evento de sequencia correta
                genius.onRightSequence instanceof Function ? genius.onRightSequence() : '';
                // reseta o acumulador de sequencia digitada
                genius.digited = [];
              }
            }
          };
        }
      }
    };

    // chama a função inicializadora no contexto do Genius.
    init.call(this);
  };


  /**
  Recursividade abaixo
  */
  Genius.prototype.showAllSequence = function() {
    var genius = this;
    var pc = document.getElementById('peca' + genius.sequence[genius.currentConsumed]);
    // atribuimos a uma variável 'i'  para não modificar o valor original da propriedade.
    var i = genius.currentConsumed;

    // define o evento (abaixo, recursividade)
    pc.afterBlink = function(peca, genius) {
      // próxima peça na sequência de genius
      ++i;
      var pc1 = document.getElementById('peca' + genius.sequence[i]);
      // se a 'próxima peça' existir então...
      if (pc1 !== null) {
        // define o evento de maneira recursiva
        pc1.afterBlink = pc.afterBlink;
        // pisca a próxima peça (que chamará este evento de maneira recursiva )
        pc1.blink();
      }
    }

    //starta o processo
    pc.blink();
  };



  Genius.prototype.executeSequence = function() {
    var genius = this;
    var i = 0;

    document.getElementById("seq_num").innerHTML = genius.currentConsumed;


    var pc = document.getElementById('peca' + genius.sequence[i]);
    // atribuimos a uma variável 'i'  para não modificar o valor original da propriedade.


    // define o evento (abaixo, recursividade)
    pc.afterBlink = function(peca, genius) {
      // próxima peça na sequência de genius
      ++i;

      // vai mostrando até a sequência certa somada pelo jogador
      if (i > genius.currentConsumed) {
        return;
      }

      var pc1 = document.getElementById('peca' + genius.sequence[i]);
      // se a 'próxima peça' existir então...
      if (pc1 !== null) {
        // define o evento de maneira recursiva
        pc1.afterBlink = pc.afterBlink;
        // pisca a próxima peça (que chamará este evento de maneira recursiva )
        pc1.blink();
      }
    }

    //inicia o processo
    pc.blink();
  };

  // O propósito deste método é comparar o que foi digitado com a sequência original
  Genius.prototype.verify = function() {
    var ret = true;
    for (var i = 0; i <= this.digited.length - 1; i++) {
      var digitado = this.digited[i];
      var original = this.sequence[i];

      ret = ret && (digitado === original);

      // Se for false, lança imediatamente o erro e já sai da função. Não precisa nem continuar verificando
      if (ret === false) {
        return false;
      }
    }
    // Se não lançou o false então é true.
    return true;
  };

  /* Se eu definir o 'new Genius()' aqui (abaixo), ele será chamado antes do evento window.onload ...
      a consequência disso é que as divs não estarão prontas na DOM e o sintaxe (contida na function init)

          var divs = document.getElementsByTagName("div");

      não funcionará
  */
  var genius = undefined;

  return {
    newGame: function(sequence, show) {
      //var seq = sequence === undefined ? 1000 : sequence;
      var seq = 1000;
      //... por isso eu defino 'new Genius()' aqui, pois eu chamarei esta função apenas no window.onload, conforme abaixo.
      genius = new Genius();

      // gera sequência (do jogo)
      for (var i = 0; i < seq; i++) {
        var x = (Math.round(Math.random() * 4));
        if (x > 0 && x <= 4) {
          genius.sequence.push(x);
        }
      }

      if (show) {
        document.getElementById('sequencia').innerHTML = genius.sequence;
      } else {
        document.getElementById('sequencia').innerHTML = '';
      }

      genius.executeSequence();

    },
    showAllSequence: function() {
      genius.showAllSequence();
    },
    defineOnWrongSequenceEvent: function(evt) {
      genius.onWrongSequence = evt;
    },
    defineOnWinEvent: function(evt) {
      genius.onWin = evt;
    }
  }
}());

window.onload = function() {
  mudaLayout();
  //game.newGame(4);
  //game.showAllSequence();
  document.getElementById("results").hidden = true;
  document.getElementById("close").onclick = function() {
    document.getElementById('myModal').style.display = "none";
  }
  document.getElementById("cmdNewGame").onclick = function() {
    if (true){ //window.confirm("Você está pronto?")) {
      var repet = 1000; //document.getElementById("txtQtdRepeticoes").value;
      var show = false; //document.getElementById("chkShowSequence").checked;
      game.newGame(repet, show);

      document.getElementById("cmdNewGame").hidden = true;
      document.getElementById("results").hidden = false;

      game.defineOnWrongSequenceEvent(
        function(quantidade) {
          //alert('Sequência errada ' + quantidade);
          document.getElementById('textoFinal').innerHTML = "Seu número de acertos foi: " + (quantidade-1);
          document.getElementById('myModal').style.display = 'block';
          document.getElementById("cmdNewGame").hidden = false;
          document.getElementById("results").hidden = true;
        }
      );
      game.defineOnWinEvent(
        function(qtd) {
          alert('*** Parabéns, você venceu !!! *** \n\nacertou: ' + qtd);
          document.getElementById("cmdNewGame").hidden = false;
          document.getElementById("results").hidden = true;
          labels.forEach(function(label) {
            label.hidden = true;
          });
        }
      );
    }
  }
}

function mudaLayout(){
  var tipoPessoa = localStorage.getItem('tipoPessoa');
  console.log(tipoPessoa);
}
