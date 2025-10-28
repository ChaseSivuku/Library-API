export interface Book {
  id: string;
  title: string;
  authorId: string;
  year?: number;
  isbn?: string;
  summary?: string;
}

export const books: Book[] = [];
