import { useNavigate } from "react-router-dom";
import "./HomeBody.css";
import { BsHeartFill } from "react-icons/bs";
import { MdArrowForwardIos } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";

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

/* Makes the first char of every word to uppercase */
function capitalizeWords(str: string) {
  return str
    .split(" ") // Split the string into an array of words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first character of each word
    )
    .join(" "); // Join the words back into a single string
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
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "CHF", // Change the currency code as needed
    minimumFractionDigits: 2, // Set the minimum number of digits after the decimal point
  });
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

// Fetch menus for today of facility with id menu.facilityID
async function checkIfMenuIsAvailableToday(
  menu: any
): Promise<[boolean, string]> {
  try {
    const response = await fetch(`/menus/${menu.facility_id}`);
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
      const meals = mealsData[currentDay];

      if (meals["Lunch"]) {
        for (const meal of meals["Lunch"]) {
          if (meal.meal_description === menu.meal_description) {
            return [true, "Lunch"];
          }
        }
      }

      if (meals["Dinner"]) {
        for (const meal of meals["Dinner"]) {
          if (meal.meal_description === menu.meal_description) {
            return [true, "Dinner"];
          }
        }
      }

      return [false, "Menu not available today"];
    }

    return [false, "Menu not available today"];
  } catch (error) {
    console.error(error);
    return [false, "Failed to fetch meals"];
  }
}

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

interface FavoritesState {
  [key: string]: boolean;
}

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

