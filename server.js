const NAME_COL = 4;

const ss = SpreadsheetApp.openById(
  "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
);
const sheet = ss.getActiveSheet();

function parseSheet() {
  
  if (!checkColumns()) {
    // add init tracker cols if they don't exist
    addTrackerCols(sheet);
  }

  // idk if I still need this
  const [columnNames, ...data] = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();

  const colNames = sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()
    .reduce((arr, cols) => arr.concat(cols),[]); // flatten array; concat merges arr with []

    // for this current proj, there are 23 cols

  const parsedColNames = extractPriceInfo(colNames);
  /* Testing extractPriceInfo func
  for (let i = 0 ; i < parsedColNames.length; i++){
      if(parsedColNames[i].cost === "null"){
        continue;
       }
       Logger.log(`Priced items: ${parsedColNames[i].name}, cost: ${parsedColNames[i].cost}`);
  }
  */

  // these are from arrays and index from 0; Sheets class index from 1, so watch out!
  const { start, end } = getItemColumnIndexes(parsedColNames); // Meow lesson: destructuring

  // console.log(`Find price from ${start} - ${end}; ${parsedColNames[start]} - ${parsedColNames[end]}`);

  /*
  Calculating the amount we should charge the customer, and write this val into the "Total" col
  Good example for writing lots of stuff on a same row: https://webapps.stackexchange.com/questions/106503/how-do-i-write-data-to-a-single-range-in-google-apps-script
  */
  const itemList = parsedColNames.slice(start, end); // stuff with cost
  getChoSmoney(itemList, start);

  // create row data for unprinted receipts

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
  let end = parsedColNames.findIndex((e, i) => 
    e.cost === null && i > start); // findIndex has an optional para; second is index i

  // TODO: Handle if end isn't found
  return { start, end};
}

/**
 * Finds and writes the total amt the customer should pay Sue-ayi; saves/writes the $ value into the spreadsheet
 * 
 * @param: list of obj containing columns with costs
 */
function getChoSmoney(itemList, start){
  // sheet.getRange(i, 1, 1, sheet.getLastColumn()).getValues().reduce((arr, cols) => arr.concat(cols),[]);
  
  for(let i = 2; i <= sheet.getLastRow(); i++){ // for every row of customer data
    
    let custTotal = 0.0;
    const currentRow = sheet.getRange(i, 1, 1, sheet.getLastColumn())
      .getValues().reduce((arr, cols) => arr.concat(cols),[]);
    index = start;
    console.log(`Calculating ${currentRow[4]}'s total.`);

    itemList.forEach(function (item) {
      // currentRow[index] = quantity stored at the cell
      const qty = currentRow[index];
    
      if (qty){ // when not 0 or empty
        console.log(`Add ${qty} ${item.name} to total: ${custTotal}`);
        custTotal += item.cost * qty;
      }
      index += 1;
    } );

    // write to the i-th cell in the second column
    const rng = sheet.getRange(i, 2);

    // ISSUE: gets written as a date on the spreadsheet, but when i manually format, it goes back to a num
    // WHY
    rng.setValue(custTotal);
  }

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

  // gets all val of first col, starting from row 2,
  // NO cells from empty rows (:
  const cell = sheet.getRange(2, 1, sheet.getLastRow()-1)
    .getValues();

  for (let i = 0; i < cell.length; i++) {
    // need [0] bc the value is stored at the first col of a 2D arr with i rows
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
