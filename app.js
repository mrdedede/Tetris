shapes = {
  // Aqui ficarão todas as possibilidades de formas para os tetrominos
  // Botar os códigos de "batalha naval" pra todos os casos
  line:
    [
      ["b1","b2","b3","b4"],
      ["a2","b2","c2","d2"],
      ["c1","c2","c3","c4"],
      ["a3","b3","c3","d3"],
    ],
}

Tetromino = {
  // Aqui está um exemplo base de como funcionariam os tetrominós
  shape: "line",
  curIndex: 0,
  shapeMatrix: []
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
function spin(tetromino) {
	tetromino.curIndex ++;
  if(tetromino.curIndex > 3) {
    tetromino.curIndex = 0;
  }
  return tetromino.shapeMatrix = decode(shapes[tetromino.shape][tetromino.curIndex]);
}


// Isso vai carregar o jogo só quando tudo estiver carregado na page
document.addEventListener("DOMContentLoaded", () => {
})