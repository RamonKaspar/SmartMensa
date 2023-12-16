import "./Settings.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type appliedSettingsType = {
  price_class: "students" | "external" | "internal";
  gluten: boolean;
  krebstiere: boolean;
  ei: boolean;
  fisch: boolean;
  erdnüsse: boolean;
  soja: boolean;
  milch_laktose: boolean;
  schalenfrüchte: boolean;
  sellerie: boolean;
  senf: boolean;
  sesam: boolean;
  sulfite: boolean;
  lupinen: boolean;
  weichtiere: boolean;
  hartschalenobst: boolean;
};

function Settings({
  appliedSettings,
  setAppliedSettings,
  showSettings,
  setShowSettings,
}: any) {
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [key, setKey] = useState(0); // dummy state to force re-render
  const [slideOut, setSlideOut] = useState(0);
  const navigate = useNavigate();

  // If showFilter changes from true to false, set slideOut to true
  useEffect(() => {
    if (document.getElementsByClassName("hidden-settings").length === 0) {
      setSlideOut(1);
    }
  }, [showSettings]);

  useEffect(() => {
    async function fetchUserData() {
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

    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchAppliedSettings() {
      try {
        if (currentUserId === -1) {
          return;
        }
        await fetch(`/serve-applied-settings/${currentUserId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.appliedSettings) {
              setAppliedSettings(data.appliedSettings);
            }
          })
          .catch((error) =>
            console.error("Error fetching applied settings:", error)
          );
      } catch (error) {
        console.error(error);
      }
    }

    fetchAppliedSettings();
  }, [currentUserId, key]);

  const toggleAllergies = (filterKey: keyof appliedSettingsType) => {
    const newAppliedSettings = appliedSettings;
    newAppliedSettings[filterKey] = !newAppliedSettings[filterKey];

    if (currentUserId !== -1) {
      fetch(`/modify-applied-settings/${currentUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppliedSettings),
      })
        .then((response) => response.json())
        .then(() => {})
        .catch((error) => console.error("Error:", error));
    }

    setTimeout(() => {
      setKey((prevKey) => prevKey + 1);
    }, 100);
  };

  const setPriceClass = (
    newPriceClass: "students" | "external" | "internal"
  ) => {
    const newAppliedSettings = appliedSettings;
    newAppliedSettings.price_class = newPriceClass;

    if (currentUserId !== -1) {
      fetch(`/modify-applied-settings/${currentUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppliedSettings),
      })
        .then((response) => response.json())
        .then(() => {})
        .catch((error) => console.error("Error:", error));
    }

    setTimeout(() => {
      setKey((prevKey) => prevKey + 1);
    }, 100);
  };

  const handleLogout = () => {
    // Use /logout route to destroy session
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {})
      .catch((error) => console.error("Error:", error));

    setShowSettings(false);
    navigate("/login");
  };

  return (
    <>
      <div
        className={`settings-component ${
          showSettings
            ? "slideIn"
            : slideOut > 0
            ? "slideOut"
            : "hidden-settings"
        }`}
      >
        <h2>Settings</h2>
        <h3>Change Price:</h3>
        <div className="price-container">
          <button
            className={`settings-button ${
              appliedSettings.price_class === "students" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("students")}
          >
            Student
          </button>
          <button
            className={`settings-button ${
              appliedSettings.price_class === "internal" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("internal")}
          >
            Intern
          </button>
          <button
            className={`settings-button ${
              appliedSettings.price_class === "external" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("external")}
          >
            Extern
          </button>
        </div>
        <h3>Please select all your allergies:</h3>
        <div className="allergy-info">
          Selected allergens will be highlighted in red in the menu overview
        </div>
        <div className="allergies-container">
          <button
            className={`settings-button ${
              appliedSettings.gluten ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("gluten")}
          >
            Gluten
          </button>
          <button
            className={`settings-button ${
              appliedSettings.krebstiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("krebstiere")}
          >
            Krebstiere
          </button>
          <button
            className={`settings-button ${appliedSettings.ei ? "applied" : ""}`}
            onClick={() => toggleAllergies("ei")}
          >
            Ei
          </button>
          <button
            className={`settings-button ${
              appliedSettings.fisch ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("fisch")}
          >
            Fisch
          </button>
          <button
            className={`settings-button ${
              appliedSettings.erdnüsse ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("erdnüsse")}
          >
            Erdnüsse
          </button>
          <button
            className={`settings-button ${
              appliedSettings.soja ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("soja")}
          >
            Soja
          </button>
          <button
            className={`settings-button ${
              appliedSettings.milch_laktose ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("milch_laktose")}
          >
            Milch / Laktose
          </button>
          <button
            className={`settings-button ${
              appliedSettings.schalenfrüchte ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("schalenfrüchte")}
          >
            Schalenfrüchte
          </button>
          <button
            className={`settings-button ${
              appliedSettings.sellerie ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sellerie")}
          >
            Sellerie
          </button>
          <button
            className={`settings-button ${
              appliedSettings.senf ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("senf")}
          >
            Senf
          </button>
          <button
            className={`settings-button ${
              appliedSettings.sesam ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sesam")}
          >
            Sesam
          </button>
          <button
            className={`settings-button ${
              appliedSettings.sulfite ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sulfite")}
          >
            Sulfite
          </button>
          <button
            className={`settings-button ${
              appliedSettings.lupinen ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("lupinen")}
          >
            Lupinen
          </button>
          <button
            className={`settings-button ${
              appliedSettings.weichtiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("weichtiere")}
          >
            Weichtiere
          </button>
          <button
            className={`settings-button ${
              appliedSettings.hartschalenobst ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("hartschalenobst")}
          >
            Hartschalenobst (Nüsse)
          </button>
        </div>
        <>
          <div className="user-login-logout">
            {currentUserId === -1 ? (
              <>
                <h3 className="login-info">Go to the login page</h3>
                <button
                  className="login-button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <h3 className="logout-info">Logout from current session</h3>
                <button
                  className="logout-button"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </>
      </div>
    </>
  );
}

export default Settings;
