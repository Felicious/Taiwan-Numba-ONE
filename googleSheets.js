const START_ROW = 2;
const START_COL = 2;
const NAME_COL = 4;

/*
Returns: populate template with user order info
*/
function fillOrderTemplate() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lrIndex = sheet.getLastRow();

  Logger.log("Last row: " + lrIndex);
}

/**
 * Iterates over spreadsheet rows
 */
function parseSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  // Gets range with data present - https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange
  const [columnNames, ...data] = sheet.getDataRange().getValues();

  const menuItems = extractPriceInfo(columnNames);
  const { start, end } = getItemColumnIndexes(menuItems); // Meow lesson: destructuring

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
 * @param menuItems array of extractPriceInfo
 */
function getItemColumnIndexes(menuItems) {
  const start = menuItems.findIndex(e => e.menuItems !== null);
  let end;

  // Iterate from start to find first with null
  for (let i = start; start < menuItems.length; i++) {
    if (menuItems[i].cost === null) {
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
 *
 * Returns: a row object that will be passed into the template
 */
function parseRow(row, start, end) {
  // create recipt etc

  // Logger.log("Parsing row:\n", row);
  Logger.log("Name of customer: " + row[NAME_COL]);

  let quantity = [];
  let menuItems = [];

  for (let i = start; i <= end; i++) {
    if (row[i] === null) {
      continue;
    } else {
      quantity.push(row[i]);
      // TODO: get menu item name ): use index i
    }
  }

  // let rowData = {name: row[NAME_COL], qty: quantity,
  // order = menuItems, comment: row[row.length-1]};
  // comment can be empty

  // TODO: write/call function that gets total cost dynamically

  // return rowData;
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
