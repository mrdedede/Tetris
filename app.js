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

Tetromino = {
  // Aqui está um exemplo base de como funcionariam os tetrominós
  shape: "line",
  curIndex: 0,
  shapeMatrix: []
}

var figure = {
  x: 125,
  y: -50,
  width: 50,
  height: 50,
}

var moveLeft = false, 
    moveRight = false, 
    isFixed = false;

var canvas = document.getElementById("main-game");
var ctx = canvas.getContext('2d');

/**
 * Renders the game
*/
function render() {
  requestAnimationFrame(render);
  
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillRect(figure.x,figure.y,figure.width,figure.height);
  ctx.fillStyle = 'black';
    
  if(figure.y < canvas.height - figure.height){
    figure.y += 0.5;
  }else{
    isFixed = true;
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
    if(coordinate.charAt(0) == "a") {
      shapeMatrix[coordinate.charAt(1)][0] = 1;
    } else if (coordinate.charAt(0) == "b") {
      shapeMatrix[coordinate.charAt(1)][1] = 1;
    } else if (coordinate.chatAt(0) == "c") {
      shapeMatrix[coordinate.charAt(1)][2] = 1;
    } else {
      shapeMatrix[coordinate.charAt(1)][3] = 1;
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

  return piece;
}

function move(){
  if(moveLeft && !moveRight){
    if(figure.x > 0){
      figure.x -= 5;
    }
    moveLeft = false;
  }else{
    if(figure.x < canvas.width - figure.width){
      figure.x += 5;
    }
    moveRight = false;
  }

}

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

function start(){
  window.addEventListener("keydown",keyListener);

  render();
}

start();

// Isso vai carregar o jogo só quando tudo estiver carregado na page
document.addEventListener("DOMContentLoaded", () => {
})