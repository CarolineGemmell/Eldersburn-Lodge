ELDERSBURN LODGE WEBSITE VERSION 5

UPLOAD
1. Upload every file in this folder to the root of the GitHub repository.
2. Commit directly to main.
3. Wait for the Pages deployment green tick and refresh with Ctrl+F5.

AVAILABILITY
The public website uses the polished custom calendar. Add or remove booked nights in site-config.js under bookedDates using YYYY-MM-DD.
The Outlook published URL is retained in site-config.js for reference, but it is not embedded because the Outlook layout does not suit the website and a static GitHub Pages site cannot safely convert the Outlook feed into a custom calendar without a separate service.

PRICES
Update the prices and notes in site-config.js.

ENQUIRIES
The form is visual only until it is connected to an email form service.

OWNER CALENDAR
--------------
After upload, open:
https://carolinegemmell.github.io/Eldersburn-Lodge/admin.html

The owner page edits site-config.js through the GitHub API. You need a fine-grained GitHub personal access token restricted to the Eldersburn-Lodge repository with Contents read/write permission. The token is entered on the owner page and is not included in the website files.
