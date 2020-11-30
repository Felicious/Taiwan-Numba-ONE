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

# Stylesheet doesn't open on Google Apps Script

```html
<link
  rel="stylesheet"
  href="https://raw.githubusercontent.com/Felicious/Taiwan-Numba-ONE/master/html/css/styles.css"
/>
```

The resulting webpage does not contain any CSS because for some reason, the CSS file isn't open/applied to the HTML page.

**The cause**: The error is actually caused by Google's way of protecting against malicious scripts; when the Apps Script API detects any links or files that are scripts within a page, it deletes the header, causing the generated file to be blank.

To fix this, Google Apps Script Docs asks developers to follow this set of [Best Practices](https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript) that advises to create an HTML file specifically for CSS and include this call within `main.gs`:

```js
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
```

Then, replace erroneous HTML code mentioned above with: `<?!= include('Stylesheet')>`

# Routing <form action="/orders" method="get"> fails

This above code works on a regular web app, and usually you can type that line to go to "example.com/orders" but doesn't work for Apps Script.

According to Derrick,

> since it's on google with their long weird url it would go to script.google.com/orders
> but also your web app runs in an iframe so it's not atually on script.google.com
> it runs on some weird url like
> https://n-5yl7c7llzo5bc35qmgkh4nl5yrvt7llhuary2ei-0lu-script.googleusercontent.com/userCodeAppPanel
> iframes are like embedding a page in another page

Thus, to work around this problem, Derrick replaced the above code with this line: `<form action="<?= ScriptApp.getService().getUrl() ?>/orders" method="get">`

He got this info from this Stack Overflow [thread](https://stackoverflow.com/questions/15668119/linking-to-another-html-page-in-google-apps-script), wow so useful haha.

Read more about [what routing is]([link will be added later lol](https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/misc/help.md#form-submission-and-get-requests)) on my other doc!

# Destructuring

My function getRowNum() returns an array and a row number as an object {currentRow, i} that getReceipt() saves to {currentRow, rowNum}. However, rowNum evaluates to undefined while i is a real number.

How to solve:

Destructuring shorthand explained [here](https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/misc/help.md#destructuring):
