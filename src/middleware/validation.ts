import { Request, Response, NextFunction } from "express";
import { authors } from "../models/author.js";

export function validateAuthor(req: Request, res: Response, next: NextFunction) {
  const { name, birthYear } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: 'Invalid author: "name" is required and must be a string.' });
  }
  if (birthYear !== undefined && typeof birthYear !== "number") {
    return res.status(400).json({ error: 'Invalid author: "birthYear" must be a number.' });
  }
  next();
}

export function validateBook(req: Request, res: Response, next: NextFunction) {
  const { title, authorId, year } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: 'Invalid book: "title" is required and must be a string.' });
  }
  if (!authorId || typeof authorId !== "string") {
    return res.status(400).json({ error: 'Invalid book: "authorId" is required and must be a string.' });
  }
  const authorExists = authors.some(a => a.id === authorId);
  if (!authorExists) {
    return res.status(400).json({ error: "Invalid book: referenced authorId does not exist." });
  }
  if (year !== undefined && typeof year !== "number") {
    return res.status(400).json({ error: 'Invalid book: "year" must be a number if provided.' });
  }
  next();
}
