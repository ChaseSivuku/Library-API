import express, { Request, Response } from "express";
import { books } from "../models/book.js";
import { authors } from "../models/author.js";
import { validateBook } from "../middleware/validation.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Create Book
router.post("/", validateBook, (req, res) => {
  const { title, authorId, year, isbn, summary } = req.body;
  const conflict = books.find(b => b.title.toLowerCase() === title.trim().toLowerCase() && b.authorId === authorId);
  if (conflict) return res.status(409).json({ error: "Book already exists for this author" });

  const book = { id: uuidv4(), title: title.trim(), authorId, year, isbn, summary };
  books.push(book);
  res.status(201).json(book);
});

// Get All Books
router.get("/", (req, res) => {
  let results = books.slice();
  const { title, author, year } = req.query as any;

  if (title) results = results.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  if (author) {
    const aIds = authors.filter(a => a.name.toLowerCase().includes(author.toLowerCase())).map(a => a.id);
    results = results.filter(b => aIds.includes(b.authorId));
  }
  if (year) results = results.filter(b => b.year === Number(year));

  res.json(results);
});

// Get Book by ID
router.get("/:id", (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Update Book
router.put("/:id", validateBook, (req, res) => {
  const { title, authorId, year, isbn, summary } = req.body;
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Book not found" });

  const other = books.find(b => b.id !== req.params.id && b.title.toLowerCase() === title.trim().toLowerCase() && b.authorId === authorId);
  if (other) return res.status(409).json({ error: "Another book with this title already exists for the same author." });

  books[idx] = { ...books[idx], title: title.trim(), authorId, year, isbn, summary };
  res.json(books[idx]);
});

// Delete Book
router.delete("/:id", (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Book not found" });

  books.splice(idx, 1);
  res.status(204).send();
});

export default router;
