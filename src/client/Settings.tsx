import "./Settings.css";
import { useState, useEffect } from "react";

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

function Settings({ appliedSettings, setAppliedSettings }: any) {
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [wasSent, setWasSent] = useState(false);

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
  }, [wasSent]);

  const toggleAllergies = (filterKey: keyof appliedSettingsType) => {
    // Idea: First send to server, then using server sent event, update the state locally

    setAppliedSettings((prevFilters: appliedSettingsType) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));

    const newAppliedSettings = {
      ...appliedSettings,
      [filterKey]: !appliedSettings[filterKey],
    };

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

    setWasSent(!wasSent);
  };

  const setPriceClass = (
    newPriceClass: "students" | "external" | "internal"
  ) => {
    setAppliedSettings((prevFilters: appliedSettingsType) => ({
      ...prevFilters,
      ["price_class"]: newPriceClass,
    }));
  };

  return (
    <>
      <div className="settings-component">
        <h2>Settings</h2>
        <h3>Change Price:</h3>
        <div className="price-container">
          <div
            className={`settings-button ${
              appliedSettings.price_class === "students" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("students")}
          >
            Student
          </div>
          <div
            className={`settings-button ${
              appliedSettings.price_class === "internal" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("internal")}
          >
            Intern
          </div>
          <div
            className={`settings-button ${
              appliedSettings.price_class === "external" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("external")}
          >
            Extern
          </div>
        </div>
        <h3>Please select all your allergies:</h3>
        <div className="allergy-info">
          The menu containing any of the selected allergens will be marked in
          red!
        </div>
        <div className="allergies-container">
          <div
            className={`settings-button ${
              appliedSettings.gluten ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("gluten")}
          >
            Gluten
          </div>
          <div
            className={`settings-button ${
              appliedSettings.krebstiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("krebstiere")}
          >
            Krebstiere
          </div>
          <div
            className={`settings-button ${appliedSettings.ei ? "applied" : ""}`}
            onClick={() => toggleAllergies("ei")}
          >
            Ei
          </div>
          <div
            className={`settings-button ${
              appliedSettings.fisch ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("fisch")}
          >
            Fisch
          </div>
          <div
            className={`settings-button ${
              appliedSettings.erdnüsse ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("erdnüsse")}
          >
            Erdnüsse
          </div>
          <div
            className={`settings-button ${
              appliedSettings.soja ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("soja")}
          >
            Soja
          </div>
          <div
            className={`settings-button ${
              appliedSettings.milch_laktose ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("milch_laktose")}
          >
            Milch / Laktose
          </div>
          <div
            className={`settings-button ${
              appliedSettings.schalenfrüchte ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("schalenfrüchte")}
          >
            Schalenfrüchte
          </div>
          <div
            className={`settings-button ${
              appliedSettings.sellerie ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sellerie")}
          >
            Sellerie
          </div>
          <div
            className={`settings-button ${
              appliedSettings.senf ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("senf")}
          >
            Senf
          </div>
          <div
            className={`settings-button ${
              appliedSettings.sesam ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sesam")}
          >
            Sesam
          </div>
          <div
            className={`settings-button ${
              appliedSettings.sulfite ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sulfite")}
          >
            Sulfite
          </div>
          <div
            className={`settings-button ${
              appliedSettings.lupinen ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("lupinen")}
          >
            Lupinen
          </div>
          <div
            className={`settings-button ${
              appliedSettings.weichtiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("weichtiere")}
          >
            Weichtiere
          </div>
          <div
            className={`settings-button ${
              appliedSettings.hartschalenobst ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("hartschalenobst")}
          >
            Hartschalenobst (Nüsse)
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
