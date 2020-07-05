// Mapa com todos os formatos de tetrominó possível
shapes = {
  // Array com todas as possibilidades de rotação de um tetrominó
  line:[
    ["b1","b2","b3","b4"],
    ["a2","b2","c2","d2"],
    ["c1","c2","c3","c4"],
    ["a3","b3","c3","d3"],
  ],
  s:[
    ["a3","b2","b3","c2"],
    ["a1","a2","b2","b3"],
    ["a2","b1","b2","c1"],
    ["b1","b2","c2","c3"],
  ],
  j:[
    ["a2","b2","c2","c3"],
    ["b3","c1","c2","c3"],
    ["a2","a3","b3","c3"],
    ["b1","b2","b3","c1"],
  ],
  square:[
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
  ],
}

//Exemplo de um tetrominó
var tetromino = {
  x: 125,
  y: -66,
  width: 66,
  height: 66,
  currentIndex: 0,
  currentShape: [],
}

// Variável indicando tipos de movimento que serão usados nas funções a seguir.
var moveLeft = false, 
    moveRight = false, 
    isFixed = false;
    isPaused = false;

var pieces = [],
    piecesIndex = 0;

// Canvas do jogo principal
var canvas = document.getElementById("main-game");
var ctx = canvas.getContext('2d');

// Canvas da peça que viria em seguida
var nxt = document.getElementById("next-tetromino");
var ctxNxt = nxt.getContext('2d');

/**
 * Cria um novo tetromino
 *
 * @param {*} x - O valor da peça na coordenada X
 * @param {*} y - O valor da peça na coordenada Y
 * @param {*} width - Largura da peça
 * @param {*} height - Altura da peça
 */
function Piece(x, y, width, height, shape) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.shape = shape;

  this.update = function(){
    if(this.y < 500 - this.height){
      this.y += 1;
    }else{
      isFixed = true;
      gameFlow();      
    }
    draw(this.x, this.y, this.shape, ctx);
  }
  
  this.setShape = function(newShape) {
    this.shape = newShape
    this.update()
  }
}

// Gera-se a próxima peça
var nextPiece = genNextPiece();

// Desenha-se essa nova peça gerada
draw(nxt.width / 2 - 33, 50, nextPiece, ctxNxt);

var curPiece = genNextPiece();

// Cria-se um objeto para essa peça e o joga no main game.


//pieces.push(new Piece(tetromino.x, tetromino.y, tetromino.width, tetromino.height, curPiece));

/**
 * Renderiza o jogo
*/
function render() {
  if(!isPaused){
    requestAnimationFrame(render);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    pieces[piecesIndex].update();
  }
}

/**
 * Desenha-se um objeto para o canvas.
 * 
 * @param {number} dx - Tamanho da peça em X
 * @param {number} dy - Tamanho da peça em Y
 * @param {array} shape - Shape da peça
 * @param {HTMLElement} context - Context do canvas no qual se insere a peça.
 * @param {number} center - Centro do canvas
 */
function draw(dx, dy, shape, context, center=198) {
  var x = dx, y = dy
  // If e Else ainda meio inúteis, mas alguma hora, usaremos para escrever o nextPiece no meio
  if(center != 198) {
    console.log("nextPiece")
  } else {
    console.log("curPiece")
  }
  for(var row = 0; row < 4; row++) {
    var column = 0;
    for(column = 0; column < 4;column++) {

      if(shape[row][column] != 0){
        context.fillRect(x, y, 33, 33);
        context.fillStyle = 'black';
      }
      x += 33;
    }
    x = dx;
    y+=33;
  }
}

