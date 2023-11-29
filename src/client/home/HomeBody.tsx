import { Link } from "react-router-dom";
import "./HomeBody.css";

const mensas = [
  {
    name: "Zentrum (UZH)",
    locations: [
      { name: "uzh-untere-mensa-lunch", route: "505" },
      { name: "uzh-untere-mensa-dinner", route: "506" },
      { name: "uzh-obere-mensa", route: "507" },
      { name: "lichthof-rondell", route: "508" },
      { name: "raemi-59", route: "509" },
      { name: "platte-14", route: "520" },
    ],
  },
  {
    name: "Irchel",
    locations: [
      { name: "irchel", route: "180" },
      { name: "cafeteria-irchel-atrium", route: "512" },
      { name: "cafeteria-irchel-seerose-lunch", route: "513" },
      { name: "cafeteria-irchel-seerose-dinner", route: "514" },
    ],
  },
  {
    name: "Other",
    locations: [
      { name: "binzmuehle", route: "515" },
      { name: "cafeteria-cityport", route: "516" },
      { name: "cafeteria-zentrum-fuer-zahnmedizin", route: "517" },
      { name: "cafeteria-tierspital", route: "518" },
      { name: "cafeteria-botanischer-garten", route: "519" },
      { name: "cafeteria-plattenstrasse", route: "520" },
    ],
  },
  {
    name: "Zentrum (ETH)",
    locations: [
      { name: "archimedes", route: "8" },
      { name: "clausiusbar", route: "3" },
      { name: "dozentenfoyer", route: "5" },
      { name: "food-lab", route: "7" },
      { name: "mensa-polyterrasse-lunch", route: "9" },
      { name: "mensa-polyterrasse-dinner", route: "9" },
      { name: "polysnack", route: "10" },
      { name: "tannenbar", route: "11" },
    ],
  },
  {
    name: "Hönggerberg",
    locations: [
      { name: "alumni-quattro-lounge-lunch", route: "14" },
      { name: "alumni-quattro-lounge-dinner", route: "14" },
      { name: "bistro-hpi", route: "16" },
      { name: "food-market-green-day", route: "17" },
      { name: "food-market-grill-bbq", route: "18" },
      { name: "food-market-pizza-pasta-day", route: "19" },
      { name: "food-market-dinner", route: "18" },
      { name: "fusion-meal", route: "20" },
      { name: "fusion-coffee", route: "21" },
      { name: "rice-up", route: "22" },
    ],
  },
  {
    name: "Oerlikon",
    locations: [{ name: "octavo", route: "23" }],
  },
];

function HomeBody() {
  return (
    <main className="home-body-container">
      {mensas.map((mensa, index) => (
        <div key={index}>
          <h2>{mensa.name}</h2>
          <div className="mensa-buttons-container">
            {mensa.locations.map((location, idx) => (
              <Link key={idx} to={`/${location.name}`}>
                <button>{location.name}</button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

export default HomeBody;
