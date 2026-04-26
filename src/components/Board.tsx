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
            {grid.map((row, rowIndex) => 
                row.map((cell, colIndex) => {
                    const isTop = rowIndex === 0;
                    const isLeft = colIndex === 0;
                    const isBlockBottom = (rowIndex + 1) % 3 === 0;
                    const isBlockRight = (colIndex + 1) % 3 === 0;

                    const borderClass = [
                        isTop ? "border-t-4" : "border-t",
                        isLeft ? "border-l-4" : "border-l",
                        isBlockBottom ? "border-b-4" : "border-b",
                        isBlockRight ? "border-r-4" : "border-r",
                        "border-black",
                    ].join(" ");

                return (
                <Cell 
                    key={`${rowIndex}-${colIndex}`}
                    value={cell.value}
                    isFixed={cell.isFixed}
                    isSelected={selected?.row === rowIndex && selected?.col === colIndex}
                    onClick={() => onSelectCell(rowIndex, colIndex)}
                    borderClass={borderClass}
                    />
                );
            })
        )}
    </div>
    );
}

export default Board;