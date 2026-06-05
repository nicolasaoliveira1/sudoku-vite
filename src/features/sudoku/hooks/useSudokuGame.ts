import { useCallback, useEffect, useMemo, useState, useRef, } from 'react';
import type { BoardCell, Difficulty, NumberGrid, SelectedCell } from '../types/sudoku';
import { DIFFICULTY_MAP } from '../types/sudoku';
import {
  applyNumberGridToBoard,
  createEmptyBoardGrid,
  createEmptyNumberGrid,
  fillGridBacktracking,
  isValidMoveBoard,
  isValidMoveNumberGrid,
  numberGridToBoardWithFixed,
  removeCellsRandom,
  toNumberGrid,
  isBoardSolved,
} from '../utils/sudoku';


type UseSudokuGameResult = {
  grid: BoardCell[][];
  selected: SelectedCell | null;
  isSolving: boolean;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  generatePuzzle: (difficulty?: Difficulty) => void;
  solvePuzzle: () => Promise<void>;
  setCellValue: (value: number | null) => void;
};

type UseSudokuGameOptions = {
  onMove?: () => void;
  onComplete?: () => void;
  onSolverPlace?: () => void;
};

const SOLVE_SPEED_MS = 50;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSudokuGame({ onMove, onComplete, onSolverPlace }: UseSudokuGameOptions = {}): UseSudokuGameResult {

  const [grid, setGrid] = useState<BoardCell[][]>(() => createEmptyBoardGrid());
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const solveBacktrackingAnimated = useCallback(
  async (numbers: NumberGrid, boardTemplate: BoardCell[][]): Promise<boolean> => {
    // MRV: encontra a célula vazia com menos candidatos
    let bestRow = -1;
    let bestCol = -1;
    let bestCount = 10;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (numbers[r][c] !== 0) continue;

        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValidMoveNumberGrid(numbers, r, c, num)) count++;
        }

        if (count === 0) return false; // beco sem saída
        if (count < bestCount) {
          bestCount = count;
          bestRow = r;
          bestCol = c;
        }
      }
    }

    if (bestRow === -1) return true; // resolvido

    for (let num = 1; num <= 9; num++) {
      if (!isValidMoveNumberGrid(numbers, bestRow, bestCol, num)) continue;

      numbers[bestRow][bestCol] = num;
      setGrid(applyNumberGridToBoard(numbers, boardTemplate));
      onSolverPlace?.();
      await sleep(SOLVE_SPEED_MS);

      if (await solveBacktrackingAnimated(numbers, boardTemplate)) return true;

      numbers[bestRow][bestCol] = 0;
      setGrid(applyNumberGridToBoard(numbers, boardTemplate));
      onSolverPlace?.();
      await sleep(SOLVE_SPEED_MS);
    }

    return false;
  },
  []
);

  const generatePuzzle = useCallback((nextDifficulty: Difficulty = 'medium'): void => {
    const removeCount = DIFFICULTY_MAP[nextDifficulty];
    const solved = createEmptyNumberGrid();
    fillGridBacktracking(solved);

    const puzzle = removeCellsRandom(solved, removeCount);
    
    const filled = puzzle.flat().filter(n => n !== 0).length;
    console.log(`Células visíveis: ${filled} (removidas: ${81 - filled})`);

    setGrid(numberGridToBoardWithFixed(puzzle));
    setSelected(null);
  }, []);

  const solvePuzzle = useCallback(async (): Promise<void> => {
    if (isSolving) return;

    setIsSolving(true);
    setSelected(null);

    const cleanedBoard: BoardCell[][] = grid.map((row) =>
      row.map((cell) => (cell.isFixed ? cell : { ...cell, value: null }))
    );

    setGrid(cleanedBoard);

    const numbers = toNumberGrid(cleanedBoard);
    await solveBacktrackingAnimated(numbers, cleanedBoard);

    setIsSolving(false);
  }, [grid, isSolving, solveBacktrackingAnimated]);

  const movedRef = useRef(false);

  const setCellValue = useCallback(
    (value: number | null) => {
      if (!selected) return;
      const { row, col } = selected;

      movedRef.current = false;

      setGrid((prevGrid) => {
        if (prevGrid[row][col].isFixed) return prevGrid;
        if (value !== null && !isValidMoveBoard(prevGrid, row, col, value)) return prevGrid;
        if (prevGrid[row][col].value === value) return prevGrid;

        const nextGrid = prevGrid.map((r) => [...r]);
        nextGrid[row][col] = { ...nextGrid[row][col], value };
        movedRef.current = true;
        return nextGrid;
      });

    },
    [selected, onMove]
  );

  // const onMove = useCallback(() => {
  //   // This will be implemented by the parent component
  // }, []);

  // const onComplete = useCallback(() => {
  //   // This will be implemented by the parent component
  // }, []);

  useEffect(() => {
  if (movedRef.current) {
    onMove?.();
    movedRef.current = false;
  }
}, [grid, onMove]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      if (isSolving) return;

      if (event.key >= '1' && event.key <= '9') {
        setCellValue(Number(event.key));
        return;
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        setCellValue(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, isSolving, setCellValue]);

  useEffect(() => {
    generatePuzzle('medium');
  }, [generatePuzzle]);

  // Check for completion after each move
  useEffect(() => {
    if (isBoardSolved(grid)) {
      onComplete?.();
    }
  }, [grid, onComplete]);

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (grid[row][col].isFixed) {
        setSelected(null);
        return;
      }
      setSelected({ row, col });
    },
    [grid]
  );

  return useMemo(
  () => ({
    grid,
    selected,
    isSolving,
    difficulty,
    setDifficulty,
    selectCell,
    generatePuzzle,
    solvePuzzle,
    setCellValue
  }),
  [difficulty, generatePuzzle, grid, isSolving, onComplete, onMove, selectCell, selected, solvePuzzle, setCellValue]
)};


