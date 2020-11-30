function doGet(e) {
  if (e.pathInfo === "sheet") {
    const url = e.parameter["url"];
    let ss;

    try {
      ss = SpreadsheetApp.openByUrl(url);
    } catch (err) {
      const errorPage = HtmlService.createTemplateFromFile("urlFailed");
      errorPage.url = url;
      return errorPage.evaluate();
    }

    const sheet = ss.getActiveSheet();

    // check if tracking cols need to be added
    getColumns(sheet);

    // load options of the drop-down
    const loadOptions = HtmlService.createTemplateFromFile("Index");
    loadOptions.e = e;
    loadOptions.customers = getCustomers(sheet);

    return loadOptions.evaluate();
  } else if (e.pathInfo === "order") {
    // ALERT const custName = e.parameters["customerName"]; this gives an array with 1 item in it!

    const custName = e.parameters["customerName"][0];
    const t = HtmlService.createTemplateFromFile("template");

    const ss = SpreadsheetApp.openByUrl(e.parameters["url"][0]);
    const sheet = ss.getActiveSheet();

    // push variables as a property of the HtmlTemplate object
    t.receipt = getReceipt(custName, sheet);

    return t.evaluate();
  } else {
    const page = HtmlService.createTemplateFromFile("Index");
    page.e = e;
    return page.evaluate();
  }
}

// gets called by the Event Listener to
// generate html info
function getReceipt(name, sheet) {
  const { currentRow, rowNum } = findRowNum(name, sheet);

  const colNames = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()
    .reduce((arr, cols) => arr.concat(cols), []); // flatten array; concat merges arr with []

  const parsedColNames = extractPriceInfo(colNames);

  // these are from arrays and index from 0; Sheets class index from 1, so watch out!
  const { start, end } = getItemColumnIndexes(parsedColNames); // Meow lesson: destructuring

  const itemList = parsedColNames.slice(start, end);
  const itemIndex = start;

  //console.log("Printing Mommy's order (:");
  //const currentRow = sheet.getRange(8, 1, 1, sheet.getLastColumn())
  //    .getValues().reduce((arr, cols) => arr.concat(cols),[]);

  let col = itemIndex;
  let items = [];

  itemList.forEach(function (item) {
    if (currentRow[col]) {
      console.log(`Add ${currentRow[col]} of ${item.name} to cart`);
      items.push({ name: item.name, qty: currentRow[col] });
    }
    col += 1;
  });

  const mommy = new Order(
    currentRow[4],
    items,
    currentRow[sheet.getLastColumn() - 1]
  );

  // mark receipt as completed on the spreadsheet
  checkOff(rowNum, 1, sheet);

  return mommy;
}

/**
 * gets the names of all customers whose receipts that haven't been printed yet
 */
function getCustomers(sheet) {
  let customers = [];

  for (let i = 2; i <= sheet.getLastRow(); i++) {
    // for every row of customer data

    const currentPrintCell = sheet.getRange(i, 1).getValue();
    if (!currentPrintCell) {
      customers.push(sheet.getRange(i, 5).getValue());
    }
  }

  return customers;
}

/*
 * returns an object with an array of row info that matches the @param name
 * and the row number
 */
function findRowNum(name, sheet) {
  for (let i = 2; i <= sheet.getLastRow(); i++) {
    const currentRow = sheet
      .getRange(i, 1, 1, sheet.getLastColumn())
      .getValues()
      .reduce((arr, cols) => arr.concat(cols), []);

    if (currentRow[4] === name) {
      return { currentRow, rowNum: i };
    }
  }
}
