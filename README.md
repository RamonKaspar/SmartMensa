# SmartMensa

## Team Members
1. Lukas Mast
2. Ramon Kaspar
3. Alex Feng
4. Kiara Chau

## Project Description 
In the bustling academic environment of ETH and UZH, finding the perfect meal can be a daily challenge. Therefore we want to design SmartMensa, an innovative web app that will make life easier for ETH students, employees and external users.

### Project goals
The goal of SmartMensa is to create a user-friendly, accessible web application that simplifies and enriches the eating experience at ETH and UZH by providing real-time information on menus, nutritional content, allergy alerts, and personalized recommendations, all in one integrated platform. 

### Data Sources
These links are dynamically generated in the python scripts.

Mensa Menus from ETH: \
https://idapps.ethz.ch/cookpit-pub-services/v1/weeklyrotas/?client-id=ethz-wcms&lang={language}&rs-first=0&rs-size=50&valid-after={yyyy-mm-dd}&valid-before={yyyy-mm-dd}&facility={facility_id} \
Example link for ETH: \
https://idapps.ethz.ch/cookpit-pub-services/v1/weeklyrotas/?client-id=ethz-wcms&lang=de&rs-first=0&rs-size=50&valid-after=2023-11-27&valid-before=2023-12-04&facility=9

Mensa Menus from UZH: \
https://zfv.ch/{language}/menus/rssMenuPlan?menuId={facility_id}&type=uzh2&dayOfWeek={numberOfDayOfTheWeek} \
Example link for UZH: \
https://zfv.ch/en/menus/rssMenuPlan?menuId=509&type=uzh2&dayOfWeek=1


### Tasks
Here we present the key features of our app:

- *Comprehensive Menu Display:* The app features a real-time showcase of all available menus across various canteens in both ETH and UZH.
- *Detailed Menu Information:* Each menu item comes with a detailed breakdown of its nutritional content (i.e. ingredients)
- *Allergy Informations*: The user can select his allergies in the settings and the app highlights all selected allergens which are contained in the respective menu.
- *Price catergory*: Users can select their preferred price category (student, intern, extern).
- *Favourite Mensas*: Users can give their favourite mensas a heart which then stores their favourite mensas in a database.
- *Favourite Menus*: Users can give their favourite menus a star which stores it to the database. On the home page, users can click the edit button to see all their starred favourite menus on a seperate page.
- *Todays favourite menus*: On the home page, users can see their favourite menus which are available today.
- *Filtering*: Filter by name, location, currently open and favourite mensas.
- *Opening Hours*: Display whether a mensa is open and when the dining times are.
- *Sharing*: Feature to copy a menu in a nicely formatted way to send it to friends to suggest a menu.

## Milestones
Document here the major milestones of your code and future planned steps.\
- [x] Milestone 1: Create non-functional frontend
  - [x] Create react skeleton (all react components) and implement routes for BrowserRouter: #1 !1
  - [x] Implement and style the login- and homepage #4 !4
  - [x] Implement and style the mensa page #7 !8
  - [x] Refine mensa styling and make it functional #9 !10
  - [x] Hardcode all static mensa information (name, open hours etc.) #13 !15
  - [x] Add CSS styling for desktop devices #25 !27

- [x] Milestone 2: Make frontend functional (dynamic)
  - [x] Implement backend functionality to get the menus #6 !5
  - [x] Implement filter functions #12 !14
  - [x] Implement some settings #15 !17
  - [x] Implement share functionality #14 !16
  - [x] Restyle login page and adapt filter logic #21 !22
  - [x] Add smooth animation for filter and settings #23 !25

- [x] Milestone 3: Use webscraping to get the latest menus
  - [x] Get the menus for ETH mensas: #2 !2
  - [x] Get the menus for UZH mensas: #3 !3
  - [x] Run python scripts daily in backend to fetch the new menus and store them as JSON files #8 !9

- [x] Milestone 4: Personalize the web-app
  - [x] Add login functionality #5 !12
  - [x] Create favourite menus page and store the favourite menus in remote mongoDB user database #17 !19
  - [x] Display all favourite menus which are available today #18 !20
  - [x] Add functionality to store allergens and price class (student, intern, extern) in database #20 !21
  - [x] Add functionality to store favourite mensas in database #22 !24
  - [x] Add login and logout button to settings and destroy current session on server-side #24 !26


## Weekly Summary 

**Week 1:**\
In the first week, we focused on getting the menus with help of webscraping and built the basic frontend for our app. We noticed that for the mensa card component, the footer is too large, so will change that in the next week and we will also create a json file, in which we will sotore the hardcoded mensa information like opening times and location for the footer. Additionally, we will try to incorporate the login functionality into our app.

**Week 2:**\
In the second week, we managed to schedule the python script daily at 00:05 to fetch new menus by modifying the Dockerfile and installing python to the base [Node](https://hub.docker.com/_/node/) image together with the needed python packages. This took many commits to the main branch as there was no other way to test the deployment and as we are using an Express backend, in order to run the python scripts we had to spawn child processes. As we have no possibility to check errors on the VM in the kubernetes cluster, we added [serverlogs](http://lumast-project-express.course-fwe-2023.isginf.ch/serverlogs). We also improved the frontend and moved much of the hardcoded mensa information to a JSON file in the backend to store this data more centralized which makes it easier to change. We also added the user login functionality (this will allow us to store favourite menus and personalized settings per user).  

**Week 3:**\
In the third and last week, we used a mongoDB database to store user data. Users can now store their favourite menus by clicking the star icon on a menu box so they can see their favourite menus on the home page if they are available today. They can also edit their favourite menus on the favourite menus page where they see all their favourite menus stored (not only the once which are available today). They can also store their favourite mensas by clicking the heart icon either on the home page or on a specific mensa page. We also changed the registration process such that users can now chose their preferred price category (student, inter, extern) and their allergies in the registration process (both can be changed later in the settings). We also extensively tested our web app to find and fix bugs or logic errors in our code. We improved some styling and added more small functionalities like a share (copy to clipboard) feature where users can send todays menus in a nicely formatted way to their friends to suggest where and what they would like to eat today.  


## Versioning

Tags:
- Week 1: [v1.1.1](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/lumast_project_express/-/tags/v1.1.1)
- Week 2: [v1.4.0](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/lumast_project_express/-/tags/v1.4.0)
- Week 3: [v2.0.0](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/lumast_project_express/-/tags/v2.0.0)
