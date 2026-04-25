type CellProps = {
    value: number | null;
    isFixed: boolean;
    onClick: () => void;
    isSelected: boolean;
}


function Cell({value, isFixed, onClick, isSelected} : CellProps) {
    const effectiveSelected = !isFixed && isSelected;

    const bgClass = isFixed
        ? "bg-gray-600"
        : effectiveSelected
        ? "bg-red-300"
        : "bg-gray-300";

    const textClass = isFixed
        ? "text-white"
        : effectiveSelected
        ? "text-red-500"
        : "text-black";

    return (
        <button
            type="button"
            onClick={!isFixed ? onClick : undefined}
            className={
                `border text-3xl
                w-[56px]
                h-[56px]
                flex
                justify-center
                items-center
                ${bgClass} ${textClass} ${!isFixed ? "cursor-pointer" : "cursor-default"}`}
        >
            <span>{value ?? ""}</span>
        </button>
    );
}

export default Cell;