export interface Author {
  id: string;
  name: string;
  bio?: string;
  birthYear?: number;
}

export const authors: Author[] = [];
