import { useState, useEffect } from "react";
import "./Filter.css";

type appliedFiltersType = {
  Zentrum_ETH: boolean;
  Zentrum_UZH: boolean;
  Irchel: boolean;
  Höngg: boolean;
  Currently_Open: boolean;
  Favorites: boolean;
};

const appliedFiltersDefault: appliedFiltersType = {
  Zentrum_ETH: false,
  Zentrum_UZH: false,
  Irchel: false,
  Höngg: false,
  Currently_Open: false,
  Favorites: false,
};

function Filter() {
  /* State for handling the applied filters */
  const [appliedFilters, setAppliedFilters] = useState<appliedFiltersType>(
    () => {
      const savedFilters = localStorage.getItem("appliedFilters");
      return savedFilters ? JSON.parse(savedFilters) : appliedFiltersDefault;
    }
  );

  /*  Save State to Local Storage */
  useEffect(() => {
    localStorage.setItem("appliedFilters", JSON.stringify(appliedFilters));
  }, [appliedFilters]);

  const toggleFilter = (filterKey: keyof appliedFiltersType) => {
    setAppliedFilters((prevFilters: appliedFiltersType) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  return (
    <>
      <div className="filter-component">
        <h2>Filter</h2>
        <h3>Location:</h3>
        <div className="filter-container">
          <div
            className={`filter-button ${
              appliedFilters.Zentrum_ETH ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Zentrum_ETH")}
          >
            Zentrum (ETH)
          </div>
          <div
            className={`filter-button ${
              appliedFilters.Zentrum_UZH ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Zentrum_UZH")}
          >
            Zentrum (UZH)
          </div>
          <div
            className={`filter-button ${
              appliedFilters.Irchel ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Irchel")}
          >
            Irchel
          </div>
          <div
            className={`filter-button ${appliedFilters.Höngg ? "applied" : ""}`}
            onClick={() => toggleFilter("Höngg")}
          >
            Höngg
          </div>
        </div>
        <h3>Other:</h3>
        <div className="filter-container">
          <div
            className={`filter-button ${
              appliedFilters.Currently_Open ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Currently_Open")}
          >
            Currently Open
          </div>
          <div
            className={`filter-button ${
              appliedFilters.Favorites ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Favorites")}
          >
            Favorites
          </div>
        </div>
      </div>
    </>
  );
}

export default Filter;
