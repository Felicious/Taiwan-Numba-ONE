# Bugs and Issues

Some peculiar errors I encountered and how I resolved them.

# The problem with Logger.log()

Google Apps Script has its own print statement, Logger.log(), but it automatically formats the string outputs into arrays.

I had this bug where I attempted to compare an empty cell to null, expecting the conditional to allow me to return the index of which the empty cell === null, but the function kept returning undefined after going through all of the empty cells.

```
function whereToStart() {
  const sheet = SpreadsheetApp.openById(
    "1pjD2wbT-Gt0fFefdpXvwek3dNguD0NG9APYqbT8v5J8"
  ).getActiveSheet();

  // gets all val of first col, including empty cells
  const cell = sheet.getRange("A2:A").getValues();
  /**
   * cell is: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
   */

  for (let i = 0; i < cell.length; i++) {
    Logger.log(cell[i]);
    if (cell[i] === null) {
      // always returns undefined ):
      return i;
    }
  }
}
```

`console.log()` still works on the Google Apps IDE,

and while `Logger.log(cell[i]);` displays [], `console.log(cell[i])` displays ""!
This means that Logger.log was misrepresenting my output, which confused me and caused my conditional to fail.

I'll just use `console.log()` from now on.
