import './App.css'
import Board from './components/Board';
import { useState, useEffect, useCallback } from 'react';

type BoardCell = {
  value: number | null;
  isFixed: boolean;
};

type SelectedCell = {
  row: number;
  col: number;
};

type Difficulty = "easy" | "medium" | "hard";
const difficultyMap: Record<Difficulty, number> = {easy:35,medium:45,hard:55};

type NumberGrid = number[][];

function createEmptyNumberGrid(): NumberGrid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function removeCellsRandom(fullGrid: NumberGrid, removeCount: number): NumberGrid {
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

function isValidMoveNumberGrid(
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
 const startRow = Math.floor(row/3)*3;
 const startCol = Math.floor(col/3)*3;
 for (let r = startRow; r<startRow + 3; r++) {
  for (let c =startCol; c<startCol +3; c++) {
    if ((r !== row || c!== col) && grid[r][c] === value) {
      return false;
    }
  }
 }
  return true;
}

function isValidMoveBoard(
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
 const startRow = Math.floor(row/3)*3;
 const startCol = Math.floor(col/3)*3;
 for (let r = startRow; r<startRow + 3; r++) {
  for (let c =startCol; c<startCol +3; c++) {
    if ((r !== row || c!== col) && grid[r][c].value === value) {
      return false;
    }
  }
 }
  return true;
}

function getShuffledDigits(): number[] {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits;
}

function fillGridBacktracking(grid : NumberGrid) : boolean {
  let emptyRow = -1
  let emptyCol = -1
  for (let row =0; row<9; row++) {
    for(let col=0;col<9; col++) {
      if (grid[row][col] === 0){
        emptyRow = row;
        emptyCol = col;
        break;
      }
    }
    if (emptyRow!== -1){
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

function createEmptyBoardGrid() : BoardCell[][] {
  return Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({
        value: null,
        isFixed: false,
      }))
    );
}

function App() {
  const [grid, setGrid] = useState<BoardCell[][]>(() => createEmptyBoardGrid());
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solveSpeed] = useState(25);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  function toNumberGrid(board: BoardCell[][]): NumberGrid {
    return board.map((row) => row.map((cell) => cell.value ?? 0));
  }

  function applyNumberGridToBoard(numbers: NumberGrid) :BoardCell[][] {
    return grid.map((row, r) =>
    row.map((cell,c) => ({
        value: numbers[r][c] === 0 ? null : numbers[r][c],
        isFixed: cell.isFixed,
      }))
    );
  }

  async function solveBacktrackingAnimated(numbers: NumberGrid): Promise<boolean> {
  let emptyRow = -1;
  let emptyCol = -1;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (numbers[r][c] === 0) {
        emptyRow = r;
        emptyCol = c;
        break;
      }
    }
    if (emptyRow !== -1) break;
  }

  if (emptyRow === -1) return true;

  const digits = getShuffledDigits();

  for (const num of digits) {
    if (!isValidMoveNumberGrid(numbers, emptyRow, emptyCol, num)) continue;

    numbers[emptyRow][emptyCol] = num;
    setGrid(applyNumberGridToBoard(numbers));
    await sleep(solveSpeed);

    if (await solveBacktrackingAnimated(numbers)) return true;

    numbers[emptyRow][emptyCol] = 0;
    setGrid(applyNumberGridToBoard(numbers));
    await sleep(solveSpeed);
  }

  return false;
}

  async function solvePuzzle(): Promise<void> {
  if (isSolving) return;

  setIsSolving(true);
  setSelected(null);

  const cleanedBoard: BoardCell[][] = grid.map((row) =>
    row.map((cell) =>
      cell.isFixed ? cell : { ...cell, value: null }
    )
  );
  setGrid(cleanedBoard);

  const numbers = toNumberGrid(cleanedBoard);
  await solveBacktrackingAnimated(numbers);

  setIsSolving(false);
}

  const handleSetCellValue = useCallback((value: number | null) => {
    if (!selected) return;
    const { row, col } = selected;

    setGrid((prevGrid) => {
      if (prevGrid[row][col].isFixed) return prevGrid;

      if (value !== null && !isValidMoveBoard(prevGrid, row, col, value)) {
        return prevGrid;
      }

      const nextGrid = prevGrid.map((r) => [...r]);
      nextGrid[row][col] = {...nextGrid[row][col], value };
      return nextGrid;
    });
  }, [selected]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      if (isSolving) return;
      
      if (event.key >= "1" && event.key <= "9"){
        handleSetCellValue(Number(event.key));
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete" ) {
        event.preventDefault();
        handleSetCellValue(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, isSolving, handleSetCellValue]);

  function generatePuzzle(difficulty: Difficulty = "medium"): void {
    const removeCount = difficultyMap[difficulty];
    const solved = createEmptyNumberGrid();
    fillGridBacktracking(solved);
    const puzzle = removeCellsRandom(solved, removeCount)

    const boardGrid: BoardCell[][] = puzzle.map((row) =>
      row.map((num) => {
        if (num ===0) {
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
    setGrid(boardGrid);
    setSelected(null);
  }
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  useEffect(() => {generatePuzzle("medium");},[])
  return (
    <div className='app'>
      
      <h1 className="mb-[40px] text-white text-center text-shadow-lg/60 text-[5rem] font-bold">SudokuTS</h1>
      <div className='text-center text-white text-[20px]'>
        <label className='text-white' htmlFor="difficulty">Dificuldade:</label>
        <select disabled={isSolving} id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className='text-[17px] mx-2 px-2 py-1 rounded bg-white text-black'>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
        <button type='button' disabled={isSolving} onClick={() => generatePuzzle(difficulty)} className='text-[17px] mb-1 px-3 py-1 rounded bg-blue-600 text-white'>Gerar</button>
        <button type='button' disabled={isSolving} onClick={() => solvePuzzle()} className='text-[17px] mb-1 ml-2 px-3 py-1 rounded bg-blue-600 text-white'>Resolver</button>
        <Board
          grid={grid}
          selected={selected}
          onSelectCell={(row, col) => {if (grid[row][col].isFixed){setSelected(null);return;} setSelected({row, col});
        }}
        />
      </div>
    </div>
  );
}

export default App
