export type BoardCell = {
  value: number | null;
  isFixed: boolean;
};

export type SelectedCell = {
  row: number;
  col: number;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type NumberGrid = number[][];

export const DIFFICULTY_MAP: Record<Difficulty, number> = {
  easy: 35,
  medium: 45,
  hard: 55,
};
