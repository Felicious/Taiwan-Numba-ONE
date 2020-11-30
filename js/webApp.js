function doGet(e) {
  // e: entered "/order?name=Mei Yu" -> got "/order?name=Mei%20Yu" in the URL
  // stringified e and got:
  /*
  {
    "parameter": {
        "name": "Mei Yu"
    },
    "parameters": {
        "name": [
            "Mei Yu"
        ]
    },
    "contextPath": "",
    "contentLength": -1,
    "queryString": "name=Mei%20Yu",
    "pathInfo": "order"
}
  */
  if (e.pathInfo === "sheet") {
    const url = e.parameter["url"];
    const sheet = openSheetFromUrl(url);

    // load options of the drop-down
    const loadOptions = HtmlService.createTemplateFromFile("Index");
    loadOptions.customers = getCustomers(sheet);

    return loadOptions.evaluate();
  }
  // seems like i just need e.parameter and e.pathInfo
  else if (e.pathInfo === "order") {
    const custName = e.parameters["customerName"];

    const t = HtmlService.createTemplateFromFile("template");

    const ss = SpreadsheetApp.openByUrl(e.parameters["url"]);
    const sheet = ss.getActiveSheet();

    // push variables as a property of the HtmlTemplate object
    t.receipt = getReceipt(custName, sheet); // how to get sheet?

    return t.evaluate();
  } else {
    //just load the homepage
    return HtmlService.createTemplateFromFile("Index").evaluate();
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
      return { currentRow, i };
    }
  }
}

/**
 * gets costs, name of item from column names.
 *
 * NOTE: Column names MUST have a $cost in name (no space between $ and cost)
 * example: "$11 Taiwan sausage [very yummy]"
 *
 * returns array of objects:
 * {name: "found item name", cost: "found cost"}
 *
 * Only returns complete obj of menu items; if not in req. format,
 * the column does not describe a menu item
 *
 * @param columnNames array of column names
 */
function extractPriceInfo(columnNames) {
  // Find values in column name with the above described format
  return columnNames.map((col) => {
    const matches = col.match(/(?<item>[^\[]*)\$(?<cost>\d+)/); // key info stored in 3 capture grps

    // No matches and no matching groups cost -> not menu item
    if (!matches || !matches.groups || !matches.groups.cost) {
      Logger.log("WARN: cost not found in:", col);
      return { name: col, cost: null };
    }

    return {
      name: matches.groups.item,
      cost: matches.groups.cost,
    };
  });
}

/**
 * Gets the start and end (NOT inclusive) indices for columns for item quantities
 *
 * @param parsedColNames array of extractPriceInfo
 */
function getItemColumnIndexes(parsedColNames) {
  const start = parsedColNames.findIndex((e) => e.cost !== null);

  // index of the first cost === null after start
  let end = parsedColNames.findIndex((e, i) => e.cost === null && i > start); // findIndex has an optional para; second is index i

  // TODO: Handle if end isn't found
  return { start, end };
}
