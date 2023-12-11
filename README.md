# Project Title

[[_TOC_]]

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
Mensa Menus from ETH: https://ethz.ch/de/campus/erleben/gastronomie-und-einkaufen/gastronomie/menueplaene.html
Mensa Menus from UZH: https://www.mensa.uzh.ch/de/menueplaene.html

### Tasks
Here we present the key features of our app:

- *Comprehensive Menu Display:* The app features a real-time showcase of all available menus across various canteens in both ETH and UZH.
- *Detailed Nutritional Information:* Each menu item comes with a detailed breakdown of its nutritional content (i.e. ingredients)
- *Allergy Informations*: The user can select his allergies in the settings and the app automatically filter out/highlights the dishes which the user could not eat.
- *Filtering*: Filter out list of dishes by location, opening time and price.
- *Sorting*: Sort by name and location.
- *Opening Hours*: Display whether a mensa is open (eventually detailed opening times as well).
- *Sharing*: Feature to copy text directly or copy the link to send it via WhatsApp/…


## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the Dummy project you have to:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;
- then run:


### Local Development

Only change files inside the `src` directory.

**Client side**

All client side files are located in the `src/client` directory.

**Server side**

All server side files are located in the `src/server` directory.

### Local Testing

**run container for local testing**

```bash
docker build -t my-webapp .

docker run -it --rm -p 5173:5173 my-webapp
```
Open a browser and connect to http://localhost:5173

**run bash in interactive container**
```bash
docker build -t my-webapp src/.

docker run -it --rm -p 5173:5173 my-webapp bash
```


## Milestones
Document here the major milestones of your code and future planned steps.\
- [ ] Milestone 1: Create non-functional frontend
  - [x] Create react skeleton (all react components) and implement routes for BrowserRouter: #1 !1
  - [x] Implement and style the login- and homepage #4 !4
  - [x] Implement and style the mensa page #7 !8
  - [x] Refine mensa styling and make it functional #9 !10
  - [ ] Hardcode all static mensa information (name, open hours etc.) #13

- [ ] Milestone 2: Make frontend functional (dynamic)
  - [x] Implement backend functionality to get the menus #6 !5
  - [x] Implement filter functions #12 !14
  - [ ] Implement some settings
  - [ ] Implement share functionality

- [ ] Milestone 3: Use webscraping to get the latest menus
  - [x] Get the menus for ETH mensas: #2 !2
  - [x] Get the menus for UZH mensas: #3 !3
  - [x] Run python scripts daily in backend to fetch the new menus and store them as JSON files #8 !9

- [ ] Milestone 4: Personalize the web-app
  - [x] Add login functionality #5 !12
  - [ ] Add favourite menus functionality
  - [ ] Add favourite mensas functionality
  - [ ] Add personalized setting (allergens etc.)

- [ ] Milestone 5: Use gitlap pipeline to run python in backend
  - [ ] Install chrome-driver, chromium-browser and python with all the necessary packages

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

**Week 1:**\
In the first week, we focused on getting the menus with help of webscraping and built the basic frontend for our app. We noticed that for the mensa card component, the footer is too large, so will change that in the next week and we will also create a json file, in which we will sotore the hardcoded mensa information like opening times and location for the footer. Additionally, we will try to incorporate the login functionality into our app.

**Week 2:**\
In the second week, we managed to schedule the python script daily at 00:05 to fetch new menus by modifying the Dockerfile and installing python to the base [Node](https://hub.docker.com/_/node/) image together with the needed python packages. This took many commits to the main branch as there was no other way to test the deployment and as we are using an Express backend, in order to run the python scripts we had to spawn child processes. As we have no possibility to check errors on the VM in the kubernetes cluster, we added [serverlogs](http://lumast-project-express.course-fwe-2023.isginf.ch/serverlogs). We also improved the frontend and moved much of the hardcoded mensa information to a JSON file in the backend to store this data more centralized which makes it easier to change. We also added the user login functionality (this will allow us to store favourite menus and personalized settings per user). 

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [v1.1.1](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/lumast_project_express/-/tags/v1.1.1)
- Week 2: [v1.4.0](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/lumast_project_express/-/tags/v1.4.0)
