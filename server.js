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
 * Print first chunk of receipts from the top of the sheet
 *
 * (default function when running script?)
 *
 * @param data : 2D array of arrays, where each array contains row data
 */
function printBulk(data) {
  // parse every row to check 1) row is valid & 2)if data[i][0]-- this is the print col-- is null
  //  if yes, print
  // if no, have u started printing yet? (use start flag) if not, look for where to print
  //                                     if yes, stop now

  const start = whereToStart();
  // check if whereToStart() row is completely empty

  let printInfo = [];

  for (let i = start; i < data.length; i++) {
    if (validRow(data[i])) {
      // check "Sent to Print col"
      if (!data[i][0]) {
        // printInfo.push(print(data[i]));
        // fill in col
        // TODO: look for built in function in Sheets Class that writes to a cell
        /**
         * Writing: row = i + 2, col A
         * Start at "A2" to "A11", for instance
         */

        writeSingleCell("A", 3 + 2, "yay");
      } else {
        console.log(`Ended print at row ${i}.`);
        break;
      }
    } else {
      // row is empty
      break;
    }
  }
}

// generate html info
function print(row) {}

function writeSingleCell(col, row, val) {
  const sheet = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  ).getActiveSheet();

  const range = col + row;
  sheet.getRange(range).setValue(val);

  /*
  This code doesn't work because it uses Advanced Google Services (https://developers.google.com/apps-script/guides/services/advanced),
  the API, and to use it, it needs to be enabled
  with some Cloud stuff and i dont wanna work on that right now.. 

  console.log(`Writing ${val}`);
  const rng = "Sheet1!" + col + row;
  const request = {
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: rng,
        values: val
      }
    ]
  };

  // second para is spreadsheetID
  const response = Sheets.Spreadsheets.Values.update(
    request,
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );*/
}

// find the first row index where the first col is empty
function whereToStart() {
  const sheet = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );

  // gets all val of first col, including empty cells
  const cell = sheet.getRange("A2:A").getValues();

  for (let i = 0; i < cell.length; i++) {
    if (!cell[i][0]) {
      //falsy that is equivalent to if (cell[i][0] === "")
      return i;
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

/**
 * @param e: request info
 *
 * a response to the client's HTTP Get request,
 * where our server sends back the receipt in html script
 *
 */
function doGet(e) {
  console.log(`Handling the request for ${e.parameter}`);

  // generate receipt from info stored in e, a JSON obj ie {"name": "alice", "n": "1"}
  receipt = 
  return HtmlService.createHtmlOutput
  .createTemplateFromFile('template')
  .evaluate();
}
