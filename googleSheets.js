const START_ROW = 2;
const START_COL = 2;
const NAME_COL = 4;
let parsedColumns;
let custNo = 1;

// TODO: add calendar data obj for pick-up date

/**
 * Iterates over spreadsheet rows
 */
function parseSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  // Gets range with data present - https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange
  const [columnNames, ...data] = sheet.getDataRange().getValues();

  parsedColumns = extractPriceInfo(columnNames);

  /* Testing extractPriceInfo func
  for (let i = 0 ; i < parsedColumns.length; i++){
    Logger.log(`Priced items: ${parsedColumns[i].name}, cost: ${parsedColumns[i].cost},
      description: ${parsedColumns[i].detail}`);
  }
  */
  const { start, end } = getItemColumnIndexes(parsedColumns); // Meow lesson: destructuring

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

  // Logger.log(`Columns with prices: ${start}-${end} (inclusive)`);

  for (let i = 0; i < data.length; i++) {
    if (!validRow(data[i])) {
      break;
    }

    parseRow(data[i], start, end); // !! parseRow now returns rowData obj
    // TODO: pass i into function that makes the
    // order ticket to keep track of customer numbers
  }
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
 * gets costs, name of item, description from column names.
 *
 * NOTE: Column names MUST have a $cost in name (no space between $ and cost)
 * example: "$11 Taiwan sausage [very yummy]"
 *
 * returns array of objects:
 * {name: "found item name", cost: "found cost",
 *  detail: "found description"}
 *
 * Only returns complete obj of menu items; if not in req. format,
 * the column does not describe a menu item
 *
 * @param columnNames array of column names
 */
function extractPriceInfo(columnNames) {
  // Find values in column name with the above described format
  return columnNames.map(col => {
    const matches = col.match(/\$(?<cost>\d+)(?<item>[^\[]*)\[(?<des>[^\[]+)]/); // key info stored in 3 capture grps

    // No matches and no matching groups cost -> not menu item
    if (!matches || !matches.groups || !matches.groups.cost) {
      Logger.log("WARN: cost not found in:", col);
      return { name: col, cost: null, des: null };
    }

    return {
      name: matches.groups.item,
      cost: matches.groups.cost,
      detail: matches.groups.des
    };
  });
}

/**
 * Gets the start and end (inclusive) indices for columns for item quantities
 *
 * @param parsedColumns array of extractPriceInfo
 */
function getItemColumnIndexes(parsedColumns) {
  const start = parsedColumns.findIndex(e => e.parsedColumns !== null);
  let end;

  // Iterate from start to find first with null
  for (let i = start; start < parsedColumns.length; i++) {
    if (parsedColumns[i].cost === null) {
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
 * @param: start, end inclusive indices of col with menuItems
 *
 * Returns: a row obj {custName: customer name, custNo: unique # for current batch,
 *    order: arr of {menuItem, qty} that contains name of menu item paired w/ qty,
 *    comment: additional specifications from customer abt order}
 *
 * Will be passed into the template
 */
function parseRow(row, start, end) {
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
      order.push({ menuItem: parsedColumns[i], qty: row[i] });
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
