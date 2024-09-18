import express from "express";

const app = express();

interface ExampleRes {
    id: number;
    message: string;
}

app.get("/", (_, res) => {
    const myRes: ExampleRes = {id: 25, message: "Hello Friend"};
    res.json(myRes);
});

export default app;