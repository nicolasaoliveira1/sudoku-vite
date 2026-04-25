import './App.css'
import Board from './components/Board';
import { useState } from 'react';

type BoardCell = {
  value: number | null;
  isFixed: boolean;
};

type SelectedCell = {
  row: number;
  col: number;
};

function App() {
  const [grid] = useState<BoardCell[][]>(
    Array.from({ length: 9 }, (_, row) =>
      Array.from({ length: 9 }, (_, col) => ({
        value: (row === 0 && col < 3) ? col + 1 : null,
        isFixed: row === 0 && col < 3,
      }))
    )
  );

  const [selected, setSelected] = useState<SelectedCell | null>(null);

  return (
    <div className='app'>
      <h1 className="mb-[25px] text-white text-center text-shadow-lg/60 text-[5rem] font-bold">SUDOKU</h1>
      <div className='text-center text-white text-[20px]'>
        <Board
          grid={grid}
          selected={selected}
          onSelectCell={(row, col) => setSelected({row, col})}
        />
      </div>
    </div>
  );
}

export default App
