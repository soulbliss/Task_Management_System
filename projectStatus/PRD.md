##Current Tech Stack 
nextjs, tailwind, shadcn, typescript, neon, node posgres, nextauth(jwt).
### Technical Requirements
- Setup node posgres. 
- Implement basic username (email-ID) and password based authentication (use JWT)
- Other than Home page, all other pages are private pages and cannot be accessed without login.
    - The user should be redirected to dashboard page after logging
    - If the user is already logged in and tries to open the home page, then also he / she should be automatically redirected to dashboard page.
- Implement pagination for the task list on both front end and backend
- Create endpoints as you deem necessary based on the app requirements
- Users should be able to do CRUD on their tasks and not on tasks of other users (hence authentication is required both on front end and back end)
- Create endpoints to dynamically calculate the statistics required for dashboard page. Fetching all data on front end and then doing data manipulation on front end is not advisable (all required calculations should be done by backend)







**Business Logic**

- Total time to finish, i.e. actual time taken for a completed task or estimated time for a pending task is calculated as (end time - start time)
    - Put appropriate validations on front end and back end
- Total time lapsed for a pending task is (current time - start time)
    - If current time < start them, then lapsed time is 0 (i.e. no time has lapsed as the task will start in future)
- Balance estimated time to finish a pending task is (end time - current time)
    - if current time > end time, then this should be taken as zero, i.e. no further time is left to finish the task

**Notes**

- Follow MVC for APIs