function HomeBody({
  showFilter,
  setShowFilter,
  appliedFilters,
  showSettings,
  setShowSettings,
  appliedSettings,
  setAppliedSettings,
}: any) {
  const [mensaInfos, setMensaInfos] = useState<any>([]);
  const [favouriteMenus, setFavouriteMenus] = useState<Menu[]>([]);
  const [favouriteMenusToday, setFavouriteMenusToday] = useState<
    [Menu, string][]
  >([]);

  // Saves the state of the heart (mensa selected as favorite) for each mensa
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const [currentUserId, setCurrentUserId] = useState(-1);

  useEffect(() => {
    if (currentUserId === -1) {
      return;
    }
    if (favouriteMenus.length === 0) {
      return;
    }
    // For each menu in favouriteMenus, check if it is available today
    async function checkIfMenusAreAvailableToday() {
      const favouriteMenusToday: [Menu, string][] = [];
      for (const menu of favouriteMenus) {
        const [isAvailableToday, daytime] =
          await checkIfMenuIsAvailableToday(menu);
        if (isAvailableToday) {
          favouriteMenusToday.push([menu, daytime]);
        }
      }
      setFavouriteMenusToday(favouriteMenusToday);
    }

    checkIfMenusAreAvailableToday();
  }, [favouriteMenus]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const mensaInfos = await fetchMensaStaticInfos();
        setMensaInfos(mensaInfos.mensas);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMeals();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        await fetch("/api/current-user")
          .then((response) => response.json())
          .then((data) => {
            if (data.userId) {
              setCurrentUserId(data.userId);
            }
            if (data.appliedSettings) {
              setAppliedSettings(data.appliedSettings);
            }
          })
          .catch((error) =>
            console.error("Error fetching current user ID:", error)
          );
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserData();
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
        const favouriteMenus = await response.json();
        setFavouriteMenus(favouriteMenus.favouriteMenus);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFavouriteMenus();
  }, [currentUserId]);

  /* Filter functionality */
  const noFiltersApplied = Object.values(appliedFilters).every(
    (value) => !value
  );
  const filteredMensas = noFiltersApplied
    ? mensaInfos
    : mensaInfos.filter((mensa: any) => {
        // Check if mensa is a favorite if the Favorites filter is applied
        let isFavorite =
          !appliedFilters.Favorites || favorites[mensa.name_display];

        // Check location filters
        let locationMatch = false;
        if (appliedFilters.Zentrum_ETH && mensa.location === "Zentrum (ETH)") {
          locationMatch = true;
        }
        if (appliedFilters.Zentrum_UZH && mensa.location === "Zentrum (UZH)") {
          locationMatch = true;
        }
        if (appliedFilters.Irchel && mensa.location === "Irchel") {
          locationMatch = true;
        }
        if (appliedFilters.Höngg && mensa.location === "Höngg") {
          locationMatch = true;
        }
        if (appliedFilters.Oerlikon && mensa.location === "Oerlikon") {
          locationMatch = true;
        }

        // If no location filter is set, consider all locations as matching
        if (
          !appliedFilters.Zentrum_ETH &&
          !appliedFilters.Zentrum_UZH &&
          !appliedFilters.Irchel &&
          !appliedFilters.Höngg &&
          !appliedFilters.Oerlikon
        ) {
          locationMatch = true;
        }

        // Check 'Currently Open' filter
        let openMatch = true; // Default to true if filter is not set
        if (appliedFilters.Currently_Open) {
          openMatch = currentlyOpen(mensa);
        }

        // Return true if both location and open status match
        return locationMatch && openMatch && isFavorite;
      });

  // Handles if one clicks on a heart (for now, only the color changes)
  const handleFavoriteClick = (
    locationName: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [locationName]: !prevFavorites[locationName], // Toggle the favorite state for the clicked location
    }));
  };

  // Navigates to the corresponding mensa
  const navigate = useNavigate();
  const handleClickAndNavigate = (mensaName: string) => {
    navigate("/" + mensaName);
  };

  // function to translate facility_id to mensa name
  function translateFacilityIDtoMensaName(
    facility_id: number,
    daytime: string
  ): string {
    const foundMensa = mensaInfos.find(
      (mensa: any) =>
        mensa.facility_id === facility_id.toString() &&
        mensa.daytime === daytime
    );
    return foundMensa ? foundMensa.name_display : "Mensa not found";
  }

  return (
    <>
      <main
        className={`home-body-container ${
          showFilter || showSettings ? "blurred" : ""
        }`}
      >
        {(showFilter || showSettings) && (
          <div
            className="overlay"
            onClick={() => {
              setShowFilter(false);
              setShowSettings(false);
            }}
          ></div>
        )}
        {currentUserId !== -1 && (
          <>
            <div className="todays-favourite-menus-container">
              {currentUserId !== -1 && (
                <>
                  <div className="row-one-title">
                    <h2>Your favourite menus today</h2>
                    <FaEdit
                      size={30}
                      onClick={() => navigate("/favourite-menus")}
                      className="edit-favourites-button"
                    />
                  </div>
                  <div className="menu-container">
                    {/* Create for each menu a component */}
                    {favouriteMenusToday.map(([meal, daytime], index) => (
                      <div key={index} className="menu-component">
                        <h3 className="mensa-name">
                          Available at{" "}
                          {translateFacilityIDtoMensaName(
                            meal.facility_id,
                            daytime
                          )}
                        </h3>
                        <h3 className="menu-title-and-price">
                          <p className="menu-title">
                            {transformMensaTitle(meal)}
                          </p>
                          <p className="menu-price">
                            {getPrice(meal, appliedSettings.price_class)}
                          </p>
                        </h3>
                        {/* change later: priceCategory should be retrieved from user preference */}
                        <div className="ingredients-component">
                          {meal.meal_description}
                        </div>
                        <div className="matched-allergens-component">
                          {meal.allergens && meal.allergens.length === 0
                            ? "No allergy information available"
                            : displayMatchedAllergens(
                                meal.allergens,
                                appliedSettings
                              )}
                        </div>
                      </div>
                    ))}
                    {favouriteMenus.length === 0 && (
                      <div className="banner-no-menus-available">
                        No favourite menus today!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
        <h2>Mensas ({filteredMensas.length})</h2>
        <div className="mensa-buttons-container">
          {filteredMensas.map((mensa: any, index: any) => (
            <div className="mensas" key={index}>
              <button className="mensa-component" key={index}>
                <div className="first-row">
                  <div className="mensa-title">{mensa.name_display}</div>
                  <div className="mark-as-favorite-mensa">
                    <BsHeartFill
                      size={20}
                      onClick={(e) =>
                        handleFavoriteClick(mensa.name_display, e)
                      }
                      style={{
                        fill: favorites[mensa.name_display] ? "red" : "gray",
                      }}
                    />
                  </div>
                </div>
                <div className="second-row">
                  <div className="location-tag">{mensa.location}</div>
                  <div
                    className={`open-closed-tag ${
                      currentlyOpen(mensa) ? "open" : "closed"
                    }`}
                  >
                    {currentlyOpen(mensa) ? "Open" : "Closed"}
                  </div>
                  <div
                    className="goTo"
                    onClick={() => handleClickAndNavigate(mensa.name)}
                  >
                    <MdArrowForwardIos size={20} />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default HomeBody;
