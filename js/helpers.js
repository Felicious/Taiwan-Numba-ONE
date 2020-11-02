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
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

  sheet.insertColumnsBefore(1, 2);
  sheet.getRange("A1").setValue("Sent to Print");
  sheet.getRange("B1").setValue("Total $$");
}

export { checkColumns, addTrackerCols };
