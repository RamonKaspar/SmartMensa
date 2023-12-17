import "./MensaBody.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar, FaShareSquare } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import { RiExternalLinkFill } from "react-icons/ri";
import type { favouriteMensasType } from "../home/HomeBody";

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

interface Menu {
  facility_id: number;
  line_name: string;
  meal_name: string;
  meal_description: string;
  allergens: string[];
  price_info: {
    students: number;
    internal: number;
    external: number;
  };
}

function MensaBody({ appliedSettings, showSettings, setShowSettings }: any) {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");
  const [currentDayMeals, setCurrentDayMeals] = useState<any[]>([]);
  const [myMensa, setMyMensa] = useState<any>({});
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [favouriteMenus, setFavouriteMenus] = useState<Menu[]>([]);
  const [favouriteMensas, setFavouriteMensas] = useState<favouriteMensasType>({
    archimedes: false,
    clausiusbar: false,
    dozentenfoyer: false,
    "food-lab": false,
    "mensa-polyterrasse-lunch": false,
    "mensa-polyterrasse-dinner": false,
    polysnack: false,
    tannenbar: false,
    "alumni-quattro-lounge-lunch": false,
    "alumni-quattro-lounge-dinner": false,
    "bistro-hpi": false,
    "food-market-green-day": false,
    "food-market-grill-bbq": false,
    "food-market-pizza-pasta-day": false,
    "food-market-dinner": false,
    "fusion-meal": false,
    "fusion-coffee": false,
    "rice-up": false,
    octavo: false,
    "uzh-untere-mensa-lunch": false,
    "uzh-untere-mensa-dinner": false,
    "uzh-obere-mensa": false,
    "lichthof-rondell": false,
    "raemi-59": false,
    "platte-14": false,
    "uzh-irchel": false,
    "cafeteria-irchel-seerose-lunch": false,
    "cafeteria-irchel-seerose-dinner": false,
    binzmuehle: false,
    "cafeteria-cityport": false,
    "cafeteria-zentrum-fuer-zahnmedizin": false,
    "cafeteria-tierspital": false,
    "cafeteria-botanischer-garten": false,
  });
  const [dummy, setDummy] = useState(false);

  // Function to check if a meal in favouriteMenus matches the meal_description
  const checkFavouriteMeal = (mealDescription: string): boolean => {
    // Check if there's any meal in favouriteMenus with the same meal_description
    return favouriteMenus.some(
      (meal) => meal.meal_description === mealDescription
    );
  };

  useEffect(() => {
    async function fetchUserID() {
      try {
        await fetch("/api/current-user")
          .then((response) => response.json())
          .then((data) => {
            if (data.userId) {
              setCurrentUserId(data.userId);
            }
          })
          .catch((error) =>
            console.error("Error fetching current user ID:", error)
          );
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserID();
  }, []);

  useEffect(() => {
    async function fetchFavouriteMenus() {
      try {
        if (currentUserId === -1) {
          return;
        }
        const response = await fetch(`/serve-favourite-menus/${currentUserId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch favorite meals");
        }
        const favoriteMeals = await response.json();
        setFavouriteMenus(favoriteMeals.favouriteMenus);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchFavouriteMensas() {
      try {
        if (currentUserId === -1) {
          return;
        }
        const response = await fetch(
          `/serve-favourite-mensas/${currentUserId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorite mensas");
        }
        const favouriteMensas = await response.json();
        setFavouriteMensas(favouriteMensas.favouriteMensas);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFavouriteMenus();
    fetchFavouriteMensas();
  }, [currentUserId, favouriteMenus]);

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
  }, [mensaName, dummy]);

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
      console.error("Fallback: Copying to clipboard failed", err);
    }

    document.body.removeChild(el);

    if (success) {
      alert("Meal description copied to clipboard!");
    } else {
      console.error("Fallback: Copying to clipboard failed");
    }
  }

  const handleStarClick = (meal: any) => {
    // Store favourite menu to mongodb database
    let mealName = "";
    if (meal.meal_name) {
      mealName = meal.meal_name;
    }

    const newFavouriteMenu = {
      facility_id: myMensa.facility_id,
      line_name: meal.line_name,
      meal_name: mealName,
      meal_description: meal.meal_description,
      allergens: meal.allergens,
      price_info: meal.price_info,
    };

    // Check if the meal is already in the favouriteMenus array
    setDummy(!dummy);
    if (checkFavouriteMeal(meal.meal_description)) {
      // Remove meal from favouriteMenus
      const index = favouriteMenus.indexOf(meal);
      const newFavouriteMenus = favouriteMenus.filter(
        (menu) => menu.meal_description !== meal.meal_description
      );
      setFavouriteMenus(newFavouriteMenus);
      async function deleteFavouriteMenu() {
        try {
          await fetch(`/delete-favourite-menu/${currentUserId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ index }),
          });
        } catch (error) {
          console.error(error);
        }
      }
      deleteFavouriteMenu();

      return;
    }

    favouriteMenus.push(meal);

    // add new favourite menu to database using /add-favorite-menu/:userID endpoint
    fetch(`/add-favorite-menu/${currentUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFavouriteMenu),
    })
      .then((response) => response.json())
      .then(() => {})
      .catch((error) => console.error("Error:", error));
  };

  const handleHeartClick = (mensa_name: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Store favourite mensa to mongodb database
    const newFavouriteMensas = { ...favouriteMensas };
    newFavouriteMensas[mensa_name as keyof favouriteMensasType] =
      !newFavouriteMensas[mensa_name as keyof favouriteMensasType];

    setFavouriteMensas(newFavouriteMensas);

    fetch(`/modify-favourite-mensas/${currentUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFavouriteMensas),
    })
      .then((response) => response.json())
      .then(() => {})
      .catch((error) => console.error("Error:", error));
  };

  const handleShareClick = (meal: any) => {
    let str = "Today: " + "\n" + myMensa.name_display + "\n";
    str += transformMensaTitle(meal) + "\n" + meal.meal_description;
    str += "\n" + getPrice(meal, appliedSettings.price_class);

    // Check if the Clipboard API is available
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(str)
        .then(() => {
          alert("Meal description copied to clipboard!");
        })
        .catch(() => {
          // Fallback to the alternative copy function
          copyTextFallback(str);
        });
    } else {
      // Fallback to the alternative copy function
      copyTextFallback(str);
    }
  };

  return (
    <>
      <main className={`mensa-body-container ${showSettings ? "blurred" : ""}`}>
        {showSettings && (
          <div
            className="overlay"
            onClick={() => {
              setShowSettings(false);
            }}
          ></div>
        )}
        <div className="row-one-title">
          <h2>{myMensa.name_display}</h2>
          <p className="mark-as-favorite-mensa">
            <BsHeartFill
              size={20}
              style={{
                color: favouriteMensas[
                  myMensa.name as keyof favouriteMensasType
                ]
                  ? "red"
                  : "black",
              }}
              onClick={(e) =>
                handleHeartClick(myMensa.name as keyof favouriteMensasType, e)
              }
            />
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
                <p className="menu-price">
                  {getPrice(meal, appliedSettings.price_class)}
                </p>
              </h3>
              {/* change later: priceCategory should be retrieved from user preference */}
              <div className="menu-line">{}</div>
              <div className="ingredients-component">
                {meal.meal_description === ""
                  ? "No meal description available"
                  : meal.meal_description}
              </div>
              <div className="matched-allergens-component">
                {meal.allergens && meal.allergens.length === 0
                  ? "No allergy information available"
                  : displayMatchedAllergens(meal.allergens, appliedSettings)}
              </div>
              <div className="last-row-actions">
                <FaStar
                  style={{
                    fontSize: "2em",
                  }}
                  onClick={() => handleStarClick(meal)}
                  className={`star-icon ${
                    checkFavouriteMeal(meal.meal_description)
                      ? "marked-as-favourite"
                      : ""
                  }`}
                />
                <FaShareSquare
                  style={{ fontSize: "2em" }}
                  onClick={() => handleShareClick(meal)}
                  className="share-icon"
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
  let amount = meal.price_info[priceCategory];
  if (amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "CHF", // Change the currency code as needed
      minimumFractionDigits: 2, // Set the minimum number of digits after the decimal point
    });
  } else {
    return "No price information available";
  }
}

function displayMatchedAllergens(
  allergens: any[],
  appliedSettings: any
): string {
  let allergensString = "";
  for (const allergen of allergens) {
    if (markAllergen(allergen, appliedSettings)) {
      allergensString += allergen + ", ";
    }
  }
  return allergensString.slice(0, -2);
}

/* Hardcoded logic for handling allergies */
function markAllergen(allergen: string, appliedSettings: any): boolean {
  if (allergen.toLowerCase().includes("gluten")) {
    return appliedSettings.gluten;
  }
  if (allergen.toLowerCase().includes("krebstiere")) {
    return appliedSettings.krebstiere;
  }
  if (allergen.toLowerCase().includes("ei")) {
    return appliedSettings.ei;
  }
  if (allergen.toLowerCase().includes("fisch")) {
    return appliedSettings.fisch;
  }
  if (allergen.toLowerCase().includes("erdnüsse")) {
    return appliedSettings.erdnüsse;
  }
  if (allergen.toLowerCase().includes("soja")) {
    return appliedSettings.soja;
  }
  if (
    allergen.toLowerCase().includes("milch") ||
    allergen.toLowerCase().includes("laktose")
  ) {
    return appliedSettings.milch_laktose;
  }
  if (allergen.toLowerCase().includes("schalenfrüchte")) {
    return appliedSettings.schalenfrüchte;
  }
  if (allergen.toLowerCase().includes("sellerie")) {
    return appliedSettings.sellerie;
  }
  if (allergen.toLowerCase().includes("senf")) {
    return appliedSettings.senf;
  }
  if (allergen.toLowerCase().includes("sesam")) {
    return appliedSettings.sesam;
  }
  if (allergen.toLowerCase().includes("sulfite")) {
    return appliedSettings.sulfite;
  }
  if (allergen.toLowerCase().includes("lupinen")) {
    return appliedSettings.lupinen;
  }
  if (allergen.toLowerCase().includes("weichtiere")) {
    return appliedSettings.weichtiere;
  }
  if (allergen.toLowerCase().includes("hartschalenobst")) {
    return appliedSettings.hartschalenobst;
  }

  /* Handle case: allergy is not in our list --> Add it to be on the safe side*/
  console.log(allergen.toUpperCase() + " is not in our list!!!!");
  return true;
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
  const isWeekend = currentDay === "Saturday" || currentDay === "Sunday";

  return true && !isWeekend;
}
