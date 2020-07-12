/*
Returns: populate template with user order info
*/
function fillOrderTemplate() {
    let sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 2;
    let lrIndex = findLastRowIndex(
        sheet.getRange("E1:E").getValues() // col of customer names (cannot skip the title row!!)
    );
    Logger.log("Last row: " + lrIndex);
    let startCol = 2;

    let data = sheet.getRange(startRow, startCol, lrIndex).getValues();
    Logger.log('data is ' + data);

    /*
    for (var i = startRow; i < numRow; i++){
        Logger.log('Customer total: ' + data[i][startCol]);
    }
    */
}

/* 
    param: 2D array
    (i'm likely only going to use this for a single column,
    which is why column is passed in as a var, but it works for multiple)
    returns: index of the last non-empty cell/row
*/
function findLastRowIndex(col){
    let lrIndex;
    
    for(let i = 0; i < col.length; i++){
        let currentRow = col[i];
        let allEmpty = currentRow.every(
            (cell) => { return cell === ""; }
        );

        if(allEmpty){ // if current row is completely empty, exit
            break;
        } else {
            lrIndex = i;
        }
    }

    return lrIndex;
}

