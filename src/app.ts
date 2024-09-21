import express from "express";
import cors from 'cors';

import loadData from "./libs/LoadData.js";
import { FRONTEND_URL } from "./config.js";

const app = express();
const BooksData = loadData();

app.use(cors({
    credentials: true,
    origin: FRONTEND_URL,
}));
app.use(express.json());

app.get("/books", (_, res) => {
    res.json(BooksData);
});

app.get("/books/:index", (req, res) => {
    const data = loadData();
    res.json(data[parseInt(req.params.index)]);
});

export default app;