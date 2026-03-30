# teamE-prototype

Write the following code:
1. React Front-end (CMA)
  a. You will need to use React Router to create multiple pages for React. See
  https://www.w3schools.com/react/react_router.asp for more information.
  b. Determine how users will navigate between the pages. You will need a menu system for
  at least some of the pages
  c. Create a home page with a hero section
  d. Create a form to management the content on the website (hyperlinks and documents).
    For now, you are just creating the user interface and the form will not do anything.
    Include at least the following fields in your form
    i. Name of hyperlink or document
    ii. URL of link
    iii. Content owner
    iv. Job Position (Persona) that this hyperlink or document is for. We will begin with
    two job positions – the underwriter and the business analyst. Personas are
    provided for both positions. Research on the web to find out more concerning
    what an insurance writer is and does.
    v. Last modified date
    vi. Expiration date of the link/document
    vii. Whether it is reference content or workflow content
    viii. Document status – make a guess as to what statuses they might have
  e. Create a form to manage employees. Determine what fields you may need for
employees. Note that in the future, the content owners are company employees.
  f. Organize the links provided in the Persona document under the two personas. For now,
just create the page(s) with dummy links that have the names provided in the
document.
2. Express and PostgreSQL Back-end Servers (CDA)
  a. Create a simple employee table with fields matching the front end and populate it with
  at least 5 employees.
  b. Create a simple content management table with fields matching the front end and
  populate it with at least 5 items.
  c. Create a Supabase bucket to hold a sample of Word, Excel, PowerPoint, and PDF files.
  Create dummy test files for now.
  d. Write a Typescript/node.js program named server.js that uses PrismaORM to access and
  display the data entered in the employee and content tables.
  The following are optional, although if you are able to accomplish this, your team will be
  even better prepared for iteration 1.
  e. (Optional) Create an Express server with port 3000 that uses PrismaORM to access the
  data on the PostgreSQL server.
  f. (Optional) Use console.log() to display the data from the database for the following
  Express URL endpoints
    i. /employee lists the employee data
    ii. /servicereqs lists the service request data
    iii. /assigned lists the service requests with assigned employees
  g. (Optional) You should be able to test the server by going to the following URLs :
    i. localhost:3000/employee
    ii. localhost:3000/servicereqs
    iii. localhost:3000/assigned
  Right-click on the above web pages and select Inspect. Then click on Console to see the
  data displayed.
