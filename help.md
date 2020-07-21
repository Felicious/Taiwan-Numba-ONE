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

These are extremely useful to find patterns in words. To extract the price from the name and description of Chinese menu items, Derrick used [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to find the pattern of a dollar sign directly followed by a number (no space!) `$price`

- Regular expressions are particularly useful when using the method _match()_, which takes the string combination you want to find in a piece of text as input. The parameter is typically a regular expression. [More details here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

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
