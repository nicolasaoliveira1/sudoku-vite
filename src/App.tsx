import './App.css'
import Board from './components/Board';
import { useState, useEffect } from 'react';

type BoardCell = {
  value: number | null;
  isFixed: boolean;
};

type SelectedCell = {
  row: number;
  col: number;
};

function App() {
  const [grid, setGrid] = useState<BoardCell[][]>(
    Array.from({ length: 9 }, (_, row) =>
      Array.from({ length: 9 }, (_, col) => ({
        value: (row === 0 && col < 3) ? col + 1 : null,
        isFixed: row === 0 && col < 3,
      }))
    )
  );

  const [selected, setSelected] = useState<SelectedCell | null>(null);

  function handleSetCellValue(value: number | null) {
    if (!selected) return;
    const { row, col } = selected;

    setGrid((prevGrid) => {
      if (prevGrid[row][col].isFixed) return prevGrid;

      const nextGrid = prevGrid.map((r) => [...r]);
      nextGrid[row][col] = {
        ...nextGrid[row][col],
        value,
      };
      return nextGrid;
    });
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      
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
  }, [selected, handleSetCellValue]);

  return (
    <div className='app'>
      <h1 className="mb-[25px] text-white text-center text-shadow-lg/60 text-[5rem] font-bold">SudokuTS</h1>
      <div className='text-center text-white text-[20px]'>
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
