export interface CreateProgramData {
  name: string;
  details?: string;
  days: {
    name: string;
    exercises: string[];
  }[];
}
