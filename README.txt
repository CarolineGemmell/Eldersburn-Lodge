ELDERSBURN LODGE WEBSITE — GITHUB PAGES INSTRUCTIONS

IMPORTANT: Upload the files and the assets folder directly into the root of your GitHub repository.
Do not upload the ZIP file itself.

FILES TO UPLOAD:
- index.html
- styles.css
- script.js
- assets folder (with all images inside)
- README.txt (optional)

TO REPLACE THE CURRENT WEBSITE
1. Open your Eldersburn-Lodge repository on GitHub.
2. Delete or replace the existing index.html, styles.css and script.js.
3. Click Add file > Upload files.
4. Drag all contents of this folder onto the upload screen, including the assets folder.
5. Click Commit changes.
6. Open Actions and wait for Pages build and deployment to show a green tick.
7. Refresh the live site with Ctrl + F5.

CONNECTING THE CONTACT FORM
Open script.js on GitHub and find:
  contactEmail: "",
Put your email address inside the quotation marks, for example:
  contactEmail: "bookings@example.com",
The form will then open the visitor's email program with the enquiry completed.

UPDATING BOOKED DATES
Open script.js and find bookedRanges. Add each booking in this format:
  ["2026-08-14", "2026-08-18"],
Use year-month-day. Remove the sample dates and replace them with your real bookings.

NOTES
- This is a static website hosted free on GitHub Pages.
- The calendar does not automatically connect to another booking platform.
- The contact form does not collect payments.
