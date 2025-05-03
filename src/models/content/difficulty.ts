export interface Difficulty {
  id: number;
  name: string;
  weight: string;
}

export interface DifficultiesResponse {
  difficulties: Difficulty[];
}
