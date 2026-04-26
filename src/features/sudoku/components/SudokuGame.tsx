import type { Difficulty } from '../types/sudoku';
import { useSudokuGame } from '../hooks/useSudokuGame';
import Board from './Board';

function SudokuGame() {
  const {
    grid,
    selected,
    isSolving,
    difficulty,
    setDifficulty,
    selectCell,
    generatePuzzle,
    solvePuzzle,
  } = useSudokuGame();

  return (
    <div className="app">
      <h1 className="mb-[40px] text-white text-center text-shadow-lg/60 text-[5rem] font-bold">SudokuTS</h1>
      <div className="text-center text-white text-[20px]">
        <label className="text-white" htmlFor="difficulty">
          Dificuldade:
        </label>
        <select
          disabled={isSolving}
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="text-[17px] mx-2 px-2 py-1 rounded bg-white text-black"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>

        <button
          type="button"
          disabled={isSolving}
          onClick={() => generatePuzzle(difficulty)}
          className="text-[17px] mb-1 px-3 py-1 rounded bg-blue-600 text-white"
        >
          Gerar
        </button>

        <button
          type="button"
          disabled={isSolving}
          onClick={() => solvePuzzle()}
          className="text-[17px] mb-1 ml-2 px-3 py-1 rounded bg-blue-600 text-white"
        >
          Resolver
        </button>

        <Board grid={grid} selected={selected} onSelectCell={selectCell} />
      </div>
    </div>
  );
}

export default SudokuGame;
