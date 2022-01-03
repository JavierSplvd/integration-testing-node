import express from "express";
import { executeQuery } from "./poolClient";

const PORT = process.env.PORT || 3000;
export const app = express();

// Parse request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/courses", async function (req, res, next) {
  try {
    const query = "SELECT * from courses";
    const data = await executeQuery(query, []);

    res.send(data.rows);
  } catch (err) {
    next(err);
  }
});

app.post("/courses", async function (req, res, next) {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      const error = new Error("Missing params");
      return next(error);
    }

    const queryParams = [name, content];
    const query = "INSERT INTO courses (name, content) VALUES ($1, $2)";
    await executeQuery(query, queryParams);

    console.log(`Course successfully inserted: ${name}`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// Handle errors hardcoding status 400 for the sake of simplicity in our example
app.use(function (err: any, req: any, res: any, next: any) {
  if (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
