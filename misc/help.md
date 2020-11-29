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

## Understanding Emily's code

Her [src code](https://github.com/emilyb7/HTML-templating-with-Google-Apps-Script/blob/master/Code.gs) had a lot of idiomatic JS things that I didn't immediately understand; the source of much of the confusion was regarding the callback logic.

While I was heavily _referencing_ her code, I was puzzling over `getData()`, specifically why it was necessary to index the first array element `[0]` after filtering `allData()` to a single row.

```
function findRowByName(name) {
  const allData = sheet
    .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();

  return allData.filter(function(row) {
    return row[4] === name; // 4 is the col where the names are stored
  })[0]; // filter returns an arr of elements that satisfy the condition
}
```

The function returns a 1D array containing the row data from the Sheet that matches the `name` passed in as the parameter.

The confusion lies in the return value of `.filter()` and why the `[0]` is necessary.

![1](../images/filtering-2D-array.jpg)

The main clarifying explanation is that `.filter()` returns an _array_ of elements `[ [row data] ]` that satisfies the condition. However, the element, the row data, is an array. So we have an array within an array, which isn't ideal. To just get the inner array, we index it with `[0]`, which gives us the first and only element of the outer array.

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

# falsey comparison

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

### A simple server-client interaction

Usually, I have difficulty absorbing lots of new technical information at once, so I made some doodles and jokes to help myself retain the information. Hopefully this is useful/entertaining to anyone.

![1](../images/httpRequest.jpg)

![2](../images/urlContents.jpg)

![3](../images/simpleHttpResponse.jpg)

1. Say that Capoo wants to request information from the server. As the client, he sends an HTTP request to the server. The contents of his request are stored as a url, with `/thing_he's_requesting?` before the question mark. Additionally, he specifically requests the server to "show-yu" the noods by elaborating: `name=shoyu`.

2. Thus, the server, who is the bunny Tutu, is given sufficient information to understand that Capoo wants ramen noodles in shoyu broth.

3. Within the server, Tutu has several pre-made, ready-to-order shoyu ramen available. These are static HTML pages, like `shoyuRamen.html` that she simply serves to Capoo. The server also includes a [status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), like "200 OK", which means the server successfully fulfilled the client's request and bunbun loves her meowmeow very much.

This concludes a **static** HTTP Request, where the client is requesting for the same, hard-coded content, which can be inefficient to curate when there's a lot of pages. Instead, HTML pages can be created and tailored to a client's request with **dynamic** sites, which I will illustrate next.

# Illustration of a Dynamic Site

![4](../images/dynamicHTTPRequest.jpg)

When Capoo asks for a specific type of nood, the web server recognizes that she'll need to process the HTTP request with a web application.

![5](../images/webApp.jpg)

Tutu passes the relatively complex request from the client to the web app, or server-side code. When the info is passed, it is often encoded so that the web app can easily process the request parameters.

It is similar to how restaurant servers often type and print an order so that the kitchen staff can actually read it. In regards to this project, the client's request is passed to the server code `doGet()` as `e`.

![6](../images/webApp2.jpg)

Once the web app identifies the intention of Capoo's request (for `/noods`) based on the URL, the chef acquires the recipe for shoyu ramen and searches for the required ingredients within the database. Thus the resulting bowl of ramen, created from an HTML template/recipe, where the chef specifically tailors this dynamically created HTML page from specific pre-existing data/ingredients from within the database.

If the client requested for further analysis on the data (so, more than just a data look-up), more functions must be written within the web app to handle those queries.

For the purpose of this example and doodle, however, the web app is only equipped with `cook()` to process ramen orders.

![7](../images/httpResponse.jpg)

Although not depicted in the illustration, the web application first passes the completed HTML page of ramen (with a status code of "200 OK") to Tutu, the web server/browser, so that Tutu can personally serve each piping-hot bowl of ramen to Tutu's love of her life, Capoo!

I wish I had a better understanding of what happens on the client-side and how the HTTP response is handled by the browser and served to the client, but I'm still a little bit in the dark. I'm glad that I had the opportunity to illustrate and better understand the server-side of the this process, though! Hope you enjoyed reading my goofy doodles and dad puns (:

## A Somewhat Confusing Example Involving Code

In lieu of a web app, the contents of the request Tutu (who is the web app) receives is the object `e`. You can read more about the [request parameters](https://developers.google.com/apps-script/guides/web#request_parameters) here, but I wanted to see the entirety of Capoo's `/noods?name=shoyu` request.

But how did Capoo make this mischeivous request in the first place?

First, he needed Chef Tutu's app URL, which is `https://script.google.com/macros/s/{ID of my web app}`.

However, since this web app is still in beta testing, Capoo needs to add `/dev`. What follows after is the contents of his request. The full HTTP request is the following:

`https://script.google.com/macros/s/{ID of my web app}/dev/noods?name=shoyu`

The script written within the web app (so inside the `Code.gs` file) instructs Tutu on how to fulfill Capoo (the client's) request. However, since I just wanted to scrutinize Capoo's request and not actually make a bowl of noodles for him, I wrote **"How Tutu Baits Capoo"** inside `Code.gs` to simply display the contents of the request.

Chef Tutu's reply to Capoo is found in **"Tutu's Reply to Capoo."** However, Capoo (who's expecting a bowl of ramen) might be disappointed that I wrote script to simply display Capoo's request back to him in JSON format.

**How Tutu Baits Capoo**:

```
function doGet(e) {
  // I'm just showing you your order; nothing to see here
  const s = JSON.stringify(e, null, 4);
  return HtmlService.createHtmlOutput(s);
}
```

**Tutu's Reply to Capoo**:

```
{
    "contextPath": "",
    "contentLength": -1,
    "parameters": {
        "name": [
            "shoyu"
        ]
    },
    "parameter": {
        "name": "shoyu"
    },
    "pathInfo": "noods",
    "queryString": "name=shoyu"
}
```

In short, the URL `https://script.google.com/macros/s/{ID of my web app}` represents the ramen shop Tutu owns. For Capoo to request noods, he needs to go to the URL and attach his request `/noods?name=shoyu` to that URL. The web app, Tutu, processes the order according to the instructions written in her employee manual, which represents the **backend script** within `Code.js`. Then, the web app displays results of the script (Tutu)'s work on the page.

This is more or less the code and client-server communication described in the art above (:

# Templating

Used to simply the process of creating a web page, templates serve as a structural base for web creation that the server-side script fills in the details. Templates are rendered on the server, so all of the logic will be on the server side.

For example, main page is a template that creates all the links to other things like selecting which receipt to print. That list of receipts would be generated on the server and part of the html. The receipts can link to another page like example.com/receipt and that receipt url will generate different template for the receipt.

### Derrick:

https://developers.google.com/apps-script/guides/html/reference/run#code.gs_2

google.script.run is on the client side, which lets you run a server side function via their abstracted api

google.script.run.getData(name); would be calling the server side getData(name) function from the client side,
adding .withSuccessHandler((data) => ...) means it will run that given handler when getData(name) is successful

so the logic flow would be

var name = document.getElementById("select").value;
// send name to server and call getData(name)
// server responds successfully with data and then runs the given function (withSuccessHandler) on the client side
function (data) {
document.querySelector("#devName").innerHTML = data.name;
document.querySelector("#devGithub").innerHTML = data.github;
document.querySelector("#devRole").innerHTML = data.role;
document.querySelector("#devLanguage").innerHTML = data.language;
document.querySelector("#github_img").src = data.img;
}
5h
google.script.run is an asynchronous client-side JavaScript API available in HTML-service pages that can call server-side Apps Script functions.

so it's essentially handling the client/server GET/POST requests for you, so it will make it very confusing what is client and server side

## Why I don't actually need templating in my project

for example, with

```
<html>
  <body>
    <b>
      <?= receipt.name ?>
    </b>
    <? for (var i = 0; i < receipt.orders.length; i++) { ?>
        Quantity:  <?= receipt.orders[i].qty ?>
        Name: <?= receipt.orders[i].name ?>
    <? } ?>
  </body>
</html>
```

is essentially what you already have written here
https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/js/webApp.js#L50-L55

the template expands to basically

```js
let output = "<html><body><b>" + receipt.name + "</b>";
for (var i = 0; i < receipt.orders.length; i++) {
  output += "Quantity: " + receipt.orders[i].qty;
  output += "Name:" + receipt.orders[i].name;
}

output += "</body></html>";
```

anythinig you put in <? here ?> uses js
everything else is just a big string

so like you have a template for your ramen,
you can swap out different things like noodles, broth etc,
"bowl" + noodlesVariable + broth + "chopsticks"

then once it's all put together in one big string, you give it to me

if it's like client side code then i would have to assemble the ramen myself after i get it from the server, which defeats the purpose of templating

## Use getCode()

This is a built in function for Google Apps Script that can help me debug and see what's going on better

[This example](https://developers.google.com/apps-script/guides/html/templates#index.html_6) shows how the template actually works

switch to the log (evaulated) tab, it is just a bunch of strings being appended

# References

## Emily's Github

She wrote a very informative guide + demo on [Github](https://github.com/emilyb7/HTML-templating-with-Google-Apps-Script) about how to use Apps Script for using HTML templates when building a web app.

While referring to her source code, I noticed that Emily had an idiomatic way of writing Javascript that I definitely wanted to learn, since it looked way cleaner than my version. The following is what I learned from her.

### Idiomatic Method of Getting Column Data

The following method returns an array of the applicants' names from a column

```js
function getApplicants() {
  return devs
    .getRange(2, 1, devs.getLastRow() - 1)
    .getValues()
    .reduce(function (a, b) {
      // flatten array
      return a.concat(b[0]);
    }, []);
}
```

`getRange()` with three parameters returns a [specific column](https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow,-column,-numrows), and `getValues()` returns that column data as a 2D array.

`.reduce()` has 2 parameters; first one is a function(a, b), and second parameter is the initial value we start with, and here it's an empty array [] that we will fill up with `function(a,b)`

then for the function(a, b), the function is run for each value of the array

and "a" is the return value of the previous iteration as an "accumulator"

so essentially it's just combining all the first value in each "sub-array"

it should be somewhat equivalent to this code

```
const vals = devs.getRange(2, 1, devs.getLastRow() - 1)
.getValues();

let acc = []; // initial value for accumulator

for (let i = 0; i < vals.length; i++) {
acc.concat(vals[i][0])
}

return acc;
```

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

```js
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

## A Progression of Receipt Designs

I thought it would be interesting to see how the first versions of my site/receipt look in comparison to the end result! This could also be used to show my growth (if any LOL) so that maybe I could feel proud later hehe

1. Very first working receipt request (11/12/20)

This one was achieved by typing in Mom's name in the request URL. Little to no formatting, other than choosing a font (Calibri) and colors.
![first_receipt](<../images/Screenshot%20(17).png>)

## Flexbox

I wanted to ensure the layout of my site looked nice on mobile too, so I thought [Flexbox's container-type layouts](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) were most suitable to compartmentalize the grids in my site.

The following is the result of an entire day's of coding ;-; I had trouble figuring out which CSS tricks to use to align the input box and button, resulting in ~4hrs of trial and (LOTS of) error. If you'd like to see the monstrosity I started with, [here it is](https://github.com/Felicious/Taiwan-Numba-ONE/issues/10)

![wowfinally](../images/flex-container-ex.png)

For future reference, Flexbox is container-ized, so `inputRow` is the parent container that holds the textbox and button elements.

Within the parent container, I needed to specify that I'm defining a flex container for this row using `display: flex`. Margin with 3 parameters indicates the top, horizontal, and bottom margins, respectively. I had auto in the 2nd parameter in the screenshot, but I ended up changing it to `1rem` (denoting 1 unit of the standard font size) so that the row is centered. I also removed `padding` because I didn't really see a visual difference in its inclusion.

The child containers are `flexInput` and `flexButton`. I wanted the textbox to elongate horizontally when the window size expanded, so I set the flex-grow value to 4, and the button to 1, so that the input box would be 4x longer than the button. The StackOverflow thread I referenced was [this](https://stackoverflow.com/questions/42421361/input-button-elements-not-shrinking-in-a-flex-container)

In the end, however, I removed `flex: 1;` from the button because flex grow was applied not to the button itself, but the space around it. Thus, there was an uncomfortable amount of white space around the button at larger window sizes.

**Question**: How do I make a button grow dynamically? Is it possible with flexbox?

lastly, the submit button was floating and not aligned with the yellow line of the textbox, so I used `align-self: flex-end;` to align the button with the bottom edge of the container.

### Padding vs Margin

There are so many attributes you can modify in CSS, and so it's quite overwhelming at first when I first started using them all. While coding, I noticed an important distinction:

- Padding controls the element's **intra**-spacial whitespace, so the whitespace within the button, container, etc
- Margin controls the element's **inter**-spacial whitespace, or the whitespace between objects

### DOMElement.style.display

I simply copied the example from making a tab and I didn't understand what all the lines meant. The `{some HTML element}.style.display` is a property that, when is set to "none," the element disappears. "Hidden" means it exists, but it's invisible to the eye.

Therefore, in this context below, the tabs that aren't displayed should physically disappear, not hidden, because the inactive objects from the other tabs shouldn't be there when the other tabs aren't active.

The following is how to set the value of the property in Javascript.

```js
function openTab(evt, evtType) {
  const tabContent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  const tabLinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  // set tab content box
  document.getElementById(evtType).style.display = "block";
  evt.currentTarget.className += " active";
}
```

This `style.display` property can also be set to "block", like in the code above, which makes the entire width of the screen that element (in our case, it's the tab content)

One more thing; this `style.display` property is set css more directly:

```css
.dropdown select {
  display: none;
}
```

## The Curse of Copying Code

WHAT DOES THIS MEAN? ;-;

I'm trying to make a dropdown menu to select customers to print. However, I'm having trouble understanding the javascript in the [code I copied](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select).

Thus, I've decided to comment it to better understand it.

### What is x?

```js
var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
```

Firstly, what is "custom-select"? In the html code, the dropdown menu is surrounded by a div with the class name "custom-select" that wraps around the `select` type of input with 13 different `options`.

Here's the code:

```html
<div class="custom-select" style="width:200px;">
  <select>
    <option value="0">Select car:</option>
    <option value="1">Audi</option>
    ...
    <option value="12">Volvo</option>
  </select>
</div>
```

Thus, x stores an array of elements, the first of which is select box itself, then the 13 options: `x = [{select box}, {option Select car: }, {option Audi}, ... {option Volvo}];`

DERRICK: is this correct? ;-; im so confused.

### The outermost for loop

Next I'm going to try to figure out what's going on in the outermost for loop, with the variables a and b.

### Linear Gradient

Unsure if there was a better way to achieve the split design, but I used linear gradient.

# Serving HTML as a web app

When beginning this project, I was confused about what [Serving HTML as a web app](https://developers.google.com/apps-script/guides/html#serve_html_as_a_web_app) really meant.

- I'm not going to go into too much detail about what sort of mess my brain was in, but...
- I thought that the server was "serving" the receipt to the user, which was why I was so confused about what my `doGet()` function that returns an `HtmlOutput` was meant to do.

Clarification: `doGet()` tells the script how to display the page users interact with to get info from your server. In other words, it's supposed to be your UI.

## Components of a Dynamic Site

> A dynamic site is one that can generate and return content based on the specific request URL and data

From [MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview)

The notable components are the web app, HTML template, and database.

### Web Application

Initially, I thought a web application was like a mobile app like Spotify; something a user interacted with to request information. However, the definition of a web app in the context of client-server web programming is:

> server-side code that processes HTTP requests and returns HTTP responses

# Form Submission and GET Requests

I learned a lot of unfamiliar coding terminology while working on the submit buttons for this project, so I can share with you (:

## Routing

First, I was completely unaware that **URL** stood for **uniform resource locator** "used to communicate and send requests to the server." The URI, or the **uniform resource identifier**, is used by any application that manages routing, and using a specific one like Node and ExpressJS gains you access to convenient methods like GET [and POST] that works with these requests.[^1]

**Question for Derrick**: what URI does Google Apps Script use? Does it have its own, modified version, like how it has its own version of JavaScript (like their .gs file type)?

In response to this question I posed to Derrick, I read about `google.script.url` an asynchronous client-side JavaScript API that can [query URLs to obtain the current URL parameters and fragment](https://developers.google.com/apps-script/guides/html/reference/url). I don't think this really relates much to my question, and it seems like this is used mostly in conjunction with `google.script.history` to use browser history in web apps.

However, the documentation mentions [`IFRAME`](<(https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)>), which is a state represented by another HTML page embedded into the current one. This concept is key to understanding the work-around Derrick employed to send the GET request-- a URL-- from the form back to the server and receive an HTML page with embedded new information(?) like the list of customer names who needs their receipt printed.

Note: Derrick says we don't need to care about iframes bc u hardly need to use it lol

### Key Components

After all of that confusion, I will now summarize the lecture (see footnote 1). When visiting any web app, the first page you see-- like the landing page of a website-- is the **root route**.

To ask the web app for specific information, you'll have to routing using a specific key word concerts for `mamamoo.kr/concerts`. Within the server code, there should be a function that handles GET requests for Mamamoo concert information `/concerts`, which will send a response back to the user. (See my [bunny illustrations](https://github.com/Felicious/Taiwan-Numba-ONE/blob/master/misc/help.md#a-simple-server-client-interaction) for more info!)

In summary, the key components of routing is the request (what specifically is being requested is found in the **path info**, like /concerts in our example), back-end script that designates how the response is constructed, and the response-- how it's served back to the user.

While the idea is simple, the specifics of which to implement is different across frameworks. It seemed simple in the demo of the lecture using Node.js, but it'll be different implementing routing on Google Apps Script.

**Question**: what's a framework vs API vs IDE vs software?

### References + More Info

[^1]: From Ray Villalobos's [lecture](https://www.linkedin.com/learning/mastering-web-developer-interview-code/how-does-routing-work-in-a-modern-web-application) "How does routing work in the modern web application" on LinkedIn, at the timestamp: 0:40.

[The concept of IFRAME](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)-- I don't think I completely get how to use it yet.
