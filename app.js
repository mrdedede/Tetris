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
  x: 10,
  y: 10,
}

/**
 * Renders the game
*/
function render() {
  var canvas = document.getElementById("main-game");
  var ctx = canvas.getContext('2d');
  
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillRect(figure.x,figure.y,50,50);
  ctx.fillStyle = 'black';

  
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


function start(){
  	window.addEventListener("keydown",keyListener);
    
    render();
}

function keyListener(event) {
  let key = event.key;
  if(key === "A" || key === "a") {
    figure.x -= 5
  } else if (key === "D" || key === "d") {
    figure.x += 5
  } else if (key === "R" || key === "r") {
    //rotate()
  } else if (key === " ") {
    //pauseGame()
  }
  console.log(figure)
  render()
}

start();

// Isso vai carregar o jogo só quando tudo estiver carregado na page
document.addEventListener("DOMContentLoaded", () => {
})