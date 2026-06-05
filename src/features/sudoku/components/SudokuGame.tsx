import type { Difficulty } from '../types/sudoku';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { useGameStats } from '../hooks/useGameStats';
import { useSound } from '../hooks/useSound';
import Board from './Board';
import { useEffect, useCallback, useRef } from 'react';


function SudokuGame() {
  const {
    time,
    isRunning,
    moveCount,
    isCompleted,
    startTimer,
    resetTimer,
    incrementMoveCount,
    completeGame,
    formatTime
  } = useGameStats();

  const playPlace = useSound(`${import.meta.env.BASE_URL}sounds/place.wav`, 0.0050);
  // calcula pitch baseado no progresso do solver
const getSolverPitch = useCallback(() => {
  const filled = gridRef.current.flat().filter(c => c.value !== null).length;
  return 1 + (filled / 81) * 10;
}, []);

  const {
    grid,
    selected,
    isSolving,
    difficulty,
    setDifficulty,
    selectCell,
    generatePuzzle,
    solvePuzzle,
  } = useSudokuGame({
    onMove: () => {
      incrementMoveCount();
      playPlace();
    },
    onComplete: completeGame,
    onSolverPlace: () => playPlace(getSolverPitch())
  });

    const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Start timer when game starts
  useEffect(() => {
    if (!isRunning && !isSolving && !isCompleted) {
      startTimer();
    }
  }, [isRunning, isSolving, isCompleted, startTimer]);

  return (
    <div className="app">
      <h1 className="mb-[40px] text-white text-center text-shadow-lg/60 text-[5rem] font-bold">SudokuTS</h1>
      <div className="text-center text-white text-[20px] mb-4">
        <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg mr-4">
          <span className="font-bold">Tempo:</span> {formatTime(time)}
        </div>
        <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg">
          <span className="font-bold">Movimentos:</span> {moveCount}
        </div>
      </div>

      <div className="text-center text-white text-[20px]">
        <label className="text-white" htmlFor="difficulty">
          Dificuldade:
        </label>
        <select
          disabled={isSolving}
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="text-[17px] mt-1 mx-2 mb-2 px-2 py-1 rounded bg-white text-black"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>



        <Board grid={grid} selected={selected} onSelectCell={selectCell} />

        <button
          type="button"
          disabled={isSolving}
          onClick={() => {
            resetTimer();
            generatePuzzle(difficulty);
          }}
          className="inline-flex items-center justify-center h-8 text-[19px] px-3 mt-1 rounded bg-blue-600 text-white align-middle"
        >
          Gerar
        </button>

        <button
          type="button"
          disabled={isSolving}
          onClick={() => {
            resetTimer();
            solvePuzzle();
          }}
          className="inline-flex items-center justify-center h-8 text-[19px] gap-2 ml-4 mt-1 px-3 rounded bg-blue-600 text-white align-middle"
        >
          {isSolving && (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSolving ? 'Resolvendo...' : 'Resolver'}
        </button>

      </div>
    </div>
  );
}

export default SudokuGame;

