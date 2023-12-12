import "./MensaBody.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar, FaShareSquare } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import { RiExternalLinkFill } from "react-icons/ri";

async function fetchMensaStaticInfos() {
  try {
    const response = await fetch(`/mensa-info`);
    if (!response.ok) {
      throw new Error("Failed to fetch mensa static infos");
    }
    const mensaInfo = await response.json();
    return mensaInfo;
  } catch (error) {
    console.error(error);
  }
}

/* Returns the data for the given mensa */
const getSpecificMensaStaticInfos = async (mensaName: string) => {
  try {
    const mensaInfos = await fetchMensaStaticInfos();
    for (const mensa of mensaInfos.mensas) {
      if (mensa.name === mensaName) {
        return mensa;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

function MensaBody() {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");
  const [currentDayMeals, setCurrentDayMeals] = useState<any[]>([]);
  const [myMensa, setMyMensa] = useState<any>({});

  useEffect(() => {
    async function fetchMeals() {
      try {
        const mensa = await getSpecificMensaStaticInfos(mensaName);
        setMyMensa(mensa);
        const response = await fetch(`/menus/${mensa.facility_id}`);
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
            mealsData[currentDay].Lunch.length > 0 &&
            !mensaName.includes("dinner")
          ) {
            setCurrentDayMeals(mealsData[currentDay].Lunch);
          } else if (
            mealsData[currentDay].Dinner.length > 0 &&
            !mensaName.includes("lunch")
          ) {
            setCurrentDayMeals(mealsData[currentDay].Dinner);
          } else {
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

  function copyTextFallback(str: string): void {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    el.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(el);

    if (success) {
      alert("Meal description copied to clipboard!");
    } else {
      console.error("Fallback: Copying to clipboard failed");
    }
  }

  const handleShareClick = (meal: any) => {
    let str = "Today: " + "\n" + myMensa.name_display + "\n";
    str += transformMensaTitle(meal) + "\n" + meal.meal_description;
    str += "\n" + getPrice(meal, "external");

    // Check if the Clipboard API is available
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(str)
        .then(() => {
          alert("Meal description copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy to clipboard: ", error);
          // Fallback to the alternative copy function
          copyTextFallback(str);
        });
    } else {
      console.error("Clipboard API not available");
      // Fallback to the alternative copy function
      copyTextFallback(str);
    }
  };

  return (
    <>
      <main className="mensa-body-container">
        <div className="row-one-title">
          <h2>{myMensa.name_display}</h2>
          <p className="mark-as-favorite-menu">
            <BsHeartFill size={20} />
          </p>
        </div>
        <div className="second-row-tags">
          <div className="location-tag">{myMensa.location}</div>
          <div
            className={`open-closed-tag ${
              currentlyOpen(myMensa) ? "open" : "closed"
            }`}
          >
            {currentlyOpen(myMensa) ? "Open" : "Closed"}
          </div>
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
              <div className="allergens-component">
                {displayAllergens(meal.allergens)}
              </div>
              <div className="last-row-actions">
                <FaStar style={{ fontSize: "2em" }} />
                <FaShareSquare
                  style={{ fontSize: "2em" }}
                  onClick={() => handleShareClick(meal)}
                />
              </div>
            </div>
          ))}
          {currentDayMeals.length === 0 && (
            <div className="banner-no-menus-available">No menus available</div>
          )}
          <div className="footer">
            {Object.keys(myMensa).length > 0 && (
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
            )}
            <div
              className="visit-website"
              onClick={() => window.open(myMensa.homepage)}
            >
              <RiExternalLinkFill style={{ fontSize: "2em" }} />
              <div>Visit Homepage</div>
            </div>
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

function displayAllergens(allergens: any[]): string {
  let allergensString = "";
  for (const allergen of allergens) {
    allergensString += allergen + ", ";
  }
  return allergensString.slice(0, -2);
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

/* Function that returns either "Open" or "Closed", depending on current time */
function currentlyOpen(mensa: any): boolean {
  const now = new Date();
  const nowAsNumber = now.getHours() + now.getMinutes() / 100;
  if (
    nowAsNumber < mensa.opening_time_start ||
    nowAsNumber > mensa.opening_time_end
  ) {
    return false;
  }
  return true;
}
