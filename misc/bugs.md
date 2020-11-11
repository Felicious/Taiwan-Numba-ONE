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

# Modules vs Files-- What's the Difference?

```
import { checkColumns, addTrackerCols, validRow } from "helpers.gs";
import { Order } from "OrderClass.gs";
```

In an attempt to make my main file shorter (250 lines to 200 lines), I moved some helper functions out to another file, but now I have this bug:

> SyntaxError: Cannot use import statement outside a module

Thankfully, Google Apps Script handles this confusion I have!

> You are not limited to a single server Code.gs file. You can spread server code across multiple files for ease of development. All of the server files are loaded into the same global namespace, so use JavaScript classes when you want to provide safe encapsulation.

Therefore, to fix this issue, I just need to remove all import statements and call all functions as if they're not written in separate server-side files (everything ending in .gs)! Thank you!!! <3
