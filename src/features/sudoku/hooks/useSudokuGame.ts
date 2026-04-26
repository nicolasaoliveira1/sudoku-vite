import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BoardCell, Difficulty, NumberGrid, SelectedCell } from '../types/sudoku';
import { DIFFICULTY_MAP } from '../types/sudoku';
import {
  applyNumberGridToBoard,
  createEmptyBoardGrid,
  createEmptyNumberGrid,
  fillGridBacktracking,
  getShuffledDigits,
  isValidMoveBoard,
  isValidMoveNumberGrid,
  numberGridToBoardWithFixed,
  removeCellsRandom,
  toNumberGrid,
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
};

const SOLVE_SPEED_MS = 25;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSudokuGame(): UseSudokuGameResult {
  const [grid, setGrid] = useState<BoardCell[][]>(() => createEmptyBoardGrid());
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const solveBacktrackingAnimated = useCallback(
    async (numbers: NumberGrid, boardTemplate: BoardCell[][]): Promise<boolean> => {
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
        setGrid(applyNumberGridToBoard(numbers, boardTemplate));
        await sleep(SOLVE_SPEED_MS);

        if (await solveBacktrackingAnimated(numbers, boardTemplate)) return true;

        numbers[emptyRow][emptyCol] = 0;
        setGrid(applyNumberGridToBoard(numbers, boardTemplate));
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

  const setCellValue = useCallback(
    (value: number | null) => {
      if (!selected) return;
      const { row, col } = selected;

      setGrid((prevGrid) => {
        if (prevGrid[row][col].isFixed) return prevGrid;

        if (value !== null && !isValidMoveBoard(prevGrid, row, col, value)) {
          return prevGrid;
        }

        const nextGrid = prevGrid.map((r) => [...r]);
        nextGrid[row][col] = { ...nextGrid[row][col], value };
        return nextGrid;
      });
    },
    [selected]
  );

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
    }),
    [difficulty, generatePuzzle, grid, isSolving, selectCell, selected, solvePuzzle]
  );
}
