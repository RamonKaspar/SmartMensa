import "./MensaBody.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { BsHeartFill } from "react-icons/bs";
import { RiExternalLinkFill } from "react-icons/ri";
import mensaData from "./mensa-infos-static.json"; /* IMPORTED FOR NOW: WILL BE IN BACKEND LATER!!!!! */

type staticInfos = {
  name: string;
  facility_id: string;
  name_display: string;
  location: string;
  opening_time_start: number;
  opening_time_end: number;
  dining_time_start: number;
  dining_time_end: number;
  building: string;
  street: string;
  city: string;
  google_maps_link: string;
  homepage: string;
};

/* Returns the data for the given mensa */
const getMensaStaticInfos = (mensaName: string): staticInfos => {
  for (const mensa of mensaData.mensas) {
    if (mensa.name === mensaName) {
      return mensa;
    }
  }
  throw new Error("Mensa not found.");
};

function MensaBody() {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");
  const [currentDayMeals, setCurrentDayMeals] = useState<any[]>([]);
  const myMensa: staticInfos = getMensaStaticInfos(mensaName);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch(`/menus/${myMensa.facility_id}`);
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

  /* Function that returns either "Open" or "Closed", depending on current time */
  const handleOpenTag = () => {
    const now = new Date();
    const nowAsNumber = now.getHours() + now.getMinutes() / 100;
    if (
      nowAsNumber < myMensa.opening_time_start ||
      nowAsNumber > myMensa.opening_time_end
    ) {
      return "Closed";
    }
    return "Open";
  };

  return (
    <>
      <main className="mensa-body-container">
        <div className="row-one-title">
          <h2>{myMensa.name_display}</h2>
          <p className="mark-as-favorite">
            <BsHeartFill size={20} />
          </p>
        </div>
        <div className="second-row-tags">
          <div className="location-tag">{myMensa.location}</div>
          <div className="open-closed-tag">{handleOpenTag()}</div>
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
              <div>
                {formatedTimes(
                  myMensa.opening_time_start,
                  myMensa.opening_time_end
                )}
              </div>
              <h3>Dining Times</h3>
              <div>
                {formatedTimes(
                  myMensa.dining_time_start,
                  myMensa.dining_time_end
                )}
              </div>
            </div>
            <div className="footer-location">
              <h3> Location </h3>
              <div>{myMensa.building}</div>
              <div>{myMensa.street}</div>
              <div>{myMensa.city}</div>
              <div className="footer-maps-link">
                <a href={myMensa.google_maps_link}>Show in Google Maps</a>
              </div>
            </div>
          </div>
          {/* LINK HARDCODED FOR NOW */}
          <div
            className="visit-website"
            onClick={() => window.open(myMensa.homepage)}
          >
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
      return (
        meal.line_name.toUpperCase() + " | " + capitalizeWords(meal.meal_name)
      );
    } else {
      return meal.line_name.toUpperCase();
    }
  }
  return "";
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

/* Makes the first char of every word to uppercase */
function capitalizeWords(str: string) {
  return str
    .split(" ") // Split the string into an array of words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first character of each word
    )
    .join(" "); // Join the words back into a single string
}

/* Function that outputs the formated time to "hh:mm"-"hh:mm"*/
function formatedTimes(start: number, end: number): string {
  // Helper function to format a time from a decimal number to "hh:mm"
  return (
    start.toFixed(2).replace(".", ":") +
    " - " +
    end.toFixed(2).replace(".", ":")
  );
}

export default MensaBody;
