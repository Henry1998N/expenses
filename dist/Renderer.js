class Renderer {
  constructor() {}
  renderExpenses(expensesData) {
    const source = $("#expenses-template").html();
    const template = Handlebars.compile(source);
    let newHTML = template({ expenses: expensesData });
    $(".expenses-container").empty().append(newHTML);
  }
  renderAdd() {}
}
