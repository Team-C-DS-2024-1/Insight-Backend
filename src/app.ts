import express from "express";

import loadData from "./libs/LoadData.js";

const app = express();

app.get("/books", (_, res) => {
    const data = loadData();
    res.json(data);
});

app.get("/books/:index", (req, res) => {
    const data = loadData();
    res.json(data[parseInt(req.params.index)]);
});

export default app;