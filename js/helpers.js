/**open stylesheet (in "Index") using include() */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

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
  if (row.every((e) => !e)) {
    //.every() true if every row is empty
    return false;
  } else {
    return true;
  }
  // cannot simply return !row.every() bc it would return false if ANY row is empty
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

/**
 * Takes url submitted by the user and attempts to open a sheet with it
 * @param userInput is possible url string
 *
 * Returns: active Google Sheet
 *    - additionally makes responsive changes to page
 *      to update user on status of their url submission
 */
function openSheetFromUrl(userInput) {
  let message = document.getElementById("message");
  message.style.color = "black";
  message.innerHTML = "validating url..";

  // TODO: change ifs to check if userInput begins with http://

  // check if valid
  if (userInput.length > 44) {
    try {
      const possibleSheet = SpreadsheetApp.openByUrl(userInput);

      message.innerHTML = "";
      return possibleSheet.getActiveSheet();
    } catch (err) {
      message.style.color = "red";
      message.innerHTML =
        'Couldn\'t find sheet from url. Make sure to include the "https://..." part too.';
    }
  }
  // This else might be antiquated since the site only requests the URL
  else {
    try {
      const possibleSheet = SpreadsheetApp.openById(userInput);
      message.innerHTML = "";
      return possibleSheet.getActiveSheet();
    } catch (err) {
      if (userInput.length < 44) {
        message.style.color = "red";
        message.innerHTML = "Sheet not found. Is the ID not long enough?";
        // TODO: check if all IDs need to be 44 characters
      }
    }
  }
}
