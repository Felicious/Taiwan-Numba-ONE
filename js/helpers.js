/**
 * Checks if row is all empty
 *
 * WARN: this might be an obsolete func since I've been implementing this differently
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
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

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

/**
 * check the cell with an "x" to indicate the row has been read
 */
function checkOff(row, col) {
  const range = sheet.getRange(row, col);
  range.setValue("x");
}

function getSheetId() {
  const userInput = getElementbyId("sheetUrl");
  let message = document.getElementById("message");
  message.innerHTML = "";

  // TODO: change ifs to check if userInput begins with http://

  // check if valid
  if (userInput.length > 44) {
    try {
      const possibleSheet = SpreadsheetApp.openByUrl(userInput);

      // return type: int
      return possibleSheet.getSheetId(); // built-in func of Google Sheets class
    } catch (err) {
      /* TODO: make the text box underline red to indicate error */
      message.innerHTML =
        'Couldn\'t find sheet from url. Make sure to include the "https://..." part too.';
    }
  }
  // This else might be antiquated since the site only requests the URL
  else {
    try {
      const possibleSheet = SpreadsheetApp.openById(userInput);
      return possibleSheet.getSheetId();
    } catch (err) {
      if (userInput.length < 44) {
        message.innerHTML = "Sheet not found. Is the ID not long enough?";
        // TODO: check if all IDs need to be 44 characters
      }
    }
  }
}
