import { useNavigate } from "react-router-dom";
import "./HomeBody.css";
import { BsHeartFill } from "react-icons/bs";
import { MdArrowForwardIos } from "react-icons/md";
import { useState, useEffect } from "react";

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

interface FavoritesState {
  [key: string]: boolean;
}

function HomeBody({
  showFilter,
  setShowFilter,
  appliedFilters,
  showSettings,
  setShowSettings,
}: any) {
  const [mensaInfos, setMensaInfos] = useState<any>([]);

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
  // Saves the state of the heart (mensa selected as favorite) for each mensa
  const [favorites, setFavorites] = useState<FavoritesState>({});
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

  /* Filter functionality */
  const noFiltersApplied = Object.values(appliedFilters).every(
    (value) => !value
  );
  const filteredMensas = noFiltersApplied
    ? mensaInfos
    : mensaInfos.filter((mensa: any) => {
        let matchesFilter = false;
        if (appliedFilters.Zentrum_ETH && mensa.location === "Zentrum (ETH)")
          matchesFilter = true;
        if (appliedFilters.Zentrum_UZH && mensa.location === "Zentrum (UZH)")
          matchesFilter = true;
        if (appliedFilters.Irchel && mensa.location === "Irchel")
          matchesFilter = true;
        if (appliedFilters.Höngg && mensa.location === "Höngg")
          matchesFilter = true;
        if (appliedFilters.Oerlikon && mensa.location === "Oerlikon")
          matchesFilter = true;

        // If 'Currently Open' filter is active, further filter by open status
        if (!matchesFilter) {
          if (appliedFilters.Currently_Open) {
            matchesFilter = currentlyOpen(mensa);
          }
        } else {
          if (appliedFilters.Currently_Open) {
            matchesFilter = matchesFilter && currentlyOpen(mensa);
          }
        }

        return matchesFilter;
      });

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
        <h2>Your favorite menus today</h2>
        <div className="favorite-meus-container">
          {currentUserId !== -1 ? (
            <div>Welcome, User ID: {currentUserId}</div>
          ) : (
            <div>No user logged in...</div>
          )}
        </div>
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
