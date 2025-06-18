// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export default function generateSudoku() {
  const sudoku = createEmptyGrid();
  resolveSudoku(sudoku);
  return removeCells(formatCells(sudoku));
}

function createEmptyGrid() {
  return new Array(9).fill([]).map(() => new Array(9).fill(null));
}

// eslint-disable-next-line consistent-return
function resolveSudoku(grid) {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return true;

  const numbers = getRandomNumbers();

  for (let i = 0; i < numbers.length; i += 1) {
    // eslint-disable-next-line no-continue
    if (!validate(grid, emptyCell.row, emptyCell.column, numbers[i])) continue;

    // eslint-disable-next-line no-param-reassign
    grid[emptyCell.row][emptyCell.column] = numbers[i];

    if (resolveSudoku(grid)) return true;

    // eslint-disable-next-line no-param-reassign
    grid[emptyCell.row][emptyCell.column] = null;
  }
}

export function findEmptyCell(grid) {
  for (let row = 0; row < 9; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      if (grid[row][column] === null) return { row, column };
    }
  }

  return null;
}

function getRandomNumbers() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = numbers.length - 1; i >= 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
  }

  return numbers;
}

function validate(grid, row, column, value) {
  return validateColumn(grid, row, column, value)
    && validateRow(grid, row, column, value)
    && validateBox(grid, row, column, value);
}

function validateColumn(grid, row, column, value) {
  for (let iRow = 0; iRow < 9; iRow += 1) {
    if (grid[iRow][column] === value && iRow !== row) return false;
  }

  return true;
}

function validateRow(grid, row, column, value) {
  for (let iColumn = 0; iColumn < 9; iColumn += 1) {
    if (grid[row][iColumn] === value && iColumn !== column) return false;
  }

  return true;
}

function validateBox(grid, row, column, value) {
  const firstRowInBox = row - (row % 3);
  const firstColumnInBox = column - (column % 3);

  for (let iRow = firstRowInBox; iRow < firstRowInBox + 3; iRow += 1) {
    for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + 3; iColumn += 1) {
      if (grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) {
        return false;
      }
    }
  }

  return true;
}

function removeCells(grid) {
  const DIFFICULTY = 30;
  const resultGrid = [...grid].map((row) => [...row]);

  let i = 0;
  while (i < DIFFICULTY) {
    const row = Math.floor(Math.random() * 9);
    const column = Math.floor(Math.random() * 9);

    if (resultGrid[row][column].value !== null) {
      resultGrid[row][column].value = null;
      resultGrid[row][column].isFixed = false;
      i += 1;
    }
  }

  return resultGrid;
}

function formatCells(grid) {
  return grid.map((row, rowIndex) => row.map((col, colIndex) =>
    ({ value: col, correctValue: col, isFixed: true, rowIndex, colIndex, notes: [] })));
}
