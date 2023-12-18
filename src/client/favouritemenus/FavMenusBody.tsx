import "./FavMenusBody.css";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

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

function FavMenusBody({ appliedSettings, showSettings, setShowSettings }: any) {
  const [favouriteMenus, setFavouriteMenus] = useState<Menu[]>([]);
  const [currentUserId, setCurrentUserId] = useState(-1);

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

    fetchFavouriteMenus();
  }, [currentUserId]);

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

  /* Makes the first char of every word to uppercase */
  function capitalizeWords(str: string) {
    return str
      .split(" ") // Split the string into an array of words
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first character of each word
      )
      .join(" "); // Join the words back into a single string
  }

  const handleTrashClick = (meal: any) => {
    const index = favouriteMenus.indexOf(meal);
    const newFavouriteMenus = favouriteMenus.filter(
      (menu) =>
        !(
          menu.meal_description === meal.meal_description &&
          menu.line_name === meal.line_name &&
          menu.meal_name === meal.meal_name
        )
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
  };

  return (
    <main
      className={`favourite-body-container ${showSettings ? "blurred" : ""}`}
    >
      {showSettings && (
        <div
          className="overlay"
          onClick={() => {
            setShowSettings(false);
          }}
        ></div>
      )}
      <div className="row-one-title">
        <h2>Edit your favourite menus ({favouriteMenus.length})</h2>
      </div>
      <div className="menu-container">
        {/* Create for each menu a component */}
        {favouriteMenus.map((meal, index) => (
          <div key={index} className="menu-component">
            <h3 className="menu-title-and-price">
              <p className="menu-title">{transformMensaTitle(meal)}</p>
              <p className="menu-price">
                {getPrice(meal, appliedSettings.price_class)}
              </p>
            </h3>
            {/* change later: priceCategory should be retrieved from user preference */}
            <div className="ingredients-component">{meal.meal_description}</div>
            <div className="matched-allergens-component">
              {meal.allergens && meal.allergens.length === 0
                ? "No allergy information available"
                : displayMatchedAllergens(meal.allergens, appliedSettings)}
            </div>
            <div className="last-row-actions">
              <FaTrash
                className="trash-icon"
                style={{ fontSize: "2em" }}
                onClick={() => handleTrashClick(meal)}
              />
            </div>
          </div>
        ))}
        {favouriteMenus.length === 0 && (
          <div className="banner-no-menus-available">
            No favourite menus yet!
          </div>
        )}
      </div>
    </main>
  );
}
export default FavMenusBody;
