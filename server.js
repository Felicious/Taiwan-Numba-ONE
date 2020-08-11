const NAME_COL = 4;

function parseSheet() {
  const ss = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  );
  const sheet = ss.getActiveSheet();

  if (!checkColumns(ss)) {
    // are the 1st 2 col modified?
    // no? modify it (:<
    addTrackerCols(sheet);
  }

  const [columnNames, ...data] = sheet.getDataRange().getValues();
}
/**
 * Ensure that the first 2 columns are for our app purposes
 *
 * @param ss is the active sheet
 */
function checkColumns(ss) {
  const sheet = ss.getActiveSheet();
  if (
    sheet.getRange("A1").getValue() == "Sent to Print" &&
    sheet.getRange("B1").getValue() == "Total"
  ) {
    return true;
  } else {
    return false;
  }
}
/**
 * Add cols that will be used for data storage
 */
function addTrackerCols(sheet) {
  sheet.insertColumnsBefore(1, 2);
  sheet.getRange("A1").setValue("Sent to Print");
  sheet.getRange("B1").setValue("Total");
}
