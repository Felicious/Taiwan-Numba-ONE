# Order Ticket

Written for my favorite restaurant, Taiwan Cafe, this project aims to reduce food order preparation time by automatically generating printable order tickets from customer Google Form submissions.

## Getting Started

[These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.]

### Prerequisites

- Open [Google Apps Script](https://script.google.com), a Google tool to automate and manage your Google apps, like Google Forms & Sheets.
- (don't need this anymore?)Sign up and enable [Google Cloud API](https://cloud.google.com/apis/docs/getting-started#enable_an_api)
  - MUST enable this in order to use the script to modify/complete actions
  - You will have to add a credit card for this, but Google APIs allow you to have free \$200 credit every month, so we likely won't exceed this and won't have to pay anything
  - Explain what this is LOL

### Deployment

1. Open the spreadsheet containing all the form responses
2. Open the _Tools_> _Script editor_ tab and it will take you to Google Apps Script [IDE](https://www.codecademy.com/articles/what-is-an-ide "What is an IDE?") to create a script to do things
3. Copy and paste my code, and save.
4. Click run and accept permissions, ignoring the warnings
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
   3. Send completed ticket to email to print - (not exactly related) [Send email from spreadsheet]{https://developers.google.com/apps-script/articles/sending_emails} - Email code i found somewhere:
      `// Email a link to the Doc as well as a PDF copy. MailApp.sendEmail({ to: user.email, subject: doc.getName(), body: 'Thanks for registering! Here\'s your itinerary: ' + doc.getUrl(), attachments: doc.getAs(MimeType.PDF) });`
   4. Mark entry on Google Sheet as checked for "Sent to print"
   5. Optional: send confirmation email to user?

## Built with

## Author

Felicia Kuan

## Acknowledgments

- Derrick Lee, who tremendously helped in the development process
