type CellProps = {
    value: number | null;
    isFixed: boolean;
    onClick: () => void;
    isSelected: boolean;
}


function Cell({value, isFixed, onClick, isSelected} : CellProps) {
    const effectiveSelected = !isFixed && isSelected;

    const bgClass = isFixed
        ? "bg-gray-500"
        : effectiveSelected
        ? "bg-blue-200"
        : "bg-gray-200";

    const textClass = isFixed
        ? "text-white"
        : effectiveSelected
        ? "text-blue-500"
        : "text-black";

    return (
        <button
            type="button"
            onClick={onClick}
            className={
                `border text-3xl
                w-[56px]
                h-[56px]
                flex
                justify-center
                items-center
                focus:outline-none
                ${bgClass} ${textClass} ${!isFixed ? "cursor-pointer" : "cursor-default"}`}
        >
            <span>{value ?? ""}</span>
        </button>
    );
}

export default Cell;