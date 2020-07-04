shapes = {
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
    ["a1","b1","b2","b3"],
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
}

var tetromino = {
  x: 125,
  y: -66,
  width: 66,
  height: 66,
}

var moveLeft = false, 
    moveRight = false, 
    isFixed = false;

var canvas = document.getElementById("main-game");
var ctx = canvas.getContext('2d');
var nxt = document.getElementById("next-tetromino");
var ctxNxt = nxt.getContext('2d');
var newNext;
/**
 * Cria um novo tetromino
 *
 * @param {*} x - O valor da peça na coordenada X
 * @param {*} y - O valor da peça na coordenada Y
 * @param {*} width - Largura da peça
 * @param {*} height - Altura da peça
 */
function Piece(x, y, width, height,shape) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.shape = shape;

  this.update = function(){
    
    if(this.y < 500 - this.height){
      this.y += 0.5;
    }else{
      isFixed = true;
      //nextPiece();      
    }
    
    draw(this.x,this.y,this.shape,ctx);

  }
}
newNext = nextPiece();

draw(10,10, newNext, ctxNxt);

var piece = new Piece(tetromino.x,tetromino.y, tetromino.width, tetromino.height,newNext);


/**
 * Renders the game
*/
function render() {
  requestAnimationFrame(render);

  ctx.clearRect(0,0,canvas.width, canvas.height);
  piece.update();
}

function draw(dx,dy,shape,context){
  var x = dx, y = dy;

  for(var row = 0; row < 4; row++){
    var column = 0;
    for(column = 0; column < 4;column++){
      if(shape[row][column] != 0){
        context.fillRect(x,y,33,33);
        context.fillStyle = 'black';
        x+=33;
      }
    }
    x= dx;
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
 * Gira o tetromino atual
 * @params tetromino {Tetromino} - Objeto tetrominó atual
*/
function rotate(tetromino) {
  tetromino.curIndex ++;
  
  if(tetromino.curIndex > 3) {
    tetromino.curIndex = 0;
  }

  return tetromino.shapeMatrix = decode(shapes[tetromino.shape][tetromino.curIndex]);
}

/**
 *Gera uma peça aleatória para o jogador
*/
function nextPiece() {
  let shapeNames = [],
      pieceName,
      piece
  ;

  for(shape in shapes) {
    shapeNames.push(shape);
  }

  pieceName = shapeNames[Math.floor(Math.random() * 4)];

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

  return decode(piece[Math.floor(Math.random() * 3)]);
}

/**
 * Move a peça na direção da tecla que está sendo apertada
 */
function move(){
  if(moveLeft && !moveRight){
    if(piece.x > 0){
      piece.x -= 5;
    }
    moveLeft = false;
  }else{
    if(piece.x < canvas.width - tetromino.width){
      piece.x += 5;
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
      //rotate()
    }
  } else if (key === " ") {
    //pauseGame()
  }

}

/**
 * Começa o Jogo
 */
function start(){
  window.addEventListener("keydown",keyListener);

  render();
}

start();

// Isso vai carregar o jogo só quando tudo estiver carregado na page
document.addEventListener("DOMContentLoaded", () => {
})