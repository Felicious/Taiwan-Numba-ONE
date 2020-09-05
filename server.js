const NAME_COL = 4;

function parseSheet() {
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

  if (!checkColumns()) {
    // are the 1st 2 col modified?
    // no? modify it (:<
    addTrackerCols(sheet);
  }

  const [columnNames, ...data] = sheet.getDataRange().getValues();

  const parsedColNames = extractPriceInfo(columnNames);

  /* Testing extractPriceInfo func
  for (let i = 0 ; i < parsedColNames.length; i++){
      if(parsedColNames[i].cost === "null"){
        continue;
       }
       Logger.log(`Priced items: ${parsedColNames[i].name}, cost: ${parsedColNames[i].cost}`);
  }
  */

  const { start, end } = getItemColumnIndexes(parsedColNames); // Meow lesson: destructuring

  // create row data for unprinted receipts

  // find first range of "null"s in col "A1".
  const { aStart, aEnd } = findUnprintedRange(data);
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
 * @param 2D array
 *
 * Return range of receipts that will be printed
 *
 * Logic: return the indices of the first chunk
 * of rows that are "null" in the "Sent to Print"
 * col
 */
function findUnprintedRange(data) {
  const sheet = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  ).getActiveSheet();

  // gets all val of first col, including empty cells
  const cell = sheet.getRange("A2:A").getValues();
  let start = -1;
  let end = 0;

  // TODO: refactor this

  let i = 0;

  // find first null cell
  while (start == -1) {
    if (!validRow(cell[i])) {
      Logger.log("Insufficient data to print receipts.");
      break;
    }
    /**TEST:
     * Ran into unexpected issues because I added 2 blank cols into the row data to store total and print status
     * validRow returns false when even one cell is empty (is this correct?)
     * I'm kinda confused about how to read the code for validRow.
     *
     * !row.every(e => !e) ??
     *
     * When I take away either "!"" when i test the code in google apps script, I get an error saying that Google apps script doesnt recognize the key word "Every"
     *
     * I want to rewrite validRow where it would only return false when every cell in the row is empty. Unsure how to do so
     *
     * This is my logic:
     * I THINK (e => !e) checks and returns true if the input is not empty, so every(e => !e) returns true if all cells have values
     *
     * I don't understand the additional "!"
     *
     * These are questions i shouldve asked u before, but I think it's because i figure it out one time, forget the next time, and get confused by the e, !e the following time.
     *
     * Sorry meow, you're unwell right now so i don't want to bother u with questions. Hope u feel better, love <3
     */
    if (cell[i] === null) {
      start = i;
      // this should cancel this while loop, right..? i dont need to write break;
    }
    i += 1;
  }

  // start where we left off
  while (i < cell.length) {
    if (!validRow(cell[i])) {
      break;
    }
    if (cell[i] !== null) {
      break;
    } else {
      end = i;
    }
    i += 1;
  }
  return { start, end };
}

/**
 * Checks if row is valid or not
 *
 * @param row
 * @returns false if all columns are empty
 *          true if any column is filled
 */
function validRow(row) {
  // ["hi", "hello"]

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
  const sheet = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  ).getActiveSheet();
  return (
    sheet.getRange("A1").getValue() === "Sent to Print" &&
    sheet.getRange("B1").getValue() === "Total"
  );
}

// Add cols that will be used for data storage
function addTrackerCols(sheet) {
  sheet.insertColumnsBefore(1, 2);
  sheet.getRange("A1").setValue("Sent to Print");
  sheet.getRange("B1").setValue("Total");
}
