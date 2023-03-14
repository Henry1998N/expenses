const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Mongoose setup
const api = require("./server/routes/api");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/expensesDB", {
    useNewUrlParser: true,
  })
  .catch((err) => console.log(err));

app.use("/", api);

const port = 4200;
app.listen(port, function () {
  console.log(`Running on port ${port}`);
});
