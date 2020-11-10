import { checkColumns, addTrackerCols, validRow } from "helpers.js";
import { Order } from "OrderClass.js";

/*

Commenting this out rn because it's still too early for me to handle buttons 
w/o understanding API calls and stuff

document.querySelector('#btn').addEventListener("click", function () {
    const name = document.getElementById("select").value;
    var data = google.script.run.withSuccessHandler(function (customer) {
        document.querySelector("#name").innerHTML = customer.name;
        
        const parent = document.getElementById("orders");
        for (let i = 0; i < customer.length; i++){
            // TODO: add some spans and stuff
            parent.appendChild(displayPara(customer.orders[i].qty));
            parent.appendChild(displayPara(customer.orders[i].name));
        }
        document.querySelector("#comments").innerHTML = customer.comment;
    
      }).getReceipt(name);

*/

function doGet() {
  // e: request parameter https://developers.google.com/apps-script/guides/web#request_parameters
  const s = getReceipt("Mei Yu");
  // s is currently an object

  // trying to make a JSON object

  const receipt = JSON.stringify(
    {
      "customer name": s.name,
      order: s.orders,
      comments: s.comment
    },
    null,
    3
  );
  return HtmlService.createHtmlOutput(
    "<b>Hello, world!</b><pre>" + receipt + "</pre>"
  );
}

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

function doGet(e) {
  return HtmlService.createTemplateFromFile("template").evaluate();
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
 *    @param: the text that will be inserted into the paragraph element
 *    returns: a paragraph-type html element that displays the passed in text
 */
function displayPara(words) {
  const addInfo = document.createTextNode(words);
  const pElement = document.createElement("P");
  pElement.appendChild(addInfo);
  return pElement;
}
