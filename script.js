//this will have many sudokus and i will choose a random one
let sudokus = [
  [
    [0, 1, 0, 0, 4, 0, 0, 5, 0],
    [4, 0, 7, 0, 0, 0, 6, 0, 2],
    [8, 2, 0, 6, 0, 0, 0, 7, 4],
    [0, 0, 0, 0, 1, 0, 5, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 4, 0, 5, 0, 0, 0, 0],
    [9, 6, 0, 0, 0, 3, 0, 4, 5],
    [3, 0, 5, 0, 0, 0, 8, 0, 1],
    [0, 7, 0, 0, 2, 0, 0, 3, 0],
  ],
  [
    [3, 0, 0, 0, 0, 0, 0, 4, 0],
    [6, 7, 0, 8, 0, 0, 0, 0, 9],
    [0, 5, 1, 0, 2, 0, 0, 0, 8],
    [0, 0, 7, 0, 0, 9, 6, 5, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 2],
    [0, 9, 0, 3, 0, 0, 1, 0, 0],
    [4, 0, 0, 7, 0, 0, 3, 0, 6],
    [0, 0, 6, 2, 0, 4, 0, 1, 0],
    [5, 0, 8, 0, 0, 1, 0, 0, 0],
  ],
  [
    [0, 2, 0, 7, 8, 0, 0, 0, 0],
    [4, 0, 0, 0, 3, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 6, 7, 5],
    [9, 5, 0, 1, 0, 7, 4, 0, 0],
    [0, 1, 2, 8, 0, 0, 0, 9, 0],
    [8, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 9, 0, 0, 0, 0, 3, 0],
    [0, 0, 1, 2, 0, 4, 0, 0, 7],
    [6, 0, 0, 0, 1, 3, 8, 2, 0],
  ],
  [
    [6, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 7, 8, 0, 3, 0],
    [0, 0, 7, 1, 0, 0, 0, 5, 9],
    [0, 0, 0, 0, 2, 4, 0, 0, 0],
    [8, 0, 1, 0, 0, 0, 7, 0, 0],
    [0, 9, 3, 0, 0, 5, 2, 0, 0],
    [0, 6, 0, 3, 0, 0, 0, 9, 0],
    [0, 5, 0, 0, 0, 0, 6, 0, 1],
    [0, 0, 0, 5, 0, 7, 0, 8, 0],
  ],
];

let generate = document.getElementById("generate");
let solve = document.getElementById("solve");
let clear = document.getElementById("clear");
td = document.getElementsByTagName("td");
table = document.getElementsByTagName("table");

let isGenerated = false;
let inProcess = false;
var sudoku = [];
for (var i = 0; i < 9; i++) {
  sudoku[i] = new Array(9);
}

if (!isGenerated) {
  document.getElementById("solve").disabled = true;
}

generate.addEventListener("click", () => {
  //clearing prev sudoku
  clearSudoku();

  //   generate a random index to select a sudoku
  let randomInd = Math.floor(Math.random() * sudokus.length);
  let matrix = sudokus[randomInd];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      sudoku[i][j] = matrix[i][j];
    }
  }
  console.log("sudoku", sudoku);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] !== 0) {
        td[9 * i + j].textContent = sudoku[i][j];
      }
    }
  }
  isGenerated = true;
  document.getElementById("solve").disabled = false;
});

function isSafe(row, col, num, sudoku) {
  //row and col
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === num) {
      return false;
    }

    if (sudoku[i][col] === num) {
      return false;
    }
  }

  //in 3x3 matrix
  let rowStart = row - (row % 3);
  let colStart = col - (col % 3);

  for (let i = rowStart; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      if (sudoku[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

async function solveSudoku(sudoku, n) {
  let row = -1;
  let col = -1;
  let isEmpty = false;

  //checking for empty fields
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) {
      break;
    }
  }

  //base condition
  if (!isEmpty) {
    inProcess = false;
    document.getElementById("clear").disabled = false;
    document.getElementById("generate").disabled = false;
    return true;
  }

  //checking for every num
  for (let num = 1; num <= n; num++) {
    if (isSafe(row, col, num, sudoku)) {
      try {
        await delay(10);
        sudoku[row][col] = num;
        td[9 * row + col].textContent = num;
        td[9 * row + col].style.backgroundColor = "#eba134";

        if (await solveSudoku(sudoku, n)) {
          return true;
        }
        sudoku[row][col] = 0;
        td[9 * row + col].textContent = "";
        td[9 * row + col].style.backgroundColor = "white";
      } catch (error) {
        console.log(error);
      }
    }
  }

  return false;
}

solve.addEventListener("click", () => {
  if (!isGenerated) {
    alert("First generate a sudoku");
    return;
  }

  inProcess = true;

  document.getElementById("generate").disabled = true;
  document.getElementById("solve").disabled = true;
  document.getElementById("clear").disabled = true;

  solveSudoku(sudoku, 9);
});

clear.addEventListener("click", clearSudoku);

function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function clearSudoku() {
  document.getElementById("solve").disabled = true;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      td[9 * i + j].textContent = "";
      td[9 * i + j].style.backgroundColor = "white";
    }
  }
}
