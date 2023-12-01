import "./MensaBody.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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

        if (mealsData[currentDay]) {
          setCurrentDayMeals(mealsData[currentDay].Lunch);
        } else {
          setCurrentDayMeals([]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMeals();
  }, [mensaName]);

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

  return (
    <>
      <main className="mensa-body-container">
        <div>
          <h2>{changeName(mensaName)}</h2>
          <ul>
            {currentDayMeals.map((meal, index) => (
              <li key={index}>
                <h3>{meal.line_name}</h3>
                <p>{meal.meal_name}</p>
                <p>{meal.meal_description}</p>
                <p>{meal.allergens}</p>
                <p>
                  {meal.price_info.students} / {meal.price_info.internal} /{" "}
                  {meal.price_info.external}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

export default MensaBody;
