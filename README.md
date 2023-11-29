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
  - [x] Sub-task: Create react skeleton (all react components) and implement routes for BrowserRouter: #1 !1
  - [ ] Sub-task: Style the frontend using CSS
  - [ ] Sub-task: Hardcode all static mensa information (name, open hours etc.)

- [ ] Milestone 2: Make frontend functional
  - [ ] Sub-task: Create backend
  - [ ] Sub-task: Implement filter functions
  - [ ] Sub-task: Implement some settings

- [ ] Milestone 3: Use webscraping to get the latest menus
  - [ ] Sub-task: Get the menus for ETH mensas
  - [ ] Sub-task: Get the menus for UZH mensas
  - [ ] Sub-task: Run scripts weekly in backend

- [ ] Milestone 4: Personalize the web-app
  - [ ] Sub-task: Add login functionality
  - [ ] Sub-task: Add favourite menus functionality
  - [ ] Sub-task: Add favourite mensas functionality
  - [ ] Sub-task: Add personalized setting (allergens etc.)

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Milestone 1: ...
- Milestone 2: ...
- Milestone 3: ...
- ...



