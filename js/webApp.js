// gets called by the Event Listener to
// generate html info

function getReceipt(name) {
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

  if (!checkColumns()) {
    // add init tracker cols if they don't exist
    addTrackerCols(sheet);
  }

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
