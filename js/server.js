const NAME_COL = 4;

//TODO: pass spreadsheetID as a variable;
// receive it from user

const ss = SpreadsheetApp.openById(
  "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
);
const sheet = ss.getActiveSheet();

function parseSheet() {
  if (!checkColumns()) {
    // add init tracker cols if they don't exist
    addTrackerCols(sheet);
  }

  const colNames = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()
    .reduce((arr, cols) => arr.concat(cols), []); // flatten array; concat merges arr with []

  // note: for this current proj, there are 23 cols

  // array of obj {name: of column, cost: of menu item}
  const parsedColNames = extractPriceInfo(colNames);

  // these are from arrays and index from 0; Sheets class index from 1, so watch out!
  const { start, end } = getItemColumnIndexes(parsedColNames); // Meow lesson: destructuring

  // Calculating the amount we should charge the customer, and write this val into the "Total" col
  const itemList = parsedColNames.slice(start, end); // stuff with cost
  // getChoSmoney(itemList, start);

  // create row data for unprinted receipts
  //const allOrders = printBulk(itemList, start);

  // print a single receipt first!
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
  return columnNames.map(col => {
    const matches = col.match(/(?<item>[^\[]*)\$(?<cost>\d+)/); // key info stored in 3 capture grps

    // No matches and no matching groups cost -> not menu item
    if (!matches || !matches.groups || !matches.groups.cost) {
      Logger.log("WARN: cost not found in:", col);
      return { name: col, cost: null };
    }

    return {
      name: matches.groups.item,
      cost: matches.groups.cost
    };
  });
}

/**
 * Gets the start and end (NOT inclusive) indices for columns for item quantities
 *
 * @param parsedColNames array of extractPriceInfo
 */
function getItemColumnIndexes(parsedColNames) {
  const start = parsedColNames.findIndex(e => e.cost !== null);

  // index of the first cost === null after start
  let end = parsedColNames.findIndex((e, i) => e.cost === null && i > start); // findIndex has an optional para; second is index i

  // TODO: Handle if end isn't found
  return { start, end };
}

/**
 * TODO: optimize this by combining logic with printBulk()
 * Finds and writes the total amt the customer should pay Sue-ayi;
 *    saves/writes the $ value into the spreadsheet
 *
 * @param: list of obj containing columns with costs
 */
function getChoSmoney(itemList, start) {
  // sheet.getRange(i, 1, 1, sheet.getLastColumn()).getValues().reduce((arr, cols) => arr.concat(cols),[]);

  for (let i = 2; i <= sheet.getLastRow(); i++) {
    // for every row of customer data

    let custTotal = 0.0;
    const currentRow = sheet
      .getRange(i, 1, 1, sheet.getLastColumn())
      .getValues()
      .reduce((arr, cols) => arr.concat(cols), []);
    index = start;
    console.log(`Calculating ${currentRow[4]}'s total.`);

    itemList.forEach(function(item) {
      // currentRow[index] = quantity stored at the cell
      const qty = currentRow[index];

      if (qty) {
        // when not 0 or empty
        console.log(`Add ${qty} ${item.name} to total: ${custTotal}`);
        custTotal += item.cost * qty;
      }
      index += 1;
    });

    // write to the i-th cell in the second column
    const rng = sheet.getRange(i, 2);

    // ISSUE: gets written as a date on the spreadsheet, but when i manually format, it goes back to a num
    rng.setValue(custTotal);
  }
}

/**
 * Print first chunk of receipts from the top of the sheet
 *
 * (default function when running script?)
 *
 * @param: array of items with its names and cost
 *
 */
function printBulk(itemList, itemIndex) {
  let allOrders = [];

  const start = whereToStart();

  // ALERT: indexing issue: Google Sheets indexes start 1
  for (let i = start; i <= sheet.getLastRow(); i++) {
    const currentRow = sheet
      .getRange(i, 1, 1, sheet.getLastColumn())
      .getValues()
      .reduce((arr, cols) => arr.concat(cols), []);
    col = itemIndex;

    console.log(`Printing receipt for ${currentRow[4]}!`);
    // if first col is empty and is a validRow
    if (!currentRow[0] && validRow(currentRow)) {
      // TODO: generate receipt data
      let items = [];

      itemList.forEach(function(item) {
        if (currentRow[col]) {
          console.log(`Add ${currentRow[col]} of ${item.name} to cart`);
          items.push({ name: item.name, qty: currentRow[col] });
          checkOff(i, 1);
        }
        col += 1;
      });

      allOrders.push(
        new Order(currentRow[4], items, currentRow[sheet.getLastColumn() - 1])
      );

      // TODO: write "x" to cell -> getRange(row+1, 1)
    } else {
      // reached a row that has been printed
      console.log("Stop printing");
      break;
    }
  }

  return allOrders;
}

// generate html info
function getReceipt(name) {
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

  const currentRow = findRowByName(name);

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

  itemList.forEach(function(item) {
    if (currentRow[col]) {
      console.log(`Add ${currentRow[col]} of ${item.name} to cart`);
      items.push({ name: item.name, qty: currentRow[col] });
      checkOff(i, 1);
    }
    col += 1;
  });

  const mommy = new Order(
    currentRow[4],
    items,
    currentRow[sheet.getLastColumn() - 1]
  );

  return mommy;
}

/**
 * gets the names of all customers whose receipts that haven't been printed yet
 */

function getCustomers() {
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

/**
 * Returns the entire row matching the customer's name
 */
function findRowByName(name) {
  const allData = sheet
    .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();

  return allData.filter(function(row) {
    return row[4] === name; // 4 is the col where the names are stored
  })[0]; // filter returns an arr of elements that satisfy the condition
}

/**
 * check the cell with an "x" to indicate the row has been read
 */
function checkOff(row, col) {
  const range = sheet.getRange(row, col);
  range.setValue("x");
}

// find the first row index where the first col is empty
function whereToStart() {
  // gets all val of first col, starting from row 2,
  // NO cells from empty rows (:
  const cell = sheet.getRange(1, 1, sheet.getLastRow() - 1).getValues();

  for (let i = 0; i < cell.length; i++) {
    // need [0] bc the value is stored at the first col of a 2D arr with i rows
    if (!cell[i][0]) {
      //falsy that is equivalent to if (cell[i][0] === "")

      return i + 1;
      // ALERT: Google Sheets indexes starting from 1, we need to +1
    }
  }
}

/**
 * Checks if row is all empty
 *
 * @param row
 * @returns false if all columns are empty
 *          true if any column is filled
 */
function validRow(row) {
  if (row.every(e => !e)) {
    //.every() true if every row is empty
    return false;
  } else {
    return true;
  }
  // cannot simply return !row.every() bc it would return false if ANY row is empty
}

// Ensure that the first 2 columns are for our app purposes
function checkColumns() {
  return (
    sheet.getRange("A1").getValue() === "Sent to Print" &&
    sheet.getRange("B1").getValue() === "Total"
  );
}

// Add cols that will be used for data storage
function addTrackerCols(sheet) {
  sheet.insertColumnsBefore(1, 2);
  sheet.getRange("A1").setValue("Sent to Print");
  sheet.getRange("B1").setValue("Total $$");
}

// TODO: modify this to work with order
document.querySelector("#btn").addEventListener("click", printHtml);

function printHtml() {
  const name = document.getElementById("select").value;

  /**
   * Wait, i thought i couldn't use document functions
   * only the google apps script one, since i can't use DOM??
   */
  // client waits for server to respond with receipt data
  const data = google.script.run
    .withSuccessHandler(function(data) {
      document.querySelector("#custName").innerHTML = data.name;
      document.querySelector("#custNo").innerHTML = data.github;
      document.querySelector("#orders").innerHTML = data.role;
      document.querySelector("#comments").innerHTML = data.language;
    })
    .getData(name);

  // TODO: serve data as html (how???)
}
