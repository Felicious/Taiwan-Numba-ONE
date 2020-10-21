## Useful Functions

### Google Sheets Built-ins

1. sheet.getDataRange().getValues() -> get all the cols and rows from the sheet.
   sheet is a variable assigned the value of the the Spreadsheet
2. sheet.getRange(parameter) -> getting a specific column. Use "A1:A" to get the entire column of A, starting from row 1
3. Write to a cell

```
var range = SpreadsheetApp.getActiveSpreadsheet().getRange("B5");
range.setValue("TEXT");
```

4.

## Retrieve Rows from Spreadsheet

Easiest way to go through rows of data, from [StackOverflow](https://stackoverflow.com/questions/10518084/retrieve-rows-from-spreadsheet-data-using-google-app-script)

`var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();`

Then use a loop

`for (i in data) {`

### Destructuring

Learning coding from Meow~ The following are lines of code Meowmeow wrote for me, and he used the concept of destructuring a 2D array to make the array a little more read-able.

`const [columnNames, ...data] = getGoogleSheetInfo();`

The concept of [head, ... tail], declaring an array in this fashion names the first index (in our ex, it's an arr of all column names) of the large array is named columnNames, and the rest of the arr elements are left alone.

`const { start, end } = getItemColumnIndexes(menuItems);`

The function getItemColumnIndexes() returns an object with two properties, and the declaration on the left saves the values returned in the obj properties as two separate variables. This is essentially a short version of:

`const object = getItemColumnIndexes(menuItems); const start = object.start; const end = object.end;`

### Regular Expressions

Herein lie notes on the subject that are extremely useful to find patterns in words. To extract the price from the name and description of Chinese menu items, Derrick used [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to find the pattern of a dollar sign directly followed by a number (no space!) `$price`

- Regular expressions are particularly useful when using the method _match()_, which takes the string combination you want to find in a piece of text as input. The parameter is typically a regular expression. [More details here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

  1. Captured groups that are unnamed are saved as an array (see how values are saved inside the arr [_match[]_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges))
  2. Refer to named capture groups using the call matches.groups.name
     1. matches is a var saving the value of the .match() call
        ex: `const matches = imageDescription.match(regexpSize);`
     2. name will be the name of the capture group
        ex: `(?<name>\w)`

- [Regular expression simulation](https://regex101.com/) so you can check if your hardly understandable string of characters like `\$(?<cost>\d+)` works as expected

_Concepts required to understand regex_
(Or rather, some concepts I need reminders of to remember them)

1. Backslash `\`, an _escape character_ so that I can use special characters or characters that might break a string
   - In uni, I used the command `\n` to make a new line, but if I actually wanted to write \n, not make a new line, I'd write `\\n`
2. Special characters that represent a wide range of characters:
   1. Any digit `\d`
   - If I wanted exactly 3 digits `\d\d\d` would match any 3 digit characters
   2. `\w` any letter or number, including underscore
   3. `\s` a white space character
   4. [See more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)
3. Dealing with more than single letters/ (called _quantifiers_)
   1. `+` indicates 1 or more
   2. `*` is 0 or more
   3. Characters in #1 & #2 are used after others. `\d+` means 1 or more digit.
   4. `?` means it's optional
   5. `^` negation of something.
4. Groups and ranges of characters
   1. After capturing a group of characters "x", save it into the variable "name": `(?<Name>x)`
      - Ex: `\$(?<cost>\d+)` saving a number immediately proceeding a dollar sign
   2. Ignore the following x `(?:x)`
      - An example of skipping the https/fps part and keeping the rest: `(?:https?|ftp)://([^/\r\n]+)(/[^\r\n]*)?`
      - Also a note about the above example, `\r\n` is the standard line-termination for text formats on the internet
5. Mistakes I've made
   1. I tried to "exclude" \$price and [description] from `$price name [description]` using (incorrectly):
      - `(?:\$\d+)` which excludes price, and
      - `(?:\[\])` which didn't even exclude the brackets [ ], not to mention what's inside the brackets
      - Typically, Derrick advises not to "exclude" expressions. Instead, group what you want to keep in [capture groups](https://javascript.info/regexp-groups), and try to write out the format of the expression (see #3 for more details)
   2. Incorrectly placed the `^` to capture "all characters except [" outside the brackets
      - Correct way: `[^\[]`
      - Wrong way: `^[\[]`
   3. Ignore the dollar sign by writing out the dollar sign, but only saving the dollar value in cost
      - `\$(?<cost>\d+)`

## Reading/Writing to Google Sheets

Basic things are to determine

1. which cells you'll write to
   - Use `sh.getRange(start, end)` for a row
2. Update them
   - A single cell, use
     `const cell = sheet.getRange(1,1); cell.setValue(2);`
   - Use `sh.updateValues(spreadsheetId, range, valueInputOption, _values)` for multiple rows and columns
   - [Documentation](https://github.com/gsuitedevs/apps-script-samples/blob/master/sheets/api/spreadsheet_snippets.gs)

# Why I can't use Document methods

What I've been working with until now has been Javascript on the browser side, while Apps Script runs on Google's servers, so I will have to be dealing with server-side Javascript for this project. Hurray.
The following are explanations from my love, Derricku!
Regular web pages in the browser, which is the only time where there's actually a document. Browsers load HTML, which then loads js. Compared to servers, they execute js without any HTML involved, which is why there isn't a document, or DOM.

This is why the HTML template doesn't know what a document is, because it's just strings within a server js script. Also, it's kind of an external thing compared to the apps script, you evaluate the HTML template from apps script, which is

server js -> evaluates template via inline scriplets -> HTML string

there isn't any HTML involved until the end, which isn't an actual document but rather a string.

vs the browser is

HTML string -> parsed and evaluated in browser -> JS is loaded and evaluated, with access to the DOM

HTML loads the JS as compared to apps script which is JS generating a HTML string

For an incredibly useful guide on HTML templating with Google Apps Script that I followed, please look at [Emily's github](https://github.com/emilyb7/HTML-templating-with-Google-Apps-Script)

# Middle of the Project Complete Overhaul

Originally, I approached this project like this:

1. User (Kevin-susu) runs my script
2. Script reads spreadsheet -> returns data
3. Take the data -> script generates html page from data -> returns html receipt
4. html -> script opens a page with the generated html
5. User downloads page

This was a script running on the server, where the script is run when the user runs the script through the spreadsheet menu.

Derrick explains that in step 3-4, once you have some html in your script, you can't just throw it at the user; the user has to explicitly open the page with the generated html. However, since you cannot simply pass the html to the user through data urls due to browswer security issues, there's no way to get the user to open the page.

Thus, the only working option is to have the user open a link to the scrip which is independent of the previous logic in steps 1-3.

The revised logical steps are:

1. User opens script web app [standalone scripts](https://developers.google.com/apps-script/guides/standalone)
2. script reads spreadsheet -> data
3. data -> script generates html page from data -> html
4. html -> served to user
5. user downloads page

Compared to the script running on the server before, this will be web app, which is run when the user loads the script url in their browser. The script then runs the logic on the server, and responds to the browser request with data.

click run -> script exec

vs

browser request -> script run -> script responds with data to browser

"So how you can think of it is like how a c++ program when you execute it, it runs the main() function. so when a user runs a script via the spreadsheet, it runs main(), but when a user runs the script via the web app, it runs doGet() instead.

they're independent from each other."

"you're writing a web app now, which means the function doGet(e) executed when the the browser sends a request to your script

so in order to run the function you send the app an http get request

which is just loading the script in your browser
doGet() is run on the server
I request a meowmeow pic, you doGet() which returns a meowmeow, and you respond with a pic
you're the server, I'm client
I just ask you for something, you do the thing, doGet(), and respond with the result

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

## falsey comparison

_Definition_: any empty/null value considered false like 0, null, undefined (From [Mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Falsy))

Referring the bug above, the if statement is fundamentally incorrect because `if ([""] === "")` is comparing an array to a string, which is incorrect.

- Since the first element of the array [""] is the empty string, I need to do the following instead.

```
`if(data[0][i] === "")`
```

- Alternatively, Derrick recommends `if(!cell[i][0])` since if cell[i] is an empty array [], cell[i][0] would return undefined, not ""
  so just checking if it's falsey compares the following:
  - if the first element string is empty
  - if there is no first element since undefined is considered falsey
  - This is equivalent to explicit checks like: `if (cell[i][0] === undefined || cell[i][0] === "")`

# Server, Client-side

APIs of the REST category and webpages use URLs to send or receive information from a web app or server. My lovely Derrick illustrates this exchange in the following example:

> When a browser makes a request, a letter is sent to the server with information on it, maybe like a request for what I want.
>
> For example, I (browser) can send Felicia (server) a letter. The outside of the letter, represented by the URL parameters, contains basic information about the things I am requesting from the server like {"meowmeow":"mimi", "type":"video}

Before moving on, I'd like to clarify that this is an example of an HTTP request from the browser to server requesting a Mimi video. Derrick would then expect a Mimi video served to him from the server in the form of a webpage?

Continuing with the analogy Derrick provided earlier,

> After receiving the contents of the request, the server processes the request with the function doGet(e). The parameter **e** is the information about the letter.
>
> Felicia, as the server, can read the letter, which has some requests for specific data regarding Mimi videos.
>
> There's two ways to send and receive information-- mostly with GET and POST
>
> GET: you can request parameters(? info), basically like writing stuff on the outside of the letter envelope, since it's on the outside, "anyone" who has passed the letter along can read it -- ie. browser will store that data in your history, shows up in logs, etc.
>
> POST: send an actual letter inside the envelope, which is the postData, or request body (the actual "content" of the request, as compared to request metadata in data requests) -- so since it's on the "inside" of the letter, the information is "safer" (assuming there's encryption), your browser won't save this information in the history

### Example of an actual GET request

There's an API endpoint @ /api/meowmeow which returns a picture of a meowmeow

But how do I tell the server which meowmeow I want?

I can tell the server some information:
/api/meowmeow?name=mimi
which becomes a json object / dictionary / map of {name: mimi}

Another way to conceptualize all this is to think of the endpoint as a "function" and the URL parameters are the function parameters as an object

/api/meowmeow?name=mimi

function meowmeow(obj){ ... }

meowmeow({"name": "mimi"})

# References

## Emily's Github

She wrote a very informative guide + demo on [Github](https://github.com/emilyb7/HTML-templating-with-Google-Apps-Script) about how to use Apps Script for using HTML templates when building a web app.

While referring to her source code, I noticed that Emily had an idiomatic way of writing Javascript that I definitely wanted to learn, since it looked way cleaner than my version. The following is what I learned from her.

### Idiomatic Method of Getting Column Data

The following method returns an array of the applicants' names from a column

```
function getApplicants() {
  return devs.getRange(2, 1, devs.getLastRow() - 1)
    .getValues()
    .reduce(function (a, b) { // flatten array
      return a.concat(b[0])
  }, []);
}
```

`getRange()` with three parameters returns a [specific column](https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow,-column,-numrows), and `getValues()` returns that column data as a 2D array.

`.reduce()` has 2 parameters; first one is a function(a, b), and second parameter is the initial value we start with, and here it's an empty array [] that we will fill up with `function(a,b)`

then for the function(a, b), the function is run for each value of the array

and "a" is the return value of the previous iteration as an "accumulator"

so essentially it's just combining all the first value in each "sub-array"

it should be somewhat equivalent to this code

const vals = devs.getRange(2, 1, devs.getLastRow() - 1)
.getValues();

let acc = []; // initial value for accumulator

for (let i = 0; i < vals.length; i++) {
acc.concat(vals[i][0])
}

return acc;

since getvalues is a 2d array right
so concat would be concatenating arrays. combining them

reduce just converts an array into a single value, it could be like

reduce to single number of the sum an array
reduce to single number of the max of array

or in this case, reduce to single array

flatting a 2d array would be like

[[1, 2], [3, 4, 5], [6, 7]]
to
[1,2,3,4,5,6,7]

#### get a single row

```
const names = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

  console.log(names);
```

Get 2D array, starting from row 1, col 1. Returns 1 row with sheet.getLastColumn() columns

## Struggles with UI/UX designs

Specifically, I was wondering how to design an interface that allows the user to request which receipts they wanted to print.

Derrick mentions:

> so if i have 30 ice cream flavors and you want 1 flavor what would you do
> you'd tell me which one you want right
> that's one way, you tell the server which one you want

This solution is the one Emily from Github uses, that I might heavily reference once more x:

Derrick also suggests another solution:

> alternatively you could just respond with the single oldest but still pending receipt
> but you don't want like a refresh to just suddenly mark it as done
> yeah if you want to respond with only 1 single receipt at a time, you'd need to either let the client pick which one, or the server picks
> i think it'll get a bit complicated when thinking about a good ux
> so i'd probably just start with something simple like the client requests row x
> to finish the other parts firs

Okay, I like the sound of this. I'll do both (':
