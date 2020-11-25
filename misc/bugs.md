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

# Debugging tips for HTML and CSS

## Inspecting a Webpage (Derrick's Method)

To be frank, I still don't really understand this...

## Use Codepen

> CodePen is an online community for testing and showcasing user-created HTML, CSS and JavaScript code snippets. It functions as an online code editor and open-source learning environment, where developers can create code snippets, called "pens," and test them.

Specifically, there's an option within the code editor to "Analyze HTML" or CSS that helped me catch bugs, like an unclosed `<div>`, wrong way to comment `//`, and others!

# Image broken

Bug: image broken/doesn't load even though the image source exists.

```html
<p align="center">
  <img
    src="https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/images/homepage-graphic.png"
  />
</p>
```

**how to fix**
The link we copied wasn't the true image, but rather a github page. To get the link for the true image, do the following:

1. Go to the page https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/images/homepage-graphic.png
2. Press "Download"
3. Copy the link at the top

OR

1. go to the page
2. Right click the image
3. Select "open image in new tab"
4. Copy the link at the top
