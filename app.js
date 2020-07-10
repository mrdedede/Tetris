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
    ["a3","b1","b2","b3"],
    ["a1","a2","b2","c2"],
    ["b1","b2","b3","c1"],
    ["a2","b2","c2","c3"],
  ],
  square:[
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
    ["a1","a2","b1","b2"],
  ],
  l: [
    ["b1","b2","b3","c3"],
    ["a2","a3","b2","c2"],
    ["a1","b1","b2","b3"],
    ["a2","b2","c1","c2"],
  ],
  t:[
    ["a2","b2","b3","c2"],
    ["a2","b1","b2","b3"],
    ["a2","b1","b2","c2"],
    ["c1","c2","c3","d2"],
  ],
  z:[
    ["a2","b2","b3","c3"],
    ["a2","a3","b1","b2"],
    ["a1","b1","b2","c2"],
    ["b2","b3","c1","c2"],
  ]
}

//Exemplo de um tetrominó
var tetromino = {
  x: 125,
  y: -132,
  width: 132,
  height: 132,
  currentHeight: 0,
  currentIndex: 0,
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
 * @param {*} type - Tipo da peça
 * @param {*} shape - Formato da peça
 */
function Piece(x, y, width, height, type, shape) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type;
  this.shape = shape;

  this.update = function(){

    if(this.y < canvas.height - tetromino.currentHeight){
      this.y += 1;
    }else{
      isFixed = true;
      gameFlow();      
    }
    draw(this.x, this.y, this.width, this.height, this.shape, ctx);
  }

  this.getType = function(){
    return this.type;
  }
  
  this.setShape = function(newShape) {
    this.shape = newShape;
    this.update();
  }
}

// Gera-se a próxima peça
var nextPiece = genNextPiece();

// Desenha-se essa nova peça gerada
draw(nxt.width / 2 - 33, 50, tetromino.width, tetromino.height, nextPiece[1], ctxNxt);

var curPiece = genNextPiece();
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
 * @param {number} dx - Posição da peça em X
 * @param {number} dy - Posição da peça em Y
 * @param {array} shape - Shape da peça
 * @param {HTMLElement} context - Context do canvas no qual se insere a peça.
 * @param {number} center - Centro do canvas
 */
function draw(dx, dy, width, height, shape, context) {
  
  var x = dx, y = dy, row, column, nullX = 0;

  for(row = 0; row < 4; row++) {
    
    for(column = 0; column < 4;column++) {

      if(shape[row][column] != 0){
        context.fillRect(x, y, 33, 33);
        context.fillStyle = 'black';
      }else{
        nullX++;
        
        if (nullX==4){
          height-=33;
        }
      }
      x += 33;
    }
    
    nullX = 0;
    x = dx;
    y+=33;
  }

  tetromino.currentHeight = height;
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
function rotate(type) {
  tetromino.currentIndex ++;

  if(tetromino.currentIndex > 3) {
    tetromino.currentIndex = 0;
  }
  
  return pieces[piecesIndex].setShape(decode(type[tetromino.currentIndex]));
}

var isPlaying = true;

function gameFlow() {
  ctxNxt.clearRect(0,0, nxt.width, nxt.height);  

  if(isFixed) {
    curPiece = nextPiece;
    
    pieces.push(new Piece(tetromino.x,tetromino.y,tetromino.width, tetromino.height, curPiece[0], curPiece[1]));
    piecesIndex++;
    isFixed = false;
    
    nextPiece = genNextPiece();
    draw(nxt.width / 2 - 33, 50, tetromino.width, tetromino.height, nextPiece[1], ctxNxt);
    
    isPlaying = false;
  } else {
  	if(isPlaying) {
      nextPiece = genNextPiece();
      draw(nxt.width / 2 - 33, 50, tetromino.width, tetromino.height, nextPiece[1], ctxNxt);
      //curPiece = nextPiece;  
      pieces.push(new Piece(tetromino.x, tetromino.y, tetromino.width, tetromino.height, curPiece[0], curPiece[1]));
    }
  }
  pieces[piecesIndex].update();
}

/**
 * Gera uma peça aleatória para o jogador
*/
function genNextPiece() {
  let shapeNames = [],
      pieceName,
      type
  ;

  for(shape in shapes) {
    shapeNames.push(shape);
  }

  pieceName = shapeNames[Math.floor(Math.random() * shapeNames.length)];

  switch (pieceName){
    case 'line':
      type = shapes.line;
      break;
    case 'j':
      type = shapes.j;
      break;
    case 's':
      type = shapes.s;
      break;
    case 'l':
      type = shapes.l;
      break;
    case 't':
      type = shapes.t;
      break;
    case 'z':
      type = shapes.z;
      break;
    default:
      type = shapes.square;
      break;
  }

  tetromino.currentIndex = Math.floor(Math.random() * 3);

  return [type,decode(type[tetromino.currentIndex])];
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
      rotate(pieces[piecesIndex].getType());
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