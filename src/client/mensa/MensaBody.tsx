import "./MensaBody.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { BsHeartFill } from "react-icons/bs";
import { RiExternalLinkFill } from "react-icons/ri";

function MensaBody() {
  const mensaMapping = new Map<string, string>([
    ["archimedes", "8"],
    ["clausiusbar", "3"],
    ["dozentenfoyer", "5"],
    ["food-lab", "7"],
    ["mensa-polyterrasse-lunch", "9"],
    ["mensa-polyterrasse-dinner", "9"],
    ["polysnack", "10"],
    ["tannenbar", "11"],
    ["alumni-quattro-lounge-lunch", "14"],
    ["alumni-quattro-lounge-dinner", "14"],
    ["bistro-hpi", "16"],
    ["food-market-green-day", "17"],
    ["food-market-grill-bbq", "18"],
    ["food-market-pizza-pasta-day", "19"],
    ["food-market-dinner", "18"],
    ["fusion-meal", "20"],
    ["fusion-coffee", "21"],
    ["rice-up", "22"],
    ["octavo", "23"],
    ["uzh-untere-mensa-lunch", "505"],
    ["uzh-untere-mensa-dinner", "506"],
    ["uzh-obere-mensa", "507"],
    ["lichthof-rondell", "508"],
    ["raemi-59", "509"],
    ["platte-14", "520"],
    ["irchel", "180"],
    ["cafeteria-irchel-atrium", "512"],
    ["cafeteria-irchel-seerose-lunch", "513"],
    ["cafeteria-irchel-seerose-dinner", "514"],
    ["binzmuehle", "515"],
    ["cafeteria-cityport", "516"],
    ["cafeteria-zentrum-fuer-zahnmedizin", "517"],
    ["cafeteria-tierspital", "518"],
    ["cafeteria-botanischer-garten", "519"],
    ["cafeteria-plattenstrasse", "520"],
  ]);

  const getFacilityID = (mensaName: string) => {
    return mensaMapping.get(mensaName);
  };

  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");
  const [currentDayMeals, setCurrentDayMeals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const facilityID = getFacilityID(mensaName);
        const response = await fetch(`/menus/${facilityID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const mealsData = await response.json();

        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const currentDate = new Date();
        const currentDay = daysOfWeek[currentDate.getDay()] as string;

        // Logic to determine if dinner or lunch
        if (mealsData[currentDay]) {
          if (
            (mealsData[currentDay].Lunch.length > 0 &&
              mensaName.includes("lunch")) ||
            (mealsData[currentDay].Lunch.length > 0 &&
              mealsData[currentDay].Dinner.length === 0)
          ) {
            setCurrentDayMeals(mealsData[currentDay].Lunch);
          } else if (mealsData[currentDay].Dinner.length > 0) {
            setCurrentDayMeals(mealsData[currentDay].Dinner);
          } else {
            // here I would add the logic if there is no menu available for the current day
            setCurrentDayMeals([]);
          }
        } else {
          setCurrentDayMeals([]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMeals();
  }, [mensaName]);

  const openWebpageOfMensa = () => {
    window.open("https://www.google.de/?hl=de", "_blank");
  };

  return (
    <>
      <main className="mensa-body-container">
        <div className="row-one-title">
          <h2>{changeName(mensaName)}</h2>
          <p className="mark-as-favorite">
            <BsHeartFill size={20} />
          </p>
        </div>
        <div className="second-row-tags">
          <div className="location-tag">Zentrum (UZH)</div>
          {/* HARDCODED FOR NOW!!!! */}
          <div className="open-closed-tag">Open</div>
          {/* HARDCODED FOR NOW!!!! */}
        </div>
        <div className="menu-container">
          {/* Create for each menu a component */}
          {currentDayMeals.map((meal, index) => (
            <div key={index} className="menu-component">
              <h3 className="menu-title-and-price">
                <p className="menu-title">{transformMensaTitle(meal)}</p>
                <p className="menu-price">{getPrice(meal, "external")}</p>
              </h3>
              {/* change later: priceCategory should be retrieved from user preference */}
              <div className="menu-line">{}</div>
              <div className="ingredients-component">
                {meal.meal_description}
              </div>
              <div className="allergies-component">{meal.allergens}</div>
              <div className="last-row-actions">
                <FontAwesomeIcon icon={faStar} style={{ fontSize: "2em" }} />
                <FontAwesomeIcon
                  icon={faShareSquare}
                  style={{ fontSize: "2em" }}
                />
              </div>
            </div>
          ))}
          {currentDayMeals.length === 0 && (
            <div className="banner-no-menues-available">No menus available</div>
          )}
          <div className="footer-container">
            {/* ALL INFORMATIONS HARDCODED FOR NOW */}
            <div className="footer-times">
              <h3>Opening Times</h3>
              <div>17.00-18.00</div>
              <h3>Dining Times</h3>
              <div>17.00-18.00</div>
            </div>
            <div className="footer-location">
              <h3> Location </h3>
              <div>HG E11</div>
              <div>Künstlergasse 10</div>
              <div>8001 Zürich</div>
              <div className="footer-maps-link">
                <a href="https://maps.app.goo.gl/1qFBdfGYNwKsZ87X8">
                  Show in Google Maps
                </a>
              </div>
            </div>
          </div>
          {/* LINK HARDCODED FOR NOW */}
          <div className="visit-website" onClick={() => openWebpageOfMensa()}>
            <RiExternalLinkFill style={{ fontSize: "2em" }} />
            <div>Visit Homepage</div>
          </div>
        </div>
      </main>
    </>
  );
}

function transformMensaTitle(meal: any): string {
  if (meal.line_name) {
    if (meal.meal_name) {
      return meal.line_name.toUpperCase() + " | " + meal.meal_name;
    } else {
      return meal.line_name.toUpperCase();
    }
  }
  return "NOTHING";
}

function changeName(oldMensaName: string): string {
  // Here we can handle excpetional cases
  switch (oldMensaName) {
    case "uzh-untere-mensa-lunch":
      return "UZH Untere Mensa (Lunch)";
    case "uzh-untere-mensa-dinner":
      return "UZH Untere Mensa (Dinner)";
    case "uzh-obere-mensa":
      return "UZH Obere Mensa";
    case "cafeteria-irchel-seerose-lunch":
      return "Cafeteria Irchel Seerose (Lunch)";
    case "cafeteria-irchel-seerose-dinner":
      return "Cafeteria Irchel Seerose (Dinner)";
    case "mensa-polyterrasse-lunch":
      return "Mensa Polyterrasse (Lunch)";
    case "mensa-polyterrasse-dinner":
      return "Mensa Polyterrasse (Dinner)";
    case "alumni-quattro-lounge-lunch":
      return "Alumni Quattro Lounge (Lunch)";
    case "alumni-quattro-lounge-dinner":
      return "Alumni Quattro Lounge (Dinner)";
  }
  // Generic case (replace "-" by " " and make every word start with uppercase)
  return oldMensaName
    .split("-") // Split the string into an array at each hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a string, separated by spaces
}

function getPrice(meal: any, priceCategory: string): string {
  let amount = meal.price_info.external;
  if (priceCategory == "student") {
    amount = meal.price_info.students;
  } else if (priceCategory == "internal") {
    amount = meal.price_info.internal;
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "CHF", // Change the currency code as needed
    minimumFractionDigits: 2, // Set the minimum number of digits after the decimal point
  });
}

export default MensaBody;
