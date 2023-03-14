const renderer = new Renderer();

const getExpenses = function () {
  $.get("/expenses").then((expenses) => {
    renderer.renderExpenses(expenses);
  });
};

getExpenses();