/**
 * Decodifica os endereços em formato "batalha naval" para uma matriz correspondente
 * @params shapeArray {String[]} - String com os formatos batalha naval.
 * @returns {Number[][]} - Matriz com as posições pintadas. 
*/
function decode(shapeArray) {
  let shapeMatrix = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  for(coordinate of shapeArray) {
    let coordY = coordinate.charAt(1) - 1
    let coordX = coordinate.charAt(0)
    if(coordX == "a") {
      shapeMatrix[coordY][0] = 1;
    } else if (coordX == "b") {
      shapeMatrix[coordY][1] = 1;
    } else if (coordX == "c") {
      shapeMatrix[coordY][2] = 1;
    } else {
      shapeMatrix[coordY][3] = 1;
    }
  }
  return shapeMatrix;
}

/**
 * Rotaciona o Tetrominó
 * 
 * @param {object} tetromino - Objeto do Tetrominó atual
 */
function rotate() {
  tetromino.currentIndex ++;
  console.log(tetromino.currentShape)
  if(tetromino.currentIndex > 3) {
    tetromino.currentIndex = 0;
  }
    
  return pieces[piecesIndex].setShape(decode(tetromino.currentShape[tetromino.currentIndex]));
}

var isPlaying = true

function gameFlow() {
  ctxNxt.clearRect(0,0,ctxNxt.width, ctxNxt.height)
  if(isFixed) {
    curPiece = nextPiece;
    nextPiece = genNextPiece();
    
    pieces.push(new Piece(tetromino.x,tetromino.y,tetromino.width, tetromino.height, nextPiece))
    piecesIndex++
    isFixed = false
    nextPiece = genNextPiece()
    
    draw(nxt.width / 2 - 33, 50, nextPiece, ctxNxt);
    
    isPlaying = false;
  } else {
  	if(isPlaying) {
      var nextPiece = genNextPiece();
      draw(nxt.width / 2 - 33, 50, nextPiece, ctxNxt);
      var curPiece = genNextPiece()
      pieces.push(new Piece(tetromino.x, tetromino.y, tetromino.width, tetromino.height, curPiece))
    }
  }
  pieces[piecesIndex].update()
}

/**
 * Gera uma peça aleatória para o jogador
*/
function genNextPiece() {
  let shapeNames = [],
      pieceName,
      piece
  ;

  for(shape in shapes) {
    shapeNames.push(shape);
  }

  pieceName =  "s"; //shapeNames[Math.floor(Math.random() * 4)];

  switch (pieceName){
    case 'line':
      piece = shapes.line;
      break;
    case 'j':
      piece = shapes.j;
      break;
    case 's':
      piece = shapes.s;
      break;
    default:
      piece = shapes.square;
      break;
  }
  tetromino.currentShape = piece;
  tetromino.currentIndex = Math.floor(Math.random() * 3);

  return decode(piece[tetromino.currentIndex]);
}

/**
 * Move a peça na direção da tecla que está sendo apertada
 */
function move() {
  if(moveLeft && !moveRight) {
    if(pieces[piecesIndex].x > 0){
      pieces[piecesIndex].x -= 33;
    }
    moveLeft = false;
  } else {
    if(pieces[piecesIndex].x < canvas.width - tetromino.width) {
      pieces[piecesIndex].x += 33;
    }
    moveRight = false;
  }

}

/**
 * Escuta qual tecla está sendo apertada
 * @param {*} event 
 */
function keyListener(event) {
  let key = event.key;
  if(key === "A" || key === "a") {
    if(!isFixed){
      moveLeft = true;
      move();
    }
  } else if (key === "D" || key === "d") {
    if(!isFixed){
      moveRight = true;
      move();
    }
  } else if (key === "R" || key === "r") {
    if(!isFixed){
      rotate();
    }
  } else if (key === " ") {
    if(!isPaused){
      isPaused = true;
    }else{
      isPaused = false;
      render();
    }
  }

}

/**
 * Começa o Jogo
 */
function start(){
  gameFlow();
  window.addEventListener("keydown",keyListener);

  render();
}

// Isso vai carregar o jogo só quando tudo estiver carregado na page
document.addEventListener("DOMContentLoaded", () => {
  start();
})