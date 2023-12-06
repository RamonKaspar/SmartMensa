import { useNavigate } from "react-router-dom";
import "./HomeBody.css";
import { BsHeartFill } from "react-icons/bs";
import { MdArrowForwardIos } from "react-icons/md";
import { useState, useEffect } from "react";

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

interface FavoritesState {
  [key: string]: boolean;
}

function HomeBody() {
  // Saves the state of the heart (mensa selected as favorite) for each mensa
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetch('/api/current-user')
      .then(response => response.json())
      .then(data => {
        if (data.userId) {
          setCurrentUserId(data.userId);
        }
      })
      .catch(error => console.error('Error fetching current user ID:', error));
  }, []);

  // Handles if one clicks on a heart (for now, only the color changes)
  const handleFavoriteClick = (
    locationName: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevents the button's click event
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

  return (
    <main className="home-body-container">
      <h2>Your favorite menus today</h2>
      <div className="favorite-meus-container">
        {/* Implement this in a later stage when we have user management */}
        {currentUserId ? (
          <div>Welcome, User ID: {currentUserId}</div>
        ) : (
          <div>Loading or no user logged in...</div>
        )}
        {/* ... rest of your component */}
      </div>
      <h2>Mensas</h2>
      <div className="mensa-buttons-container">
        {mensas.map((mensa) => (
          <div className="mensas" key={mensas.indexOf(mensa)}>
            {mensa.locations.map((location) => (
              <button className="mensa-component" key={location.name}>
                <div className="first-row">
                  <div className="mensa-title">{changeName(location.name)}</div>
                  <div className="mark-as-favorite">
                    <BsHeartFill
                      size={20}
                      onClick={(e) => handleFavoriteClick(location.name, e)}
                      style={{
                        fill: favorites[location.name] ? "red" : "gray",
                      }}
                    />
                  </div>
                </div>
                <div className="second-row">
                  <div className="location-tag">{mensa.name}</div>
                  <div className="open-closed-tag">Open</div>
                  <div
                    className="goTo"
                    onClick={() => handleClickAndNavigate(location.name)}
                  >
                    <MdArrowForwardIos size={20} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
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

export default HomeBody;
