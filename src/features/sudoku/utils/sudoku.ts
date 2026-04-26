import type { BoardCell, NumberGrid } from '../types/sudoku';

export function createEmptyNumberGrid(): NumberGrid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function createEmptyBoardGrid(): BoardCell[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: null,
      isFixed: false,
    }))
  );
}

export function removeCellsRandom(fullGrid: NumberGrid, removeCount: number): NumberGrid {
  const puzzle = fullGrid.map((row) => [...row]);

  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const toRemove = Math.max(0, Math.min(removeCount, 81));
  for (let i = 0; i < toRemove; i++) {
    const { row, col } = positions[i];
    puzzle[row][col] = 0;
  }

  return puzzle;
}

export function isValidMoveNumberGrid(
  grid: NumberGrid,
  row: number,
  col: number,
  value: number
): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === value) {
      return false;
    }
  }

  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) {
        return false;
      }
    }
  }
  return true;
}

export function isValidMoveBoard(
  grid: BoardCell[][],
  row: number,
  col: number,
  value: number
): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c].value === value) {
      return false;
    }
  }

  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col].value === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === value) {
        return false;
      }
    }
  }
  return true;
}

export function getShuffledDigits(): number[] {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits;
}

export function fillGridBacktracking(grid: NumberGrid): boolean {
  let emptyRow = -1;
  let emptyCol = -1;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        emptyRow = row;
        emptyCol = col;
        break;
      }
    }
    if (emptyRow !== -1) {
      break;
    }
  }

  if (emptyRow === -1) {
    return true;
  }

  const digits = getShuffledDigits();

  for (const num of digits) {
    if (isValidMoveNumberGrid(grid, emptyRow, emptyCol, num)) {
      grid[emptyRow][emptyCol] = num;
      if (fillGridBacktracking(grid)) return true;
      grid[emptyRow][emptyCol] = 0;
    }
  }
  return false;
}

export function toNumberGrid(board: BoardCell[][]): NumberGrid {
  return board.map((row) => row.map((cell) => cell.value ?? 0));
}

export function applyNumberGridToBoard(
  numbers: NumberGrid,
  boardTemplate: BoardCell[][]
): BoardCell[][] {
  return boardTemplate.map((row, r) =>
    row.map((cell, c) => ({
      value: numbers[r][c] === 0 ? null : numbers[r][c],
      isFixed: cell.isFixed,
    }))
  );
}

export function numberGridToBoardWithFixed(numbers: NumberGrid): BoardCell[][] {
  return numbers.map((row) =>
    row.map((num) => {
      if (num === 0) {
        return {
          value: null,
          isFixed: false,
        };
      }
      return {
        value: num,
        isFixed: true,
      };
    })
  );
}
