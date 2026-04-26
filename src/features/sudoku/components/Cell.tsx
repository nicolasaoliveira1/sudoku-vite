type CellProps = {
  value: number | null;
  isFixed: boolean;
  onClick: () => void;
  isSelected: boolean;
  borderClass: string;
};

function Cell({ value, isFixed, onClick, isSelected, borderClass }: CellProps) {
  const effectiveSelected = !isFixed && isSelected;

  const bgClass = isFixed ? 'bg-gray-200' : effectiveSelected ? 'bg-blue-200' : 'bg-gray-200';

  const textClass = isFixed ? 'text-blue-500' : effectiveSelected ? 'text-blue-900' : 'text-black';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-3xl
                w-[56px]
                h-[56px]
                flex
                justify-center
                items-center
                focus:outline-none
                ${bgClass} ${textClass} ${borderClass} ${!isFixed ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span>{value ?? ''}</span>
    </button>
  );
}

export default Cell;
