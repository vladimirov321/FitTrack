export interface LoggedSetData {
  weight: number;
  reps: number;
  order: number;
}

export interface LoggedExerciseData {
  exerciseId: string;
  sets: LoggedSetData[];
}

export interface WorkoutDayData {
  date: string; // ISO date string
  exercises: LoggedExerciseData[];
}
