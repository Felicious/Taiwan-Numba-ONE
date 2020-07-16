# Order Ticket

Written for my favorite restaurant, Taiwan Cafe, this project aims to reduce food order preparation time by automatically generating printable order tickets from customer Google Form submissions.

## Getting Started

In order to run the [Google Apps Script](https://script.google.com), a Google tool to automate and manage your Google apps, like Google Forms & Sheets, you will need to follow these instructions:

1. Open the Taiwan Cafe spreadsheet containing all the form responses
2. Open the _Tools_> _Script editor_ tab and it will take you to Google Apps Script [IDE](https://www.codecademy.com/articles/what-is-an-ide "What is an IDE?") to create a script to do things

[These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.]

### Deployment

1. Open the spreadsheet containing all the form responses
2. Open the _Tools_> _Script editor_ tab and it will take you to Google Apps Script [IDE](https://www.codecademy.com/articles/what-is-an-ide "What is an IDE?") to create a script to do things
3. Copy and paste my code into the editor, and save.
4. Click run and accept permissions, ignoring the warnings (add pics?)
   1. On the pop-up window saying "Authorization required," select _Review Permissions_.
   2. Sign into your Google account, and when the window alerts you that this app isn't verified, select the small _Advanced_ text at the bottom.
   3. Then, select the small underlined text that says "\*Go to [your project name](unsafe)"
   4. Note: we can ignore the warnings because I wrote this app, so you know it's safe, haha.
5.

## Behavior

1. Customer Google Form Submit runs ticket generating script
2. Google Apps Script
   1. Gather user input
      - Google Forms
      - [Google Sheets](https://developers.google.com/apps-script/guides/sheets#reading_data)
   2. Create printout based on [HTML template](https://developers.google.com/apps-script/guides/html/templates "Google HTML services doc")
   - Script will parse + save Customer order + info as an object
   - Object passed to HTML template. [See example here](https://developers.google.com/apps-script/guides/html/templates#calling_apps_script_functions_from_a_template)
   3. Send completed ticket to email to print - (not exactly related) [Send email from spreadsheet]{https://developers.google.com/apps-script/articles/sending_emails} - Email code i found somewhere:
      `// Email a link to the Doc as well as a PDF copy. MailApp.sendEmail({ to: user.email, subject: doc.getName(), body: 'Thanks for registering! Here\'s your itinerary: ' + doc.getUrl(), attachments: doc.getAs(MimeType.PDF) });`
      - Note: sorry, Kevin-叔叔, your email will get bombarded
   4. Mark entry on Google Sheet as checked for "Sent to print"
   5. Optional: Invite user to [Google Calendar event](https://developers.google.com/apps-script/quickstart/forms "The useful how-to")?
   - This would be cool to implement, but it would require Kevin-叔叔 to indicate the pick-up time somewhere

## Assumptions about User Inputs

In order for this script to work, it assumes that the user will input data into the form a specific way. If the user fails to do so, _script may break_.

1. Customer name is found on the 5th column (labeled "E", with the index 4 for programmers) of the Google Sheet
2. The first column and row are used as names for each respective part.
3. Comments are saved as the final data element of the Google Sheet.
4. Food items are listed with the following naming scheme:
   `$price item_name [description]`
   Only _item name_ will be listed with the quantity on the Order Ticket
5.

## Testing

## Author

Felicia Kuan

## Acknowledgments

- Derrick Lee, who gave tremendously useful advice on [coding best practices](link to blog?) and actively contributed to the writing of code.
