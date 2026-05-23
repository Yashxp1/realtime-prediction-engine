import express from "express";
import cors from "cors";

const PORT = 4001;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
