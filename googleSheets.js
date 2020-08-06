const START_ROW = 2;
const START_COL = 2;
const NAME_COL = 4;

let custNo = 0;

// TODO: add calendar data obj for pick-up date

/**
 * Iterates over spreadsheet rows
 */
function parseSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  // Gets range with data present - https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange
  const [columnNames, ...data] = sheet.getDataRange().getValues();

  const parsedColNames = extractPriceInfo(columnNames);

  /* Testing extractPriceInfo func
  for (let i = 0 ; i < parsedColNames.length; i++){
    Logger.log(`Priced items: ${parsedColNames[i].name}, cost: ${parsedColNames[i].cost}`);
  }
  */
  const { start, end } = getItemColumnIndexes(parsedColNames); // Meow lesson: destructuring

  // Logger.log(`Columns with prices: ${start}-${end} (inclusive)`);

  /*
  Logger.log(
    "Extracted costs:",
    // Pretty print json
    JSON.stringify(
      costs.filter(c => c.cost !== null),
      null,
      2
    )
  );
  */

  let rowData = [];
  for (let i = 0; i < data.length; i++) {
    if (!validRow(data[i])) {
      break;
    }

    rowData.push(parseRow(parsedColNames, data[i], start, end)); // !! parseRow now returns rowData obj
  }

  return rowData;
}

/**
 * Checks if row is valid or not
 *
 * @param row
 * @returns false if all columns are empty
 */
function validRow(row) {
  // ["hi", "hello"]
  return !row.every(e => !e);
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
 * Gets the start and end (inclusive) indices for columns for item quantities
 *
 * @param parsedColNames array of extractPriceInfo
 */
function getItemColumnIndexes(parsedColNames) {
  const start = parsedColNames.findIndex(e => e.parsedColNames !== null);
  let end;

  // Iterate from start to find first with null
  for (let i = start; start < parsedColNames.length; i++) {
    if (parsedColNames[i].cost === null) {
      // Break before setting `end` since we want previous loop index (not current)
      break;
    }

    end = i;
  }

  // TODO: Handle if end isn't found
  return { start, end };
}

/**
 * Process row data
 * @param: parsedColNames -> column names w/ the text, cost, etc organized in an obj
 *    start, end inclusive indices of col with menuItems
 *    row: the row data on the sheet
 *    row[i] refers to col i of the row passed into this func
 *
 * Returns: a row obj {custName: customer name, custNo: unique # for current batch,
 *    order: arr of {menuItem, qty} that contains name of menu item paired w/ qty,
 *    comment: additional specifications from customer abt order}
 *
 * Will be passed into the template
 */
function parseRow(parsedColNames, row, start, end) {
  // create recipt etc

  Logger.log("Name of customer: " + row[NAME_COL]);

  // order: {menuItem, quantity}
  let order = [];

  // iterates through the cols with menuItems
  for (let i = start; i <= end; i++) {
    if (row[i] === null) {
      continue;
    } else {
      // add to array of orders
      // helpp
      order.push({ menuItem: parsedColNames[i], qty: row[i] });
    }
  }

  Logger.log("Comment: " + row[row.length - 1]);

  // let rowData = {custName: row[NAME_COL], custNo: custNo
  // order: {menuItem, qty}, comment: row[row.length-1]};
  // comment can be empty

  custNo += 1;

  // TODO: write/call function that gets total cost dynamically

  return {
    custName: row[NAME_COL],
    custNo: custNo,
    order: order,
    comment: row[row.length - 1]
  };
}

function replaceName(name, num) {
  document.getElementsByTagName("h1").innerHTML = name;
  document.getElementById("p1").innerHTML = num;
}
/**
 *
 * returns paragraph-type HTML element for text
 */
function insertItem(item, qty) {
  // want: <p><span class ="item-qty">1</span><span class = "item-name">name</span></p>
  const para = document.createElement("P");
  const qtySpan = document.createElement("SPAN");
  qtySpan.className = "item-qty";
  qtySpan.innerHTML = qty;
  para.appendChild(qtySpan);

  const itemSpan = document.createElement("SPAN");
  itemSpan.className = "item-name";
  itemSpan.innerHTML = item;
  para.appendChild(itemSpan);

  return para;
}

/**
 *
 * @param orders: array of obj {menuItem, qty}
 */
function curateOrders(orders) {
  const parent = document.getElementById("orders");

  for (let i = 0; i < orders.length; i++) {
    parent.appendChild(insertItem(orders[i].menuItem, orders[i].qty));
  }
}

function addComment(comment) {
  const para = document.getElementById("comments");
  if (comment === null) {
    para.parentNode.removeChild(para);
  } else {
    const addInfo = document.createTextNode(comment);
    const pElement = document.createElement("P");
    pElement.appendChild(addInfo);

    para.appendChild(pElement);
  }
}

/**
 * Creates a receipt page / PDF
 *
 * NOTE: reference this to call functions from templates:
 * https://developers.google.com/apps-script/guides/html/templates#calling_apps_script_functions_from_a_template
 *
 */
function createReceipt() {
  return HtmlService.createTemplateFromFile("template").evaluate();
}
