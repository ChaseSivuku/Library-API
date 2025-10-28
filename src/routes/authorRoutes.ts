import express, { Request, Response } from "express";
import { authors } from "../models/author.js";
import { books } from "../models/book.js";
import { validateAuthor } from "../middleware/validation.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Create Author
router.post("/", validateAuthor, (req, res) => {
  const { name, bio, birthYear } = req.body;
  const conflict = authors.find(a => a.name.toLowerCase() === name.trim().toLowerCase());
  if (conflict) return res.status(409).json({ error: "Author already exists." });

  const author = { id: uuidv4(), name: name.trim(), bio, birthYear };
  authors.push(author);
  res.status(201).json(author);
});

// Get All Authors
router.get("/", (req, res) => {
  const q = (req.query.q as string) || "";
  if (q) {
    const v = q.toLowerCase();
    return res.json(authors.filter(a => a.name.toLowerCase().includes(v)));
  }
  res.json(authors);
});

// Get Author by ID
router.get("/:id", (req, res) => {
  const author = authors.find(a => a.id === req.params.id);
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.json(author);
});

// Update Author
router.put("/:id", validateAuthor, (req, res) => {
  const { name, bio, birthYear } = req.body;
  const idx = authors.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Author not found" });

  const other = authors.find(a => a.name.toLowerCase() === name.trim().toLowerCase() && a.id !== req.params.id);
  if (other) return res.status(409).json({ error: "Another author with this name exists." });

  authors[idx] = { ...authors[idx], name: name.trim(), bio, birthYear };
  res.json(authors[idx]);
});

// Delete Author
router.delete("/:id", (req, res) => {
  const idx = authors.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Author not found" });

  const removedAuthor = authors.splice(idx, 1)[0];
  for (let i = books.length - 1; i >= 0; i--) {
    if (books[i].authorId === removedAuthor.id) books.splice(i, 1);
  }
  res.status(204).send();
});

// Get Author’s Books
router.get("/:id/books", (req, res) => {
  const author = authors.find(a => a.id === req.params.id);
  if (!author) return res.status(404).json({ error: "Author not found" });

  const authorBooks = books.filter(b => b.authorId === author.id);
  res.json(authorBooks);
});

export default router;
