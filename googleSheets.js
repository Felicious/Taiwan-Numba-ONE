/*
Returns: populate template with user order info
*/
function fillOrderTemplate() {
    let sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 2;
    let numRow = sheet.getRange("B2:C").getValues().length; // get last row number that's not empty?
    
  
    let startCol = 2;
    let numCol = 2;

    let data = sheet.getRange(startRow, numRow, startCol, numCol).val;

    for (var i = startRow; i < numRow; i++){
        Logger.log('Customer total: ' + data[i][startCol]);
    }
}

