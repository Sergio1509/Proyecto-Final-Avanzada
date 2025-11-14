import type { Person } from "./person";


export interface Mission {
  id: number;
  description: string;
  created_at: string;
  person: Person;
}