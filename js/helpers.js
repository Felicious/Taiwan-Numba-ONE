/**open stylesheet (in "Index") using include() */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
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

// Ensure that the first 2 columns are for our app purposes
function checkColumns(sheet) {
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

/**calls to check if these columns exist */
function getColumns(sheet) {
  if (!checkColumns(sheet)) {
    // add init tracker cols if they don't exist
    addTrackerCols(sheet);
  }
}

/**
 * check the cell with an "x" to indicate the row has been read
 */
function checkOff(row, col, sheet) {
  const range = sheet.getRange(row, col);
  range.setValue("x");
}
