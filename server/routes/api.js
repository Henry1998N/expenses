const express = require("express");
const router = express.Router();
const moment = require("moment");

const Expense = require("../model/expense");
const formatDate = function (date) {
  return moment(date).format("YYYY-MM-DD");
};
const formatToJson = function (expense) {
  let expenseString = JSON.stringify(expense);
  let d1 = JSON.parse(expenseString);
  d1 = d1[0].date;
  return formatDate(d1);
};
const getTheSmallestDate = function () {
  return Expense.find({}).sort({ date: 1 }).limit(1);
};
const filterExpensesByDates = function (d1, d2, res) {
  Expense.find({ $and: [{ date: { $gte: d1 } }, { date: { $lte: d2 } }] })
    .sort({ date: -1 })
    .then(function (expenses) {
      res.send(expenses);
      return;
    })
    .catch((err) => {
      res.status(400).send(err);
      return;
    });
};
router.get("/expenses", function (req, res) {
  let query = req.query;
  let d1;
  let d2 = query.d2 ? formatDate(query.d2) : formatDate(new Date());
  if (query.d1 != undefined) {
    d1 = formatDate(query.d1);
    filterExpensesByDates(d1, d2, res);
  } else {
    let smallestExpense = getTheSmallestDate();
    smallestExpense.then((expense) => {
      d1 = formatToJson(expense);
      filterExpensesByDates(d1, d2, res);
    });
  }
});
router.post("/expense", function (req, res) {
  let body = req.body;

  let newDate = body.date
    ? moment(body.date).format("LLLL")
    : moment(new Date()).format("LLLL");
  console.log(newDate);
  let newExpense = new Expense({
    amount: body?.amount,
    group: body?.group,
    date: newDate,
    item: body?.item,
  });
  newExpense
    .save()
    .then(() => {
      console.log(
        `the amount of expense is ${body?.amount} and the item is : ${body?.item}`
      );
      res.status(201).send("created");
    })
    .catch((err) => {
      console.log(err);
    });
});
router.put("/update/:group1/:group2", function (req, res) {
  Expense.findOneAndUpdate(req.params.group1, { group: req.params.group2 })
    .then((expense) => {
      res.send(expense);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/expenses/:group", function (req, res) {
  let total = req.query?.total;

  if (total === "true") {
    Expense.aggregate([
      { $match: { group: req.params.group } },
      {
        $group: {
          _id: "$group",
          total: { $sum: "$amount" },
        },
      },
    ])
      .then((total) => {
        res.status(200).send(total);
      })
      .catch((err) => {
        res.status(409).send(err);
      });
  } else {
    Expense.find({ group: req.params.group })
      .then((expenses) => {
        res.status(200).send(expenses);
      })
      .then((expenses) => {
        res.status(200).send(expenses);
      })
      .catch((err) => res.status(409).send(err));
  }
});

module.exports = router;

// const data = require("../expenses.json");
// console.log(data);
// data.forEach((d) => {
//   let d1 = new Expense({
//     amount: d.amount,
//     group: d.group,
//     date: d.date,
//     item: d.item,
//   });
//   d1.save();
// });
