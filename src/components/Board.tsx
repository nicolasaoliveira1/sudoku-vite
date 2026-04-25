import Cell from "./Cell";

type BoardCell = {
    value: number | null;
    isFixed: boolean;
};

type SelectedCell = {
    row: number;
    col: number;
};

type BoardProps = {
    grid: BoardCell[][];
    selected: SelectedCell | null;
    onSelectCell: (row: number, col: number) => void;
}

function Board({grid, selected, onSelectCell} : BoardProps){
    return (
        <div className="grid grid-cols-9 w-fit mx-auto">
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                <Cell 
                    key={`${rowIndex}-${colIndex}`}
                    value={cell.value}
                    isFixed={cell.isFixed}
                    isSelected={selected?.row === rowIndex && selected?.col === colIndex}
                    onClick={() => onSelectCell(rowIndex, colIndex)}
                    />
                ))
            ))}
        </div>
    )
}

export default Board;