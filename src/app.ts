import express from "express";
import cors from 'cors';

import loadData from "./libs/LoadData.js";
import Book from "./interfaces/Book.js";
import AVLTree from "./DataStructures/AVLTree.js";
import { FRONTEND_URL } from "./config.js";

const app = express();
const BooksData = loadData();
const IsbnIndex = new AVLTree<Book>((a,b) => {
    if(a.isbn < b.isbn){
        return -1;
    } else if(a.isbn > b.isbn){
        return 1;
    } else {
        return 0;
    }
});
const TitleIndex = new AVLTree<Book>((a,b) => {
    if(a.title < b.title){
        return -1;
    } else if(a.title > b.title){
        return 1;
    } else {
        return 0;
    }
});

IsbnIndex.load(BooksData);
TitleIndex.load(BooksData);

app.use(cors({
    credentials: true,
    origin: FRONTEND_URL,
}));
app.use(express.json());

app.get("/books", (_, res) => {
    res.json(BooksData);
});

app.get("/books/isbn/:isbn", (req, res) => {
    const a: Book = {
        isbn: req.params.isbn,
        title: "",
        category: "",
        author: "",
        score: 0,
        reviews: [],
    }
    const book = IsbnIndex.find(a);

    if(book !== null){
        res.json(book);
        return;
    } else {
        res.status(404);
        res.json({message: "Not found"});
    }
});

app.get("/books/title/:title", (req,res) => {
    const a: Book = {
        isbn: "",
        title: req.params.title,
        category: "",
        author: "",
        score: 0,
        reviews: [],
    }
    const book = TitleIndex.find(a);

    if(book !== null){
        res.json(book);
        return;
    } else {
        res.status(404);
        res.json({message: "Not found"});
    }
});

/*
app.get("/books/category/:category", (req,res) => {

});
*/

export default app;