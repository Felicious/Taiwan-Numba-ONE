const START_ROW = 2;
const START_COL = 2;

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

  const costs = getCosts(columnNames);
  const { start, end } = getItemColumnIndexes(costs);

  Logger.log(
    "Extracted costs:",
    // Pretty print json
    JSON.stringify(
      costs.filter(c => c.cost !== null),
      null,
      2
    )
  );

  Logger.log(`Columns with prices: ${start}-${end} (inclusive)`);

  for (let i = 0; i < data.length; i++) {
    if (!validRow(data[i])) {
      break;
    }

    parseRow(data[i]);
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
 * gets costs from column names
 *
 * NOTE: Column names MUST have a $cost in name (no space between $ and cost)
 * example: "item name $14"
 *
 * returns array of objects:
 * {name: "column name", cost: "found cost"}
 *
 * @param columnNames array of column names
 */
function getCosts(columnNames) {
  // Find values in column name with $number,
  return columnNames.map(col => {
    const matches = col.match(/\$(?<cost>\d+)/);

    // No matches and no matching groups cost
    if (!matches || !matches.groups || !matches.groups.cost) {
      Logger.log("WARN: cost not found in:", col);
      return { name: col, cost: null };
    }

    return { name: col, cost: matches.groups.cost };
  });
}

/**
 * Gets the start and end (inclusive) indices for columns for item quantities
 *
 * @param costs array of getCosts
 */
function getItemColumnIndexes(costs) {
  const start = costs.findIndex(e => e.cost !== null);
  let end;

  // Iterate from start to find first with null
  for (let i = start; start < costs.length; i++) {
    if (costs[i].cost === null) {
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
 */
function parseRow(row) {
  // create recipt etc
  Logger.log("Parsing row:\n", row);
}

/**
 * Creates a receipt page / PDF
 *
 * @param rowData
 */
function createReceipt(rowData) {}
